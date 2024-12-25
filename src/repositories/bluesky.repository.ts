import { supabase } from "../config/supabaseClient";
import { BlueSkyFilteredPost } from "../types/blueskypostType";
export async function insertBlueSkyPost(post: BlueSkyFilteredPost) {
  const { data, error } = await supabase.from("bluesky_posts").insert(post);

  if (error) {
    throw new Error("Error inserting post: " + error.message);
  }

  return data;
}
