import { Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

import { Post, Comment } from '../db-models/db-models';
import { CurrentLanguageType, IPostModel, FormidableFile, IRequestModified } from '../types/types';
import { ApiError } from '../error-handler/error-handler';
import { Undefinable } from '../client/src/types/types';

class PostController {
  async create(request: IRequestModified, response: Response, next: NextFunction): Promise<void | Response> {
    try {
      const { requesterId } = request;
      const { id } = request.params;

      if (!fs.existsSync(path.join(__dirname, "..", "temp"))) {
        fs.mkdirSync(path.join(__dirname, "..", "temp"),
          { recursive: true }
        );
        console.log('temp folder has been created');
      }
      const tempFolderPath = path.join(__dirname, "..", "temp");

      const form = formidable({ multiples: true, uploadDir: tempFolderPath });
      form.parse(request, async (error: Error, fields: formidable.Fields, files: formidable.Files) => {
        if (error) {
          console.error('\x1b[40m\x1b[31m\x1b[1m', error);
        }
        let { lang, date, postText, media, postHeading,
        } = fields as formidable.Fields & IPostModel & { lang: CurrentLanguageType };

        if (requesterId && id) {
          if (Number(id) !== requesterId) {
            return next(
              ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
          }
        } else {
          const mediaFile = files.media as FormidableFile;
          if (mediaFile) {
            fs.readdirSync(tempFolderPath).forEach((file) => {
              if (file !== '.gitignore') {
                fs.unlinkSync(path.join(__dirname, "..", "temp", file))
              }
            })
          }

          return next(
            ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
        }

        if (Post) {
          if (!lang || !date || !postText || !postHeading) {
            return next(
              ApiError.badRequest(
                lang === "ru" ?
                  "Недостаточно данных для выполнения операции" :
                  "Not enough data to perform the operation"
              )
            );
          }
          if (postHeading.length > 200) {
            return next(
              ApiError.badRequest(
                lang === "ru" ?
                  "Максимальное количество символов в заголовке поста - 200" :
                  "The maximum number of characters in the title of a post is 200"
              )
            );
          }
          if (postText.length > 1000) {
            return next(
              ApiError.badRequest(
                lang === "ru" ?
                  "Максимальное количество символов в тексте поста - 1000" :
                  "The maximum number of characters in the text of the post is 1000"
              )
            );
          }

          const mediaFile = files.media as FormidableFile;
          if (mediaFile && typeof media !== 'string') {
            let mediaNewFullName: Undefinable<string>;
            mediaNewFullName = `${mediaFile.newFilename}.${mediaFile.mimetype?.split('/')[1]}`;

            if (mediaFile.newFilename) {
              const newPost = await Post.create({
                date,
                postHeading,
                postText,
                media: mediaNewFullName,
                userId: Number(id),
              });

              if (!fs.existsSync(path.join(__dirname, "..", "static", `${id}`, "posts"))) {
                fs.mkdirSync(path.join(__dirname, "..", "static", `${id}`, "posts"),
                  { recursive: true }
                );
              }
              if (fs.existsSync(path.join(__dirname, "..", "static", `${id}`, "posts"))) {
                fs.mkdirSync(path.join(__dirname, "..", "static", `${id}`, "posts", String(newPost.dataValues.id)),
                  { recursive: true }
                );
              }
              fs.rename(path.join(tempFolderPath, mediaFile.newFilename), path.join(__dirname,
                "..", "static", `${id}`, "posts", String(newPost.dataValues.id), mediaNewFullName),
                (error) => {
                  if (error) {
                    console.log(error);
                  }
                })

              return response.status(201).json({
                message: lang === 'ru' ?
                  "Пост успешно опубликован" :
                  "The post was successfully published",
              });
            }
          }

          await Post.create({
            date,
            postHeading,
            postText,
            media: '',
            userId: Number(id),
          });

          return response.status(201).json({
            message: lang === 'ru' ?
              "Пост успешно опубликован" :
              "The post was successfully published",
          });
        }
      })
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

      if (Post && Comment) {
        const foundPostForDeleting = await Post.findOne({
          where: { id: Number(id) },
        });
        if (foundPostForDeleting) {
          if (requesterId && role) {
            if (requesterId !== foundPostForDeleting.dataValues.userId && role !== 'ADMIN') {
              return next(
                ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
            }
          } else {
            return next(
              ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
          }

          await Post.destroy({ where: { id } });

          const foundCommentsForDeleting = await Comment.findOne({
            where: {
              postId: foundPostForDeleting.dataValues.id,
            }
          })
          if (foundCommentsForDeleting) {
            await Comment.destroy({
              where: {
                postId: foundPostForDeleting.dataValues.id,
              }
            });
          }

          if (fs.existsSync(path.join(__dirname, "..", "static",
            `${foundPostForDeleting.dataValues.userId}`, "posts",
            `${foundPostForDeleting.dataValues.id}`))) {
            fs.rmdirSync(path.join(__dirname, "..", "static",
              `${foundPostForDeleting.dataValues.userId}`, "posts",
              `${foundPostForDeleting.dataValues.id}`),
              { recursive: true }
            );
          }

          return response.json({
            message: lang === 'ru' ?
              "Пост удалён!" :
              "The post has been deleted!",
          });
        } else {
          return response.status(204).json({
            message:
              lang === "ru"
                ? "Указанный пост не найден"
                : "The specified post was not found",
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

export const postController = new PostController();
