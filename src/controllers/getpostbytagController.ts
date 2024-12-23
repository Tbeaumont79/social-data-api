import { title } from "process";
import {
  fetchBlueSkyPosts,
  generateBlueskyPostUrl,
  generateBlueskyImageUrl,
} from "../services/blueskyService";
export const getpostbytagController = async (req, res) => {
  try {
    const tag = req.params.tag;
    const posts = await fetchBlueSkyPosts(tag);

    const formattedPosts = posts.map((post) => {
      const url = generateBlueskyPostUrl(post.uri);
      const hasEmbed =
        post.record.embed &&
        post.record.embed.external &&
        post.record.embed.external.description &&
        post.record.embed.external["title"] &&
        post.record.embed.external.thumb;

      const customEmbed = hasEmbed
        ? {
            external: {
              description: post.record.embed.external.description,
              title: post.record.embed.external["title"],
              thumb: generateBlueskyImageUrl(post.record.embed.external.thumb),
            },
          }
        : null;
      return {
        url,
        text: post.record.text,
        createdAt: post.record.createdAt,
        author: post.author.displayName,
        embed: customEmbed,
      };
    });
    res.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Error fetching posts" });
  }
};
