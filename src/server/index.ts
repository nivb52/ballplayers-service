import { initConfig } from "../config/";
initConfig();
import { initJobs } from "../jobs/repetitiveTasks";
initJobs();

import * as process from "process";
import { connetToRabbit, broker } from "../lib/rabbit";
import { AppError } from "../models/error/error.interface";
import { startHttpServer } from "./app";
import { startSocket } from "./socket";

main()
  .then(() => console.info("online"))
  .catch((err: Error) => {
    console.error("failed to start server");
    console.error((err && err.stack) || err);
  });

//
// Application entry point.
//
function main() {
  const PORT: number = +process.env.PORT || 4000;
  return connetToRabbit()
    .then(() => startHttpServer(PORT))
    .then((app) => startSocket(app))
    .then(() => setErrorListeners())
    .catch((err: Error) => {
      console.error(err);
      const stopHttpServer: AppError = new Error("rabbitmq failed to start");
      stopHttpServer.critical = true;
      throw stopHttpServer;
    });
}

function setErrorListeners() {
  broker.on("blocked", (reason, { vhost, connectionUrl }) => {
    console.error(
      `Rabbitmq Vhost: ${vhost} was blocked using connection: ${connectionUrl}. Reason: ${reason}`
    );
  });

  process
    .on("beforeExit", () => {
      for (const value of global.connections.values()) {
        value.$disconnect();
      }
    })
    .on("exit", (code) => {
      console.info("Process exit event with code: ", code);
    })
    .on("unhandledRejection", (reason, p) => {
      console.error(reason, "Unhandled Rejection at Promise", p);
    })
    .on("uncaughtException", (err: AppError) => {
      console.error(`${new Date().toUTCString()} UNHANDLED ERROR:`);
      console.error(err.stack);
      if (err.critical) process.exit(1);
    });
}
