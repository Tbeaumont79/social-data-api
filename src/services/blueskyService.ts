import AtpAgent from "@atproto/api";
import {
  BlueSkyPost,
  BlueSkySearchResult,
  BlueSkyPostWithImage,
  BlueSkyFilteredPost,
} from "../types/blueskypostType";
import {
  insertBlueSkyPost,
  getBlueSkyPostsByUrl,
} from "../repositories/bluesky.repository";

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
const generateBlueskyImageUrl = (thumb: BlueSkyPostWithImage): string => {
  if (!thumb?.ref || !thumb.mimtype) return null;

  const baseUrl = "https://cdn.bsky.app/img/feed_thumbnail/plain";
  const did = "did:plc:i3xtdbvud6pgb62n5g2uw5i2"; // À remplacer dynamiquement si besoin
  const link = thumb.ref;
  const extension = thumb.mimtype === "image/png" ? "png" : "jpeg";

  return `${baseUrl}/${did}/${link}@${extension}`;
};

const generateBlueskyPostUrl = (uri: string): string => {
  const match = uri.match(
    /at:\/\/(did:[\w:]+)\/app\.bsky\.feed\.post\/([\w]+)/
  );
  if (!match) {
    throw new Error("Invalid post URI");
  }
  const [, did, rkey] = match;

  return `https://bsky.app/profile/${did}/post/${rkey}`;
};

const filterNewPosts = async (posts: BlueSkyPost[]): Promise<BlueSkyPost[]> => {
  // filtering new posts to avoid duplicates
  const urlPosts = await getBlueSkyPostsByUrl();
  return posts.filter((post) => {
    const url = generateBlueskyPostUrl(post.uri);
    return !urlPosts.some((urlPost) => urlPost.url === url);
  });
};
const transformPost = (post: BlueSkyPost): BlueSkyFilteredPost => {
  const url = generateBlueskyPostUrl(post.uri);

  const hasEmbed =
    post.record.embed &&
    post.record.embed.external &&
    post.record.embed.external.description &&
    post.record.embed.external["title"] &&
    post.record.embed.external.thumb;

  return {
    url,
    text: post.record.text,
    created_at: post.record.createdAt,
    author: post.author.displayName,
    embed_description: hasEmbed ? post.record.embed.external.description : null,
    embed_title: hasEmbed
      ? (post.record.embed.external["title"] as string)
      : null,
    embed_thumb: hasEmbed
      ? generateBlueskyImageUrl(post.record.embed.external.thumb)
      : null,
  };
};
export const fetchAndStoreBlueSkyPosts = async (
  tag: string
): Promise<BlueSkyFilteredPost[]> => {
  try {
    await authenticateAgent();
    const searchResults = (await agent.app.bsky.feed.searchPosts({
      tag: [`${tag}`],
      q: tag,
      lang: "fr",
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
