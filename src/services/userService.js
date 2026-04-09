import { apiClient } from "./apiClient";
import { getSafeCommunityText } from "./communitySafetyService";

export function sanitizeUserPayload(user) {
  if (!user || typeof user !== "object") return user;

  return {
    ...user,
    fullName: getSafeCommunityText(user?.fullName, ""),
    bio: getSafeCommunityText(user?.bio, ""),
  };
}

function sanitizeUserListResponse(payload) {
  if (!payload || typeof payload !== "object") return payload;

  return {
    ...payload,
    items: Array.isArray(payload?.items)
      ? payload.items.map(sanitizeUserPayload)
      : payload?.items,
  };
}

/**
 * GET: /api/users/me
 */
export async function getMe() {
  const res = await apiClient.get("/users/me");
  return sanitizeUserPayload(res.data);
}

/**
 * PUT: /api/users/me
 * req = { fullName?, phone?, gender?, city?, bio?, birthOfDate?, avatarUrl? }
 */
export async function updateMe(req) {
  const res = await apiClient.put("/users/me", req);
  return sanitizeUserPayload(res.data);
}

/**
 * POST: /api/users/me/avatar
 * fileUri: uri từ expo-image-picker
 */
export async function uploadAvatar(fileUri) {
  const formData = new FormData();

  const ext = (fileUri.split(".").pop() || "jpg").toLowerCase();
  const type =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  formData.append("file", {
    uri: fileUri,
    name: `avatar.${ext}`,
    type,
  });

  const res = await apiClient.post("/users/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

export async function changePassword({
  currentPassword,
  newPassword,
  confirmPassword,
}) {
  const res = await apiClient.post("/users/me/change-password", {
    currentPassword,
    newPassword,
    confirmPassword,
  });
  return res.data;
}

/**
 * GET /api/users/members
 */
export async function getMembers({ query = "", page = 1, pageSize = 20 } = {}) {
  const res = await apiClient.get("/users/members", {
    params: { query, page, pageSize },
  });
  return sanitizeUserListResponse(res.data);
}

/**
 * GET /api/users/{userId}
 */
export async function getUserDetail(userId) {
  const res = await apiClient.get(`/users/${userId}`);
  return sanitizeUserPayload(res.data);
}

/**
 * GET /api/users/{userId}/rating-history
 */
export async function getUserRatingHistory(userId) {
  const res = await apiClient.get(`/users/${userId}/rating-history`);
  return res.data;
}

/**
 * GET /api/users/me/rating-history
 */
export async function getMyRatingHistory() {
  const res = await apiClient.get("/users/me/rating-history");
  return res.data;
}

/**
 * PUT /api/users/me/self-rating
 */
export async function updateMySelfRating({ ratingSingle, ratingDouble }) {
  const res = await apiClient.put("/users/me/self-rating", {
    ratingSingle,
    ratingDouble,
  });
  return res.data;
}

export async function deleteMe() {
  const res = await apiClient.delete("/users/me");
  return res.data;
}
/**
 * GET /api/users/{userId}/achievements
 */
export async function getUserAchievements(userId) {
  const res = await apiClient.get(`/users/${userId}/achievements`);
  return res.data;
}

/**
 * GET /api/users/me/achievements
 */
export async function getMyAchievements() {
  const res = await apiClient.get("/users/me/achievements");
  return res.data;
}
/**
 * GET /api/videos/users/{userId}/videos
 */
export async function getUserMatchVideos(
  userId,
  { tab = "all", page = 1, pageSize = 10 } = {},
) {
  const res = await apiClient.get(`/videos/users/${userId}/videos`, {
    params: { tab, page, pageSize },
  });
  return res.data;
}
