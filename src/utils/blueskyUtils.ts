import {
  BlueSkyPost,
  BlueSkyPostWithImage,
  BlueSkyFilteredPost,
} from "../types/blueskypostType";

import { getBlueSkyPostsByUrl } from "../repositories/bluesky.repository";

const generateBlueskyImageUrl = (thumb: BlueSkyPostWithImage): string => {
  if (!thumb?.ref || !thumb.mimtype) return null;

  const baseUrl = "https://cdn.bsky.app/img/feed_thumbnail/plain";
  const did = "did:plc:i3xtdbvud6pgb62n5g2uw5i2";
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

export const filterNewPosts = async (
  posts: BlueSkyPost[]
): Promise<BlueSkyPost[]> => {
  // filtering new posts to avoid duplicates
  const urlPosts = await getBlueSkyPostsByUrl();
  return posts.filter((post) => {
    const url = generateBlueskyPostUrl(post.uri);
    return !urlPosts.some((urlPost) => urlPost.url === url);
  });
};
export const transformPost = (post: BlueSkyPost): BlueSkyFilteredPost => {
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
    langs: post.record.langs,
    embed_description: hasEmbed ? post.record.embed.external.description : null,
    embed_title: hasEmbed
      ? (post.record.embed.external["title"] as string)
      : null,
    embed_thumb: hasEmbed
      ? generateBlueskyImageUrl(post.record.embed.external.thumb)
      : null,
  };
};
