export interface createMessageOptions {
  buffer?: boolean;
  text?: boolean;
}

export interface systemEventMessageContent<DATATYPE> {
  event: "update" | "create" | "remove";
  payload: DATATYPE;
  metadata: {};
}
