import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "./apiClient";
import { getAuthSession } from "./authStorage";
import {
  COMMUNITY_MASKED_MESSAGE_TEXT,
  COMMUNITY_REPORT_REASONS,
  COMMUNITY_TERMS_VERSION,
} from "../constants/communitySafety";

const STORAGE_KEYS = {
  terms: "communityTermsState_v1",
  blockedUsers: "communityBlockedUsers_v1",
  reports: "communityReports_v1",
};

const GUEST_COMMUNITY_SCOPE = "guest";

const OUTGOING_BLOCK_PATTERNS = [
  {
    label: "Ngôn từ xúc phạm",
    regex:
      /\b(dm|dmm|vcl|clm|cc|fuck|shit|bitch|asshole|motherfucker)\b/i,
  },
  {
    label: "Đe dọa bạo lực",
    regex: /\b(kill|rape|giết|đập chết|đâm chết|hiếp)\b/i,
  },
  {
    label: "Nội dung tình dục phản cảm",
    regex: /\b(sex|nude|xxx|khoe thân|ảnh nóng)\b/i,
  },
];

function normalizeId(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function cloneValue(value) {
  if (Array.isArray(value)) return [...value];
  if (value && typeof value === "object") return { ...value };
  return value;
}

function getScopedStorageKey(baseKey, scopeKey) {
  return `${baseKey}:${scopeKey}`;
}

async function getCommunityScope(overrideUserId = null) {
  const normalizedOverride = normalizeId(overrideUserId);
  if (normalizedOverride) {
    return {
      scopeKey: `user:${normalizedOverride}`,
      userId: normalizedOverride,
    };
  }

  try {
    const session = await getAuthSession();
    const sessionUserId = normalizeId(session?.user?.userId);

    if (sessionUserId) {
      return {
        scopeKey: `user:${sessionUserId}`,
        userId: sessionUserId,
      };
    }
  } catch (error) {
    console.log("communitySafety getCommunityScope error", error?.message);
  }

  return {
    scopeKey: GUEST_COMMUNITY_SCOPE,
    userId: null,
  };
}

async function readJsonValue(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch (error) {
    console.log("communitySafety readJson error", error?.message);
    return undefined;
  }
}

async function writeJson(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log("communitySafety writeJson error", error?.message);
  }
}

function resolveLegacyTermsState(legacyValue, scopeKey) {
  if (!legacyValue || Array.isArray(legacyValue)) {
    return undefined;
  }

  if (typeof legacyValue !== "object") {
    return undefined;
  }

  const legacyUserId = normalizeId(legacyValue?.userId);

  if (legacyUserId) {
    return scopeKey === `user:${legacyUserId}` ? legacyValue : undefined;
  }

  return scopeKey === GUEST_COMMUNITY_SCOPE ? legacyValue : undefined;
}

async function readScopedJson(
  baseKey,
  fallbackValue,
  { userId = null, legacyResolver = null } = {},
) {
  const { scopeKey } = await getCommunityScope(userId);
  const scopedKey = getScopedStorageKey(baseKey, scopeKey);
  const scopedValue = await readJsonValue(scopedKey);

  if (scopedValue !== undefined) {
    return {
      scopeKey,
      storageKey: scopedKey,
      value: scopedValue,
    };
  }

  if (typeof legacyResolver === "function") {
    const legacyValue = await readJsonValue(baseKey);
    const migratedValue = legacyResolver(legacyValue, scopeKey);

    if (migratedValue !== undefined) {
      await writeJson(scopedKey, migratedValue);

      return {
        scopeKey,
        storageKey: scopedKey,
        value: migratedValue,
      };
    }
  }

  return {
    scopeKey,
    storageKey: scopedKey,
    value: cloneValue(fallbackValue),
  };
}

async function writeScopedJson(baseKey, value, { userId = null } = {}) {
  const { scopeKey } = await getCommunityScope(userId);
  const scopedKey = getScopedStorageKey(baseKey, scopeKey);

  await writeJson(scopedKey, value);

  return {
    scopeKey,
    storageKey: scopedKey,
    value,
  };
}

async function tryRemoteRequest(requests = []) {
  let lastError = null;

  for (const request of requests) {
    try {
      const response = await apiClient.request({
        timeout: 4000,
        ...request,
      });

      return {
        ok: true,
        data: response?.data,
        endpoint: request?.url,
      };
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;

      if (status && ![404, 405].includes(status)) {
        break;
      }
    }
  }

  return {
    ok: false,
    error: lastError,
  };
}

