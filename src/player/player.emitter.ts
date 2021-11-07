import {
  broker,
  subscribers,
  publishers,
  defaultSubscribeCallback,
} from "../lib/rabbit";
// import type * as amqp from "amqplib";
import {
  ModelPlayer,
  PlayerOnlineDataFlattened,
} from "../models/player/player.interface";
import type { systemEventMessageContent } from "../models/systemEventMessages/interface";

// ***************************
// PUBLISHERS
// ***************************

export const publishPlayerToPresist = async (
  data,
  cb?: Function | null | undefined
): Promise<void> => {
  let publication;

  try {
    publication = await broker.publish(publishers.player_presist, data);
    publication
      .on("success", (messageId) => {
        console.log("Message id was: ", messageId);
      })
      .on("error", (err, messageId) => {
        console.error("Publisher error", err, messageId);
      });
    if (cb && typeof cb === "function") cb(null, publication);
  } catch (err) {
    if (cb && typeof cb === "function") cb(err, publication);
    throw new Error(`Rascal config error: ${err.message}`);
  }
};

export const playerUpdatedPublish = async (
  data,
  cb?: Function | null | undefined
): Promise<void> => {
  let publication;
  try {
    publication = await broker.publish(publishers.player_socket_publish, data);
    publication
      .on("success", (messageId) => {
        console.log("Message id was: ", messageId);
      })
      .on("error", (err, messageId) => {
        console.error("Publisher error", err, messageId);
      });
    if (cb && typeof cb === "function") cb(null, publication);
  } catch (err) {
    if (cb && typeof cb === "function") cb(err, publication);
    throw new Error(`Rascal config error: ${err.message}`);
  }
};

// ***************************
// SUBSCRIBERS
// ***************************

export const subscribeToPresistPlayer = async (
  cb = (
    message: string,
    content: PlayerOnlineDataFlattened []| ModelPlayer[],
    ackOrNack: Function
  ) => {}
): Promise<void> => {
  try {
    const subscription = await broker.subscribe(subscribers.player_presist);
    subscription
      .on("message", (message, content: ModelPlayer[], ackOrNack: Function) => {
        cb(message, content, ackOrNack);
      })
      .on("error", console.error);
  } catch (err) {
    throw new Error(`Rascal config error: ${err.message}`);
  }
};

export const playerUpdatedSubscribe = async (
  cb = defaultSubscribeCallback
): Promise<void> => {
  try {
    const subscription = await broker.subscribe(
      subscribers.player_socket_publish
    );

    subscription
      .on(
        "message",
        (
          message: string,
          content: systemEventMessageContent<ModelPlayer>,
          ackOrNack: Function
        ) => {
          console.log("table players updated");
          cb(message, content, ackOrNack);
        }
      )
      .on("error", console.error);
  } catch (err) {
    throw new Error(`Rascal config error: ${err.message}`);
  }
};
