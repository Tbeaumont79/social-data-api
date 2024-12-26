import { Router } from "express";
import { getAndStoreBlueSkyPostsController } from "../controllers/getandstoreblueskypostscontroller";

const router = Router();

router.get("/posts/:tag", getAndStoreBlueSkyPostsController);

export default router;
