import { describe, expect, test, it, vi, beforeEach } from "vitest";
import { fetchBlueSkyPosts } from "../src/services/blueskyService";
import { BskyAgent } from "@atproto/api";
import { access } from "fs";

vi.mock("@atproto/api", () => {
  return {
    BskyAgent: {
      login: vi.fn().mockResolvedValue(true),
      session: {
        accessJwt: "test_token",
      },
      app: {
        bsky: {
          feed: {
            searchPosts: vi.fn().mockResolvedValue({
              data: {
                posts: [
                  {
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
                  },
                  {
                    uri: "test_uri2",
                    text: "test_text2",
                    createdAt: "2024-01-02T00:00:00Z",
                    author: {
                      did: "test_did2",
                      handle: "test_handle2",
                      displayName: "test_displayName2",
                    },
                    did: "test_did2",
                    handle: "test_handle2",
                    displayName: "test_displayName2",
                  },
                ],
              },
            }),
          },
        },
      },
    },
  };
});
