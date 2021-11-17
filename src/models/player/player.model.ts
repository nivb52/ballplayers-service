import {
  isValidateNumericId,
  parseNumericId,
  isEmptyObject,
  validator,
} from "../../validators";
import type { TypeOf } from "yup";

const PlayerSchema = makePlayerSchema();
export interface PlayerInput extends TypeOf<typeof PlayerSchema> {}
import type { ModelPlayer } from "./player.interface";

export const validId = (id: number | string): number | null => {
  return parseNumericId(id);
};

// @throws Error
export const prepareCreate = function (data: object): Promise<ModelPlayer> {
  return validateDataForNewPlayer(data);
};

// @throws Error
export const prepareUpdate = function (newData: object): Promise<ModelPlayer> {
  return validateDataForExistingPlayer(newData);
};

// @throws Error
export const prepareCreateWithId = prepareUpdate;

// @throws Error
export const prepareRemove = function (data): Promise<number> {
  return new Promise((resolve, reject) => {
    const parsedId = isValidateNumericId(data.id);
    if (!parsedId) {
      return reject("not valid id");
    }
    return resolve({ ...data, id: parseNumericId(data.id), is_active: false });
  });
};

// @throws Error
export const prepareHardRemove = function (
  id: number | string
): Promise<number> {
  return new Promise((resolve, reject) => {
    const parsedId = isValidateNumericId(id);
    if (!parsedId) {
      return reject("not valid id");
    }
    return resolve(parseNumericId(id));
  });
};

function validateDataForNewPlayer(data: object): Promise<ModelPlayer> {
  if (data.hasOwnProperty("id")) {
    //@ts-ignore
    delete data.id;
  }
  const result = preparePlayer(data);
  return PlayerSchema.validate(result);
}

function validateDataForExistingPlayer(data: object): Promise<ModelPlayer> {
  if (isEmptyObject(data)) throw new Error("invalid data");
  //@ts-ignore
  if (!validId(data.id)) throw new Error("invalid id");

  const result = preparePlayer(data);
  return PlayerSchema.validate(result);
}

function preparePlayer(data: unknown): ModelPlayer | unknown {
  return PlayerSchema.cast(data, { stripUnknown: true });
}

export function preparePlayerWithoutError(
  data: unknown,
  cb = (err: Error) => {}
) {
  return PlayerSchema.isValid(data)
    .then((res) => res)
    .catch((err: Error) => cb(err));
}

function makePlayerSchema() {
  return validator.object().shape({
    id: validator.number().integer().positive().required(),
    nickname: validator.string().optional(),
    first_name: validator.string().required(),
    last_name: validator.string().optional().nullable(true),
    position: validator.string().optional().nullable(true),
    height_feet: validator.number().optional().nullable(true),
    height_inches: validator.number().optional().nullable(true),
    weight_pounds: validator.number().optional().nullable(true),
    team_id: validator.number().integer().optional().nullable(true),
    create_date: validator.date().default(() => new Date()),
    update_date: validator.date(),
    is_active: validator.boolean(),
  });
}
