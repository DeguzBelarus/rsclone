import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../db-models/db-models';
import { CurrentLanguageType, IUserModel, IRequestModified } from '../types/types';
import { ApiError } from '../error-handler/error-handler';

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
      if (nickname.length < 2) {
        return next(
          ApiError.badRequest(
            lang === "ru" ?
              "Минимальная длина никнейма - 2 символа" :
              "The minimum nickname length is 2 characters"
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
      } = request.body;

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
}

export const userController = new UserController();
