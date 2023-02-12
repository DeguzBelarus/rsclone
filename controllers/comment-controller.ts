import { Response, NextFunction, Request } from 'express';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

import { Post, Comment, User } from '../db-models/db-models';
import { CurrentLanguageType, IPostModel, FormidableFile, IRequestModified } from '../types/types';
import { ApiError } from '../error-handler/error-handler';
import { Undefinable } from '../client/src/types/types';

class CommentController {
  async create(request: IRequestModified, response: Response, next: NextFunction): Promise<void | Response> {
    try {
      const { requesterId } = request;
      const { lang } = request.query;
      const { postId, userId } = request.params;
      const { commentText } = request.body;

      if (!postId || !userId || !commentText || !lang) {
        return next(
          ApiError.badRequest(
            lang === 'ru' ?
              "Недостаточно данных для выполнения операции" :
              "Not enough data to perform the operation"
          )
        );
      }

      if (commentText.length > 200) {
        return next(
          ApiError.badRequest(
            lang === "ru" ?
              "Максимальное количество символов в комментарии - 200" :
              "The maximum number of characters in a comment is 200"
          )
        );
      }

      if (Post && User && Comment) {
        const foundPostForCommenting = await Post.findOne({ where: { id: postId } });
        if (!foundPostForCommenting) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Указанный пост не найден" :
                "The specified post was not found"
            )
          );
        }
        const foundCommentator = await User.findOne({ where: { id: userId } });
        if (!foundCommentator) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Комментирующий пользователь не найден" :
                "The commenting user was not found"
            )
          );
        }

        if (requesterId) {
          if (foundCommentator.dataValues.id !== requesterId) {
            return next(
              ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
          }
        } else {
          return next(
            ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
        }

        await Comment.create({
          date: String(Date.now()),
          commentText,
          authorNickname: foundCommentator.dataValues.nickname,
          userId: Number(foundCommentator.dataValues.id),
          postId: Number(foundPostForCommenting.dataValues.id),
        });

        return response.status(201).json({
          message: lang === 'ru' ?
            "Комментарий успешно опубликован" :
            "The comment was successfully published",
        });
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        next(ApiError.badRequest(exception.message));
      }
    }
  }

  async delete(request: IRequestModified, response: Response, next: NextFunction): Promise<void | Response> {
    try {
      const { requesterId, role } = request;
      const { id } = request.params;
      const { lang } = request.query;

      if (Comment) {
        const foundCommentForDeleting = await Comment.findOne({
          where: { id: Number(id) },
        });
        if (foundCommentForDeleting) {
          if (requesterId && role) {
            if ((requesterId !== foundCommentForDeleting.dataValues.userId) || role !== 'ADMIN') {
              return next(
                ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
            }
          } else {
            return next(
              ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
          }

          await Comment.destroy({ where: { id } });

          return response.json({
            commentOwnerId: foundCommentForDeleting.dataValues.userId,
            postId: foundCommentForDeleting.dataValues.postId,
            message: lang === 'ru' ?
              "Комментарий удалён!" :
              "The comment has been deleted!",
          });
        } else {
          return response.status(204).json({
            message:
              lang === "ru"
                ? "Указанный комментарий не найден"
                : "The specified comment was not found",
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

export const commentController = new CommentController();
