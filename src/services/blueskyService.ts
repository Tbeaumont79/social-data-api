import AtpAgent from "@atproto/api";
import { BlueSkyPost } from "../types/blueskypostType";

const agent = new AtpAgent({
  service: "https://bsky.social",
});

const authenticateAgent = async () => {
  await agent.login({
    identifier: process.env.BSKY_USERNAME,
    password: process.env.BSKY_PASSWORD,
  });
};
export const generateBlueskyImageUrl = (thumb: any): string | null => {
  if (!thumb?.ref || !thumb.mimeType) return null;

  const baseUrl = "https://cdn.bsky.app/img/feed_thumbnail/plain";
  const did = "did:plc:i3xtdbvud6pgb62n5g2uw5i2"; // À remplacer dynamiquement si besoin
  const link = thumb.ref;
  const extension = thumb.mimeType === "image/png" ? "png" : "jpeg";

  return `${baseUrl}/${did}/${link}@${extension}`;
};

export const generateBlueskyPostUrl = (uri: string): string => {
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
): Promise<BlueSkyPost[]> => {
  try {
    if (!agent.session) {
      await authenticateAgent();
    }

    const searchResults = await agent.app.bsky.feed.searchPosts({
      tag: [`${tag}`],
      q: tag,
      lang: "fr",
    });
    const posts = searchResults.data.posts as unknown as BlueSkyPost[];
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
    return formattedPosts as unknown as BlueSkyPost[];
  } catch (error) {
    console.error("Erreur lors de la récupération des posts BlueSky:", error);
    throw new Error("Impossible de récupérer les posts BlueSky.");
  }
};
