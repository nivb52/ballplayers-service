import db from "@lib/postgres";
import * as Player from "@models/player/player.model";

// @throws Error
export const create = async function (data: {}): Promise<{}> {
  const validPlayerData = await Player.prepareCreateWithId(data);
  return await db.player.create({ data: validPlayerData });
};

// @throws Error
export const update = async function (where: {}, data: {}): Promise<{}> {
  const validPlayerData = await Player.prepareUpdate(data);
  return await db.player.update({
    where: {
      ...where,
    },
    data: validPlayerData,
  });
};

// @throws Error
export const updateById = async function (
  id: string | number,
  newData: {},
  oldData?: {}
): Promise<{}> {
  const validPlayerData = await Player.prepareUpdate(newData);
  const validId = Player.validId(id);
  return await db.player.update({
    where: {
      id: validId,
    },
    data: {
      ...validPlayerData,
    },
  });
};

// @throws Error
export const remove = async function (id: number | string): Promise<{}> {
  const data = await Player.prepareRemove(id);
  const validId = Player.validId(id);
  if (data && validId)
    return await db.player.update({
      where: {
        id: validId,
      },
      data,
    });
  throw new Error("not valid id");
};

// @throws Error
export const hardRemove = async function (id: number | string): Promise<{}> {
  const validId = await Player.prepareHardRemove(id);
  return await db.player.delete({
    where: {
      id: validId,
    },
  });
};

// @throws Error
export const findById = async function (id: number | string): Promise<{}> {
  const validId = Player.validId(id);
  if (validId)
    return await db.player.findUnique({
      where: {
        id: validId,
      },
    });
  throw new Error("not valid id");
};

export const findOne = async function (
  { where, orderBy = {} },
  isUnique = true
) {
  const searchData = { where: { where }, orderBy: { ...orderBy, id: "asc" } };
  if (isUnique) {
    return await db.player.findUnique({
      searchData,
    });
  } else {
    return await db.player.findFirst({
      searchData,
    });
  }
};

// @throws Error
export const upsert = async function (where: {}, data) {
  const validPlayerData = await Player.prepareUpdate(data);
  return await db.player.upsert({
    where,
    update: {
      id: validPlayerData.id,
      nickname: validPlayerData.nickname,
      first_name: validPlayerData.first_name,
      last_name: validPlayerData.last_name,
      position: validPlayerData.position,
      height_feet: validPlayerData.height_feet,
      height_inches: validPlayerData.height_inches,
      weight_pounds: validPlayerData.weight_pounds,
      team_id: validPlayerData.team_id,
    },
    create: {
      id: validPlayerData.id,
      nickname: validPlayerData.nickname,
      first_name: validPlayerData.first_name,
      last_name: validPlayerData.last_name,
      position: validPlayerData.position,
      height_feet: validPlayerData.height_feet,
      height_inches: validPlayerData.height_inches,
      weight_pounds: validPlayerData.weight_pounds,
      team_id: validPlayerData.team_id,
    },
  });
};

export const findMany = async function (
  { where = { is_active: true }, orderBy = { id: "asc" }, take = 25 },
  select?: {} | null
) {
  const searchData: {
    where: object;
    orderBy: object;
    take: number;
    select?: object;
  } = {
    where,
    orderBy,
    take, 
  };
  if (select) {
    searchData.select = select;
  }
  return await db.player.findMany(searchData);
};
