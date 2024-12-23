import { supabase } from "../config/supabaseClient";

export async function insertBlueSkyPost(post: any) {
  const { data, error } = await supabase.from("bluesky_posts").insert(post);

  if (error) {
    throw new Error("Error inserting post: " + error.message);
  }

  return data;
}
