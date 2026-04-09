import { apiClient } from "./apiClient";
import {
  getSafeCommunityHtml,
  getSafeCommunityText,
} from "./communitySafetyService";

function sanitizeClubPayload(club) {
  if (!club || typeof club !== "object") return club;

  const overview = club?.overview && typeof club.overview === "object"
    ? {
        ...club.overview,
        introduction: getSafeCommunityText(club.overview?.introduction, ""),
      }
    : club?.overview;

  return {
    ...club,
    clubName: getSafeCommunityText(club?.clubName, club?.clubName || ""),
    description: getSafeCommunityHtml(club?.description, club?.description || ""),
    overview,
  };
}

function sanitizeClubMemberPayload(member) {
  if (!member || typeof member !== "object") return member;

  return {
    ...member,
    fullName: getSafeCommunityText(member?.fullName, ""),
    bio: getSafeCommunityText(member?.bio, ""),
  };
}

function sanitizeClubMemberListResponse(payload) {
  if (!payload || typeof payload !== "object") return payload;

  return {
    ...payload,
    items: Array.isArray(payload?.items)
      ? payload.items.map(sanitizeClubMemberPayload)
      : payload?.items,
  };
}

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
  return sanitizeClubPayload(res.data);
}

export async function getMyClubs() {
  const res = await apiClient.get("/clubs/my");
  return {
    ...res.data,
    items: Array.isArray(res?.data?.items)
      ? res.data.items.map(sanitizeClubPayload)
      : res?.data?.items,
  };
}

export async function getClubDetail(clubId) {
  const res = await apiClient.get(`/clubs/${clubId}`);
  return sanitizeClubPayload(res.data);
}

export async function getClubs({ keyword = "", page = 1, pageSize = 10 } = {}) {
  const res = await apiClient.get("/clubs", {
    params: { keyword, page, pageSize },
  });
  return {
    ...res.data,
    items: Array.isArray(res?.data?.items)
      ? res.data.items.map(sanitizeClubPayload)
      : res?.data?.items,
  };
}

export async function joinClub(clubId) {
  const res = await apiClient.post(`/clubs/${clubId}/join`);
  return res.data;
}

export async function getClubOverview(clubId) {
  const res = await apiClient.get(`/clubs/${clubId}/overview`);
  return sanitizeClubPayload(res.data);
}

export async function getClubMembers({ clubId, page = 1, pageSize = 50 } = {}) {
  const res = await apiClient.get(`/clubs/${clubId}/members`, {
    params: { page, pageSize },
  });
  return sanitizeClubMemberListResponse(res.data);
}

export async function getPendingClubMembers({
  clubId,
  page = 1,
  pageSize = 50,
} = {}) {
  const res = await apiClient.get(`/clubs/${clubId}/pending-members`, {
    params: { page, pageSize },
  });
  return sanitizeClubMemberListResponse(res.data);
}

export async function approvePendingClubMember(clubId, userId) {
  const res = await apiClient.post(
    `/clubs/${clubId}/pending-members/${userId}/approve`,
  );
  return res.data;
}

export async function rejectPendingClubMember(clubId, userId) {
  const res = await apiClient.delete(
    `/clubs/${clubId}/pending-members/${userId}`,
  );
  return res.data;
}

export async function removeClubMember(clubId, userId) {
  const res = await apiClient.delete(`/clubs/${clubId}/members/${userId}`);
  return res.data;
}

export async function updateClubMemberRole(clubId, userId, memberRole) {
  const res = await apiClient.put(`/clubs/${clubId}/members/${userId}/role`, {
    memberRole,
  });
  return res.data;
}
export async function updateClubChallengeMode(clubId, allowChallenge) {
  const res = await apiClient.put(`/clubs/${clubId}/challenge-mode`, {
    allowChallenge,
  });
  return res.data;
}
export async function getChallengingClubs({
  keyword = "",
  page = 1,
  pageSize = 10,
} = {}) {
  const res = await apiClient.get("/clubs/challenging", {
    params: { keyword, page, pageSize },
  });
  return {
    ...res.data,
    items: Array.isArray(res?.data?.items)
      ? res.data.items.map(sanitizeClubPayload)
      : res?.data?.items,
  };
}
