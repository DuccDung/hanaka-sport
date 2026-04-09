import { apiClient } from "./apiClient";
import { getSafeCommunityText } from "./communitySafetyService";

function sanitizeChatUser(user) {
  if (!user || typeof user !== "object") return user;

  return {
    ...user,
    fullName: getSafeCommunityText(user?.fullName, ""),
  };
}

function sanitizeChatMessage(message) {
  if (!message || typeof message !== "object") return message;

  return {
    ...message,
    content: getSafeCommunityText(message?.content, ""),
    sender: sanitizeChatUser(message?.sender),
  };
}

function sanitizeChatRoom(room) {
  if (!room || typeof room !== "object") return room;

  return {
    ...room,
    clubName: getSafeCommunityText(room?.clubName, room?.clubName || ""),
    lastSenderName: getSafeCommunityText(room?.lastSenderName, ""),
    lastMessagePreview: getSafeCommunityText(room?.lastMessagePreview, ""),
    lastMessage: sanitizeChatMessage(room?.lastMessage),
  };
}

export async function getMyClubChatRooms({ page = 1, pageSize = 20 } = {}) {
  const res = await apiClient.get("/clubs/chat-rooms", {
    params: { page, pageSize },
  });
  return {
    ...res.data,
    items: Array.isArray(res?.data?.items)
      ? res.data.items.map(sanitizeChatRoom)
      : res?.data?.items,
  };
}

export async function getClubMessages({
  clubId,
  page = 1,
  pageSize = 30,
} = {}) {
  const res = await apiClient.get(`/clubs/${clubId}/messages`, {
    params: { page, pageSize },
  });
  return {
    ...res.data,
    items: Array.isArray(res?.data?.items)
      ? res.data.items.map(sanitizeChatMessage)
      : res?.data?.items,
  };
}

export async function sendClubMessage(clubId, payload) {
  const res = await apiClient.post(`/clubs/${clubId}/messages`, payload);
  return {
    ...res.data,
    item: sanitizeChatMessage(res?.data?.item),
  };
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
