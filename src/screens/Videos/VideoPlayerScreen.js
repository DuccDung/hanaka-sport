import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

function getYoutubeId(url = "") {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2];
    if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2];
  } catch (e) {}
  return null;
}

function buildPlayableUrl(rawUrl = "") {
  const url = (rawUrl || "").trim();

  const ytId = getYoutubeId(url);
  if (ytId) {
    return {
      kind: "youtube",
      url: `https://www.youtube.com/embed/${ytId}?autoplay=1&playsinline=1`,
    };
  }

  return { kind: "web", url };
}

export default function VideoPlayerScreen({ route, navigation }) {
  const { title, videoUrl } = route.params || {};
  const playable = useMemo(() => buildPlayableUrl(videoUrl), [videoUrl]);
  const [loadError, setLoadError] = useState(false);

  const onOpenExternal = useCallback(async () => {
    if (!videoUrl) return;
    try {
      await Linking.openURL(videoUrl);
    } catch (e) {}
  }, [videoUrl]);

  // Một số trang (đặc biệt Facebook) redirect hoặc mở link ngoài:
  const onShouldStartLoadWithRequest = useCallback(
    (req) => {
      const nextUrl = req?.url || "";
      if (!nextUrl) return true;

      // Chặn các scheme lạ
      if (
        nextUrl.startsWith("fb://") ||
        nextUrl.startsWith("intent://") ||
        nextUrl.startsWith("tel:") ||
        nextUrl.startsWith("mailto:")
      ) {
        Linking.openURL(nextUrl).catch(() => {});
        return false;
      }

      // Nếu đang xem YouTube embed thì cho phép
      if (playable.kind === "youtube") return true;

      // Nếu facebook chuyển qua URL khác, vẫn cho phép load trong WebView;
      // trường hợp không play được sẽ rơi vào onError -> fallback.
      return true;
    },
    [playable.kind],
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <SafeAreaView style={{ backgroundColor: "#000" }} />

      {/* Header */}
      <View
        style={{
          height: 52,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.12)",
        }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={{ padding: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>

        <Text
          style={{ color: "#fff", fontSize: 14, fontWeight: "700", flex: 1 }}
          numberOfLines={1}
        >
          {title || "Xem video"}
        </Text>

        <Pressable onPress={onOpenExternal} hitSlop={10} style={{ padding: 8 }}>
          <Ionicons name="open-outline" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Body */}
      {!videoUrl ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <Text style={{ color: "#fff", opacity: 0.85 }}>
            Không có link video.
          </Text>
        </View>
      ) : loadError ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            gap: 10,
          }}
        >
          <Ionicons name="alert-circle-outline" size={28} color="#fff" />
          <Text style={{ color: "#fff", opacity: 0.9, textAlign: "center" }}>
            Video không mở được trong WebView (thường gặp với Facebook
            Live/share). Bạn có thể mở bằng app/trình duyệt.
          </Text>

          <Pressable
            onPress={onOpenExternal}
            style={{
              marginTop: 6,
              backgroundColor: "#fff",
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#111", fontWeight: "700" }}>
              Mở bằng app/trình duyệt
            </Text>
          </Pressable>
        </View>
      ) : (
        <WebView
          source={{ uri: playable.url }}
          originWhitelist={["*"]}
          allowsFullscreenVideo
          javaScriptEnabled
          domStorageEnabled
          mediaPlaybackRequiresUserAction={false}
          startInLoadingState
          setSupportMultipleWindows={false}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          onError={() => setLoadError(true)}
          onHttpError={() => setLoadError(true)}
          renderLoading={() => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator />
              <Text style={{ color: "#fff", marginTop: 10, opacity: 0.8 }}>
                Đang tải video...
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
