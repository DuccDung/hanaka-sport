// src/screens/Tournament/TournamentScheduleScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  FlatList,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./scheduleStyles";
import { rounds, scheduleSeed } from "./data/schedule";

export default function TournamentScheduleScreen({ navigation, route }) {
  const tournament = route?.params?.tournament;
  const [roundKey, setRoundKey] = useState("r1");

  const data = useMemo(
    () => scheduleSeed.filter((x) => x.roundKey === roundKey),
    [roundKey],
  );

  const onShare = async () => {
    try {
      await Share.share({
        message: `Lịch thi đấu - ${tournament?.title ?? "Giải đấu"}`,
      });
    } catch (e) {}
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      {/* left circle */}
      <View style={styles.leftCircle}>
        <Text style={styles.leftCircleText}>{item.leftIndex}</Text>
      </View>

      {/* card */}
      <View style={styles.card}>
        <Text style={styles.cardTop}>
          {item.code} ({item.time}; Sân: {item.court})
        </Text>

        <View style={styles.teamsRow}>
          <View style={styles.teamsLeft}>
            <Text style={styles.teamText}>{item.teamA}</Text>
            <Text style={styles.teamText}>{item.teamB}</Text>
          </View>

          <View style={styles.scoresRight}>
            <Text style={styles.scoreText}>{item.scoreA}</Text>
            <Text style={styles.scoreText}>{item.scoreB}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Pressable style={styles.actionItem} hitSlop={10}>
            <Ionicons name="play-circle-outline" size={18} color="#6B7280" />
            <Text style={styles.actionText}>Xem video</Text>
          </Pressable>

          <Pressable style={styles.actionItem} hitSlop={10}>
            <Ionicons name="flag-outline" size={18} color="#111827" />
            <Text style={[styles.actionText, styles.actionTextStrong]}>
              Diễn biến
            </Text>
          </Pressable>

          <Pressable style={styles.actionItem} hitSlop={10} onPress={onShare}>
            <Ionicons name="share-social-outline" size={18} color="#6B7280" />
            <Text style={styles.actionText}>Chia sẻ</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* header */}
      <View style={styles.headerWrap}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={20} color="#1E2430" />
          </Pressable>
          <Text style={styles.headerTitle}>Lịch thi đấu</Text>

          <View style={styles.headerRight}>
            <Pressable
              style={styles.headerIconBtn}
              onPress={onShare}
              hitSlop={10}
            >
              <Ionicons name="share-social" size={20} color="#1E2430" />
            </Pressable>
          </View>
        </View>

        {/* meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <Ionicons name="git-branch-outline" size={18} color="#1E2430" />
            <Text style={styles.metaText}>Loại trực tiếp</Text>
          </View>

          <View style={styles.metaSpacer} />

          <View style={styles.metaLeft}>
            <Ionicons name="people-outline" size={18} color="#1E2430" />
            <Text style={styles.metaText}>
              <Text style={styles.metaStrong}>
                {tournament?.expectedTeams ?? 64}
              </Text>{" "}
              đội -{" "}
              <Text style={styles.metaStrong}>{tournament?.matches ?? 95}</Text>{" "}
              trận đấu
            </Text>
          </View>

          <Ionicons name="git-branch-outline" size={18} color="#1E2430" />
        </View>

        {/* tabs */}
        <View style={styles.tabsRow}>
          {rounds.map((r) => {
            const active = r.key === roundKey;
            return (
              <Pressable
                key={r.key}
                style={styles.tabBtn}
                onPress={() => setRoundKey(r.key)}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {r.label}
                </Text>
                {active ? <View style={styles.tabUnderline} /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* list */}
      <FlatList
        contentContainerStyle={styles.listPad}
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
