import AtpAgent from "@atproto/api";
import {
  BlueSkyPost,
  BlueSkySearchResult,
  BlueSkyPostWithImage,
  BlueSkyFilteredPost,
} from "../types/blueskypostType";
import {
  insertBlueSkyPost,
  getBlueSkyPostsUrl,
} from "../repositories/bluesky.repository";

const agent = new AtpAgent({
  service: "https://bsky.social",
});

const authenticateAgent = async () => {
  await agent.login({
    identifier: process.env.BSKY_USERNAME,
    password: process.env.BSKY_PASSWORD,
  });
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

export const fetchAndStoreBlueSkyPosts = async (
  tag: string
): Promise<BlueSkyFilteredPost[]> => {
  try {
    if (!agent.session) {
      await authenticateAgent();
    }
    const searchResults: BlueSkySearchResult =
      (await agent.app.bsky.feed.searchPosts({
        tag: [`${tag}`],
        q: tag,
        lang: "fr",
      })) as unknown as BlueSkySearchResult;

    let posts = searchResults.data.posts as BlueSkyPost[];

    const urlPosts = await getBlueSkyPostsUrl(); // getting url from db
    posts = posts.filter((post) => {
      // filtering posts by url
      const url = generateBlueskyPostUrl(post.uri);
      return !urlPosts.some((urlPost) => urlPost.url === url);
    });

    if (posts.length === 0) {
      // if no new posts found return empty array
      return [];
    }
    const filteredPost: BlueSkyFilteredPost[] = posts.map((post) => {
      const url = generateBlueskyPostUrl(post.uri);

      const hasEmbed =
        post.record.embed &&
        post.record.embed.external &&
        post.record.embed.external.description &&
        post.record.embed.external["title"] &&
        post.record.embed.external.thumb;
      return hasEmbed
        ? {
            url,
            text: post.record.text,
            created_at: post.record.createdAt,
            author: post.author.displayName,
            embed_description: post.record.embed.external.description,
            embed_title: post.record.embed.external["title"] as string,
            embed_thumb: generateBlueskyImageUrl(
              post.record.embed.external.thumb
            ),
          }
        : {
            url,
            text: post.record.text,
            created_at: post.record.createdAt,
            author: post.author.displayName,
            embed_description: null,
            embed_title: null,
            embed_thumb: null,
          };
    });
    for (const post of filteredPost) {
      await insertBlueSkyPost(post);
    }
    return filteredPost;
  } catch (error) {
    console.error("Erreur lors de la récupération des posts BlueSky:", error);
    throw new Error("Impossible de récupérer les posts BlueSky.");
  }
};
