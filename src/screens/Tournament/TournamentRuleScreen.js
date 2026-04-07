import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";
import { styles } from "./detailStyles";
import { getTournamentRule } from "../../services/tournamentService";

function normalizeHtml(html) {
  if (!html) return "";
  const cleaned = String(html).trim();

  if (!cleaned || cleaned === "<p><br></p>") {
    return "";
  }

  return cleaned;
}

export default function TournamentRuleScreen({ navigation, route }) {
  const tournamentId = route?.params?.tournamentId;
  const fallbackTitle = route?.params?.title ?? "Thể lệ giải";

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [ruleData, setRuleData] = useState(null);

  const { width } = useWindowDimensions();

  const fetchRule = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await getTournamentRule(tournamentId);
      setRuleData(res);
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message ||
          e?.message ||
          "Không tải được thể lệ giải.",
      );
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchRule();
  }, [fetchRule]);

  const title = ruleData?.title || fallbackTitle;
  const ruleHtml = normalizeHtml(ruleData?.tournamentRule);
  const hasRule = !!ruleHtml;

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} edges={["top"]} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.headerWrap}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={20} color="#1E2430" />
          </Pressable>

          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      {loading ? (
        <View style={{ paddingTop: 16 }}>
          <ActivityIndicator />
        </View>
      ) : null}

      {errorMsg ? (
        <View style={{ padding: 16 }}>
          <Text style={{ color: "#DC2626" }}>{errorMsg}</Text>
        </View>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#E5E7EB",
            borderRadius: 12,
            padding: 14,
          }}
        >
          {!loading && !errorMsg && !hasRule ? (
            <Text
              style={{
                fontSize: 14,
                lineHeight: 22,
                color: "#1E2430",
              }}
            >
              Chưa có thể lệ giải.
            </Text>
          ) : null}

          {hasRule ? (
            <RenderHtml
              contentWidth={width - 52}
              source={{ html: ruleHtml }}
              tagsStyles={{
                body: {
                  color: "#1E2430",
                  fontSize: 14,
                  lineHeight: 22,
                },
                p: {
                  color: "#1E2430",
                  fontSize: 14,
                  lineHeight: 22,
                  marginTop: 0,
                  marginBottom: 10,
                },
                h1: {
                  fontSize: 24,
                  lineHeight: 30,
                  fontWeight: "700",
                  color: "#111827",
                  marginTop: 0,
                  marginBottom: 12,
                },
                h2: {
                  fontSize: 20,
                  lineHeight: 26,
                  fontWeight: "700",
                  color: "#111827",
                  marginTop: 8,
                  marginBottom: 10,
                },
                h3: {
                  fontSize: 17,
                  lineHeight: 24,
                  fontWeight: "700",
                  color: "#111827",
                  marginTop: 8,
                  marginBottom: 8,
                },
                strong: {
                  fontWeight: "700",
                  color: "#111827",
                },
                em: {
                  fontStyle: "italic",
                },
                ul: {
                  marginTop: 0,
                  marginBottom: 10,
                  paddingLeft: 8,
                },
                ol: {
                  marginTop: 0,
                  marginBottom: 10,
                  paddingLeft: 8,
                },
                li: {
                  color: "#1E2430",
                  fontSize: 14,
                  lineHeight: 22,
                  marginBottom: 6,
                },
                blockquote: {
                  borderLeftWidth: 4,
                  borderLeftColor: "#D1D5DB",
                  paddingLeft: 12,
                  color: "#4B5563",
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 8,
                  marginBottom: 8,
                },
                a: {
                  color: "#2563EB",
                  textDecorationLine: "underline",
                },
              }}
            />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
