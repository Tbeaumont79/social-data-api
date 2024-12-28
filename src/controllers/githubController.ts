import { Request, Response } from "express";
import { fetchVueJsChangelogs } from "../services/githubService";

export const getChangelogHandler = async (req: Request, res: Response) => {
  try {
    const changelogs = await fetchVueJsChangelogs();
    console.log(changelogs);
    res.status(200).json({ success: true, data: changelogs });
  } catch (error) {
    console.error("Error fetching releases:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching releases" });
  }
};
