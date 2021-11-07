import type { Request, Response } from "express";

export const defaultResponseError = (res: Response): Response =>
  res.status(500).send("something went wrong");
