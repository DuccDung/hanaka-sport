import { apiClient } from "./apiClient";

export async function getUpcomingMatchNotifications() {
  const res = await apiClient.get("/notifications/upcoming-matches");
  return res.data;
}

export async function getPairRequestNotifications() {
  const res = await apiClient.get("/notifications/pair-requests", {
    params: { includeResponses: true },
  });
  return res.data;
}

function formatNotificationTime(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");

  return `${hh}:${mi} ${dd}/${mm}/${yyyy}`;
}

function normalizeUpcomingMatchNotification(item) {
  const opponentNames = [
    item?.opponentTeam?.player1?.name,
    item?.opponentTeam?.player2?.name,
  ].filter(Boolean);

  return {
    id: `match-${item?.id}`,
    type: "TOURNAMENT_MATCH",
    title: item?.title || "Thông báo",
    message: item?.message || "",
    timeText: item?.match?.startAtText || "",
    sortAt: item?.match?.startAt || "",
    metaLines: [
      `Đối thủ: ${opponentNames.join(" - ") || "Chưa xác định"}`,
      `Thời gian: ${item?.match?.startAtText || "Chưa cập nhật"}`,
      `Địa điểm: ${item?.match?.addressText || "Chưa cập nhật"}`,
      `Sân: ${item?.match?.courtText || "Chưa cập nhật"}`,
    ],
    raw: item,
  };
}

function normalizePairRequestNotification(item) {
  const requestedAtText = formatNotificationTime(item?.requestedAt);
  const expiresAtText = formatNotificationTime(item?.expiresAt);

  return {
    id: `pair-${item?.pairRequestId}`,
    type: "PAIR_REQUEST",
    title: item?.title || "Lời mời ghép đôi",
    message: item?.message || "",
    timeText: requestedAtText,
    sortAt: item?.requestedAt || "",
    metaLines: [
      `Giải đấu: ${item?.tournamentTitle || "Chưa cập nhật"}`,
      `Người gửi: ${item?.requestedBy?.fullName || "Chưa cập nhật"}`,
      expiresAtText ? `Hết hạn: ${expiresAtText}` : null,
    ].filter(Boolean),
    raw: item,
  };
}

function normalizePairRequestNotificationV2(item) {
  const type = item?.notificationType || item?.type || "PAIR_REQUEST";
  const requestedAtText = formatNotificationTime(item?.requestedAt);
  const expiresAtText = formatNotificationTime(item?.expiresAt);
  const createdAtText = formatNotificationTime(item?.createdAt);
  const actor =
    item?.acceptedBy ||
    item?.requestedTo ||
    item?.requestedBy ||
    item?.details?.acceptedBy ||
    item?.details?.requestedTo ||
    item?.details?.requestedBy;
  const actorLabel =
    type === "PAIR_REQUEST"
      ? "Người gửi"
      : type === "PAIR_ACCEPTED" || type === "PAIR_REJECTED"
        ? "Người phản hồi"
        : "Liên quan";

  return {
    id: `${type}-${item?.notificationId || item?.pairRequestId}`,
    type,
    title: item?.title || "Lời mời ghép đôi",
    message: item?.message || "",
    timeText: requestedAtText || createdAtText,
    sortAt: item?.requestedAt || item?.createdAt || "",
    metaLines: [
      `Giải đấu: ${item?.tournamentTitle || "Chưa cập nhật"}`,
      `${actorLabel}: ${actor?.fullName || "Chưa cập nhật"}`,
      expiresAtText && type === "PAIR_REQUEST" ? `Hết hạn: ${expiresAtText}` : null,
    ].filter(Boolean),
    raw: item,
  };
}

export async function getNotificationInbox() {
  const [upcomingResult, pairRequestResult] = await Promise.allSettled([
    getUpcomingMatchNotifications(),
    getPairRequestNotifications(),
  ]);

  const upcomingItems =
    upcomingResult.status === "fulfilled"
      ? (upcomingResult.value?.items || []).map(normalizeUpcomingMatchNotification)
      : [];

  const pairRequestItems =
    pairRequestResult.status === "fulfilled"
      ? (pairRequestResult.value?.items || []).map(normalizePairRequestNotificationV2)
      : [];

  return {
    total: upcomingItems.length + pairRequestItems.length,
    items: [...pairRequestItems, ...upcomingItems].sort((a, b) => {
      const left = new Date(a?.sortAt || 0).getTime() || 0;
      const right = new Date(b?.sortAt || 0).getTime() || 0;
      return right - left;
    }),
  };
}

export async function getNotificationBadgeCount() {
  const inbox = await getNotificationInbox();
  return inbox?.total || 0;
}
