import { fetchBlueSkyPosts } from "../services/blueskyService";
export const getpostbytagController = async (req, res) => {
  try {
    const tag = req.params.tag;
    const posts = await fetchBlueSkyPosts(tag);
    console.log(posts[0].author.displayName);
    console.log(posts[0].record.text);
    console.log(posts[0].record.createdAt);
    console.log(posts[0].uri);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Error fetching posts" });
  }
};
