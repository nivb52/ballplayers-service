import * as fs from "fs";
import { main as playersETL } from "@player/player.ETL";
import * as PlayerService from "@services/playerService";

import type { Request, Response } from "express";
import { Router } from "express";
import { defaultResponseError } from "@server_common/index";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { err, file } = await playersETL();
  if (err) {
    return defaultResponseError(res);
  }
  res.writeHead(200, {
    "Content-Type": "text/csv",
    "Content-Disposition": "attachment; filename=" + file.name,
  });
  fs.createReadStream(file.path).pipe(res);
});

router.get("/:id", async (req: Request, res: Response) => {
  const { data: player, err } = await PlayerService.get(
    <string | number>req.params.id
  );
  if (err) {
    return defaultResponseError(res);
  }
  return res.send(player);
});

router.post("", async (req: Request, res: Response) => {
  const { data: new_player, err } = await PlayerService.post(req.body);
  if (err) {
    return defaultResponseError(res);
  }
  return res.send(JSON.stringify(new_player));
});

router.put("/:id", async (req: Request, res: Response) => {
  console.log(req.body);
  const { data: updated_player, err } = await PlayerService.put(
    <string | number>req.params.id,
    req.body
  );
  if (err) {
    return defaultResponseError(res);
  }
  return res.send(JSON.stringify(updated_player));
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { data: deleted_player, err } = await PlayerService.remove(
    <string | number>req.params.id
  );
  if (err) {
    return defaultResponseError(res);
  }
  return res.send(deleted_player);
});

export default router;
