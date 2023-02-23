import { NextFunction, Request, Response } from "express";
import { Nullable } from "../client/src/types/types";

// types
export type CurrentLanguageType = 'en' | 'ru';
export type RoleType = 'USER' | 'ADMIN';

// methods types
export type ControllerMethod = (request: IRequestModified, response: Response, next: NextFunction) => void | Response;

// interfaces

export interface IApiError {
  status: number;
  message: string;
}

export interface FormidableFile {
  size: number;
  filepath: string;
  originalFilename: Nullable<string>;
  newFilename: Nullable<string>;
  mimetype: Nullable<string>;
  mtime: Nullable<Date>;
  hashAlgorithm: false | 'sha1' | 'md5' | 'sha256'
  hash: Nullable<string | object>;
}

export interface ICommentModel {
  id?: number;
  date: string;
  editDate?: string;
  commentText: string;
  authorNickname: string;
  authorAvatar?: string | FormidableFile;
  authorRole: RoleType;
  ownerData?: IUserModel;
  postId: number;
  userId: number;
}

export interface IPostModel {
  id?: number;
  date: string;
  editDate?: string;
  postHeading: string;
  postText: string;
  media: string | FormidableFile;
  userId: number;
  ownerNickname: string;
  ownerAvatar?: string | FormidableFile;
  ownerData?: IUserModel;
  ownerRole: RoleType;
  comments?: Array<ICommentModel>;
}

export interface IMessageModel {
  id?: number;
  date: string;
  messageText: string;
  authorNickname: string;
  authorAvatarSrc?: string | FormidableFile;
  ownerData?: IUserModel;
  recipientId: number;
  recipientNickname: string;
  recipientAvatarSrc?: string | FormidableFile;
  isRead?: boolean;
  userId: number;
}

export interface IRequestModified extends Request {
  user?: IUserModel;
  role?: RoleType;
  requesterId?: number;
}

export type UserOnlineData = {
  socketId: string;
  nickname: string;
}

export interface IServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  onlineUsersUpdate: (onlineUsers: Array<string>) => void;
  userAddedPost: (userData: IUserDataPostEvent) => void;
  userDeletedPost: (userData: IUserDataPostEvent) => void;
  userSendMessage: (userData: IUserDataMessageEvent) => void;
  userDeleteMessage: (userData: IUserDataMessageEvent) => void;
}

export interface IUserDataPostEvent {
  userNickname: string;
  userId: number;
}

export interface IUserDataMessageEvent {
  authorId: number;
  recipientId: number;
  authorNickname: string;
  recipientNickname: string;
}

export interface IClientToServerEvents {
  userOnline: (onlineUserNickname: string) => void;
  userOffline: (onlineUserNickname: string) => void;
  nicknameUpdated: (userNickname: string) => void;
  userAddPost: (userData: IUserDataPostEvent) => void;
  userDeletePost: (userData: IUserDataPostEvent) => void;
  userSendMessage: (userData: IUserDataMessageEvent) => void;
  userDeleteMessage: (userData: IUserDataMessageEvent) => void;
}

export interface IInterServerEvents {
  ping: () => void;
}

export interface ISocketData {
  name: string;
  age: number;
}

export interface IFoundUserData {
  id?: number;
  nickname: string;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  city: Nullable<string>;
  country: Nullable<string>;
  avatarSrc?: string | FormidableFile;
  role: string;
}

export interface ISearchUsersResponse {
  count: number;
  searchResult: Array<IFoundUserData>;
  message: string;
}

export interface IUserDialog {
  lastMessageId: number;
  lastMessageDate: string;
  lastMessageText: string;
  lastMessageAuthorNickname: string;
  authorId: number;
  authorNickname: string;
  recipientId: number;
  recipientNickname: string;
  unreadMessages: number;
}

export interface IUserModel {
  id?: number;
  email: string;
  nickname: string;
  password: string;
  role: RoleType;
  age: Nullable<number>;
  country: Nullable<string>;
  city: Nullable<string>;
  avatar?: string | FormidableFile;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  posts?: Array<IPostModel>;
  dialogs?: Array<IUserDialog>;
  modifiedDialogs?: Array<IUserDialog>;
}