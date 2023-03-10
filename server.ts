import dotenv from 'dotenv';
import path from 'path';
import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import {
  IClientToServerEvents,
  IInterServerEvents,
  IServerToClientEvents,
  ISocketData,
  UserOnlineData
} from './types/types'
import { sequelizeConfig } from './sequelizeConfig';
import { errorHandlingMiddleware } from './middleware/error-handling';
import { router } from './routes/index'

dotenv.config();
const app: Express = express();
const server = createServer(app);
const io = new Server<IClientToServerEvents, IServerToClientEvents, IInterServerEvents, ISocketData>(server, {
  maxHttpBufferSize: 1e8
});
app.use(express.json());
app.use('/api', router);
app.use(express.static('./client/build'));
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(errorHandlingMiddleware);

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));
  app.get('/*', (request: Request, response: Response) => {
    let url = path.join(__dirname, '../client/build', 'index.html');
    if (!url.startsWith('/app/')) {
      url = url.substring(1);
    }
    response.sendFile(url);
  });
}

let usersOnline: Array<UserOnlineData> = [];
// connection and disconnection socket events
io.on('connection', (socket) => {
  console.log(`New websocket connection: socket ${socket.id}`);
  console.log(`All websocket connections: ${Array.from(io.sockets.sockets).map((socket) => socket[0])}`);

  socket.on('disconnect', (data) => {
    const disconnectedUser = usersOnline.find((user: UserOnlineData) => user.socketId === socket.id);
    if (disconnectedUser) {
      usersOnline = usersOnline.filter((user: UserOnlineData) => user.socketId !== socket.id);
      console.log(`user ${disconnectedUser.nickname} is offline`);
      const userNicknamesOnline = Array.from(new Set(usersOnline.map((user: UserOnlineData) => user.nickname)));
      socket.broadcast.emit('onlineUsersUpdate', userNicknamesOnline);
      console.log(`users online: ${userNicknamesOnline}`);
    } else {
      console.log('Websocket disconnection socket id: ', socket.id);
    }
  });

  // login/logout/self-deletion user events
  socket.on('userOnline', (onlineUserNickname) => {
    usersOnline.push({ socketId: socket.id, nickname: onlineUserNickname })
    console.log(`user ${onlineUserNickname} is online`);
    const userNicknamesOnline = Array.from(new Set(usersOnline.map((user: UserOnlineData) => user.nickname)));
    io.emit('onlineUsersUpdate', userNicknamesOnline);
    console.log(`users online: ${userNicknamesOnline}`);
  })

  socket.on('userOffline', (onlineUserNickname) => {
    usersOnline = usersOnline.filter((user: UserOnlineData) => user.socketId !== socket.id);
    console.log(`user ${onlineUserNickname} is offline`);
    const userNicknamesOnline = Array.from(new Set(usersOnline.map((user: UserOnlineData) => user.nickname)));
    socket.broadcast.emit('onlineUsersUpdate', userNicknamesOnline);
    console.log(`users online: ${userNicknamesOnline}`);
  })

  // nickname change user event
  socket.on('nicknameUpdated', (userNickname) => {
    const updatingNicknameUser = usersOnline.find((user: UserOnlineData) => user.socketId === socket.id);
    if (updatingNicknameUser) {
      const userNicknamesOnline = usersOnline.map((user: UserOnlineData) => {
        if (user.socketId === socket.id) {
          return userNickname
        } else {
          return user.nickname;
        }
      })
      console.log(`user ${userNickname}: updating nickname...`);
      io.emit('onlineUsersUpdate', userNicknamesOnline);
      console.log(`users online: ${userNicknamesOnline}`);
    }
  })

  // posts socket events
  // creation post socket event
  socket.on('userAddPost', (userData) => {
    socket.broadcast.emit('userAddedPost', userData)
  })
  // deletion post socket event
  socket.on('userDeletePost', (userData) => {
    socket.broadcast.emit('userDeletedPost', userData)
  })

  // messages socket events
  // sending message socket event
  socket.on('userSendMessage', (messageData) => {
    const targetUsersOnline = usersOnline.filter((user) => user.nickname === messageData.recipientNickname);
    targetUsersOnline.forEach((targetUser) => {
      io.to(targetUser.socketId).emit('userSendMessage', messageData);
    });
  })
  // deletion message socket event
  socket.on('userDeleteMessage', (messageData) => {
    const targetUsersOnline = usersOnline.filter((user) => user.nickname === messageData.recipientNickname);
    targetUsersOnline.forEach((targetUser) => {
      io.to(targetUser.socketId).emit('userDeleteMessage', messageData);
    });
  })
});

(async function () {
  try {
    if (sequelizeConfig) {
      await sequelizeConfig.authenticate();
      await sequelizeConfig.sync();
    }
    server.listen(process.env.PORT || 5000, () => {
      console.log(
        '\x1b[40m\x1b[32m\x1b[4m\x1b[1m',
        `Server has been started on port ${process.env.PORT || 5000}...`
      );
    });
  } catch (exception: unknown) {
    if (exception instanceof Error) {
      console.error('\x1b[40m\x1b[31m\x1b[1m', exception.message);
    }
  }
})();