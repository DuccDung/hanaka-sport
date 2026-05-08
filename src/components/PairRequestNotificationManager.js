// src/components/PairRequestNotificationManager.js
import React, { useEffect, useState, useCallback } from "react";
import { View, AppState } from "react-native";
import PairRequestNotificationPopup from "./PairRequestNotificationPopup";
import {
  addRealtimeListener,
  isPairRequestNotificationDismissed,
  dismissPairRequestNotification,
  removePairRequestNotification,
  savePairRequestNotifications,
} from "../services/realtimeService";
import { useAuth } from "../context/AuthContext";
import { fetchPendingPairRequests } from "../services/tournamentService";

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function normalizePairNotification(raw = {}) {
  const details = raw.Details ?? raw.details ?? {};
  const pairRequestId = firstValue(
    raw.PairRequestId,
    raw.pairRequestId,
    details.PairRequestId,
    details.pairRequestId,
  );

  return {
    ...raw,
    NotificationId: firstValue(raw.NotificationId, raw.notificationId, raw.id, pairRequestId),
    PairRequestId: pairRequestId,
    TournamentId: firstValue(
      raw.TournamentId,
      raw.tournamentId,
      details.TournamentId,
      details.tournamentId,
    ),
    Title: firstValue(raw.Title, raw.title),
    Body: firstValue(raw.Body, raw.body, raw.message),
    Details: details,
    NotificationType:
      firstValue(raw.NotificationType, raw.notificationType, raw.type) ||
      "PAIR_REQUEST",
    ReceivedAt: firstValue(raw.ReceivedAt, raw.receivedAt, raw.createdAt, new Date().toISOString()),
  };
}

export default function PairRequestNotificationManager({ navigation }) {
  const { session } = useAuth();
  const [pendingNotifications, setPendingNotifications] = useState([]);
  const [currentPopup, setCurrentPopup] = useState(null); // { notification, pairRequestId }
  const [appState, setAppState] = useState(AppState.currentState);

  // Fetch pending notifications from server and local storage
  const checkPendingNotifications = useCallback(async () => {
    if (!session?.accessToken) return;

    try {
      console.log("Checking pending notifications...");
      // Sync with server to get latest pending notifications
      const serverNotifications = (await fetchPendingPairRequests()).map(normalizePairNotification);
      console.log("Fetched pending pair requests from server:", serverNotifications);
      // Save to local storage
      await savePairRequestNotifications(serverNotifications);

      // Filter: only show if not dismissed (by NotificationId)
      const unseen = [];
      for (const n of serverNotifications) {
        const dismissed = await isPairRequestNotificationDismissed(n.NotificationId);
        console.log(`Notification ${n.NotificationId} from server, dismissed:`, dismissed);
        if (!dismissed) {
          unseen.push(n);
        }
      }
      console.log("Unseen notifications:", unseen);
      setPendingNotifications(unseen);

      // If there's at least one unseen, show the first one
      // Note: This function is called only when app is active (on mount or foreground)
      if (unseen.length > 0) {
        const first = unseen[0];
        console.log("Showing popup for first unseen notification:", first);
        setCurrentPopup({
          notification: first,
          pairRequestId: first.PairRequestId,
          notificationId: first.NotificationId
        });
      }
    } catch (e) {
      console.error("Failed to check pending notifications:", e);
    }
  }, [session]);

  // Listen for realtime new pair requests
  useEffect(() => {
    const unsubscribe = addRealtimeListener(async (event) => {
      console.log("Realtime event received in manager:", event.type, event.notification);
      if (event.type === "new_pair_request" && session?.accessToken) {
        // A new pair request arrived via WS
        const notification = normalizePairNotification(event.notification);
        console.log("Processing new_pair_request:", notification.NotificationId, notification.PairRequestId);

        // Check if this notification is dismissed before showing
        const isDismissed = await isPairRequestNotificationDismissed(notification.NotificationId);
        console.log(`Notification ${notification.NotificationId} dismissed:`, isDismissed);

        // Update pending notifications state - only add if not dismissed
        setPendingNotifications((prev) => {
          const exists = prev.some((n) => n.NotificationId === notification.NotificationId);
          if (exists) return prev;

          // Only add to list if not dismissed
          if (!isDismissed) {
            console.log("Adding notification to pending list and showing popup");
            return [notification, ...prev];
          } else {
            console.log("Notification is dismissed, NOT showing popup");
            return prev;
          }
        });

        // Show popup immediately only if app is active AND notification not dismissed
        if (AppState.currentState === "active" && !isDismissed) {
          console.log("App active, showing popup for notification:", notification);
          setCurrentPopup({
            notification,
            pairRequestId: notification.PairRequestId,
            notificationId: notification.NotificationId
          });
        }
      }
    });

    return unsubscribe;
  }, [session]);

  // Check on mount and when app comes to foreground
  useEffect(() => {
    checkPendingNotifications();

    const handleAppStateChange = (nextAppState) => {
      setAppState(nextAppState);
      if (nextAppState === "active" && session?.accessToken) {
        // App came to foreground - check for pending notifications
        checkPendingNotifications();
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [session, checkPendingNotifications]);

  const handleClosePopup = useCallback(async (notificationId) => {
    setCurrentPopup(null);
    // Mark as dismissed so we don't show again
    if (notificationId) {
      await dismissPairRequestNotification(notificationId);
      // Remove from pending list
      setPendingNotifications((prev) => prev.filter((n) => n.NotificationId !== notificationId));
    }
  }, []);

  const handleNavigateToDetail = useCallback((pairRequestId) => {
    setCurrentPopup(null);

    const routeNames = navigation?.getState?.()?.routeNames || [];
    if (routeNames.includes("PairRequestDetail")) {
      navigation.navigate("PairRequestDetail", { pairRequestId });
      return;
    }

    navigation.navigate("Home", {
      screen: "PairRequestDetail",
      params: { pairRequestId },
    });
  }, [navigation]);

  return (
    <View style={{ flex: 0 }}>
      {currentPopup && (
        <PairRequestNotificationPopup
          visible={!!currentPopup}
          notification={currentPopup.notification}
          onClose={() => handleClosePopup(currentPopup.notificationId)}
          onNavigate={(pairRequestId) => handleNavigateToDetail(pairRequestId)}
        />
      )}
    </View>
  );
}
