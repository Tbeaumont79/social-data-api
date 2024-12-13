import { BskyAgent } from "@atproto/api";
import { BlueSkyPost } from "../types/blueskypostType";

const agent = new BskyAgent({
  service: "https://bsky.social",
});

const authenticateAgent = async () => {
  if (!process.env.BSKY_USERNAME || !process.env.BSKY_PASSWORD) {
    throw new Error(
      "Identifiants BlueSky non définis dans les variables d’environnement."
    );
  }

  await agent.login({
    identifier: process.env.BSKY_USERNAME,
    password: process.env.BSKY_PASSWORD,
  });
};

export const fetchBlueSkyPosts = async (
  tag: string
): Promise<BlueSkyPost[]> => {
  try {
    console.log("Authentification BlueSky");
    if (!agent.session) {
      await authenticateAgent();
    }

    console.log("Recherche des posts BlueSky");

    const searchResults = await agent.app.bsky.feed.searchPosts({
      tag: [`${tag}`],
      q: "Vue Js",
    });

    console.log("Posts BlueSky trouvés:", searchResults.data.posts.length);
    return searchResults.data.posts as BlueSkyPost[];
  } catch (error) {
    console.error("Erreur lors de la récupération des posts BlueSky:", error);
    throw new Error("Impossible de récupérer les posts BlueSky.");
  }
};
