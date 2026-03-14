import { apiClient } from "./apiClient";

export async function getMyClubChatRooms({ page = 1, pageSize = 20 } = {}) {
  const res = await apiClient.get("/clubs/chat-rooms", {
    params: { page, pageSize },
  });
  return res.data;
}

export async function getClubMessages({
  clubId,
  page = 1,
  pageSize = 30,
} = {}) {
  const res = await apiClient.get(`/clubs/${clubId}/messages`, {
    params: { page, pageSize },
  });
  return res.data;
}

export async function sendClubMessage(clubId, payload) {
  const res = await apiClient.post(`/clubs/${clubId}/messages`, payload);
  return res.data;
}

export async function deleteClubMessage(clubId, messageId) {
  const res = await apiClient.delete(`/clubs/${clubId}/messages/${messageId}`);
  return res.data;
}

export async function uploadClubMessageMedia(fileUri) {
  const formData = new FormData();

  const ext = (fileUri.split(".").pop() || "jpg").toLowerCase();
  const type =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  formData.append("file", {
    uri: fileUri,
    name: `club-message.${ext}`,
    type,
  });

  const res = await apiClient.post("/clubs/message-media", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}
