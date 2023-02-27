import { Response, NextFunction, Request } from 'express';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

import { Post, Comment, User, Like } from '../db-models/db-models';
import { ApiError } from '../error-handler/error-handler';
import { Undefinable } from '../client/src/types/types';
import { CurrentLanguageType, IPostModel, FormidableFile, IRequestModified } from '../types/types';

class PostController {
  async create(request: IRequestModified, response: Response,
    next: NextFunction): Promise<void | Response> {
    try {
      const { requesterId } = request;
      const { id } = request.params;

      if (!fs.existsSync(path.join(__dirname, '..', 'temp'))) {
        fs.mkdirSync(path.join(__dirname, '..', 'temp'),
          { recursive: true }
        );
        console.log('temp folder has been created');
      }
      const tempFolderPath = path.join(__dirname, '..', 'temp');

      const form = formidable({ multiples: true, uploadDir: tempFolderPath });
      form.parse(request, async (error: Error, fields: formidable.Fields, files: formidable.Files) => {
        if (error) {
          console.error('\x1b[40m\x1b[31m\x1b[1m', error);
        }
        let { lang, postText, media, postHeading,
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
                fs.unlinkSync(path.join(__dirname, '..', 'temp', file))
              }
            })
          }

          return next(
            ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
        }

        if (Post && User) {
          if (!lang || !postText || !postHeading) {
            return next(
              ApiError.badRequest(
                lang === 'ru' ?
                  "Недостаточно данных для выполнения операции" :
                  "Not enough data to perform the operation"
              )
            );
          }
          if (postHeading.length > 200) {
            return next(
              ApiError.badRequest(
                lang === 'ru' ?
                  "Максимальное количество символов в заголовке поста - 200" :
                  "The maximum number of characters in the title of a post is 200"
              )
            );
          }
          if (postText.length > 1000) {
            return next(
              ApiError.badRequest(
                lang === 'ru' ?
                  "Максимальное количество символов в тексте поста - 1000" :
                  "The maximum number of characters in the text of the post is 1000"
              )
            );
          }

          const foundPostAuthor = await User.findOne({ where: { id: Number(id) } })
          if (foundPostAuthor) {
            const mediaFile = files.media as FormidableFile;
            if (mediaFile) {
              let mediaNewFullName: Undefinable<string>;
              mediaNewFullName = `${mediaFile.newFilename}.${mediaFile.mimetype?.split('/')[1]}`;

              if (mediaFile.newFilename) {
                const newPost = await Post.create({
                  date: String(Date.now()),
                  postHeading,
                  postText,
                  media: mediaNewFullName,
                  userId: Number(id),
                  ownerNickname: foundPostAuthor.dataValues.nickname,
                  ownerAvatar: foundPostAuthor.dataValues.avatar,
                  ownerRole: foundPostAuthor.dataValues.role,
                });

                if (!fs.existsSync(path.join(__dirname, '..', 'static', `${id}`, 'posts'))) {
                  fs.mkdirSync(path.join(__dirname, '..', 'static', `${id}`, 'posts'),
                    { recursive: true }
                  );
                }
                if (fs.existsSync(path.join(__dirname, '..', 'static', `${id}`, 'posts'))) {
                  fs.mkdirSync(path.join(__dirname, '..', 'static', `${id}`, 'posts',
                    String(newPost.dataValues.id)),
                    { recursive: true }
                  );
                }
                fs.rename(path.join(tempFolderPath, mediaFile.newFilename), path.join(__dirname,
                  '..', 'static', `${id}`, 'posts', String(newPost.dataValues.id), mediaNewFullName),
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
              date: String(Date.now()),
              postHeading,
              postText,
              media: '',
              userId: Number(id),
              ownerNickname: foundPostAuthor.dataValues.nickname,
              ownerAvatar: foundPostAuthor.dataValues.avatar,
              ownerRole: foundPostAuthor.dataValues.role,
            });

            return response.status(201).json({
              message: lang === 'ru' ?
                "Пост успешно опубликован" :
                "The post was successfully published",
            });
          } else {
            return next(
              ApiError.badRequest(
                lang === 'ru' ?
                  "Автор поста не найден" :
                  "The author of the post was not found"
              )
            );
          }
        }
      })
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        next(ApiError.badRequest(exception.message));
      }
    }
  }

  async getAllPosts(request: Request, response: Response, next: NextFunction) {
    try {
      if (Post && Comment && Like) {
        const { lang } = request.query;

        const foundPosts = await Post.findAll({
          include: [
            { model: Comment, as: 'comments' },
            { model: Like, as: 'likes' }
          ]
        });
        if (foundPosts) {
          return response.json({
            postsData: foundPosts
              .map((post) => {
                return {
                  id: post.dataValues.id,
                  date: post.dataValues.date,
                  editDate: post.dataValues.editDate,
                  postHeading: post.dataValues.postHeading,
                  postText: post.dataValues.postText,
                  media: post.dataValues.media,
                  userId: post.dataValues.userId,
                  ownerNickname: post.dataValues.ownerNickname,
                  ownerAvatar: post.dataValues.ownerAvatar,
                  ownerRole: post.dataValues.ownerRole,
                  comments: post.dataValues.comments,
                  likes: post.dataValues.likes,
                }
              })
              .sort((prevPost, nextPost) => {
                if (prevPost.id && nextPost.id) {
                  if (prevPost.id > nextPost.id) {
                    return -1;
                  }
                  if (prevPost.id < nextPost.id) {
                    return 1;
                  }
                }
                return 0;
              }),
            message: lang === 'ru' ?
              "Данные о всех постах успешно получены" :
              "Data on all posts has been successfully received",
          });
        } else {
          return next(
            ApiError.internalServerError(
              lang === 'ru' ?
                "Невозможно получить данные о всех постах" :
                "It is impossible to get data on all posts"
            )
          );
        }
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        next(ApiError.badRequest(exception.message));
      }
    }
  }

  async getOnePost(request: Request, response: Response, next: NextFunction) {
    try {
      if (Post && Comment && Like) {
        const { id } = request.params;
        const { lang } = request.query;

        const foundPost = await Post.findOne({
          where: { id },
          include: [
            { model: Comment, as: 'comments' },
            { model: Like, as: 'likes' }
          ],
        });
        if (foundPost) {
          const { id, date, media, postHeading, postText, userId, editDate,
            ownerNickname, ownerAvatar, ownerRole, likes } = foundPost.dataValues;
          let { comments } = foundPost.dataValues;

          comments = comments?.sort((prevComment, nextComment) => {
            if (prevComment.id && nextComment.id) {
              if (prevComment.id > nextComment.id) {
                return 1;
              }
              if (prevComment.id < nextComment.id) {
                return 1;
              }
            }
            return 0;
          }).reverse();
          return response.json({
            postData: {
              id, date, media, postHeading, postText, userId, editDate, comments,
              ownerNickname, ownerAvatar, ownerRole, likes
            },
            message: lang === 'ru' ?
              "Данные поста успешно получены" :
              "The post data has been successfully received",
          });
        } else {
          return next(
            ApiError.notFound(
              lang === 'ru' ?
                "Пост не найден" :
                "Post not found"
            )
          );
        }
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
      const { requesterId, role } = request;
      const { id } = request.params;
      const { lang } = request.query;

      if (Post && Comment && Like) {
        const foundPostForDeleting = await Post.findOne({
          where: { id: Number(id) },
        });
        if (foundPostForDeleting) {
          if (requesterId && role) {
            if ((requesterId !== foundPostForDeleting.dataValues.userId) && role !== 'ADMIN') {
              return next(
                ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
            }
            if ((requesterId !== foundPostForDeleting.dataValues.userId)
              && role === 'ADMIN' && foundPostForDeleting.dataValues.ownerRole === 'ADMIN') {
              return next(
                ApiError.forbidden(lang === 'ru'
                  ? "Админам не разрешено удалять посты других админов"
                  : "Admins are not allowed to delete posts of other admins"));
            }
          } else {
            return next(
              ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
          }

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

          const foundLikesForDeleting = await Like.findOne({
            where: {
              postId: foundPostForDeleting.dataValues.id,
            }
          })
          if (foundLikesForDeleting) {
            await Like.destroy({
              where: {
                postId: foundPostForDeleting.dataValues.id,
              }
            });
          }

          await Post.destroy({ where: { id } });

          if (fs.existsSync(path.join(__dirname, '..', 'static',
            `${foundPostForDeleting.dataValues.userId}`, 'posts',
            `${foundPostForDeleting.dataValues.id}`))) {
            fs.rmdirSync(path.join(__dirname, '..', 'static',
              `${foundPostForDeleting.dataValues.userId}`, 'posts',
              `${foundPostForDeleting.dataValues.id}`),
              { recursive: true }
            );
          }

          return response.json({
            postOwnerId: foundPostForDeleting.dataValues.userId,
            message: lang === 'ru' ?
              "Пост удалён!" :
              "The post has been deleted!",
          });
        } else {
          return response.status(204).json({
            message:
              lang === 'ru' ?
                "Указанный пост не найден"
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

  async update(request: IRequestModified, response: Response,
    next: NextFunction): Promise<void | Response> {
    try {
      const { requesterId } = request;
      const { lang } = request.query;
      const { id } = request.params;
      const { postHeading, postText } = request.body;

      if (!id || !lang || !postText || !postHeading) {
        return next(
          ApiError.badRequest(
            lang === 'ru' ?
              "Недостаточно данных для выполнения операции" :
              "Not enough data to perform the operation"
          )
        );
      }

      if (postHeading.length > 200) {
        return next(
          ApiError.badRequest(
            lang === 'ru' ?
              "Максимальное количество символов в заголовке поста - 200" :
              "The maximum number of characters in the title of a post is 200"
          )
        );
      }
      if (postText.length > 1000) {
        return next(
          ApiError.badRequest(
            lang === 'ru' ?
              "Максимальное количество символов в тексте поста - 1000" :
              "The maximum number of characters in the text of the post is 1000"
          )
        );
      }

      if (Post) {
        const foundPostForUpdating = await Post.findOne({ where: { id }, });
        if (!foundPostForUpdating) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Указанный пост не найден" :
                "The specified post was not found"
            )
          );
        }

        if (requesterId) {
          if (foundPostForUpdating.dataValues.userId !== requesterId) {
            return next(
              ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
          }
        } else {
          return next(
            ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
        }

        await foundPostForUpdating.update({
          editDate: String(Date.now()),
          postHeading,
          postText,
        });

        return response.json({
          message: lang === 'ru' ?
            "Пост успешно обновлен" :
            "The post was successfully updated",
        });
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        next(ApiError.badRequest(exception.message));
      }
    }
  }
};

export const postController = new PostController();
