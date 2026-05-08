import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/config";

const AUTH_STORAGE_KEYS = [
  STORAGE_KEYS.accessToken,
  STORAGE_KEYS.expiresAtUtc,
  STORAGE_KEYS.user,
];

const ACCOUNT_CACHE_KEYS = [
  "tournament_unread_count",
  "pair_request_notifications",
  "dismissed_pair_requests",
];

const ACCOUNT_CACHE_PREFIXES = [
  "pendingPairPopupDismissed_",
  "pairRequestGuide_",
];

const COMMUNITY_STORAGE_KEYS = [
  "communityTermsState_v1",
  "communityChatTermsState_v1",
  "communityBlockedUsers_v1",
  "communityReports_v1",
];

function normalizeUserId(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function resolveUserId(sessionOrUserId) {
  if (!sessionOrUserId) return "";
  if (typeof sessionOrUserId === "string" || typeof sessionOrUserId === "number") {
    return normalizeUserId(sessionOrUserId);
  }

  return normalizeUserId(sessionOrUserId?.user?.userId ?? sessionOrUserId?.userId);
}

function shouldRemoveAccountKey(key, userId) {
  if (AUTH_STORAGE_KEYS.includes(key) || ACCOUNT_CACHE_KEYS.includes(key)) {
    return true;
  }

  if (ACCOUNT_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix))) {
    return true;
  }

  if (COMMUNITY_STORAGE_KEYS.includes(key)) {
    return true;
  }

  const scopedCommunityKey = COMMUNITY_STORAGE_KEYS.find((baseKey) =>
    key.startsWith(`${baseKey}:user:`),
  );

  if (scopedCommunityKey) {
    return !userId || key === `${scopedCommunityKey}:user:${userId}`;
  }

  return false;
}

export async function saveAuthSession({ accessToken, expiresAtUtc, user }) {
  await AsyncStorage.multiSet([
    [STORAGE_KEYS.accessToken, accessToken ?? ""],
    [STORAGE_KEYS.expiresAtUtc, expiresAtUtc ?? ""],
    [STORAGE_KEYS.user, JSON.stringify(user ?? null)],
  ]);
}

export async function getAuthSession() {
  const [[, accessToken], [, expiresAtUtc], [, userStr]] =
    await AsyncStorage.multiGet([
      STORAGE_KEYS.accessToken,
      STORAGE_KEYS.expiresAtUtc,
      STORAGE_KEYS.user,
    ]);

  if (!accessToken) {
    return {
      accessToken: null,
      expiresAtUtc: null,
      user: null,
    };
  }

  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
    user = null;
  }

  return {
    accessToken,
    expiresAtUtc: expiresAtUtc || null,
    user,
  };
}

export async function clearAuthSession() {
  await AsyncStorage.multiSet(AUTH_STORAGE_KEYS.map((key) => [key, ""]));
  await AsyncStorage.multiRemove(AUTH_STORAGE_KEYS);
}

export async function clearStoredAccountData(sessionOrUserId = null) {
  const userId = resolveUserId(sessionOrUserId);
  let keysToRemove = [...AUTH_STORAGE_KEYS, ...ACCOUNT_CACHE_KEYS];

  try {
    const allKeys = await AsyncStorage.getAllKeys();
    keysToRemove = allKeys.filter((key) => shouldRemoveAccountKey(key, userId));
  } catch {}

  const uniqueKeys = [...new Set(keysToRemove)];

  if (uniqueKeys.length === 0) return;

  await AsyncStorage.multiSet(uniqueKeys.map((key) => [key, ""]));
  await AsyncStorage.multiRemove(uniqueKeys);
}
