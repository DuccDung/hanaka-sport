// src/screens/Tournament/TournamentScheduleScreen.js
import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  FlatList,
  Share,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./scheduleStyles";
import { rounds, scheduleSeed } from "./data/schedule";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function groupByTable(matches) {
  // group by tableNo
  const map = new Map();
  for (const m of matches) {
    const key = String(m.tableNo ?? 1);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(m);
  }

  // sort tables by number
  const tables = Array.from(map.entries())
    .map(([tableKey, items]) => ({
      id: `table-${tableKey}`,
      tableNo: Number(tableKey),
      items: items.sort((a, b) => (a.leftIndex ?? 0) - (b.leftIndex ?? 0)),
    }))
    .sort((a, b) => a.tableNo - b.tableNo);

  return tables;
}

export default function TournamentScheduleScreen({ navigation, route }) {
  const tournament = route?.params?.tournament;
  const [roundKey, setRoundKey] = useState("r1");

  // tree expand/collapse state per table
  const [openMap, setOpenMap] = useState({}); // { [tableNo]: boolean }

  const tables = useMemo(() => {
    const matches = scheduleSeed.filter((x) => x.roundKey === roundKey);
    return groupByTable(matches);
  }, [roundKey]);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Lịch thi đấu - ${tournament?.title ?? "Giải đấu"}`,
      });
    } catch (e) {}
  };

  const toggleTable = useCallback((tableNo) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenMap((prev) => ({
      ...prev,
      [tableNo]: !(prev?.[tableNo] ?? true), // default open
    }));
  }, []);

  const renderMatch = (item) => (
    <View>
      <View style={styles.matchRow}>
        {/* left circle */}
        <View style={styles.leftCircle}>
          <Text style={styles.leftCircleText}>{item.leftIndex}</Text>
        </View>

        {/* match body */}
        <View style={styles.matchBody}>
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

      <View style={styles.matchDivider} />
    </View>
  );

  const renderTable = ({ item }) => {
    const isOpen = openMap?.[item.tableNo] ?? true; // default open
    const count = item.items?.length ?? 0;

    return (
      <View style={styles.groupWrap}>
        {/* left big group card */}
        <View style={styles.groupCard}>
          {/* group header (tree) */}
          <Pressable
            style={styles.groupHeader}
            onPress={() => toggleTable(item.tableNo)}
          >
            <View style={styles.groupHeaderLeft}>
              <Ionicons
                name={isOpen ? "chevron-down" : "chevron-forward"}
                size={18}
                color="#111827"
              />
              <View>
                <Text style={styles.groupTitle}>{`Bảng ${item.tableNo}`}</Text>
                <Text style={styles.groupSub}>{`${count} trận`}</Text>
              </View>
            </View>

            <Ionicons name="ellipsis-horizontal" size={18} color="#9CA3AF" />
          </Pressable>

          {/* matches */}
          {isOpen ? (
            <View>
              {item.items.map((m, idx) => (
                <View key={m.id}>
                  {renderMatch(m)}
                  {/* bỏ divider cuối */}
                  {idx === item.items.length - 1 ? (
                    <View style={{ height: 1, backgroundColor: "#fff" }} />
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    );
  };

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

      {/* list of tables */}
      <FlatList
        contentContainerStyle={styles.listPad}
        data={tables}
        keyExtractor={(it) => it.id}
        renderItem={renderTable}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
