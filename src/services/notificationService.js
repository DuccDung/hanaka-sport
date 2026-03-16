import { apiClient } from "./apiClient";

export async function getUpcomingMatchNotifications() {
  const res = await apiClient.get("/notifications/upcoming-matches");
  return res.data;
}