function makeReportReasonLabel(reason) {
  return (
    COMMUNITY_REPORT_REASONS.find((item) => item.value === reason)?.label ||
    "Lý do khác"
  );
}

function createReportId(prefix = "report") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeCommunityContent(content = "") {
  return String(content || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function evaluateCommunityContent(content = "") {
  const normalized = normalizeCommunityContent(content);

  if (!normalized) {
    return {
      blocked: false,
      category: null,
      maskedText: "",
    };
  }

  const matchedRule = OUTGOING_BLOCK_PATTERNS.find((rule) =>
    rule.regex.test(normalized),
  );

  return {
    blocked: !!matchedRule,
    category: matchedRule?.label || null,
    maskedText: matchedRule ? COMMUNITY_MASKED_MESSAGE_TEXT : normalized,
  };
}

export async function getCommunityTermsState() {
  const { value: saved } = await readScopedJson(STORAGE_KEYS.terms, null, {
    legacyResolver: resolveLegacyTermsState,
  });

  if (!saved) {
    return {
      version: COMMUNITY_TERMS_VERSION,
      acceptedAt: null,
      accepted: false,
      source: null,
      userId: null,
    };
  }

  return {
    ...saved,
    accepted:
      saved?.version === COMMUNITY_TERMS_VERSION && Boolean(saved?.acceptedAt),
  };
}

export async function hasAcceptedCommunityTerms() {
  const state = await getCommunityTermsState();
  return !!state.accepted;
}

export async function acceptCommunityTerms({
  source = "manual",
  userId = null,
} = {}) {
  const scope = await getCommunityScope(userId);
  const nextState = {
    version: COMMUNITY_TERMS_VERSION,
    acceptedAt: new Date().toISOString(),
    accepted: true,
    source,
    userId: scope.userId,
  };

  await writeScopedJson(STORAGE_KEYS.terms, nextState, {
    userId: scope.userId,
  });
  return nextState;
}

export async function getBlockedUsers() {
  const { value: items } = await readScopedJson(STORAGE_KEYS.blockedUsers, []);
  return Array.isArray(items) ? items : [];
}

export async function getBlockedUserIds() {
  const blockedUsers = await getBlockedUsers();
  return blockedUsers.map((item) => normalizeId(item?.userId)).filter(Boolean);
}

export async function isUserBlocked(userId) {
  const blockedIds = await getBlockedUserIds();
  return blockedIds.includes(normalizeId(userId));
}

export async function getCommunityReports({ limit = 20 } = {}) {
  const { value: items } = await readScopedJson(STORAGE_KEYS.reports, []);
  const normalized = Array.isArray(items) ? items : [];
  return normalized.slice(0, limit);
}

export async function submitCommunityReport(payload = {}) {
  const scope = await getCommunityScope();
  const targetUserId = normalizeId(payload?.targetUserId);
  const reportPayload = {
    reportId: createReportId("ugc"),
    kind: payload?.kind || "message",
    reason: payload?.reason || "other",
    reasonLabel: makeReportReasonLabel(payload?.reason || "other"),
    notes: payload?.notes?.trim() || "",
    clubId: payload?.clubId || null,
    messageId: payload?.messageId || null,
    messageContent: payload?.messageContent || "",
    targetUserId: targetUserId || null,
    targetUserName: payload?.targetUserName || "Người dùng",
    createdAt: new Date().toISOString(),
    source: payload?.source || "app",
    reporterUserId: scope.userId,
  };

  const remote = await tryRemoteRequest([
    {
      method: "post",
      url: "/moderation/reports",
      data: reportPayload,
    },
    {
      method: "post",
      url: "/ugc/reports",
      data: reportPayload,
    },
  ]);

  const nextReport = {
    ...reportPayload,
    syncedRemote: remote.ok,
    pendingSync: !remote.ok,
    status: remote.ok ? "submitted" : "queued",
    remoteEndpoint: remote.endpoint || null,
  };

  const reports = await getCommunityReports({ limit: 100 });
  await writeScopedJson(
    STORAGE_KEYS.reports,
    [nextReport, ...reports].slice(0, 100),
    {
      userId: scope.userId,
    },
  );

  return nextReport;
}

export async function reportChatMessage({
  clubId,
  messageId,
  messageContent,
  targetUserId,
  targetUserName,
  reason,
  notes,
  source = "chat_message",
} = {}) {
  return submitCommunityReport({
    kind: "message",
    clubId,
    messageId,
    messageContent,
    targetUserId,
    targetUserName,
    reason,
    notes,
    source,
  });
}

export async function reportChatUser({
  clubId,
  targetUserId,
  targetUserName,
  reason,
  notes,
  source = "chat_user",
} = {}) {
  return submitCommunityReport({
    kind: "user",
    clubId,
    targetUserId,
    targetUserName,
    reason,
    notes,
    source,
  });
}

export async function blockCommunityUser({
  clubId = null,
  userId,
  fullName,
  reason = "hate_or_harassment",
  messageId = null,
  notifyDeveloper = true,
  source = "chat_block",
} = {}) {
  const normalizedUserId = normalizeId(userId);
  if (!normalizedUserId) {
    throw new Error("Thiếu userId để chặn người dùng.");
  }

  const scope = await getCommunityScope();
  const existingUsers = await getBlockedUsers();
  const existingItem = existingUsers.find(
    (item) => normalizeId(item?.userId) === normalizedUserId,
  );

  const remote = await tryRemoteRequest([
    {
      method: "post",
      url: "/moderation/blocks",
      data: {
        clubId,
        userId: normalizedUserId,
        fullName: fullName || "Người dùng",
        reason,
        messageId,
        source,
      },
    },
    {
      method: "post",
      url: `/users/${normalizedUserId}/block`,
      data: {
        clubId,
        reason,
        messageId,
        source,
      },
    },
  ]);

  const blockedItem = {
    userId: normalizedUserId,
    fullName: fullName || existingItem?.fullName || "Người dùng",
    clubId: clubId || existingItem?.clubId || null,
    blockedAt: existingItem?.blockedAt || new Date().toISOString(),
    reason,
    source,
    pendingSync: !remote.ok,
    remoteEndpoint: remote.endpoint || null,
  };

  const nextBlockedUsers = [
    blockedItem,
    ...existingUsers.filter(
      (item) => normalizeId(item?.userId) !== normalizedUserId,
    ),
  ];

  await writeScopedJson(STORAGE_KEYS.blockedUsers, nextBlockedUsers, {
    userId: scope.userId,
  });

  if (notifyDeveloper) {
    await reportChatUser({
      clubId,
      targetUserId: normalizedUserId,
      targetUserName: blockedItem.fullName,
      reason,
      notes: "Người dùng này đã bị chặn từ ứng dụng và cần moderator xem xét.",
      source: "block_action",
    });
  }

  return blockedItem;
}

export async function unblockCommunityUser(userId) {
  const normalizedUserId = normalizeId(userId);
  if (!normalizedUserId) return [];

  const scope = await getCommunityScope();
  await tryRemoteRequest([
    {
      method: "delete",
      url: `/moderation/blocks/${normalizedUserId}`,
    },
    {
      method: "delete",
      url: `/users/${normalizedUserId}/block`,
    },
  ]);

  const existingUsers = await getBlockedUsers();
  const nextUsers = existingUsers.filter(
    (item) => normalizeId(item?.userId) !== normalizedUserId,
  );

  await writeScopedJson(STORAGE_KEYS.blockedUsers, nextUsers, {
    userId: scope.userId,
  });
  return nextUsers;
}

export function getMaskedCommunityContent(content = "") {
  return evaluateCommunityContent(content).maskedText;
}

export function isCommunityContentBlocked(content = "") {
  return evaluateCommunityContent(content).blocked;
}

export function getSafeCommunityText(content = "", fallbackText = "") {
  const normalized = String(content || "").trim();

  if (!normalized) {
    return fallbackText;
  }

  return evaluateCommunityContent(normalized).maskedText || fallbackText;
}

export function getSafeCommunityHtml(html = "", fallbackHtml = "") {
  const normalized = String(html || "").trim();

  if (!normalized) {
    return fallbackHtml;
  }

  const plainText = normalizeCommunityContent(normalized);

  if (!plainText) {
    return fallbackHtml;
  }

  if (evaluateCommunityContent(plainText).blocked) {
    return `<p>${COMMUNITY_MASKED_MESSAGE_TEXT}</p>`;
  }

  return normalized;
}

export function getCommunityReasonLabel(reason) {
  return makeReportReasonLabel(reason);
}
