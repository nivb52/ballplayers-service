import * as dataForge from "data-forge";
import "data-forge-fs";
import type { PathLike } from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import { objectflatten } from "../utils";
import { getPlayersDataFromOnlineSource } from "../services/playerService";
import { publishPlayerToPresist } from "./player.emitter";
import type {
  PlayerCsvRow,
  PlayerOnlineDataFlattened,
} from "../models/player/player.interface";

const inputFilePath: PathLike = process.env.player_full_file_path
  ? path.join(process.env.player_full_file_path)
  : path.join("data", "backend_task_players.csv");

export const main = async () => {
  try {
    const stringDataFrame = await dataForge.readFile(inputFilePath).parseCSV({
      columnNames: ["id", "nickname"],
    });
    const parsedDataFrame = stringDataFrame.skip(1).parseInts("id");
    const sourcePlayers: PlayerCsvRow[] = parsedDataFrame.toArray();

    const ids = sourcePlayers.map((player) => +player.id);
    const resultsPlayers = await getPlayersDataFromOnlineSource(ids);

    const playersMap = new Map();
    sourcePlayers.forEach((player, index) => playersMap.set(player.id, index));
    resultsPlayers.forEach(
      (player) =>
        //@ts-ignore
        (player.nickname = sourcePlayers[playersMap.get(player.id)]?.nickname)
    );

    //@ts-ignore
    const combinedResultsPlayers: PlayerOnlineDataFlattened[] =
      resultsPlayers.map((player) => objectflatten(player));
    const generateName = randomUUID();
    const outputPath = path.join(
      __dirname,
      "..",
      "..",
      "data",
      `${generateName}.csv`
    );

    const df = new dataForge.DataFrame({
      values: combinedResultsPlayers,
    });
    publishPlayerToPresist(combinedResultsPlayers);
    await df.asCSV().writeFile(outputPath);
    return {
      err: null,
      file: { name: `${generateName}.csv`, path: outputPath },
    };
  } catch (err) {
    console.error("An error occured while transforming (player) CSV file");
    console.error(err);
    return { data: null, err };
  }
};
