import { describe, expect, it, vi, beforeEach } from "vitest";
import { fetchBlueSkyPosts } from "../src/services/blueskyService";
import { AtpAgent } from "@atproto/api";


beforeEach(() => {
  const agent = new AtpAgent({
    service: "https://bsky.social",
  });
})

describe("fetchBlueSkyPosts", () => {
  it("should return an array of posts", async () => {
    const posts = await fetchBlueSkyPosts("test_tag");
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBe(2);
    expect(posts[0]).toMatchObject({
      uri: "test_uri",
      text: "test_text",
      createdAt: "2024-01-01T00:00:00Z",
      author: {
        did: "test_did",
        handle: "test_handle",
        displayName: "test_displayName",
      },
      did: "test_did",
      handle: "test_handle",
      displayName: "test_displayName",
    });
  });

  it("return an empty array if no posts", async () => {
    agent.app.bsky.feed.searchPosts = vi.fn().mockResolvedValue({
      data: {
        posts: [],
      },
    });
    const posts = await fetchBlueSkyPosts("test_tag");

    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBe(0);
  });
});
