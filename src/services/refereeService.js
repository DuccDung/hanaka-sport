import { apiClient } from "./apiClient";

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
  return res.data;
}

/**
 * GET /api/referees/:refereeId
 */
export async function getRefereeDetail(refereeId) {
  const res = await apiClient.get(`/referees/${refereeId}`);
  return res.data;
}

/**
 * GET /api/referees/me
 * cần JWT
 */
export async function getMyRefereeProfile() {
  const res = await apiClient.get("/referees/me");
  return res.data;
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
  return res.data;
}
