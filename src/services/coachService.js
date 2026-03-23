import { apiClient } from "./apiClient";

export const getCoaches = async (params = {}) => {
  const res = await apiClient.get("/coaches", { params });
  return res.data;
};

export const getCoachDetail = async (coachId) => {
  const res = await apiClient.get(`/coaches/${coachId}`);
  return res.data;
};

export const getMyCoachProfile = async () => {
  const res = await apiClient.get("/coaches/me");
  return res.data;
};

export const registerMeAsCoach = async (payload = {}) => {
  const res = await apiClient.post("/coaches/register-me", payload);
  return res.data;
};

export const updateMyCoachProfile = async (payload = {}) => {
  const res = await apiClient.put("/coaches/me/profile", payload);
  return res.data;
};
