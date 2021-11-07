import { corsOrigin } from "../config/";
import { ModelPlayer } from "../models/player/player.interface";
import { playerUpdatedSubscribe } from "../player/player.emitter";
import type { systemEventMessageContent } from '../models/systemEventMessages/interface'
export function startSocket(app) {
  const server = require("http").createServer(app);
  const io = require("socket.io")(server, {
    cors: {
      origin: corsOrigin(),
    },
  });
  socketController(io);
}

function socketController(io) {
    const emitPlayerChange = (
      message,
      content: systemEventMessageContent<ModelPlayer>,
      ackOrNack: Function
    ) => {
      console.log("SOCKET :: emitting player change", content);
      io.sockets.emit("store:player:" + content.event, content.payload);
      ackOrNack();
    };
  
  playerUpdatedSubscribe(emitPlayerChange);
  io.on("connection", (socket) => {
    socket.on("disconnect", () => console.info(`disconnected Client`));
  });
}
