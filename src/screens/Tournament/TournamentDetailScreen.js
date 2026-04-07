// src/screens/Tournament/TournamentDetailScreen.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  ScrollView,
  Image,
  TextInput,
  Share,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./detailStyles";
import { publicGetTournamentDetail } from "../../services/tournamentService";

// helpers format giống screen list
function pad2(n) {
  return String(n).padStart(2, "0");
}
function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(
    d.getHours(),
  )}:${pad2(d.getMinutes())}`;
}

// map server dto -> UI model mà màn hình đang dùng
function mapDtoToUi(dto) {
  const bannerFallback =
    "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1400&q=80";

  const gameTypeLabel =
    dto?.gameType === "DOUBLE"
      ? "Đôi"
      : dto?.gameType === "SINGLE"
        ? "Đơn"
        : dto?.gameType === "MIXED"
          ? "Đôi hỗn hợp"
          : dto?.gameType || "-";

  return {
    tournamentId: dto?.tournamentId,
    title: dto?.title ?? "Chi tiết giải đấu",
    banner: dto?.bannerUrl || bannerFallback,
    dateTime: formatDateTime(dto?.startTime),
    registerDeadline: formatDateTime(dto?.registerDeadline),

    // UI đang dùng playoffType / formatText hơi lẫn — ưu tiên formatText
    playoffType: dto?.playoffType ?? "-",
    formatText: dto?.formatText ?? "-",
    gameType: gameTypeLabel,

    singleLimit: dto?.singleLimit ?? 0,
    doubleLimit: dto?.doubleLimit ?? 0,

    location: dto?.locationText ?? "-",
    expectedTeams: dto?.expectedTeams ?? 0,
    matches: dto?.matchesCount ?? 0,

    statusText: dto?.statusText ?? dto?.status ?? "-",
    stateText: dto?.stateText ?? "-",

    organizer: dto?.organizer ?? "-",
    creator: dto?.creatorName ?? "-",

    registeredCount: dto?.registeredCount ?? null,
    pairedCount: dto?.pairedCount ?? null,

    content: dto?.content ?? "",
  };
}

function InfoLine({ label, value, boldValue }) {
  return (
    <Text style={styles.line}>
      {label}:{" "}
      <Text style={[styles.value, boldValue && styles.valueBold]}>{value}</Text>
    </Text>
  );
}

export default function TournamentDetailScreen({ navigation, route }) {
  const tournamentId = route?.params?.tournamentId;
  const preview = route?.params?.preview; // optional

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [dto, setDto] = useState(null);

  // fetch detail
  const fetchDetail = useCallback(async () => {
    try {
      setErrorMsg("");
      setLoading(true);
      const res = await publicGetTournamentDetail(tournamentId);
      setDto(res);
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message ||
          e?.message ||
          "Không tải được chi tiết giải đấu.",
      );
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // t = model dùng để render UI
  const t = useMemo(() => {
    // nếu đang loading mà có preview thì show preview trước
    if (!dto && preview) return mapDtoToUi(preview);
    if (dto) return mapDtoToUi(dto);

    // fallback
    return {
      title: "Chi tiết giải đấu",
      banner:
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1400&q=80",
      dateTime: "-",
      registerDeadline: "-",
      playoffType: "-",
      formatText: "-",
      gameType: "-",
      singleLimit: "-",
      doubleLimit: "-",
      location: "-",
      expectedTeams: "-",
      matches: "-",
      statusText: "-",
      stateText: "-",
      organizer: "-",
      creator: "-",
      registeredCount: 0,
      pairedCount: 0,
      content: "",
    };
  }, [dto, preview]);

  const [content, setContent] = useState(t.content ?? "");

  // khi dto về, sync content vào state (vì bạn cho edit trong TextInput)
  useEffect(() => {
    setContent(t.content ?? "");
  }, [t.content]);

  const onShare = async () => {
    try {
      await Share.share({
        message: `${t.title}\nNgày: ${t.dateTime}\nĐịa điểm: ${t.location}`,
      });
    } catch (e) {}
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} edges={["top"]} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.headerWrap}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={20} color="#1E2430" />
          </Pressable>

          <Text style={styles.headerTitle}>Chi tiết giải đấu</Text>

          <View style={styles.headerRight}>
            <Pressable
              onPress={onShare}
              style={styles.headerIconBtn}
              hitSlop={10}
            >
              <Ionicons name="share-social" size={20} color="#1E2430" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* trạng thái load/error */}
      {loading ? (
        <View style={{ paddingTop: 12 }}>
          <ActivityIndicator />
        </View>
      ) : null}

      {errorMsg ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={{ color: "#DC2626" }}>{errorMsg}</Text>
          <Pressable onPress={fetchDetail} style={{ marginTop: 8 }}>
            <Text style={{ color: "#2563EB" }}>Thử lại</Text>
          </Pressable>
        </View>
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Image source={{ uri: t.banner }} style={styles.banner} />

        <View style={styles.body}>
          <Text style={styles.title}>{t.title}</Text>

          <View style={{ height: 8 }} />

          <InfoLine label="Ngày" value={t.dateTime} boldValue />
          <InfoLine label="Hạn đăng ký" value={t.registerDeadline} boldValue />
          <InfoLine label="Thể thức" value={t.playoffType} boldValue />
          <InfoLine label="Giải" value={t.gameType} boldValue />

          <View style={styles.twoColRow}>
            <Text style={styles.line}>
              Giới hạn trình đơn tối đa:{" "}
              <Text style={[styles.value, styles.valueBold]}>
                {t.singleLimit}
              </Text>
            </Text>

            <Text style={[styles.line, { textAlign: "right" }]}>
              Cặp tối đa:{" "}
              <Text style={[styles.value, styles.valueBold]}>
                {t.doubleLimit}
              </Text>
            </Text>
          </View>

          <InfoLine label="Địa điểm" value={t.location} boldValue />

          <View style={styles.twoColRow}>
            <Text style={styles.line}>
              Số đội dự kiến:{" "}
              <Text style={[styles.value, styles.valueBold]}>
                {t.expectedTeams}
              </Text>
            </Text>
            <Text style={[styles.line, { textAlign: "right" }]}>
              Số trận thi đấu:{" "}
              <Text style={[styles.value, styles.valueBold]}>{t.matches}</Text>
            </Text>
          </View>

          <View style={styles.twoColRow}>
            <Text style={styles.line}>
              Tình trạng:{" "}
              <Text style={[styles.value, styles.valueBold]}>
                {t.statusText}
              </Text>
            </Text>
            <Text style={[styles.line, { textAlign: "right" }]}>
              Dạng:{" "}
              <Text style={[styles.value, styles.valueBold]}>
                {t.formatText}
              </Text>
            </Text>
          </View>

          <InfoLine label="Đơn vị tổ chức" value={t.organizer} />
          <InfoLine label="Người tạo giải" value={t.creator} boldValue />
          {t.registeredCount !== null ? (
            <InfoLine
              label="Thành viên đã đăng ký"
              value={String(t.registeredCount)}
              boldValue
            />
          ) : null}

          {t.pairedCount !== null ? (
            <InfoLine
              label="Thành viên đã ghép cặp"
              value={String(t.pairedCount)}
              boldValue
            />
          ) : null}

          {/* Content */}
          <View style={{ height: 14 }} />
          <Text style={styles.sectionTitle}>Nội dung</Text>
          <View style={styles.contentBox}>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder=""
              placeholderTextColor="#9CA3AF"
              style={styles.contentInput}
            />
          </View>

          {/* Manager */}
          <View style={{ height: 16 }} />
          <Text style={styles.sectionCaps}>QUẢN LÝ GIẢI ĐẤU</Text>

          <View style={styles.actionsGrid}>
            <Pressable
              style={styles.actionBtn}
              onPress={() =>
                navigation.navigate("TournamentRegistration", { tournament: t })
              }
            >
              <Ionicons name="list" size={16} color="#1E2430" />
              <Text style={styles.actionText}>Danh sách đăng ký</Text>
            </Pressable>

            <Pressable
              style={styles.actionBtn}
              onPress={() =>
                navigation.navigate("TournamentRule", {
                  tournamentId: t.tournamentId,
                  title: "Thể lệ giải",
                })
              }
            >
              <Ionicons name="hammer" size={16} color="#1E2430" />
              <Text style={styles.actionText}>Thể lệ giải</Text>
            </Pressable>

            <Pressable
              style={styles.actionBtn}
              onPress={() =>
                navigation.navigate("TournamentSchedule", { tournament: t })
              }
            >
              <Ionicons name="calendar" size={16} color="#1E2430" />
              <Text style={styles.actionText}>Lịch thi đấu</Text>
            </Pressable>

            <Pressable
              style={styles.actionBtn}
              onPress={() =>
                navigation.navigate("TournamentStandings", { tournament: t })
              }
            >
              <Ionicons name="stats-chart" size={16} color="#1E2430" />
              <Text style={styles.actionText}>Bảng xếp hạng</Text>
            </Pressable>
          </View>

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>
    </View>
  );
}
