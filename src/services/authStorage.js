import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/config";

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

  return {
    accessToken: accessToken || null,
    expiresAtUtc: expiresAtUtc || null,
    user: userStr ? JSON.parse(userStr) : null,
  };
}

export async function clearAuthSession() {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.accessToken,
    STORAGE_KEYS.expiresAtUtc,
    STORAGE_KEYS.user,
  ]);
}
