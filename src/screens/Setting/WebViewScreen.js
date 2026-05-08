import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";

import { COLORS } from "../../constants/colors";
import { styles } from "./styles";

export default function WebViewScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { title = "Chi tiết", url = "https://example.com" } =
    route.params || {};
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const pageUrl = String(url || "").trim();

  const handleRetry = () => {
    setLoadError(null);
    setLoading(true);
    setReloadKey((value) => value + 1);
  };

  return (
    <SafeAreaView style={styles.webViewSafe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />

      <View style={styles.webViewHeader}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.webViewBackBtn}
        >
          <Ionicons name="chevron-back" size={24} color="#1E2430" />
        </Pressable>

        <Text style={styles.webViewHeaderTitle} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.webViewHeaderRight} />
      </View>

      <View style={styles.webViewContainer}>
        {!!pageUrl && (
          <WebView
            key={reloadKey}
            style={styles.webView}
            source={{ uri: pageUrl }}
            originWhitelist={["*"]}
            startInLoadingState
            javaScriptEnabled
            domStorageEnabled
            mixedContentMode="always"
            setSupportMultipleWindows={false}
            onLoadStart={() => {
              setLoadError(null);
              setLoading(true);
            }}
            onLoadEnd={() => setLoading(false)}
            onError={({ nativeEvent }) => {
              setLoading(false);
              setLoadError(nativeEvent?.description || "Không thể tải trang.");
            }}
            onHttpError={({ nativeEvent }) => {
              setLoading(false);
              setLoadError(`HTTP ${nativeEvent?.statusCode || ""}`.trim());
            }}
          />
        )}

        {loading && (
          <View style={styles.webViewLoading}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          </View>
        )}

        {!!loadError && (
          <View style={styles.webViewError}>
            <Ionicons name="warning-outline" size={36} color="#EF4444" />
            <Text style={styles.webViewErrorTitle}>Không tải được trang</Text>
            <Text style={styles.webViewErrorMessage}>{loadError}</Text>
            <Text style={styles.webViewErrorUrl} numberOfLines={2}>
              {pageUrl}
            </Text>

            <View style={styles.webViewErrorActions}>
              <Pressable style={styles.webViewRetryBtn} onPress={handleRetry}>
                <Text style={styles.webViewRetryText}>Thử lại</Text>
              </Pressable>

              <Pressable
                style={styles.webViewOpenBtn}
                onPress={() => Linking.openURL(pageUrl)}
              >
                <Text style={styles.webViewOpenText}>Mở trình duyệt</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
