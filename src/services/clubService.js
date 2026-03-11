import { apiClient } from "./apiClient";

export async function uploadClubCover(fileUri) {
  const formData = new FormData();

  const ext = (fileUri.split(".").pop() || "jpg").toLowerCase();
  const type =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  formData.append("file", {
    uri: fileUri,
    name: `club-cover.${ext}`,
    type,
  });

  const res = await apiClient.post("/clubs/cover", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

export async function createClub(payload) {
  const res = await apiClient.post("/clubs", payload);
  return res.data;
}

export async function getMyClubs() {
  const res = await apiClient.get("/clubs/my");
  return res.data;
}

export async function getClubDetail(clubId) {
  const res = await apiClient.get(`/clubs/${clubId}`);
  return res.data;
}

export async function getClubs({ keyword = "", page = 1, pageSize = 10 } = {}) {
  const res = await apiClient.get("/clubs", {
    params: { keyword, page, pageSize },
  });
  return res.data;
}

export async function getClubOverview(clubId) {
  const res = await apiClient.get(`/clubs/${clubId}/overview`);
  return res.data;
}

export async function getClubMembers({ clubId, page = 1, pageSize = 50 } = {}) {
  const res = await apiClient.get(`/clubs/${clubId}/members`, {
    params: { page, pageSize },
  });
  return res.data;
}

export async function getPendingClubMembers({
  clubId,
  page = 1,
  pageSize = 50,
} = {}) {
  const res = await apiClient.get(`/clubs/${clubId}/pending-members`, {
    params: { page, pageSize },
  });
  return res.data;
}
