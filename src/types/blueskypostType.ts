export interface BlueSkyPost {
  uri: string;
  cid: string;
  author: {
    did: string;
    handle: string;
    displayName?: string;
    avatar?: string;
    associated?: {
      chat?: {
        allowIncoming?: string;
      };
    };
    viewer?: {
      muted?: boolean;
      blockedBy?: boolean;
    };
    labels?: {
      src: string;
      uri: string;
      cid: string;
      val: string;
      cts: string;
    }[];
    createdAt?: string;
  };
  record: {
    $type: string;
    createdAt: string;
    langs: string[];
    embed: {
      $type: string;
      uri: string;
      title: string;
      external: {
        description: string;
        thumb: {
          type: string;
          ref: {
            link: string;
          };
          mimtype: string;
          size: number;
        };
      };
    };
    reply: {
      parent: {
        cid: string;
        uri: string;
      };
      root: {
        cid: string;
        uri: string;
      };
    };
    text: string;
  };
  replyCount: number;
  repostCount: number;
  likeCount: number;
  quoteCount: number;
  indexedAt: string;
  viewer: {
    threadMuted: boolean;
    embeddingDisabled: boolean;
  };
  labels?: {
    src: string;
    uri: string;
    cid: string;
    val: string;
    cts: string;
  };
}
export interface BlueSkySearchResult {
  data: {
    posts: BlueSkyPost[];
  };
}
export interface BlueSkyFilteredPost {
  url: string;
  text: string;
  created_at: string;
  author: string;
  langs: string[] | null;
  embed_description: string;
  embed_title: string;
  embed_thumb: string;
}

export interface BlueSkyPostWithImage {
  mimtype: any;
  ref: {
    link: string;
  };
  size: number;
}
