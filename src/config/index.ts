require("dotenv").config();
import { initGlobals } from "../config/globals";

export const initConfig = () => {
  if (!process.env.AMQP) {
    throw new Error(
      "Please specify the name of the RabbitMQ host using environment variable AMQP"
    );
  }

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "Please specify the name of the POSTGRESS host using environment variable DATABASE_URL"
    );
  }

  initGlobals();
};
export const RABBIT = () => process.env.AMQP;
export const corsOrigin = () => '*';