import { apiClient } from "./apiClient";

/**
 * GET /api/public/courts
 * params: { query?: string, page?: number, pageSize?: number }
 */
export async function getPublicCourts({
  query = "",
  page = 0,
  pageSize = 10,
} = {}) {
  const res = await apiClient.get("/public/courts", {
    params: { query, page, pageSize },
  });
  return res.data;
}

/**
 * GET /api/public/courts/:courtId
 */
export async function getPublicCourtDetail(courtId) {
  const res = await apiClient.get(`/public/courts/${courtId}`);
  return res.data;
}
