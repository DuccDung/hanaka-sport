import { apiClient } from "./apiClient";
import {
  getSafeCommunityHtml,
  getSafeCommunityText,
} from "./communitySafetyService";

function sanitizeCoachPayload(coach) {
  if (!coach || typeof coach !== "object") return coach;

  return {
    ...coach,
    fullName: getSafeCommunityText(coach?.fullName, ""),
    bio: getSafeCommunityText(coach?.bio, ""),
    introduction: getSafeCommunityHtml(coach?.introduction, ""),
    teachingArea: getSafeCommunityHtml(coach?.teachingArea, ""),
    achievements: getSafeCommunityHtml(coach?.achievements, ""),
  };
}

export const getCoaches = async (params = {}) => {
  const res = await apiClient.get("/coaches", { params });
  return {
    ...res.data,
    items: Array.isArray(res?.data?.items)
      ? res.data.items.map(sanitizeCoachPayload)
      : res?.data?.items,
  };
};

export const getCoachDetail = async (coachId) => {
  const res = await apiClient.get(`/coaches/${coachId}`);
  return sanitizeCoachPayload(res.data);
};

export const getMyCoachProfile = async () => {
  const res = await apiClient.get("/coaches/me");
  return sanitizeCoachPayload(res.data);
};

export const registerMeAsCoach = async (payload = {}) => {
  const res = await apiClient.post("/coaches/register-me", payload);
  return res.data;
};

export const updateMyCoachProfile = async (payload = {}) => {
  const res = await apiClient.put("/coaches/me/profile", payload);
  return sanitizeCoachPayload(res.data);
};
