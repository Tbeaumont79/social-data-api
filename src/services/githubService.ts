import axios from "axios";

export const fetchVueJsChangelogs = async () => {
  try {
    const response = await axios.get(
      "https://api.github.com/repos/vuejs/core/contents/CHANGELOG.md"
    );
    const contentBase64 = response.data.content;
    const content = Buffer.from(contentBase64, "base64").toString("utf-8");
    return content;
  } catch (error) {
    console.error("Error fetching cahngelog:", error);
    throw new Error("Error fetching changelog");
  }
};
