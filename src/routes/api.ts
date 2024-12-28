import { Router } from "express";
import {
  getBlueSkyPostsHandler,
  postBlueSkyPostsHandler,
} from "../controllers/blueskyController";
import { getChangelogHandler } from "../controllers/githubController";
const router = Router();

router.get("/posts", getBlueSkyPostsHandler);
router.post("/posts/:tag", postBlueSkyPostsHandler);
router.get("/changelogs", getChangelogHandler);

export default router;
