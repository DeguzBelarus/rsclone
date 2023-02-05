import { Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import formidable from 'formidable';

import { User } from '../db-models/db-models';
import { CurrentLanguageType, IUserModel, IRequestModified, FormidableFile } from '../types/types';
import { ApiError } from '../error-handler/error-handler';

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
            lang === "ru" ?
              "Недостаточно данных для регистрации" :
              "Insufficient data for registration"
          )
        );
      }
      if (
        email.length < 8 ||
        !email.includes("@") ||
        !email.includes(".") ||
        email.length > 255
      ) {
        return next(
          ApiError.badRequest(
            lang === "ru" ?
              "Указанный email некорректный" :
              "The specified email is incorrect"
          )
        );
      }
      if (password.length < 8) {
        return next(
          ApiError.badRequest(
            lang === "ru" ?
              "Минимальная длина пароля - 8 символов" :
              "The minimum password length is 8 characters"
          )
        );
      }
      if (password.length > 255) {
        return next(
          ApiError.badRequest(
            lang === "ru" ?
              "Максимальная длина пароля - 255 символов" :
              "The maximum password length is 255 characters"
          )
        );
      }
      if (nickname.length < 3) {
        return next(
          ApiError.badRequest(
            lang === "ru" ?
              "Минимальная длина никнейма - 3 символа" :
              "The minimum nickname length is 3 characters"
          )
        );
      }
      if (nickname.length > 10) {
        return next(
          ApiError.badRequest(
            lang === "ru" ?
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
              lang === "ru" ?
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
              lang === "ru" ?
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
            ? "ADMIN"
            : "USER",
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
          expiresIn: "24h"
        }
        );

        return response.status(201).json({
          token,
          message: lang === "ru" ?
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
              lang === "ru" ?
                "Неверные данные для входа в систему" :
                "Invalid login information"
            )
          );
        }

        const passwordIsMatch = bcrypt.compareSync(password, user.dataValues.password);
        if (!passwordIsMatch) {
          return next(
            ApiError.badRequest(
              lang === "ru" ?
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
          expiresIn: "24h"
        }
        );

        return response.json({
          token,
          message: lang === "ru" ?
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
            expiresIn: "24h"
          }
          );

          return response.json({
            token,
            message: lang === "ru" ?
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
      const tempFolderPath = path.join(__dirname, "..", "temp");
      const form = formidable({ multiples: true, uploadDir: tempFolderPath });
      form.parse(request, async (error: Error, fields: formidable.Fields, files: formidable.Files) => {
        if (error) {
          console.error('\x1b[40m\x1b[31m\x1b[1m', error);
        }
        let {
          lang,
          email,
          nickname,
          password,
          age,
          country,
          city,
          firstName,
          lastName,
          role,
        } = fields as formidable.Fields & IUserModel & { lang: CurrentLanguageType };

        if (!email || !nickname) {
          return next(
            ApiError.badRequest(
              lang === "ru" ?
                "Недостаточно данных для выполнения операции" :
                "Not enough data to perform the operation"
            )
          );
        }

        if (!age) {
          age = null;
        }
        if (!country) {
          country = null;
        }
        if (!city) {
          city = null;
        }
        if (!firstName) {
          firstName = null;
        }
        if (!lastName) {
          lastName = null;
        }

        if (User) {
          if (nickname) {
            if (
              forbiddenCharactersChecker(nickname)
            ) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Запрещённые символы в никнейме" :
                    "Forbidden characters in the nickname"
                )
              );
            }
            if (nickname.length < 3) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Минимальная длина никнейма - 3 символа" :
                    "The minimum nickname length is 3 characters"
                )
              );
            }
            if (nickname.length > 10) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Максимальная длина никнейма - 10 символов" :
                    "The maximum nickname length is 10 characters"
                )
              );
            }

            const foundUserWithSameNickname = await User.findOne({
              where: { nickname: nickname },
            });
            if (
              foundUserWithSameNickname &&
              foundUserWithSameNickname.dataValues.id !== Number(id)
            ) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Указанный никнейм уже используется" :
                    "The specified nickname is already in use"
                )
              );
            }
          }

          if (age) {
            if (typeof age !== "number") {
              if (Number.isNaN(Number(age))) {
                return next(
                  ApiError.badRequest(
                    lang === "ru" ?
                      "Указанный возраст некорректный" :
                      "The specified age is incorrect"
                  )
                );
              } else {
                age = Number(age);
              }
            }

            if (age > 200) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Возраст не может быть больше 200 лет" :
                    "The age cannot be more than 200 years"
                )
              );
            }
          }

          if (city) {
            if (
              forbiddenCharactersChecker(city)
            ) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Запрещённые символы в названии города" :
                    "Forbidden characters in the city name"
                )
              );
            }

            if (city.length < 3) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Минимальная длина названия города - 3 символа" :
                    "The minimum city name length is 3 characters"
                )
              );
            }
            if (city.length > 20) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Максимальная длина названия города - 20 символов" :
                    "The maximum city name length is 20 characters"
                )
              );
            }
          }

          if (country) {
            if (
              forbiddenCharactersChecker(country)
            ) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Запрещённые символы в названии страны" :
                    "Forbidden characters in the country name"
                )
              );
            }

            if (country.length < 3) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Минимальная длина названия страны - 3 символа" :
                    "The minimum country name length is 3 characters"
                )
              );
            }
            if (country.length > 20) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Максимальная длина названия страны - 20 символов" :
                    "The maximum country name length is 20 characters"
                )
              );
            }
          }

          if (firstName) {
            if (
              forbiddenCharactersChecker(firstName)
            ) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Запрещённые символы в имени" :
                    "Forbidden characters in the first name"
                )
              );
            }

            if (firstName.length < 3) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Минимальная длина имени - 3 символа" :
                    "The minimum name length is 3 characters"
                )
              );
            }
            if (firstName.length > 20) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Максимальная длина имени - 20 символов" :
                    "The maximum name length is 20 characters"
                )
              );
            }
          }

          if (lastName) {
            if (
              forbiddenCharactersChecker(lastName)
            ) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Запрещённые символы в фамилии" :
                    "Forbidden characters in the last name"
                )
              );
            }

            if (lastName.length < 3) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Минимальная длина фамилии - 3 символа" :
                    "The minimum last name length is 3 characters"
                )
              );
            }
            if (lastName.length > 20) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Максимальная длина фамилии - 20 символов" :
                    "The maximum last name length is 20 characters"
                )
              );
            }
          }

          if (email) {
            if (
              email.length < 8 ||
              !email.includes("@") ||
              !email.includes(".") ||
              email.length > 255
            ) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
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
                  lang === "ru" ?
                    "Указанный email уже используется" :
                    "The specified email is already in use"
                )
              );
            }
          }

          if (password) {
            if (password.length < 8) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Минимальная длина пароля - 8 символов" :
                    "The minimum password length is 8 characters"
                )
              );
            }
            if (password.length > 255) {
              return next(
                ApiError.badRequest(
                  lang === "ru" ?
                    "Максимальная длина пароля - 255 символов" :
                    "The maximum password length is 255 characters"
                )
              );
            }
            password = await bcrypt.hash(password, 10);
          }

          const foundUserForUpdating = await User.findOne({
            where: { id: id },
          });

          if (foundUserForUpdating) {
            if (
              !fs.existsSync(path.join(__dirname, "..", "static", `${id}`))) {
              fs.mkdirSync(path.join(__dirname, "..", "static", `${id}`,),
                { recursive: true }
              );
            }

            const avatar = files.avatar as FormidableFile;
            let avatarNewFullName = undefined;

            if (avatar) {
              avatarNewFullName = `${avatar.newFilename}.${avatar.mimetype?.split('/')[1]}`;
              if (avatar && avatar.newFilename) {
                if (fs.existsSync(path.join(__dirname, "..", "static", `${id}`, `avatar`))) {
                  fs.rmdirSync(path.join(__dirname, "..", "static", `${id}`, `avatar`),
                    { recursive: true }
                  );
                }
                fs.mkdirSync(path.join(__dirname, "..", "static", `${id}`, `avatar`),
                  { recursive: true }
                );
                fs.rename(path.join(tempFolderPath, avatar.newFilename), path.join(__dirname,
                  "..", "static", `${id}`, `avatar`, avatarNewFullName),
                  (error) => {
                    if (error) {
                      console.log(error);
                    }
                  })
              }
            }

            if (!password || !avatar || !role) {
              if (!password && !avatar && !role) {
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
              if (!password && !avatar && role) {
                await foundUserForUpdating.update({
                  age,
                  city,
                  country,
                  email,
                  nickname,
                  firstName,
                  lastName,
                  role,
                });
              }
              if (password && !avatar && !role) {
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
              }
              if (!password && avatar && !role) {
                await foundUserForUpdating.update({
                  age,
                  city,
                  country,
                  email,
                  nickname,
                  firstName,
                  lastName,
                  avatar: avatarNewFullName,
                });
              }
              if (password && avatar && !role) {
                await foundUserForUpdating.update({
                  age,
                  city,
                  country,
                  email,
                  nickname,
                  firstName,
                  lastName,
                  password,
                  avatar: avatarNewFullName,
                });
              }
            } else {
              await foundUserForUpdating.update({
                age,
                city,
                country,
                email,
                nickname,
                firstName,
                lastName,
                avatar: avatarNewFullName,
                password,
                role,
              });
            }

            return response.json({
              message: lang === "ru" ?
                "Данные обновлены" :
                "Data updated",
            });
          } else {
            return next(
              ApiError.badRequest(
                lang === "ru" ?
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
