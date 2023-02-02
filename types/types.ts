import { NextFunction, Request, Response } from "express";

// types
export type CurrentLanguageType = 'en' | 'ru';
export type RoleType = 'USER' | 'ADMIN';

// methods types
export type ControllerMethod = (request: IRequestModified, response: Response, next: NextFunction) => void | Response; 

// interfaces
export interface IServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface IClientToServerEvents {
  hello: () => void;
}

export interface IInterServerEvents {
  ping: () => void;
}

export interface ISocketData {
  name: string;
  age: number;
}

export interface IApiError {
  status: number;
  message: string;
}

export interface IUserModel {
  id?: number;
  email: string;
  nickname: string;
  password: string;
  role: RoleType;
}

export interface IRequestModified extends Request {
  user?: IUserModel;
}
