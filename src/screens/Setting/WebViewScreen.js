import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  ActivityIndicator,
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
        <WebView
          source={{ uri: url }}
          startInLoadingState
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />

        {loading && (
          <View style={styles.webViewLoading}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
