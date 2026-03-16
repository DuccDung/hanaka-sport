import { WS_BASE_URL } from "../constants/config";
let ws = null;
let reconnectTimer = null;
let manualClose = false;

const listeners = new Set();

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
