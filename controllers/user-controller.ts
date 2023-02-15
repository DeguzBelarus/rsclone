import { Op } from "sequelize";
import { Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import formidable from 'formidable';

import { User, Post, Comment, Message } from '../db-models/db-models';
import { CurrentLanguageType, IUserModel, IRequestModified, FormidableFile, IFoundUserData, ISearchUsersResponse, IMessageModel, IUserDialog } from '../types/types';
import { ApiError } from '../error-handler/error-handler';
import { Undefinable } from '../client/src/types/types';

const forbiddenCharactersChecker = (string: string): boolean => {
  if (string.includes("*") ||
    string.includes("/") ||
    string.includes("\\") ||
    string.includes(":") ||
    string.includes("?") ||
    string.includes("|") ||
    string.includes('"') ||
    string.includes("'") ||
    string.includes("`") ||
    string.includes("<") ||
    string.includes(">")) {
    return true;
  }
  return false;
};
class UserController {
  async registration(request: IRequestModified, response: Response, next: NextFunction): Promise<void | Response> {
    try {
      const {
        email,
        password,
        nickname,
        role,
        lang
      }: IUserModel & { lang: CurrentLanguageType } = request.body;

      if (!email || !password || !nickname) {
        return next(
          ApiError.badRequest(
            lang === 'ru' ?
              "Недостаточно данных для регистрации" :
              "Insufficient data for registration"
          )
        );
      }
      if (
        email.length < 8 ||
        !email.includes('@') ||
        !email.includes('.') ||
        email.length > 255
      ) {
        return next(
          ApiError.badRequest(
            lang === 'ru' ?
              "Указанный email некорректный" :
              "The specified email is incorrect"
          )
        );
      }
      if (password.length < 8) {
        return next(
          ApiError.badRequest(
            lang === 'ru' ?
              "Минимальная длина пароля - 8 символов" :
              "The minimum password length is 8 characters"
          )
        );
      }
      if (password.length > 255) {
        return next(
          ApiError.badRequest(
            lang === 'ru' ?
              "Максимальная длина пароля - 255 символов" :
              "The maximum password length is 255 characters"
          )
        );
      }
      if (nickname.length < 3) {
        return next(
          ApiError.badRequest(
            lang === 'ru' ?
              "Минимальная длина никнейма - 3 символа" :
              "The minimum nickname length is 3 characters"
          )
        );
      }
      if (nickname.length > 10) {
        return next(
          ApiError.badRequest(
            lang === 'ru' ?
              "Максимальная длина никнейма - 10 символов" :
              "The maximum nickname length is 10 characters"
          )
        );
      }

      if (User) {
        let candidate = await User.findOne({
          where: {
            nickname
          }
        });
        if (candidate) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Указанный никнейм уже используется" :
                "The specified nickname is already in use"
            )
          );
        }

        candidate = await User.findOne({
          where: {
            email
          }
        });
        if (candidate) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Указанный email уже используется" :
                "The specified email is already in use"
            )
          );
        }
      }

      const cryptedPassword = await bcrypt.hash(password, 10);
      if (User && process.env.JWT_SECRET) {
        const newUser = await User.create({
          email,
          role: (email === process.env.ADMIN_FIRST)
            || (email === process.env.ADMIN_SECOND)
            || (email === process.env.ADMIN_THIRD)
            ? 'ADMIN'
            : 'USER',
          nickname,
          password: cryptedPassword,
        });

        const token = jwt.sign({
          id: newUser.dataValues.id,
          email,
          nickname,
          role,
        },
          process.env.JWT_SECRET, {
          expiresIn: '24h'
        }
        );

        return response.status(201).json({
          token,
          message: lang === 'ru' ?
            "Регистрация успешно завершена!" :
            "Registration has been successfully completed!",
        });
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        next(ApiError.badRequest(exception.message));
      }
    }
  }

  async login(request: IRequestModified, response: Response, next: NextFunction): Promise<void | Response> {
    try {
      const {
        email,
        password,
        lang
      }: IUserModel & { lang: CurrentLanguageType } = request.body;

      if (User && process.env.JWT_SECRET) {
        const user = await User.findOne({
          where: {
            email
          }
        });
        if (!user) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Неверные данные для входа в систему" :
                "Invalid login information"
            )
          );
        }

        const passwordIsMatch = bcrypt.compareSync(password, user.dataValues.password);
        if (!passwordIsMatch) {
          return next(
            ApiError.badRequest(
              lang === 'ru' ?
                "Неверные данные для входа в систему" :
                "Invalid login information"
            )
          );
        }

        const token = jwt.sign({
          id: user.dataValues.id,
          email,
          nickname: user.dataValues.nickname,
          role: user.dataValues.role,
        },
          process.env.JWT_SECRET, {
          expiresIn: '24h'
        });

        return response.json({
          token,
          message: lang === 'ru' ?
            "Вы успешно вошли в систему!" :
            "You have successfully logged in!",
        });
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        next(ApiError.badRequest(exception.message));
      }
    }
  }

  async getAll(request: IRequestModified, response: Response, next: NextFunction): Promise<void | Response> {
    try {
      if (User) {
        const { searchKey, lang } = request.query;

        if (!searchKey && typeof searchKey === 'string' && lang) {
          const filteredSearchResponse: ISearchUsersResponse = {
            count: 0,
            searchResult: [],
            message: lang === "ru" ?
              "Поиск пользователей успешно выполнен" :
              "User search completed successfully"
          }
          return response.json(filteredSearchResponse);
        }

        if (typeof searchKey === 'string' && lang) {
          const foundUsers = await User.findAndCountAll({
            where: {
              [Op.or]: {
                nickname: {
                  [Op.or]: { [Op.startsWith]: searchKey, [Op.iLike]: `${searchKey}%` },
                },
                country: {
                  [Op.or]: { [Op.startsWith]: searchKey, [Op.iLike]: `${searchKey}%` },
                },
                city: {
                  [Op.or]: { [Op.startsWith]: searchKey, [Op.iLike]: `${searchKey}%` },
                },
                firstName: {
                  [Op.or]: { [Op.startsWith]: searchKey, [Op.iLike]: `${searchKey}%` },
                },
                lastName: {
                  [Op.or]: { [Op.startsWith]: searchKey, [Op.iLike]: `${searchKey}%` },
                }
              }
            },
          });
          const filteredSearchResponse: ISearchUsersResponse = {
            count: foundUsers.count,
            searchResult: foundUsers.rows.map((user) => {
              return {
                id: user.dataValues.id,
                nickname: user.dataValues.nickname,
                firstName: user.dataValues.firstName,
                lastName: user.dataValues.lastName,
                city: user.dataValues.city,
                country: user.dataValues.country,
                avatarSrc: user.dataValues.avatar,
                role: user.dataValues.role,
              }
            }),
            message: lang === "ru" ?
              "Поиск пользователей успешно выполнен" :
              "User search completed successfully"
          }
          return response.json(filteredSearchResponse);
        } else {
          return next(
            ApiError.badRequest(
              lang === "ru" ?
                "Недостаточно данных для выполнения операции" :
                "Not enough data to perform the operation"
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

  async getOneUser(request: IRequestModified, response: Response, next: NextFunction) {
    try {
      if (User && Post && Message) {
        const { userId } = request.params;
        const { lang } = request.query;
        const { requesterId, role } = request;

        const foundUser = await User.findOne({
          where: { id: Number(userId) },
          include: [
            { model: Post, as: "posts" },
            { model: Message, as: "dialogs" },
          ],
        });

        if (foundUser) {
          const { id, age, city, country, email, firstName, lastName, nickname, role: userRole, avatar
          } = foundUser.dataValues;
          let { posts, dialogs } = foundUser.dataValues

          if (posts) {
            posts = posts.sort((prevPost, nextPost) => {
              if (prevPost.id && nextPost.id) {
                if (prevPost.id > nextPost.id) {
                  return 1;
                }
                if (prevPost.id < nextPost.id) {
                  return 1;
                }
              }
              return 0;
            }).reverse()
          };

          if (Number(userId) === requesterId) {
            const incomingMessages = await Message.findAll({ where: { recipientId: userId } }) as unknown as Array<IMessageModel>;
            const outgoingMessages = dialogs as unknown as Array<IMessageModel>;
            const allMessages = [...incomingMessages, ...outgoingMessages];
            allMessages.sort((prevMessage, nextMessage) => {
              if (prevMessage.id && nextMessage.id) {
                if (prevMessage.id > nextMessage.id) {
                  return 1;
                }
                if (prevMessage.id < nextMessage.id) {
                  return 1;
                }
              }
              return 0;
            }).reverse();
            const modifiedDialogs = allMessages
              .map((message, i, array) => {
                const authorId = message.userId;
                const recipientId = message.recipientId;

                return {
                  authorId: message.userId,
                  authorNickname: message.authorNickname,
                  recipientId: message.recipientId,
                  recipientNickname: message.recipientNickname,
                  unreadMessages: array.reduce((sum: number, message) => {
                    if ((message.userId === authorId || message.recipientId === recipientId)
                      && !message.isRead) {
                      return sum += 1;
                    } else return sum;
                  }, 0),
                  lastMessageDate: array.find((message) => (message.userId === authorId
                    || message.recipientId === recipientId))?.date,
                  lastMessageText: array.find((message) => (message.userId === authorId
                    || message.recipientId === recipientId))?.messageText,
                  lastMessageId: message.id,
                  lastMessageAuthorNickname: array.find((message) => (message.userId === authorId
                    || message.recipientId === recipientId))?.authorNickname,
                  authorAvatarSrc: message.authorAvatarSrc,
                  recipientAvatarSrc: message.recipientAvatarSrc,
                }
              }) as Array<IUserDialog>;

            const userDialogs: Array<IUserDialog> = [];
            modifiedDialogs.forEach((modifiedDialog) => {
              if (!userDialogs.find((uniqueDialog: IUserDialog) => uniqueDialog.authorId === modifiedDialog.authorId
                && uniqueDialog.recipientId === modifiedDialog.recipientId)) {
                userDialogs.push(modifiedDialog);
              }
            });
            response.json({
              userData: {
                id, age, city, country, email, firstName, lastName, nickname, role: userRole,
                avatar, posts, userDialogs
              },
              message: lang === 'ru' ?
                "Получены собственные данные пользователя" :
                "The user's own data was obtained",
            });
          } else if (role === 'ADMIN') {
            response.json({
              userData: { id, age, city, country, email, firstName, lastName, nickname, role: userRole, avatar, posts },
              message: lang === 'ru' ?
                "Данные пользователя получены администратором" :
                "The user's data was received by the administrator",
            });
          } else {
            response.json({
              userData: { id, age, city, country, firstName, lastName, nickname, role: userRole, avatar, posts },
              message: lang === 'ru' ?
                "Данные пользователя получены" :
                "User data received",
            });
          }
        } else {
          return next(
            ApiError.notFound(
              lang === 'ru' ?
                "Пользователь не найден" :
                "User not found"
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

  async delete(request: IRequestModified, response: Response, next: NextFunction): Promise<void | Response> {
    try {
      if (User && Post && Comment) {
        const { id } = request.params;
        const { lang } = request.query;
        const { requesterId, role } = request;

        const deletedUser = await User.findOne({ where: { id: id } });
        if (deletedUser) {
          if (Number(id) !== requesterId) {
            if (role !== 'ADMIN' && deletedUser.dataValues.role === 'ADMIN') {
              return next(
                ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
            }
            if (role === 'ADMIN' && deletedUser.dataValues.role === 'ADMIN') {
              return next(
                ApiError.forbidden(lang === 'ru'
                  ? "Админу не разрешено удаление другого админа"
                  : "Admin is not allowed to delete another admin"));
            }
          }

          const foundCommentsForDeleting = await Comment.findOne({
            where: {
              userId: deletedUser.dataValues.id,
            }
          })
          if (foundCommentsForDeleting) {
            await Comment.destroy({
              where: {
                userId: deletedUser.dataValues.id,
              }
            });
          }

          const foundPostsForDeleting = await Post.findOne({
            where: {
              userId: deletedUser.dataValues.id,
            }
          })
          if (foundPostsForDeleting) {
            await Post.destroy({
              where: {
                userId: deletedUser.dataValues.id,
              }
            });
          }

          await User.destroy({ where: { id } });
          if (fs.existsSync(path.join(__dirname, "..", "static", `${id}`))) {
            fs.rmdirSync(path.join(__dirname, "..", "static", `${id}`),
              { recursive: true }
            );
          }
          return response.json({
            message: lang === 'ru' ?
              "Пользователь удалён!" :
              "The user has been deleted!",
          });
        } else {
          return response.status(204).json({
            message:
              lang === "ru"
                ? "Указанный пользователь не найден"
                : "The specified user was not found",
          });
        }
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        next(ApiError.badRequest(exception.message));
      }
    }
  }

  async authCheck(request: IRequestModified, response: Response, next: NextFunction): Promise<void | Response> {
    try {
      if (process.env.JWT_SECRET) {
        const {
          lang
        }: { lang: CurrentLanguageType } = request.body;

        if (request.user) {
          const token = jwt.sign({
            id: request.user.id,
            email: request.user.email,
            nickname: request.user.nickname,
            role: request.user.role,
          },
            process.env.JWT_SECRET, {
            expiresIn: '24h'
          });

          return response.json({
            token,
            message: lang === 'ru' ?
              "Авторизация подтверждена!" :
              "Authorization is confirmed!",
          });
        }
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        next(ApiError.badRequest(exception.message));
      }
    }
  }

  async update(request: IRequestModified, response: Response, next: NextFunction): Promise<void | Response> {
    try {
      const { id } = request.params;
      const { requesterId } = request;
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
        let { lang, email, nickname, password, age, country, city, firstName, avatar, lastName, role,
        } = fields as formidable.Fields & IUserModel & { lang: CurrentLanguageType };

        if (User) {
          const foundUserForUpdating = await User.findOne({ where: { id }, });
          if (foundUserForUpdating) {
            if (typeof email !== 'string' &&
              typeof nickname !== 'string' &&
              typeof password !== 'string' &&
              typeof age !== 'string' &&
              typeof country !== 'string' &&
              typeof city !== 'string' &&
              typeof firstName !== 'string' &&
              typeof lastName !== 'string') {

              const avatarFile = files.avatar as FormidableFile;
              if (avatarFile || typeof avatar === 'string' || role) {
                if (typeof avatar === 'string' && avatarFile) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Некорректные данные для изменения/удаления аватара" :
                        "Incorrect data for changing/deleting the avatar"
                    )
                  );
                }

                if (typeof avatar === 'string' && !avatarFile) {
                  if (fs.existsSync(path.join(__dirname, "..", "static", `${id}`, "avatar"))) {
                    fs.rmdirSync(path.join(__dirname, "..", "static", `${id}`, "avatar"),
                      { recursive: true }
                    );
                  }

                  await foundUserForUpdating.update({
                    avatar: '',
                  });

                  return response.json({
                    message: lang === 'ru' ?
                      "Аватар удалён" :
                      "Avatar has been deleted",
                  });
                }
                if (avatarFile && typeof avatar !== 'string') {
                  if (fs.existsSync(path.join(__dirname, "..", "static", `${id}`, "avatar"))) {
                    fs.rmdirSync(path.join(__dirname, "..", "static", `${id}`, "avatar"),
                      { recursive: true }
                    );
                  }

                  let avatarNewFullName: Undefinable<string>;
                  avatarNewFullName = `${avatarFile.newFilename}.${avatarFile.mimetype?.split('/')[1]}`;
                  if (avatarFile.newFilename) {
                    if (fs.existsSync(path.join(__dirname, "..", "static", `${id}`, "avatar"))) {
                      fs.rmdirSync(path.join(__dirname, "..", "static", `${id}`, "avatar"),
                        { recursive: true }
                      );
                    }
                    fs.mkdirSync(path.join(__dirname, "..", "static", `${id}`, "avatar"),
                      { recursive: true }
                    );
                    fs.rename(path.join(tempFolderPath, avatarFile.newFilename), path.join(__dirname,
                      "..", "static", `${id}`, "avatar", avatarNewFullName),
                      (error) => {
                        if (error) {
                          console.log(error);
                        }
                      })

                    await foundUserForUpdating.update({
                      avatar: avatarNewFullName,
                    });

                    return response.json({
                      message: lang === 'ru' ?
                        "Аватар обновлен" :
                        "Avatar has been updated",
                    });
                  }
                }

                if (role) {
                  console.log(requesterId);

                  if (Number(id) !== requesterId) {
                    if (role !== 'ADMIN' && foundUserForUpdating.dataValues.role === 'ADMIN') {
                      return next(
                        ApiError.forbidden(lang === 'ru' ? "Нет прав" : "No rights"));
                    }
                    if (role === 'ADMIN' && foundUserForUpdating.dataValues.role === 'ADMIN') {
                      return next(
                        ApiError.forbidden(lang === 'ru'
                          ? "Админу не разрешено изменение роли другого админа"
                          : "Admin is not allowed to change the role of another admin"));
                    }
                  }

                  await foundUserForUpdating.update({
                    role,
                  });

                  return response.json({
                    message: lang === 'ru' ?
                      "Роль обновлена" :
                      "The role has been updated",
                  });
                }
              } else {
                return next(
                  ApiError.badRequest(
                    lang === "ru" ?
                      "Недостаточно данных для выполнения операции" :
                      "Not enough data to perform the operation"
                  )
                );
              }
            } else {
              // nickname checking
              if (nickname) {
                if (forbiddenCharactersChecker(nickname)) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Запрещённые символы в никнейме" :
                        "Forbidden characters in the nickname"
                    )
                  );
                }
                if (nickname.length < 3) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Минимальная длина никнейма - 3 символа" :
                        "The minimum nickname length is 3 characters"
                    )
                  );
                }
                if (nickname.length > 10) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Максимальная длина никнейма - 10 символов" :
                        "The maximum nickname length is 10 characters"
                    )
                  );
                }

                const foundUserWithSameNickname = await User.findOne({
                  where: { nickname },
                });
                if (foundUserWithSameNickname &&
                  foundUserWithSameNickname.dataValues.id !== Number(id)) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Указанный никнейм уже используется" :
                        "The specified nickname is already in use"
                    )
                  );
                }
              } else {
                return next(
                  ApiError.badRequest(
                    lang === 'ru' ?
                      "Необходимо указать никнейм" :
                      "You must specify a nickname"
                  )
                );
              }

              // age checking
              if (Number.isNaN(Number(age))) {
                return next(
                  ApiError.badRequest(
                    lang === 'ru' ?
                      "Указанный возраст некорректный" :
                      "The specified age is incorrect"
                  )
                );
              }
              age = Number(age);
              if (!age) {
                age = null;
              }
              if (age && age > 200) {
                return next(
                  ApiError.badRequest(
                    lang === 'ru' ?
                      "Возраст не может быть больше 200 лет" :
                      "The age cannot be more than 200 years"
                  )
                );
              }

              // country checking
              if (country) {
                if (forbiddenCharactersChecker(country)) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Запрещённые символы в названии страны" :
                        "Forbidden characters in the country name"
                    )
                  );
                }

                if (country.length < 3) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Минимальная длина названия страны - 3 символа" :
                        "The minimum country name length is 3 characters"
                    )
                  );
                }
                if (country.length > 20) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Максимальная длина названия страны - 20 символов" :
                        "The maximum country name length is 20 characters"
                    )
                  );
                }
              }

              // city checking
              if (city) {
                if (forbiddenCharactersChecker(city)) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Запрещённые символы в названии города" :
                        "Forbidden characters in the city name"
                    )
                  );
                }
                if (city.length < 3) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Минимальная длина названия города - 3 символа" :
                        "The minimum city name length is 3 characters"
                    )
                  );
                }
                if (city.length > 20) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Максимальная длина названия города - 20 символов" :
                        "The maximum city name length is 20 characters"
                    )
                  );
                }
              }

              // first name checking
              if (firstName) {
                if (forbiddenCharactersChecker(firstName)) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Запрещённые символы в имени" :
                        "Forbidden characters in the first name"
                    )
                  );
                }

                if (firstName.length < 3) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Минимальная длина имени - 3 символа" :
                        "The minimum name length is 3 characters"
                    )
                  );
                }
                if (firstName.length > 20) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Максимальная длина имени - 20 символов" :
                        "The maximum name length is 20 characters"
                    )
                  );
                }
              }

              // last name checking
              if (lastName) {
                if (forbiddenCharactersChecker(lastName)) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Запрещённые символы в фамилии" :
                        "Forbidden characters in the last name"
                    )
                  );
                }

                if (lastName.length < 3) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Минимальная длина фамилии - 3 символа" :
                        "The minimum last name length is 3 characters"
                    )
                  );
                }
                if (lastName.length > 20) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Максимальная длина фамилии - 20 символов" :
                        "The maximum last name length is 20 characters"
                    )
                  );
                }
              }

              // email checking
              if (email) {
                if (email.length < 8 ||
                  !email.includes("@") ||
                  !email.includes(".") ||
                  email.length > 255) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Указанный email некорректный" :
                        "The specified email is incorrect"
                    )
                  );
                }

                const foundUserWithSameEmail = await User.findOne({
                  where: { email: email },
                });
                if (
                  foundUserWithSameEmail &&
                  foundUserWithSameEmail.dataValues.id !== Number(id)
                ) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Указанный email уже используется" :
                        "The specified email is already in use"
                    )
                  );
                }
              } else {
                return next(
                  ApiError.badRequest(
                    lang === 'ru' ?
                      "Необходимо указать email" :
                      "You must specify a email"
                  )
                );
              }

              // password checking
              if (password) {
                if (password.length < 8) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Минимальная длина пароля - 8 символов" :
                        "The minimum password length is 8 characters"
                    )
                  );
                }
                if (password.length > 255) {
                  return next(
                    ApiError.badRequest(
                      lang === 'ru' ?
                        "Максимальная длина пароля - 255 символов" :
                        "The maximum password length is 255 characters"
                    )
                  );
                }
                password = await bcrypt.hash(password, 10);
              }

              // creating individual folder if it doesn't exist
              if (!fs.existsSync(path.join(__dirname, "..", "static", `${id}`))) {
                fs.mkdirSync(path.join(__dirname, "..", "static", `${id}`,),
                  { recursive: true }
                );
              }

              // updating database data
              if (password) {
                await foundUserForUpdating.update({
                  age,
                  city,
                  country,
                  email,
                  nickname,
                  firstName,
                  lastName,
                  password,
                });
              } else {
                await foundUserForUpdating.update({
                  age,
                  city,
                  country,
                  email,
                  nickname,
                  firstName,
                  lastName,
                });
              }
              return response.json({
                message: lang === 'ru' ?
                  "Данные обновлены" :
                  "Data updated",
              });
            }
          } else {
            return next(
              ApiError.badRequest(
                lang === 'ru' ?
                  "Указанный пользователь не найден" :
                  "The specified user was not found"
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
}

export const userController = new UserController();
