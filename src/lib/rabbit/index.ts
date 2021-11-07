import rascal = require("rascal");
import { rabbitConfig, subs, pubs } from "../../config/rabbitConfig";
import type { systemEventMessageContent } from '../../models/systemEventMessages/interface'

export const subscribers = subs;
export const publishers = pubs;

const definitions = JSON.parse(rabbitConfig);
const config = rascal.withDefaultConfig(definitions);
const Broker = rascal.BrokerAsPromised;
export let broker;

export const connetToRabbit = async () => {
  broker = await Broker.create(config);
  broker.on("error", console.error);
  broker.on("blocked", (reason, { vhost, connectionUrl }) => {
    console.log(
      `Vhost: ${vhost} was blocked using connection: ${connectionUrl}. Reason: ${reason}`
    );
  });
};

// Consume a message
export const defaultSubscribeCallback = (
  message: string,
  content: systemEventMessageContent<any>,
  ackOrNack: Function
): void => {
  console.log("defaultSubscribeCallback: ", message);
  ackOrNack();
};