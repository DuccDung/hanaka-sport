// src/services/tournamentService.js
import { apiClient } from "./apiClient";

/**
 * Helpers
 */
function normalizeStatusForAdmin(status) {
  if (!status) return undefined;
  const s = String(status).trim().toUpperCase();
  // server: nếu status != "ALL" thì filter; nếu "ALL" hoặc null thì lấy hết
  return s;
}

function inferImageTypeFromUri(uri) {
  const ext = (uri.split(".").pop() || "jpg").toLowerCase();
  if (ext === "png") return { ext, type: "image/png" };
  if (ext === "webp") return { ext, type: "image/webp" };
  return { ext: ext === "jpeg" ? "jpeg" : "jpg", type: "image/jpeg" };
}

function appendIfDefined(formData, key, value) {
  if (value === undefined || value === null) return;
  // .NET binder nhận string cho số/date OK
  formData.append(key, String(value));
}

/**
 * Build FormData đúng tên field bên server:
 * CreateTournamentRequest / UpdateTournamentRequest
 */
function buildTournamentFormData(req = {}) {
  const formData = new FormData();

  // required (Create)
  appendIfDefined(formData, "title", req.title);
  appendIfDefined(formData, "gameType", req.gameType); // SINGLE/DOUBLE/MIXED
  appendIfDefined(formData, "status", req.status); // DRAFT/OPEN/CLOSED

  // optional
  appendIfDefined(formData, "expectedTeams", req.expectedTeams);
  // DateTime? -> gửi ISO là ổn nhất
  // ví dụ: new Date().toISOString()
  appendIfDefined(formData, "startTime", req.startTime);
  appendIfDefined(formData, "registerDeadline", req.registerDeadline);

  appendIfDefined(formData, "locationText", req.locationText);
  appendIfDefined(formData, "areaText", req.areaText);

  appendIfDefined(formData, "singleLimit", req.singleLimit);
  appendIfDefined(formData, "doubleLimit", req.doubleLimit);

  appendIfDefined(formData, "content", req.content);

  // server Create có các field optional này
  appendIfDefined(formData, "formatText", req.formatText);
  appendIfDefined(formData, "playoffType", req.playoffType);
  appendIfDefined(formData, "statusText", req.statusText);
  appendIfDefined(formData, "stateText", req.stateText);
  appendIfDefined(formData, "organizer", req.organizer);
  appendIfDefined(formData, "creatorName", req.creatorName);

  // Banner file (server field name: BannerFile)
  // req.bannerUri: file:///... từ expo-image-picker
  if (req.bannerUri) {
    const { ext, type } = inferImageTypeFromUri(req.bannerUri);

    formData.append("bannerFile", {
      uri: req.bannerUri,
      name: `tournament_banner.${ext}`,
      type,
    });
  }

  return formData;
}

/**
 * =========================
 * Admin Tournaments Service
 * =========================
 * Note: baseURL của apiClient là `${API_BASE_URL}/api`
 * nên chỉ cần gọi "/admin/tournaments"
 */

/**
 * GET: /api/admin/tournaments
 * params: { status?: "ALL"|"DRAFT"|"OPEN"|"CLOSED", page?: number, pageSize?: number }
 *
 * return: { page, pageSize, total, items: TournamentListItemDto[] }
 */
export async function adminListTournaments({
  status = "ALL",
  page = 1,
  pageSize = 50,
} = {}) {
  const res = await apiClient.get("/admin/tournaments", {
    params: {
      status: normalizeStatusForAdmin(status),
      page,
      pageSize,
    },
  });
  return res.data;
}

/**
 * GET: /api/admin/tournaments/{id}
 * return: TournamentListItemDto
 */
export async function adminGetTournamentDetail(tournamentId) {
  if (!tournamentId) throw new Error("tournamentId is required");
  const res = await apiClient.get(`/admin/tournaments/${tournamentId}`);
  return res.data;
}

/**
 * POST: /api/admin/tournaments  (multipart/form-data)
 *
 * req fields (match server):
 * {
 *  title, gameType, status?,
 *  expectedTeams?, startTime?, registerDeadline?,
 *  locationText?, areaText?,
 *  singleLimit?, doubleLimit?,
 *  content?,
 *  formatText?, playoffType?, statusText?, stateText?, organizer?, creatorName?,
 *  bannerUri? (file:///...)
 * }
 *
 * return: TournamentListItemDto
 */
