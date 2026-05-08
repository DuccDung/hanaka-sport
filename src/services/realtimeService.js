import { WS_BASE_URL } from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

let ws = null;
let reconnectTimer = null;
let manualClose = false;

const listeners = new Set();

// Tournament notification unread count
let tournamentUnreadCount = 0;

// Pair request notifications storage
const PAIR_NOTIFICATIONS_KEY = "pair_request_notifications";
const DISMISSED_NOTIFICATIONS_KEY = "dismissed_pair_requests";

async function loadUnreadCount() {
  try {
    const saved = await AsyncStorage.getItem("tournament_unread_count");
    if (saved) tournamentUnreadCount = parseInt(saved, 10) || 0;
  } catch {}
}

async function saveUnreadCount() {
  try {
    await AsyncStorage.setItem("tournament_unread_count", String(tournamentUnreadCount));
  } catch {}
}

async function _getPairRequestNotifications() {
  try {
    const saved = await AsyncStorage.getItem(PAIR_NOTIFICATIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

async function _savePairRequestNotifications(notifications) {
  try {
    await AsyncStorage.setItem(PAIR_NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch {}
}

async function _addPairRequestNotification(notification) {
  const notifications = await _getPairRequestNotifications();
  // Avoid duplicates by notification ID or pairRequestId
  const exists = notifications.some(
    (n) => n.NotificationId === notification.NotificationId || n.PairRequestId === notification.PairRequestId
  );
  if (!exists) {
    notifications.unshift(notification);
    await _savePairRequestNotifications(notifications);
  }
  return notifications;
}

async function _markPairRequestNotificationShown(pairRequestId) {
  const notifications = await _getPairRequestNotifications();
  const updated = notifications.map((n) => (n.PairRequestId === pairRequestId ? { ...n, shown: true } : n));
  await _savePairRequestNotifications(updated);
}

async function _removePairRequestNotification(notificationId) {
  const notifications = await _getPairRequestNotifications();
  const filtered = notifications.filter((n) => n.NotificationId !== notificationId);
  await _savePairRequestNotifications(filtered);
  return filtered;
}

async function _getDismissedNotifications() {
  try {
    const saved = await AsyncStorage.getItem(DISMISSED_NOTIFICATIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

async function _dismissNotification(notificationId) {
  const dismissed = await _getDismissedNotifications();
  if (!dismissed.includes(notificationId)) {
    dismissed.push(notificationId);
    await AsyncStorage.setItem(DISMISSED_NOTIFICATIONS_KEY, JSON.stringify(dismissed));
  }
}

async function _isNotificationDismissed(notificationId) {
  const dismissed = await _getDismissedNotifications();
  return dismissed.includes(notificationId);
}

// Clear all shown notifications (when user opens PairRequestManagement)
async function _clearPairRequestNotifications() {
  try {
    await AsyncStorage.removeItem(PAIR_NOTIFICATIONS_KEY);
  } catch {}
}

loadUnreadCount();

function emit(event) {
  listeners.forEach((cb) => {
    try {
      cb(event);
    } catch (e) {
      console.log("realtime listener error", e);
    }
  });
}

export function addRealtimeListener(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function connectRealtime(token) {
  if (!token) return;
  if (
    ws &&
    (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  manualClose = false;

  const baseWsUrl = `${WS_BASE_URL}/ws`;
  const url = `${baseWsUrl}?access_token=${encodeURIComponent(token)}`;

  ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("ws connected");
    emit({ type: "__socket_open__" });
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("WS raw message type:", data.type);

      // Handle tournament notifications
      if (data.type === "tournament.notification") {
        console.log("✅ Processing tournament notification");
        const payload = data.payload;
        const { NotificationType, Title, Body, PairRequestId, TournamentId, Details } = payload;
        console.log("NotificationType:", NotificationType);

        // Increment unread count
        tournamentUnreadCount++;
        saveUnreadCount();

        // If it's a PAIR_REQUEST or related, store it and emit specific event for popup
        if (["PAIR_REQUEST", "PAIR_ACCEPTED", "PAIR_REJECTED", "PAIR_CANCELED", "PAIR_EXPIRED"].includes(NotificationType)) {
          const notification = {
            NotificationId: payload.NotificationId,
            PairRequestId: PairRequestId,
            TournamentId: TournamentId,
            Title: Title,
            Body: Body,
            Details: Details,
            NotificationType: NotificationType,
            ReceivedAt: new Date().toISOString(),
            shown: false,
          };
          _addPairRequestNotification(notification).then(() => {
            console.log("Emitted new_pair_request event with notification:", notification);
            emit({
              type: "new_pair_request",
              notification,
            });
          });
        }

        // Emit general tournament notification event
        emit({
          type: "tournament_notification",
          notificationType: NotificationType,
          title: Title,
          body: Body,
          pairRequestId: PairRequestId,
          tournamentId: TournamentId,
          payload,
        });
      }

      emit(data);
    } catch (e) {
      console.log("ws parse error", e);
    }
  };

  ws.onerror = (error) => {
    console.log("ws error", error?.message || error);
  };

  ws.onclose = () => {
    console.log("ws closed");
    emit({ type: "__socket_close__" });

    ws = null;

    if (!manualClose) {
      clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(() => {
        connectRealtime(token);
      }, 3000);
    }
  };
}

export function disconnectRealtime() {
  manualClose = true;
  clearTimeout(reconnectTimer);

  if (ws) {
    try {
      ws.close();
    } catch {}
    ws = null;
  }
}

export function sendRealtime(data) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return false;

  ws.send(JSON.stringify(data));
  return true;
}

export function subscribeClubRoom(clubId) {
  return sendRealtime({ type: "club.subscribe", clubId });
}

export function unsubscribeClubRoom(clubId) {
  return sendRealtime({ type: "club.unsubscribe", clubId });
}

export function sendTyping(clubId, isTyping) {
  return sendRealtime({ type: "club.typing", clubId, isTyping });
}

// Tournament notification helpers
export function getTournamentUnreadCount() {
  return tournamentUnreadCount;
}

export function clearTournamentUnreadCount() {
  tournamentUnreadCount = 0;
  saveUnreadCount();
}

export function incrementTournamentUnreadCount() {
  tournamentUnreadCount++;
  saveUnreadCount();
}

// Pair request notification helpers (public API)
export async function fetchPairRequestNotifications() {
  return await _getPairRequestNotifications();
}

export async function dismissPairRequestNotification(notificationId) {
  await _dismissNotification(notificationId);
}

export async function removePairRequestNotification(notificationId) {
  return await _removePairRequestNotification(notificationId);
}

export async function clearAllPairRequestNotifications() {
  await _clearPairRequestNotifications();
}

export async function isPairRequestNotificationDismissed(notificationId) {
  return await _isNotificationDismissed(notificationId);
}

// Sync notifications from server (for offline users)
export async function savePairRequestNotifications(notifications) {
  await _savePairRequestNotifications(notifications);
}

// Check if there are any unseen pair request notifications
export async function hasUnseenPairRequests() {
  const notifications = await _getPairRequestNotifications();
  return notifications.some((n) => !n.shown);
}
