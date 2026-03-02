// src/screens/Tournament/TournamentDetailScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  ScrollView,
  Image,
  TextInput,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./detailStyles";

function InfoLine({ label, value, boldValue }) {
  return (
    <Text style={styles.line}>
      {label}:{" "}
      <Text style={[styles.value, boldValue && styles.valueBold]}>{value}</Text>
    </Text>
  );
}

export default function TournamentDetailScreen({ navigation, route }) {
  const tournament = route?.params?.tournament;

  const t = useMemo(() => {
    // fallback an toàn nếu quên truyền params
    return (
      tournament ?? {
        title: "Chi tiết giải đấu",
        banner:
          "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1400&q=80",
        dateTime: "-",
        registerDeadline: "-",
        playoffType: "-",
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
      }
    );
  }, [tournament]);

  const [content, setContent] = useState(t.content ?? "");

  const onShare = async () => {
    try {
      await Share.share({
        message: `${t.title}\nNgày: ${t.dateTime}\nĐịa điểm: ${t.location}`,
      });
    } catch (e) {}
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Image source={{ uri: t.banner }} style={styles.banner} />

        <View style={styles.body}>
          <Text style={styles.title}>{t.title}</Text>

          <View style={{ height: 8 }} />

          <InfoLine label="Ngày" value={t.dateTime} boldValue />
          <InfoLine label="Hạn đăng ký" value={t.registerDeadline} boldValue />
          <InfoLine
            label="Thể thức"
            value={t.playoffType ?? t.format}
            boldValue
          />
          <InfoLine
            label="Giải"
            value={t.gameType ?? (t.format === "Đôi" ? "Đôi" : "Đơn")}
            boldValue
          />

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
                {t.stateText}
              </Text>
            </Text>
          </View>

          <InfoLine label="Đơn vị tổ chức" value={t.organizer} />
          <InfoLine label="Người tạo giải" value={t.creator} boldValue />
          <InfoLine
            label="Thành viên đã đăng ký"
            value={t.registeredCount}
            boldValue
          />
          <InfoLine
            label="Thành viên đã ghép cặp"
            value={t.pairedCount}
            boldValue
          />

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

            <Pressable style={styles.actionBtn}>
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
