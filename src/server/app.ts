import * as express from "express";
import player from "./routes/playerRouter";
import players from "./routes/playersRouter";
import {init as playerServiceInit} from "../services/playerService";

export function startHttpServer(port: number) {
  return new Promise((resolve) => {
    const app = express();

    app.use(express.json());
    setupHandlers(app);

    app.listen(port, () => {
      console.info(`listening at port ${port}`);
      resolve(app);
    });
  });
}

function setupHandlers(app: express.Application) {
  playerServiceInit();
  app.use("/player", player);
  app.use("/players", players);

}
