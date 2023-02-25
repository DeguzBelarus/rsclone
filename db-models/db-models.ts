import { DataTypes, ModelDefined } from 'sequelize';
import { Nullable } from '../client/src/types/types';
import { sequelizeConfig } from '../sequelizeConfig';
import { ICommentModel, ILikeModel, IMessageModel, IPostModel, IUserModel } from '../types/types';

export const User: Nullable<ModelDefined<IUserModel, IUserModel>> = sequelizeConfig
  ? sequelizeConfig.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    nickname: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'USER',
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }) : null;

export const Post: Nullable<ModelDefined<IPostModel, IPostModel>> = sequelizeConfig
  ? sequelizeConfig.define('posts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.STRING,
    },
    editDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postHeading: {
      type: DataTypes.STRING,
    },
    postText: {
      type: DataTypes.STRING(1000),
    },
    media: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerNickname: {
      type: DataTypes.STRING,
    },
    ownerAvatar: {
      type: DataTypes.STRING,
    },
    ownerRole: {
      type: DataTypes.STRING,
    },
  }) : null;

export const Comment: Nullable<ModelDefined<ICommentModel, ICommentModel>> = sequelizeConfig
  ? sequelizeConfig.define('comments', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.STRING,
    },
    editDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    commentText: {
      type: DataTypes.STRING,
    },
    authorNickname: {
      type: DataTypes.STRING,
    },
    authorAvatar: {
      type: DataTypes.STRING,
    },
    authorRole: {
      type: DataTypes.STRING,
    },
  }) : null;

export const Like: Nullable<ModelDefined<ILikeModel, ILikeModel>> = sequelizeConfig
  ? sequelizeConfig.define('likes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ownerNickname: {
      type: DataTypes.STRING,
    },
  }) : null;

export const Message: Nullable<ModelDefined<IMessageModel, IMessageModel>> = sequelizeConfig
  ? sequelizeConfig.define('messages', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.STRING,
    },
    messageText: {
      type: DataTypes.STRING,
    },
    authorNickname: {
      type: DataTypes.STRING,
    },
    recipientId: {
      type: DataTypes.INTEGER,
    },
    recipientNickname: {
      type: DataTypes.STRING,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    authorAvatarSrc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recipientAvatarSrc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }) : null;

if (User && Post && Comment && Message && Like) {
  User.hasMany(Post, {
    as: 'posts',
    foreignKey: 'userId',
  });
  Post.belongsTo(User);

  User.hasMany(Message, {
    as: 'dialogs',
    foreignKey: 'userId',
  });
  Message.belongsTo(User);

  User.hasMany(Comment, {
    as: 'comments',
    foreignKey: 'userId',
  });
  Comment.belongsTo(User);

  User.hasMany(Like, {
    as: 'likes',
    foreignKey: 'userId',
  });
  Like.belongsTo(User);

  Post.hasMany(Comment, {
    as: 'comments',
    foreignKey: 'postId',
  });
  Comment.belongsTo(Post);

  Post.hasMany(Like, {
    as: 'likes',
    foreignKey: 'postId',
  });
  Like.belongsTo(Post);
}
