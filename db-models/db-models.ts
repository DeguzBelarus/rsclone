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
    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }) : null;
