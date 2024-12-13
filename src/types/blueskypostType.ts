export interface BlueSkyPost {
  uri: string;
  text?: string;
  createdAt?: string;
  author: {
    did: string;
    handle: string;
    displayName: string;
  };
  embeds?: any;
}