export async function adminCreateTournament(req) {
  // validate nhẹ phía client (server vẫn validate)
  if (!req?.title) throw new Error("title is required");
  if (!req?.gameType)
    throw new Error("gameType is required (SINGLE/DOUBLE/MIXED)");

  const formData = buildTournamentFormData(req);

  const res = await apiClient.post("/admin/tournaments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

/**
 * PUT: /api/admin/tournaments/{id}  (multipart/form-data)
 *
 * req có thể chứa 1 phần field để update:
 * {
 *  title?, gameType?, status?,
 *  expectedTeams?, startTime?, registerDeadline?,
 *  locationText?, areaText?,
 *  singleLimit?, doubleLimit?,
 *  content?,
 *  bannerUri? (file:///...)
 * }
 *
 * return: TournamentListItemDto
 */
export async function adminUpdateTournament(tournamentId, req = {}) {
  if (!tournamentId) throw new Error("tournamentId is required");

  const formData = buildTournamentFormData(req);

  const res = await apiClient.put(
    `/admin/tournaments/${tournamentId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return res.data;
}

/**
 * Optional helper: map tab UI -> status server nếu bạn muốn dùng luôn list API
 * upcoming/ongoing/finished là UI seed của bạn, còn server đang dùng DRAFT/OPEN/CLOSED.
 * Tuỳ logic của bạn mà map thế nào. Ví dụ:
 */
export function mapTabToAdminStatus(tab) {
  switch (tab) {
    case "ongoing":
      return "OPEN";
    case "finished":
      return "CLOSED";
    default:
      return "OPEN";
  }
}
export async function publicGetTournamentDetail(tournamentId) {
  if (!tournamentId) throw new Error("tournamentId is required");
  const res = await apiClient.get(`/public/tournaments/${tournamentId}`);
  return res.data;
}
// GET: /api/public/tournaments/{id}/registrations?tab=ALL|SUCCESS|WAITING
export async function publicListTournamentRegistrations(
  tournamentId,
  tab = "ALL",
) {
  if (!tournamentId) throw new Error("tournamentId is required");
  const res = await apiClient.get(
    `/public/tournaments/${tournamentId}/registrations`,
    {
      params: { tab },
    },
  );
  return res.data;
}

/**
 * GET: /api/tournaments/:id
 * Nếu sau này bạn cần lấy detail giải riêng
 */
export async function getTournamentDetail(tournamentId) {
  const res = await apiClient.get(`/tournaments/${tournamentId}`);
  return res.data;
}

/**
 * GET: /api/tournaments
 * Ví dụ nếu sau này cần list giải đấu
 */
export async function getTournaments(params = {}) {
  const res = await apiClient.get("/tournaments", { params });
  return res.data;
}
/**
 * GET: /api/tournaments/:tournamentId/rounds-with-matches
 * Response:
 * {
 *   tournament: {...},
 *   rounds: [...]
 * }
 */
export async function getTournamentRoundsWithMatches(tournamentId) {
  const res = await apiClient.get(
    `/tournaments/${tournamentId}/rounds-with-matches`,
  );
  return res.data;
}
/**
 * Public Tournaments
 * Route server:
 * GET /api/public/tournaments?page=1&pageSize=10&status=OPEN&query=abc
 */

function normalizePublicTournamentStatus(status) {
  if (!status) return undefined;
  const s = String(status).trim().toUpperCase();
  return s;
}

export async function publicListTournaments({
  page = 1,
  pageSize = 10,
  status = "ALL",
  query = "",
} = {}) {
  const res = await apiClient.get("/public/tournaments", {
    params: {
      page,
      pageSize,
      status: normalizePublicTournamentStatus(status),
      query: query?.trim() || undefined,
    },
  });

  return res.data;
}
/**
 * GET: /api/tournaments/:tournamentId/round-maps/:roundMapId/standings
 */
export async function getTournamentRoundStandings(tournamentId, roundMapId) {
  if (!tournamentId) throw new Error("tournamentId is required");
  if (!roundMapId) throw new Error("roundMapId is required");

  const res = await apiClient.get(
    `/tournaments/${tournamentId}/round-maps/${roundMapId}/standings`,
  );
  return res.data;
}

/**
 * Helper:
 * lấy danh sách round từ API rounds-with-matches
 * vì standings API của bạn đang nhận roundMapId
 */
export async function getTournamentStandingRounds(tournamentId) {
  if (!tournamentId) throw new Error("tournamentId is required");

  const data = await getTournamentRoundsWithMatches(tournamentId);

  return (data?.rounds || []).map((r) => ({
    key: String(r.roundKey),
    label: r.roundLabel || r.roundKey,
    roundMapId: r.tournamentRoundMapId,
    roundKey: r.roundKey,
    roundLabel: r.roundLabel,
    sortOrder: r.sortOrder ?? 0,
  }));
}
/**
 * GET: /api/tournaments/:tournamentId/rule
 * Lấy riêng thể lệ giải theo tournamentId
 *
 * Response dự kiến:
 * {
 *   tournamentId: number,
 *   title: string,
 *   tournamentRule: string | null
 * }
 */
export async function getTournamentRule(tournamentId) {
  if (!tournamentId) {
    throw new Error("tournamentId is required");
  }

  const res = await apiClient.get(`/tournaments/${tournamentId}/rule`);
  return res.data;
}
