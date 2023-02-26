import { Response, NextFunction } from 'express';

import { Post, Like, User } from '../db-models/db-models';
import { IRequestModified } from '../types/types';
import { ApiError } from '../error-handler/error-handler';

class LikeController {
  async create(request: IRequestModified, response: Response,
    next: NextFunction): Promise<void | Response> {
    try {
      const { requesterId } = request;
      const { lang } = request.query;
      const { postId, userId } = request.params;

      if (!postId || !userId || !lang) {
        return next(
          ApiError.badRequest(
            lang === 'ru' ?
              "Недостаточно данных для выполнения операции" :
              "Not enough data to perform the operation"
          )
        );
      }

      if (Post && User && Like) {
        const foundPostForLiking = await Post.findOne({ where: { id: postId } });
        if (!foundPostForLiking) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Указанный пост не найден" :
                "The specified post was not found"
            )
          );
        }
        const foundLiker = await User.findOne({ where: { id: userId } });
        if (!foundLiker) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Пользователь не найден" :
                "The user was not found"
            )
          );
        }

        if (requesterId) {
          console.log(userId ,foundLiker.dataValues.id, requesterId);

          if (foundLiker.dataValues.id !== requesterId) {
            return next(
              ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
          }
        } else {
          return next(
            ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
        }

        const foundLike = await Like.findOne({ where: { postId, userId: foundLiker.dataValues.id } });
        if (foundLike) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Лайк уже был поставлен" :
                "The like has already been set"
            )
          );
        }

        await Like.create({
          ownerNickname: foundLiker.dataValues.nickname,
          userId: foundLiker.dataValues.id,
          postId: Number(postId),
        });

        return response.status(201).json({
          message: lang === 'ru' ?
            "Лайк успешно поставлен" :
            "The like has been successfully set",
        });
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        next(ApiError.badRequest(exception.message));
      }
    }
  }

  async delete(request: IRequestModified, response: Response,
    next: NextFunction): Promise<void | Response> {
    try {
      const { requesterId } = request;
      const { id } = request.params;
      const { lang } = request.query;

      if (Like) {
        const foundLikeForDeleting = await Like.findOne({
          where: { id: Number(id) },
        });
        if (foundLikeForDeleting) {
          if (requesterId) {
            if ((requesterId !== foundLikeForDeleting.dataValues.userId)) {
              return next(
                ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
            }
          } else {
            return next(
              ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
          }

          await Like.destroy({ where: { id } });

          return response.json({
            likeOwnerId: foundLikeForDeleting.dataValues.userId,
            postId: foundLikeForDeleting.dataValues.postId,
            message: lang === 'ru' ?
              "Лайк удалён!" :
              "Like deleted!",
          });
        } else {
          return response.status(204).json({
            message:
              lang === 'ru' ?
                "Указанный лайк не найден"
                : "The specified like was not found",
          });
        }
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        next(ApiError.badRequest(exception.message));
      }
    }
  }
};

export const likeController = new LikeController();
