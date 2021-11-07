import * as playerRepo from "../player/player.repository";
import * as P from "bluebird";
import {
  playerUpdatedPublish,
  subscribeToPresistPlayer,
} from "../player/player.emitter";
import {
  createBlobMessage,
  createTextMessage,
} from "../models/systemEventMessages/messageFactory";
import type { systemEventMessageContent } from "../models/systemEventMessages/interface";
import type { Blob } from "buffer";
import type {
  PlayerOnlineDataFlattened,
  PlayerOnlineDataFromBallOnTile,
} from "../models/player/player.interface";
import { objectflatten, sleep } from "../utils";
import { type } from "os";

export const init = () => {
  const subscribeCallback = (
    message: string,
    content: PlayerOnlineDataFlattened[],
    ackOrNack: Function
  ): void => {
    if (!Array.isArray(content))
      throw new Error("invalid data type, expectong array");
    content.map(async (playerData) => {
      try {
        playerRepo.upsert({ id: playerData.id }, playerData);
      } catch (err) {
        handleError(err);
      }
    });
    ackOrNack();
  };
  subscribeToPresistPlayer(subscribeCallback);
};

export const get = async (id: string | number) => {
  try {
    const playerModel = await playerRepo.findById(id);
    return { data: playerModel, err: null };
  } catch (err) {
    return { data: null, err: err };
  }
};

export const post = async (data: {}) => {
  try {
    const newPlayer = await playerRepo.create(data);
    const msg: string = createTextMessage("create", newPlayer, {});
    playerUpdatedPublish(msg, null);
    return { data: newPlayer, err: null };
  } catch (err) {
    return { data: null, err: err };
  }
};

export const put = async (id: string | number, data: {}) => {
  try {
    const updatedPlayer = await playerRepo.updateById(id, data);
    const msg: string = createTextMessage("update", updatedPlayer, {});
    playerUpdatedPublish(msg, null);
    return { data: updatedPlayer, err: null };
  } catch (err) {
    return { data: null, err: err };
  }
};

export const upsert = async (id: string | number, data: {}) => {
  try {
    const upsertedPlayer = await playerRepo.upsert({ id }, data);
    const msg: Blob = createBlobMessage("update", upsertedPlayer, {});
    playerUpdatedPublish(await msg.text(), null);
    return { data: upsertedPlayer, err: null };
  } catch (err) {
    return { data: null, err };
  }
};

export const upsertCallbak = async (
  id: string | number,
  data: {},
  cb: Function
) => {
  try {
    const upsertedPlayer = await playerRepo.upsert({ id }, data);
    const msg: Blob = createBlobMessage("update", upsertedPlayer, {});
    playerUpdatedPublish(await msg.text(), null);
    return cb({ data: upsertedPlayer, err: null });
  } catch (err) {
    return cb({ data: null, err });
  }
};

export const remove = async (id: string | number) => {
  try {
    const deletedPlayer = await playerRepo.remove(id);
    const msg: Blob = createBlobMessage("delete", {}, { id: deletedPlayer });
    playerUpdatedPublish(await msg.text(), null);
    return { id: deletedPlayer, err: null };
  } catch (err) {
    return { data: null, err: err };
  }
};

export const getPlayersDataFromOnlineSource = async (
  ids: number[]
): Promise<PlayerOnlineDataFromBallOnTile[]> => {
  const outsourceDataUrl = `https://www.balldontlie.io/api/v1/players/`;
  return await P.map(
    ids,
    (id) =>
      fetch(outsourceDataUrl + id)
        .then((jsonPromise) => jsonPromise.json())
        .then((res) => res),
    {
      concurrency: 60,
    }
  );
};

export const findByIdFromExternalSource = async (
  id: number,
  cb: Function
): Promise<void> => {
  const outsourceDataUrl = `https://www.balldontlie.io/api/v1/players/`;
  try {
    const jsonPromise = await fetch(outsourceDataUrl + id);
    const res = await jsonPromise.json();
    return cb({ err: null, data: res });
  } catch (err) {
    return cb({ err, data: null });
  }
};

export const updatePlayersInDataBaseFromExternalSource = async () => {
  console.info(":: rutine job started ::");
  const players = await playerRepo.findMany({ take: 1000 }, { id: true });
  const playerIds: number[] = players.map(
    (player: { id: number }) => player.id
  );
  // @ts-ignore
  const playerIdsChunks = _.chunk(playerIds, 60);
  playerIdsChunks.forEach(async (chunkOfIds) => {
    const newPlayersData = await getPlayersDataFromOnlineSource(chunkOfIds);
    newPlayersData.forEach(async (player: PlayerOnlineDataFromBallOnTile) => {
      // @ts-ignore
      const flattenPlayer: PlayerOnlineDataFlattened = objectflatten(player);
      await put(flattenPlayer.id, flattenPlayer);
    });
    await sleep(6010);
  });
};

function handleError(err: Error) {
  console.error("error: " + err.message);
}
