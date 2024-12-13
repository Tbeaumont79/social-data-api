import { Router } from "express";
import { getpostbytagController } from "../controllers/getpostbytagController";

const router = Router();

router.get("/posts/:tag", getpostbytagController);

export default router;
