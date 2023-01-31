require("dotenv").config();
const express = require("express");
const {
  createServer
} = require("http");
const {
  Server
} = require("socket.io");
const path = require("path");
const sequelizeConfig = require("./sequelizeConfig");
const dbModels = require("./db-models/db-models");
const errorHandlingMiddleware = require("./middleware/error-handling");
const router = require("./routes/index");

const PORT = process.env.PORT || 5000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 1e8
});
app.use(express.json());
app.use("/api", router);
app.use(express.static("./client/build"));
app.use(express.static(path.resolve(__dirname, "static")));
app.use(errorHandlingMiddleware);

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "build")));
  app.get("*", (request, response) => {
    response.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
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
    await sequelizeConfig.authenticate();
    await sequelizeConfig.sync();

    server.listen(PORT, () => {
      console.log(
        "\x1b[40m\x1b[32m\x1b[4m\x1b[1m",
        `Server has been started on port ${PORT}...`
      );
    });
  } catch (exception) {
    console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
  }
})();