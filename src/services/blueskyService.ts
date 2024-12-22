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
  if (!thumb?.ref?.$link || !thumb.mimeType) return null;

  const baseUrl = "https://cdn.bsky.app/img/feed_thumbnail/plain";
  const did = "did:plc:i3xtdbvud6pgb62n5g2uw5i2"; // À remplacer dynamiquement si besoin
  const link = thumb.ref.$link;
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

export const fetchBlueSkyPosts = async (
  tag: string
): Promise<BlueSkyPost[]> => {
  try {
    if (!agent.session) {
      await authenticateAgent();
    }

    const searchResults = await agent.app.bsky.feed.searchPosts({
      tag: [`${tag}`],
      q: "Vue Js",
      lang: "fr",
    });
    return searchResults.data.posts as unknown as BlueSkyPost[];
  } catch (error) {
    console.error("Erreur lors de la récupération des posts BlueSky:", error);
    throw new Error("Impossible de récupérer les posts BlueSky.");
  }
};
