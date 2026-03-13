import { apiClient } from "./apiClient";

/**
 * GET /api/coaches
 * params: { query?: string, page?: number, pageSize?: number }
 */
export async function getCoaches({ query = "", page = 1, pageSize = 10 } = {}) {
  const res = await apiClient.get("/coaches", {
    params: { query, page, pageSize },
  });
  return res.data; // { page, pageSize, total, items }
}

/**
 * GET /api/coaches/:coachId
 */
export async function getCoachDetail(coachId) {
  const res = await apiClient.get(`/coaches/${coachId}`);
  return res.data;
}

/**
 * GET /api/coaches/me
 * cần JWT
 */
export async function getMyCoachProfile() {
  const res = await apiClient.get("/coaches/me");
  return res.data;
}

/**
 * POST /api/coaches/register-me
 * cần JWT
 */
export async function registerMeAsCoach(payload = {}) {
  const res = await apiClient.post("/coaches/register-me", payload);
  return res.data;
}

/**
 * PUT /api/coaches/me/profile
 * cần JWT
 */
export async function updateMyCoachProfile({
  introduction,
  teachingArea,
  achievements,
}) {
  const res = await apiClient.put("/coaches/me/profile", {
    introduction,
    teachingArea,
    achievements,
  });
  return res.data;
}
