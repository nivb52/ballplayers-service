import { Promise } from "bluebird";

export function objectflatten(inputObject: object, prefix = "_"): object {
  const parent = arguments[2];
  return Object.keys(inputObject).reduce(
    (sourceObj, k) =>
      Object.assign(
        sourceObj,
        inputObject[k] && typeof inputObject[k] === "object"
          ? //@ts-ignore expected arguments
            objectflatten(inputObject[k], prefix, k)
          : { [parent ? parent + prefix + k : k]: inputObject[k] }
      ),
    {}
  );
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}