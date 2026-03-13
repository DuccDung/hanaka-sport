import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
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

function buildPlayableSource(rawUrl = "") {
  const url = (rawUrl || "").trim();
  const ytId = getYoutubeId(url);

  if (ytId) {
    return {
      kind: "youtube-web",
      source: { uri: `https://m.youtube.com/watch?v=${ytId}` },
    };
  }

  return {
    kind: "web",
    source: { uri: url },
  };
}

function FallbackPoster({ poster, title, tournamentTitle, onOpenExternal }) {
  return (
    <ImageBackground
      source={poster ? { uri: poster } : undefined}
      style={styles.posterWrap}
      imageStyle={styles.posterImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.centerBox}>
        <Ionicons name="play-circle-outline" size={54} color="#fff" />
        <Text style={styles.posterTitle} numberOfLines={2}>
          {title || "Không phát được video trong ứng dụng"}
        </Text>

        {!!tournamentTitle && (
          <Text style={styles.posterSub} numberOfLines={1}>
            {tournamentTitle}
          </Text>
        )}

        <Text style={styles.posterDesc}>
          Không mở được video trong WebView. Bạn có thể mở bằng YouTube hoặc
          trình duyệt ngoài.
        </Text>

        <Pressable style={styles.posterBtn} onPress={onOpenExternal}>
          <Ionicons name="open-outline" size={18} color="#111" />
          <Text style={styles.posterBtnText}>Mở video bên ngoài</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

export default function VideoPlayerScreen({ route, navigation }) {
  const { title, videoUrl, poster, tournamentTitle } = route.params || {};
  const playable = useMemo(() => buildPlayableSource(videoUrl), [videoUrl]);
  const [loadError, setLoadError] = useState(false);

  const onOpenExternal = useCallback(async () => {
    if (!videoUrl) return;
    try {
      await Linking.openURL(videoUrl);
    } catch (e) {}
  }, [videoUrl]);

  const onShouldStartLoadWithRequest = useCallback((req) => {
    const nextUrl = req?.url || "";
    if (!nextUrl) return true;

    if (
      nextUrl.startsWith("fb://") ||
      nextUrl.startsWith("intent://") ||
      nextUrl.startsWith("tel:") ||
      nextUrl.startsWith("mailto:")
    ) {
      Linking.openURL(nextUrl).catch(() => {});
      return false;
    }

    return true;
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <SafeAreaView style={{ backgroundColor: "#000" }} />

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

      {!videoUrl || loadError ? (
        <FallbackPoster
          poster={poster}
          title={title}
          tournamentTitle={tournamentTitle}
          onOpenExternal={onOpenExternal}
        />
      ) : (
        <WebView
          source={playable.source}
          originWhitelist={["*"]}
          allowsFullscreenVideo
          javaScriptEnabled
          domStorageEnabled
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback
          startInLoadingState
          setSupportMultipleWindows={false}
          userAgent={
            "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
          }
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          onError={() => setLoadError(true)}
          onHttpError={() => setLoadError(true)}
          renderLoading={() => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000",
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

const styles = StyleSheet.create({
  posterWrap: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  posterImage: {
    opacity: 0.8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  centerBox: {
    width: "86%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  posterTitle: {
    marginTop: 12,
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  posterSub: {
    marginTop: 6,
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  posterDesc: {
    marginTop: 10,
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  posterBtn: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  posterBtnText: {
    color: "#111",
    fontWeight: "700",
  },
});
