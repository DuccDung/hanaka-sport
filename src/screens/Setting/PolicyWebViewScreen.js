import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

export default function PolicyWebViewScreen({ navigation, route }) {
  const { url, title } = route.params || {};
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View
        style={{
          height: 56,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          backgroundColor: "#fff",
        }}
      >
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </Pressable>

        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 17,
            fontWeight: "600",
            color: "#111827",
            marginRight: 22,
          }}
          numberOfLines={1}
        >
          {title || "Chính sách"}
        </Text>
      </View>

      {loading ? (
        <View
          style={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : null}

      <WebView
        source={{ uri: url }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
      />
    </SafeAreaView>
  );
}
