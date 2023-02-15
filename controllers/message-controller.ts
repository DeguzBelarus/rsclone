import { Response, NextFunction } from 'express';
import { Op } from 'sequelize';

import { Message, User } from '../db-models/db-models';
import { IRequestModified } from '../types/types';
import { ApiError } from '../error-handler/error-handler';

class MessageController {
  async send(request: IRequestModified, response: Response, next: NextFunction): Promise<void | Response> {
    try {
      const { requesterId } = request;
      const { lang } = request.query;
      const { messageText, authorId, authorNickname, recipientId, recipientNickname } = request.body;

      if (!messageText || !authorId || !authorNickname || !recipientId || !recipientNickname) {
        return next(
          ApiError.badRequest(
            lang === 'ru' ?
              "Недостаточно данных для выполнения операции" :
              "Not enough data to perform the operation"
          )
        );
      }

      if (messageText.length > 255) {
        return next(
          ApiError.badRequest(
            lang === "ru" ?
              "Максимальное количество символов в сообщении - 255" :
              "The maximum number of characters in a message is 255"
          )
        );
      }

      if (requesterId) {
        if (authorId !== requesterId) {
          return next(
            ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
        }
      } else {
        return next(
          ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
      }

      if (User && Message) {
        const foundSender = await User.findOne({ where: { id: authorId } });
        const foundReceiver = await User.findOne({ where: { id: recipientId } });

        if (!foundSender) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Отправитель не найден, операция невозможна" :
                "The sender was not found, the operation is impossible"
            )
          );
        }
        if (!foundReceiver) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Получатель не найден, операция невозможна" :
                "The recipient was not found, the operation is impossible"
            )
          );
        }

        if (foundSender.dataValues.nickname !== authorNickname) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Некорректный никнейм отправителя" :
                "Invalid sender's nickname"
            )
          );
        }
        if (foundReceiver.dataValues.nickname !== recipientNickname) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Некорректный никнейм получателя" :
                "Invalid recipient's nickname"
            )
          );
        }

        await Message.create({
          date: String(Date.now()),
          messageText,
          userId: authorId,
          authorNickname,
          recipientId,
          recipientNickname,
          authorAvatarSrc: foundSender.dataValues.avatar,
          recipientAvatarSrc: foundReceiver.dataValues.avatar,
        });

        return response.status(201).json({
          messageAuthorId: authorId,
          messageAuthorNickname: authorNickname,
          messageRecipientId: recipientId,
          messageRecipientNickname: recipientNickname,
          message: lang === 'ru' ?
            "Сообщение было успешно отправлено" :
            "The message was successfully sent",
        });
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        next(ApiError.badRequest(exception.message));
      }
    }
  }

  async getDialogMessages(request: IRequestModified, response: Response, next: NextFunction): Promise<void | Response> {
    try {
      const { requesterId } = request;
      const { lang } = request.query;
      const { userId, interlocutorId } = request.params;

      if (!userId || !interlocutorId) {
        return next(
          ApiError.badRequest(
            lang === 'ru' ?
              "Недостаточно данных для выполнения операции" :
              "Not enough data to perform the operation"
          )
        );
      }

      if (requesterId) {
        if (Number(userId) !== requesterId) {
          return next(
            ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
        }
      } else {
        return next(
          ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
      }

      if (User && Message) {
        const foundSender = await User.findOne({ where: { id: userId } });
        const foundReceiver = await User.findOne({ where: { id: interlocutorId } });

        if (!foundSender) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Отправитель не найден, операция невозможна" :
                "The sender was not found, the operation is impossible"
            )
          );
        }
        if (!foundReceiver) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Получатель не найден, операция невозможна" :
                "The recipient was not found, the operation is impossible"
            )
          );
        }

        const dialogMessages = await Message.findAll({
          where: {
            [Op.or]: {
              userId: userId || interlocutorId,
              recipientId: userId || interlocutorId
            }
          }
        });

        if (dialogMessages.length) {
          dialogMessages.forEach((message) => {
            if (message.dataValues.recipientId === Number(userId)) {
              message.update({
                isRead: true,
              })
            }
          })
        }

        return response.json({
          messages: dialogMessages,
          message: lang === 'ru' ?
            "Сообщения из диалога получены" :
            "The message was successfully sent",
        });
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        next(ApiError.badRequest(exception.message));
      }
    }
  }
};

export const messageController = new MessageController();
