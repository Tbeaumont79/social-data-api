import { Router } from "express";
import {
  getBlueSkyPostsHandler,
  postBlueSkyPostsHandler,
} from "../controllers/blueskyController";

const router = Router();

router.get("/posts", getBlueSkyPostsHandler);
router.post("/posts/:tag", postBlueSkyPostsHandler);

export default router;
