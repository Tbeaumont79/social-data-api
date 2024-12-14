import AtpAgent from "@atproto/api";
import dotenv from "dotenv";
import { vi } from "vitest";

dotenv.config({ path: ".env" });

vi.mock("@atproto/api", () => {
  return {
    AtpAgent: {
      login: vi.fn().mockResolvedValue(true),
      app: {
        bsky: {
          feed: {
            searchPosts: vi.fn().mockResolvedValue({
              data: {
                posts: [
                  {
                    uri: "test_uri",
                    record: {
                      text: "test_text",
                      createdAt: "2024-01-01T00:00:00Z",
                    },
                    author: {
                      did: "test_did",
                      handle: "test_handle",
                      displayName: "test_displayName",
                    },
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
