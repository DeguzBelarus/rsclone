const {
  DataTypes
} = require("sequelize");
const sequelizeConfig = require("../sequelizeConfig");

const User = sequelizeConfig.define("user", {
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
});

module.exports = {
  User,
};