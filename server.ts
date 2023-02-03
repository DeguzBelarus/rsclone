import dotenv from 'dotenv';
import path from 'path';
import fileUpload from 'express-fileupload';
import express, { Express, Request, Response } from 'express';
import { IClientToServerEvents, IInterServerEvents, IServerToClientEvents, ISocketData } from './types/types'
import { createServer } from 'http';
import { Server } from 'socket.io';

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
app.use("/api", router);
app.use(fileUpload({ createParentPath: true }));
app.use(express.static("./client/build"));
app.use(express.static(path.resolve(__dirname, "static")));
app.use(errorHandlingMiddleware);

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "build")));
  app.get("*", (request: Request, response: Response) => {
    response.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

io.on("connection", (socket) => {
  console.log(`New websocket connection: socket ${socket.id}`);
  console.log(
    `All websocket connections: ${Array.from(io.sockets.sockets).map(
      (socket) => socket[0]
    )}`
  );

  socket.on("disconnect", (data) => {
    console.log("Websocket disconnection socket id: ", socket.id);
  });
});

(async function () {
  try {
    if (sequelizeConfig) {
      await sequelizeConfig.authenticate();
      await sequelizeConfig.sync();
    }

    server.listen(process.env.PORT || 5000, () => {
      console.log(
        "\x1b[40m\x1b[32m\x1b[4m\x1b[1m",
        `Server has been started on port ${process.env.PORT || 5000}...`
      );
    });
  } catch (exception: unknown) {
    if (exception instanceof Error) {
      console.error('\x1b[40m\x1b[31m\x1b[1m', exception.message);
    }
  }
})();