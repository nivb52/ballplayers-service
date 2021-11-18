import { RABBIT } from "./index";
// export const exchanges = { TASK_QUEUE: "task_queue" };
export const queues = {
  PLAYER_TO_INSERT_TO_DB: "player_to_db",
  PLAYER_UPDATE_TO_PUBLISH: "player_to_publish",
};
export const subs = {
  player_socket_publish: "player_new_data",
  player_presist: "player_db",
  // task_consumer: "task_consumer",
};
export const pubs = {
  player_presist: "player_presist",
  player_socket_publish: "player_socket_publish",
  // task_publisher: "task_publisher",
};

export const rabbitConfig = JSON.stringify({
  vhosts: {
    "/": {
      connection: {
        url: RABBIT(),
      },
      exchanges: [],
      queues: {
        [queues.PLAYER_TO_INSERT_TO_DB]: {
          assert: true,
          check: true,
        },
        [queues.PLAYER_UPDATE_TO_PUBLISH]: {
          assert: true,
          check: true,
          options: {
            durable: false,
            arguments: {
              "x-message-ttl": 65000, // ms
            },
          },
        },
        
      },
      subscriptions: {
        [subs.player_presist]: {
          queue: queues.PLAYER_TO_INSERT_TO_DB,
          prefetch: 3,
        },
        [subs.player_socket_publish]: {
          queue: queues.PLAYER_UPDATE_TO_PUBLISH,
          prefetch: 1,
        },
        
      },
      publications: {
        [pubs.player_presist]: {
          queue: queues.PLAYER_TO_INSERT_TO_DB,
        },
        [pubs.player_socket_publish]: {
          queue: queues.PLAYER_UPDATE_TO_PUBLISH,
        },
        
      },
    },
  },
});
