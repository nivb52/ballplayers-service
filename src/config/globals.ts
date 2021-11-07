import fetch from "node-fetch";
import * as lodash from "lodash";
export const initGlobals = () => {
  // globals
  global._ = lodash;
  global.fetch = fetch;
  global.connections = new Map();
};
