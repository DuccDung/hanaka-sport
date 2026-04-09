import { apiClient } from "./apiClient";
import {
  getSafeCommunityHtml,
  getSafeCommunityText,
} from "./communitySafetyService";

function sanitizeRefereePayload(referee) {
  if (!referee || typeof referee !== "object") return referee;

  return {
    ...referee,
    fullName: getSafeCommunityText(referee?.fullName, ""),
    bio: getSafeCommunityText(referee?.bio, ""),
    introduction: getSafeCommunityHtml(referee?.introduction, ""),
    workingArea: getSafeCommunityHtml(referee?.workingArea, ""),
    achievements: getSafeCommunityHtml(referee?.achievements, ""),
  };
}

/**
 * GET /api/referees
 * params: { query?: string, page?: number, pageSize?: number }
 */
export async function getReferees({
  query = "",
  page = 1,
  pageSize = 10,
} = {}) {
  const res = await apiClient.get("/referees", {
    params: { query, page, pageSize },
  });
  return {
    ...res.data,
    items: Array.isArray(res?.data?.items)
      ? res.data.items.map(sanitizeRefereePayload)
      : res?.data?.items,
  };
}

/**
 * GET /api/referees/:refereeId
 */
export async function getRefereeDetail(refereeId) {
  const res = await apiClient.get(`/referees/${refereeId}`);
  return sanitizeRefereePayload(res.data);
}

/**
 * GET /api/referees/me
 * cần JWT
 */
export async function getMyRefereeProfile() {
  const res = await apiClient.get("/referees/me");
  return sanitizeRefereePayload(res.data);
}

/**
 * POST /api/referees/register-me
 * cần JWT
 */
export async function registerMeAsReferee(payload = {}) {
  const res = await apiClient.post("/referees/register-me", payload);
  return res.data;
}

/**
 * PUT /api/referees/me/profile
 * cần JWT
 */
export async function updateMyRefereeProfile({
  introduction,
  workingArea,
  achievements,
}) {
  const res = await apiClient.put("/referees/me/profile", {
    introduction,
    workingArea,
    achievements,
  });
  return sanitizeRefereePayload(res.data);
}
