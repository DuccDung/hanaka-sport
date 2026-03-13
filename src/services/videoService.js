import { apiClient } from "./apiClient";

export function normalizeVideoTab(tab) {
  const t = String(tab || "all")
    .trim()
    .toLowerCase();
  if (t === "suggested") return "suggested";
  if (t === "live") return "live";
  return "all";
}

export async function getMatchVideos({
  tab = "all",
  page = 1,
  pageSize = 10,
  tournamentId,
} = {}) {
  const res = await apiClient.get("/videos/videos", {
    params: {
      tab: normalizeVideoTab(tab),
      page,
      pageSize,
      tournamentId: tournamentId || undefined,
    },
  });

  return res.data;
}

export function mapVideoUiTabToApiTab(tab) {
  switch (tab) {
    case "suggested":
      return "suggested";
    case "live":
      return "live";
    default:
      return "all";
  }
}

export function formatVideoDateTime(input) {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

export function buildMatchVideoTitle(item) {
  const round = item?.roundLabel || item?.roundKey || "";
  const group = item?.groupName ? ` - Bảng ${item.groupName}` : "";
  const t1 = item?.team1Name || "Đội 1";
  const t2 = item?.team2Name || "Đội 2";

  if (round) {
    return `${t1} vs ${t2} • ${round}${group}`;
  }

  return `${t1} vs ${t2}`;
}

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=E5ECFF&color=1E2430&name=Player";

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80";

export function mapMatchVideoItemToCard(item) {
  const team1HasPlayer2 = !!String(item?.team1Player2Name || "").trim();
  const team2HasPlayer2 = !!String(item?.team2Player2Name || "").trim();

  return {
    id: String(item?.matchId ?? ""),
    matchId: item?.matchId,
    tournamentId: item?.tournamentId,
    type: normalizeVideoTab(item?.tab || "all"),

    title: buildMatchVideoTitle(item),
    code: item?.tournamentTitle || "",
    dateTime: formatVideoDateTime(item?.startAt || item?.createdAt),

    banner: item?.tournamentBannerUrl || DEFAULT_BANNER,
    poster: item?.tournamentBannerUrl || DEFAULT_BANNER,

    videoUrl: item?.videoUrl || "",
    raw: item,

    players: [
      {
        name: item?.team1Player1Name || "",
        avatar: item?.team1Player1Avatar || DEFAULT_AVATAR,
      },
      {
        name: item?.team2Player1Name || "",
        avatar: item?.team2Player1Avatar || DEFAULT_AVATAR,
      },
      {
        name: item?.team1Player2Name || "",
        avatar: item?.team1Player2Avatar || DEFAULT_AVATAR,
      },
      {
        name: item?.team2Player2Name || "",
        avatar: item?.team2Player2Avatar || DEFAULT_AVATAR,
      },
    ],

    scores: [
      item?.scoreTeam1 ?? 0,
      item?.scoreTeam2 ?? 0,
      team1HasPlayer2 ? (item?.scoreTeam1 ?? 0) : "",
      team2HasPlayer2 ? (item?.scoreTeam2 ?? 0) : "",
    ],
  };
}
