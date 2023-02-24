import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();
export const sequelizeConfig = process.env.NODE_ENV !== 'production'
  && process.env.DB_NAME
  && process.env.DB_USER
  ? new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
  })
  : process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
    : null;

