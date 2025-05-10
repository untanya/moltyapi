import { Router, type Request, type Response } from "express";
import * as hello from "../controllers/helloController";

const router = Router();

router.get("/", hello.hello);

router.post("/", (_req: Request, res: Response) => {
  res.send("Donnée ajoutée");
});

export default router;
