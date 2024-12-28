import axios from "axios";

const parsing = (content: string) => {
  const lines = content.split("\n##");
  let recentSection = lines.splice(1, 3);
  recentSection
    .map((section) => {
      const [versionLine, ...changes] = section.split("\n");
      const versionMatch = versionLine.match(
        /\[v([\d.]+)] - (\d{4}-\d{2}-\d{2})/
      );
      if (!versionMatch) {
        return null;
      }
      return {
        version: versionMatch[1],
        date: versionMatch[2],
        changes: changes.filter((line) => line.trim().startsWith("-")),
      };
    })
    .filter(Boolean);
  console.log(recentSection);
  return recentSection;
};
export const fetchVueJsChangelogs = async () => {
  try {
    const response = await axios.get(
      "https://api.github.com/repos/vuejs/core/contents/CHANGELOG.md"
    );
    const contentBase64 = response.data.content;
    const content = Buffer.from(contentBase64, "base64").toString("utf-8");

    parsing(content);
    return content;
  } catch (error) {
    console.error("Error fetching cahngelog:", error);
    throw new Error("Error fetching changelog");
  }
};
