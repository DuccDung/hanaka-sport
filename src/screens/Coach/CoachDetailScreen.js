import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCoachDetail } from "../../services/coachService";
import { styles } from "./detailStyles";

function formatScore(v) {
  const n = Number(v || 0);
  return n % 1 === 0 ? `${n}` : n.toFixed(2).replace(/\.?0+$/, "");
}

function HtmlText({ html }) {
  const plain = String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

  if (!plain) {
    return <Text style={styles.emptyBlockText}>Chưa cập nhật</Text>;
  }

  return <Text style={styles.blockText}>{plain}</Text>;
}

export default function CoachDetailScreen({ navigation, route }) {
  const coachId = route?.params?.coachId;

  const [loading, setLoading] = useState(true);
  const [coach, setCoach] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getCoachDetail(coachId);
        setCoach(res);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "Không tải được thông tin huấn luyện viên.";
        Alert.alert("Lỗi", String(msg), [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (coachId) {
      fetchDetail();
    }
  }, [coachId, navigation]);

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.headerIconBtn}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={22} color="#1E2430" />
        </Pressable>

        <Text style={styles.headerTitle}>Thông tin HLV</Text>

        <View style={{ width: 34 }} />
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topCard}>
            {coach?.avatarUrl ? (
              <Image source={{ uri: coach.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons name="person-outline" size={40} color="#9CA3AF" />
              </View>
            )}

            <Text style={styles.name}>{coach?.fullName || "Chưa có tên"}</Text>
            <Text style={styles.city}>{coach?.city || "Chưa cập nhật"}</Text>

            <Text
              style={coach?.verified ? styles.statusGood : styles.statusBad}
            >
              {coach?.verified ? "Đã xác thực" : "Chưa xác thực"}
            </Text>
          </View>

          <View style={styles.scoreRow}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Điểm đơn</Text>
              <Text style={styles.scoreValue}>
                {formatScore(coach?.levelSingle)}
              </Text>
            </View>

            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Điểm đôi</Text>
              <Text style={styles.scoreValue}>
                {formatScore(coach?.levelDouble)}
              </Text>
            </View>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Giới thiệu</Text>
            <HtmlText html={coach?.introduction} />
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Khu vực giảng dạy</Text>
            <HtmlText html={coach?.teachingArea} />
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Thành tích</Text>
            <HtmlText html={coach?.achievements} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}
