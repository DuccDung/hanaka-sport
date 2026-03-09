import { apiClient } from "./apiClient";

/**
 * GET: /api/users/me
 * JWT Bearer tự gắn bởi interceptor trong apiClient
 */
export async function getMe() {
  const res = await apiClient.get("/users/me");
  return res.data;
}

/**
 * PUT: /api/users/me
 * req = { fullName?, phone?, gender?, city?, bio?, birthOfDate?, avatarUrl? }
 * birthOfDate nên gửi ISO: "2004-06-02"
 */
export async function updateMe(req) {
  const res = await apiClient.put("/users/me", req);
  return res.data;
}

/**
 * POST: /api/users/me/avatar (multipart)
 * fileUri: uri từ expo-image-picker (file:///...)
 */
export async function uploadAvatar(fileUri) {
  const formData = new FormData();

  // Nếu uri không có đuôi file rõ ràng thì cứ gửi jpeg
  const ext = (fileUri.split(".").pop() || "jpg").toLowerCase();
  const type =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  formData.append("file", {
    uri: fileUri,
    name: `avatar.${ext}`,
    type,
  });

  //  Để axios tự set boundary, vẫn OK khi set multipart như dưới
  const res = await apiClient.post("/users/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // { avatarUrl: "http://..." }
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
  return res.data; // { message: "..." }
}

/**
 * GET /users/members
 * params: { query?: string, page?: number, pageSize?: number }
 */
export async function getMembers({ query = "", page = 1, pageSize = 20 } = {}) {
  const res = await apiClient.get("/users/members", {
    params: { query, page, pageSize },
  });
  return res.data; // { page, pageSize, total, items }
}

export async function getUserDetail(userId) {
  const res = await apiClient.get(`/users/${userId}`);
  return res.data;
}
