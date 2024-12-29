import AtpAgent from "@atproto/api";
import {
  BlueSkyPost,
  BlueSkySearchResult,
  BlueSkyFilteredPost,
} from "../types/blueskypostType";
import {
  insertBlueSkyPost,
  getAllBlueSkyPosts,
} from "../repositories/bluesky.repository";

import { filterNewPosts, transformPost } from "../utils/blueskyUtils";

const agent = new AtpAgent({
  service: "https://bsky.social",
});

const authenticateAgent = async () => {
  if (!agent.session) {
    try {
      await agent.login({
        identifier: process.env.BSKY_USERNAME,
        password: process.env.BSKY_PASSWORD,
      });
    } catch (error) {
      console.error("Error authenticating agent:", error);
      throw new Error(
        "Error cannot sign in to bluesky, have you provided the correct username and password in the .env file ?"
      );
    }
  }
};

export const fetchAndStoreBlueSkyPosts = async (
  tag: string
): Promise<BlueSkyFilteredPost[]> => {
  try {
    await authenticateAgent();
    const searchResults = (await agent.app.bsky.feed.searchPosts({
      tag: [`${tag}`],
      limit: 50,
      q: tag,
    })) as unknown as BlueSkySearchResult;
    let posts = searchResults.data.posts as BlueSkyPost[];
    posts = await filterNewPosts(posts);
    if (posts.length === 0) {
      // if no new posts found return empty array
      console.log("No new posts found");
      return [];
    }
    const filteredPost = posts.map((post) => transformPost(post));
    await Promise.all(
      filteredPost.map(async (post) => {
        insertBlueSkyPost(post).catch((error) => {
          console.error("Error inserting post:", post.url, error);
        });
      })
    );
    return filteredPost;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Error fetching posts");
  }
};

export const fetchBlueSkyPostsFromDB = async (): Promise<
  BlueSkyFilteredPost[]
> => {
  try {
    return getAllBlueSkyPosts();
  } catch (error) {
    console.error("Error fetching posts from DB:", error);
    throw new Error("Error fetching posts from DB");
  }
};
