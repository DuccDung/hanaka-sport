// src/components/PairRequestNotificationManager.js
import React, { useEffect, useState, useCallback } from "react";
import { View, AppState, AppStateStatus } from "react-native";
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
      const serverNotifications = await fetchPendingPairRequests();
      console.log("Fetched pending pair requests from server:", serverNotifications);
      // Save to local storage
      await savePairRequestNotifications(serverNotifications);

      // Filter: only show if not dismissed (by NotificationId)
      const unseen = [];
      for (const n of serverNotifications) {
        const dismissed = await isPairRequestNotificationDismissed(n.NotificationId);
        console.log(`Notification ${n.NotificationId} dismissed:`, dismissed);
        if (!dismissed) {
          unseen.push(n);
        }
      }
      console.log("Unseen notifications:", unseen);
      setPendingNotifications(unseen);

      // If there's at least one unseen, show the first one
      if (unseen.length > 0 && appState === "active") {
        const first = unseen[0];
        console.log("Showing popup for notification:", first);
        setCurrentPopup({
          notification: first,
          pairRequestId: first.PairRequestId,
          notificationId: first.NotificationId
        });
      }
    } catch (e) {
      console.error("Failed to check pending notifications:", e);
    }
  }, [session, appState]);

  // Listen for realtime new pair requests
  useEffect(() => {
    const unsubscribe = addRealtimeListener((event) => {
      console.log("Realtime event received in manager:", event.type, event.notification);
      if (event.type === "new_pair_request" && session?.accessToken) {
        // A new pair request arrived via WS
        const notification = event.notification;
        setPendingNotifications((prev) => {
          // Avoid duplicate by NotificationId
          const exists = prev.some((n) => n.NotificationId === notification.NotificationId);
          if (exists) return prev;
          return [notification, ...prev];
        });
        // Show popup immediately if app is active
        if (AppState.currentState === "active") {
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

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
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
    navigation.navigate("PairRequestDetail", { pairRequestId });
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
