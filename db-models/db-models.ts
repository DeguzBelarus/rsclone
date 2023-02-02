import { DataTypes, ModelDefined } from 'sequelize';
import { Nullable } from '../client/src/types/types';
import { sequelizeConfig } from '../sequelizeConfig';
import { IUserModel } from '../types/types';

export const User: Nullable<ModelDefined<IUserModel, IUserModel>> = sequelizeConfig
  ? sequelizeConfig.define("user", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    nickname: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "USER"
    },
  }) : null;
