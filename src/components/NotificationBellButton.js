import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import { useAuth } from "../context/AuthContext";
import { getNotificationBadgeCount } from "../services/notificationService";
import { addRealtimeListener } from "../services/realtimeService";

export default function NotificationBellButton({
  onPress,
  size = 22,
  color = "#fff",
  style,
  hitSlop = 10,
}) {
  const isFocused = useIsFocused();
  const { session } = useAuth();
  const [count, setCount] = useState(0);

  const refreshBadgeCount = useCallback(async () => {
    if (!session?.accessToken) {
      setCount(0);
      return;
    }

    try {
      const nextCount = await getNotificationBadgeCount();
      setCount(Number.isFinite(nextCount) ? nextCount : 0);
    } catch {
      setCount(0);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (!isFocused) return;
    refreshBadgeCount();
  }, [isFocused, refreshBadgeCount]);

  useEffect(() => {
    if (!isFocused || !session?.accessToken) return;

    const removeListener = addRealtimeListener((event) => {
      if (
        event?.type === "tournament.notification" ||
        event?.type === "__socket_open__"
      ) {
        refreshBadgeCount();
      }
    });

    return removeListener;
  }, [isFocused, refreshBadgeCount, session?.accessToken]);

  const badgeText = count > 99 ? "99+" : String(count);

  return (
    <Pressable style={[styles.button, style]} onPress={onPress} hitSlop={hitSlop}>
      <Ionicons name="notifications-outline" size={size} color={color} />

      {count > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
});
