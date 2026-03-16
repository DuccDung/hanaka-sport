import { apiClient } from "./apiClient";

export async function getYoutubeGuideLink() {
  const res = await apiClient.get("/links");
  const items = res?.data?.items || [];

  const youtubeItem = items.find((item) => item.type === "youtube");

  return youtubeItem?.link || null;
}
