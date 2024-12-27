import { Request, Response } from "express";
import {
  fetchBlueSkyPostsFromDB,
  fetchAndStoreBlueSkyPosts,
} from "../services/blueskyService";

export const getBlueSkyPostsHandler = async (req: Request, res: Response) => {
  try {
    const posts = await fetchBlueSkyPostsFromDB();
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ success: false, message: "Error fetching posts" });
  }
};

export const postBlueSkyPostsHandler = async (req: Request, res: Response) => {
  try {
    const { tag } = req.params;
    const posts = await fetchAndStoreBlueSkyPosts(tag);
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ success: false, message: "Error fetching posts" });
  }
};
