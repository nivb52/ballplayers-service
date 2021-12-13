//@ts-nocheck
import stream = require("stream");
import fs = require("fs");
import * as csv from "fast-csv";
import type { ModelPlayer } from "@models/player/player.model";
import * as PlayerService from "./playerService";

// https://c2fo.github.io/fast-csv/docs/introduction/example
// https://stackoverflow.com/questions/49374569/export-csv-file-and-downloaded-by-the-browser-using-express-js

interface PlayerCsvRow {
  id: string;
  nickname: string;
}

export const openCsvInputStream = (inputFilePath: fs.PathLike) => {
  fs.createReadStream(inputFilePath)
    .pipe(csv.parse({ headers: true }))
    // pipe the parsed input into a csv formatter
    .pipe(csv.format<PlayerCsvRow, ModelPlayer>({ headers: true }))
    // Using the transform function from the formatting stream
    .transform(getExternalData)
    .pipe(process.stdout)
    .pipe(insertToDB)
    .on("end", () => console.log('imported'));
};

function getExternalData(row, next): void {
  PlayerService.findByIdFromExternalSource(+row.id, ({ err, data: player }) => {
    if (err) {
      return next(err);
    }
    if (!player) {
      return next(new Error(`Unable to find player for ${row.id}`));
    }
    return next(null, {
      id: player.id,
      nickname: row.nickname,
      // properties from online
      first_name: player.first_name,
      last_name: player.last_name,
      position: player.position,
      height_feet: player.height_feet,
      height_inches: player.height_inches,
      weight_pounds: player.weight_pounds,
    });
  });
}

function insertToDB(row, next): void {
 PlayerService.upsertCallbak(
    row.id,
    row,
    ({ err, data: player }) => {
      if (err) {
        return next(err);
      }
      if (!player) {
        return next(new Error(`Unable to create or update player with id ${row.id}`));
      }
      return next(null, player);
    }
  );
}
