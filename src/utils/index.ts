import { Promise } from "bluebird";
import { isObject } from "lodash";

const _evaluateKey = (prev_property, prefix, property) =>
  prev_property ? prev_property + prefix + property : property;

export function objectflatten(inputObject: object, prefix = "_"): object {
  const prev_property = arguments[2];
  return Object.keys(inputObject).reduce(
    (sourceObj, property) =>
      Object.assign(
        sourceObj,
        isObject
          ? //@ts-ignore expected arguments
            objectflatten(inputObject[property], prefix, property)
          : {
              [_evaluateKey(prev_property, prefix, property)]:
                inputObject[property],
            }
      ),
    {}
  );
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
