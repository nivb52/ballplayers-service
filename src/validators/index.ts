import { isEmpty } from "lodash";
import * as yup from "yup";
export const validator = yup;
export const isEmptyObject = isEmpty;

export const isValidateNumericId = (val: unknown): boolean =>
  (typeof val === "number" && val === Math.floor(val)) ||
  (typeof val === "string" &&
    parseInt(val) &&
    parseInt(val) === Math.floor(parseInt(val)));

export const parseNumericId = (val: number | string): number | null =>
  isValidateNumericId(+val) ? +val : null;

export const isValidateNumeric = (val: unknown): boolean =>
  typeof val === "number" ||
  (typeof val === "string" && typeof parseInt(val) === "number");

export const parseNumeric = (val: number | string): number | null  =>
  validator.number().cast(val);

export const isValidString = (val: unknown, minLength = 0) =>
  typeof val === "string" && val.trim().length >= minLength;

export const parseString = (val: string, minLength = 0): string | null =>
  isValidString(val, minLength) ? val.trim() : null;

export const validateByColumns = (data: {}, columns: {}) => {
  if (!data) return null;
  const valideData = {};
  for (let key in columns) {
    if (data[key] && columns[key].validateFunction(data[key]))
      valideData[key] = columns[key].parseFunction(data[key]);
    else if (!data[key] && !columns[key].isRequired && columns[key].default)
      valideData[key] = columns[key].default;
    else throw new Error(key + " field is required");
  }
  return valideData;
};
