import type { Request, Response } from "express";
import { Router } from "express";
import { ModelPlayer } from "../../models/player/player.interface";
const router: Router = Router();
import { findMany } from "../../player/player.repository";
import { defaultResponseError } from "../common";

router.get("/", async function (req: Request, res: Response) {
  try {
    const players = await findMany({});
    res.send(JSON.stringify(players));
  } catch (err) {
    defaultResponseError(res);
  }
});

export default router;
