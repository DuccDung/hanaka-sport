// src/screens/Tournament/TournamentScheduleScreen.js
import React, { useMemo, useState, useCallback, useEffect } from "react";
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
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./scheduleStyles";
import { getTournamentRoundsWithMatches } from "../../services/tournamentService";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function formatTime(isoString) {
  if (!isoString) return "--:--";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "--:--";

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function normalizeRoundKey(roundKey) {
  return String(roundKey || "").toLowerCase();
}

function mapApiMatchToScheduleItem(match, group, roundKey, index) {
  const team1RegistrationId = match.team1RegistrationId ?? null;
  const team2RegistrationId = match.team2RegistrationId ?? null;
  const winnerRegistrationId = match.winnerRegistrationId ?? null;

  let winnerSide = null;
  if (winnerRegistrationId && winnerRegistrationId === team1RegistrationId) {
    winnerSide = "A";
  } else if (
    winnerRegistrationId &&
    winnerRegistrationId === team2RegistrationId
  ) {
    winnerSide = "B";
  }

  return {
    id: String(match.matchId),
    roundKey,
    tableNo: group?.groupName || index + 1,
    leftIndex: index + 1,
    code: `#${match.matchId}`,
    time: formatTime(match.startAt),
    court: match.addressText || match.courtText || "Chưa cập nhật",
    teamA: match.team1?.displayName || "Chưa xác định",
    teamB: match.team2?.displayName || "Chưa xác định",
    scoreA:
      typeof match.scoreTeam1 === "number" ? String(match.scoreTeam1) : "-",
    scoreB:
      typeof match.scoreTeam2 === "number" ? String(match.scoreTeam2) : "-",
    isCompleted: !!match.isCompleted,
    hasWinner: !!match.winnerRegistrationId || !!match.winner,
    winnerSide,
    winnerRegistrationId,
    team1RegistrationId,
    team2RegistrationId,
    raw: match,
  };
}

function mapApiRoundsToTabs(apiRounds = []) {
  return apiRounds.map((round, index) => ({
    key: normalizeRoundKey(round.roundKey || `R${index + 1}`),
    label: round.roundLabel || `Vòng ${index + 1}`,
    raw: round,
  }));
}

function mapApiRoundsToScheduleSeed(apiRounds = []) {
  const items = [];

  for (const round of apiRounds) {
    const roundKey = normalizeRoundKey(round.roundKey);

    for (const group of round.groups || []) {
      const matches = group.matches || [];

      matches.forEach((match, idx) => {
        items.push(mapApiMatchToScheduleItem(match, group, roundKey, idx));
      });
    }
  }

  return items;
}

function groupByTable(matches) {
  const map = new Map();

  for (const m of matches) {
    const key = String(m.tableNo ?? "Khác");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(m);
  }

  const parseTableSortValue = (tableNo) => {
    const num = Number(tableNo);
    if (!Number.isNaN(num)) return { type: "number", value: num };
    return { type: "string", value: String(tableNo) };
  };

  return Array.from(map.entries())
    .map(([tableKey, items]) => ({
      id: `table-${tableKey}`,
      tableNo: tableKey,
      items: items.sort((a, b) => (a.leftIndex ?? 0) - (b.leftIndex ?? 0)),
    }))
    .sort((a, b) => {
      const av = parseTableSortValue(a.tableNo);
      const bv = parseTableSortValue(b.tableNo);

      if (av.type === "number" && bv.type === "number") {
        return av.value - bv.value;
      }

      return String(a.tableNo).localeCompare(String(b.tableNo));
    });
}

export default function TournamentScheduleScreen({ navigation, route }) {
  const tournamentFromRoute = route?.params?.tournament;
  const tournamentId =
    route?.params?.tournamentId || tournamentFromRoute?.tournamentId;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [apiTournament, setApiTournament] = useState(
    tournamentFromRoute || null,
  );
  const [apiRounds, setApiRounds] = useState([]);

  const roundTabs = useMemo(() => mapApiRoundsToTabs(apiRounds), [apiRounds]);
  const scheduleSeed = useMemo(
    () => mapApiRoundsToScheduleSeed(apiRounds),
    [apiRounds],
  );

  const [roundKey, setRoundKey] = useState("");
  const [openMap, setOpenMap] = useState({});

  const tables = useMemo(() => {
    const matches = scheduleSeed.filter((x) => x.roundKey === roundKey);
    return groupByTable(matches);
  }, [scheduleSeed, roundKey]);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (!tournamentId) {
        setError("Không tìm thấy tournamentId");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const data = await getTournamentRoundsWithMatches(tournamentId);

        setApiTournament(data?.tournament || null);
        setApiRounds(data?.rounds || []);
      } catch (err) {
        console.log("getTournamentRoundsWithMatches error:", err);
        setError("Không tải được lịch thi đấu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [tournamentId],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!roundTabs.length) return;

    const exists = roundTabs.some((r) => r.key === roundKey);
    if (!exists) {
      setRoundKey(roundTabs[0].key);
    }
  }, [roundTabs, roundKey]);

  const onRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Lịch thi đấu - ${apiTournament?.title ?? "Giải đấu"}`,
      });
    } catch (e) {}
  };

  const toggleTable = useCallback((tableNo) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenMap((prev) => ({
      ...prev,
      [tableNo]: !(prev?.[tableNo] ?? true),
    }));
  }, []);

  const renderMatch = (item) => {
    const isWinnerA = item.winnerSide === "A";
    const isWinnerB = item.winnerSide === "B";
    const hasWinner = item.hasWinner;

    return (
      <View>
        <View style={[styles.matchRow, hasWinner && styles.matchRowWinner]}>
          <View
            style={[styles.leftCircle, hasWinner && styles.leftCircleWinner]}
          >
            <Text
              style={[
                styles.leftCircleText,
                hasWinner && styles.leftCircleTextWinner,
              ]}
            >
              {item.leftIndex}
            </Text>
          </View>

          <View style={styles.matchBody}>
            <Text style={styles.cardTop}>
              {item.code} ({item.time}; Sân: {item.court})
            </Text>

            <View style={styles.teamsRow}>
              <View style={styles.teamsLeft}>
                <Text
                  style={[styles.teamText, isWinnerA && styles.teamWinnerText]}
                >
                  {item.teamA}
                </Text>

                <Text
                  style={[styles.teamText, isWinnerB && styles.teamWinnerText]}
                >
                  {item.teamB}
                </Text>
              </View>

              <View style={styles.scoresRight}>
                <Text
                  style={[
                    styles.scoreText,
                    isWinnerA && styles.scoreWinnerText,
                  ]}
                >
                  {item.scoreA}
                </Text>

                <Text
                  style={[
                    styles.scoreText,
                    isWinnerB && styles.scoreWinnerText,
                  ]}
                >
                  {item.scoreB}
                </Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <Pressable style={styles.actionItem} hitSlop={10}>
                <Ionicons
                  name="play-circle-outline"
                  size={18}
                  color="#6B7280"
                />
                <Text style={styles.actionText}>Xem video</Text>
              </Pressable>

              <Pressable style={styles.actionItem} hitSlop={10}>
                <Ionicons name="flag-outline" size={18} color="#111827" />
                <Text style={[styles.actionText, styles.actionTextStrong]}>
                  Diễn biến
                </Text>
              </Pressable>

              <Pressable
                style={styles.actionItem}
                hitSlop={10}
                onPress={onShare}
              >
                <Ionicons
                  name="share-social-outline"
                  size={18}
                  color="#6B7280"
                />
                <Text style={styles.actionText}>Chia sẻ</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.matchDivider} />
      </View>
    );
  };

  const renderTable = ({ item }) => {
    const isOpen = openMap?.[item.tableNo] ?? true;
    const count = item.items?.length ?? 0;

    return (
      <View style={styles.groupWrap}>
        <View style={styles.groupCard}>
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

          {isOpen ? (
            <View>
              {item.items.map((m, idx) => (
                <View key={m.id}>
                  {renderMatch(m)}
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

  const currentRound = roundTabs.find((r) => r.key === roundKey);

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
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

        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <Ionicons name="git-branch-outline" size={18} color="#1E2430" />
            <Text style={styles.metaText}>
              {apiTournament?.playoffType || "Chưa cập nhật"}
            </Text>
          </View>

          <View style={styles.metaSpacer} />

          <View style={styles.metaLeft}>
            <Ionicons name="people-outline" size={18} color="#1E2430" />
            <Text style={styles.metaText}>
              <Text style={styles.metaStrong}>
                {apiTournament?.expectedTeams ?? 0}
              </Text>{" "}
              đội -{" "}
              <Text style={styles.metaStrong}>
                {apiTournament?.matchesCount ?? 0}
              </Text>{" "}
              trận đấu
            </Text>
          </View>

          <Ionicons name="git-branch-outline" size={18} color="#1E2430" />
        </View>

        <View style={styles.tabsRow}>
          {roundTabs.map((r) => {
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

      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F9FAFB",
          }}
        >
          <ActivityIndicator size="large" color="#111827" />
          <Text style={{ marginTop: 12, color: "#6B7280" }}>
            Đang tải lịch thi đấu...
          </Text>
        </View>
      ) : error ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
            backgroundColor: "#F9FAFB",
          }}
        >
          <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
          <Text
            style={{
              marginTop: 12,
              textAlign: "center",
              color: "#374151",
              fontSize: 15,
            }}
          >
            {error}
          </Text>

          <Pressable
            onPress={() => fetchData()}
            style={{
              marginTop: 16,
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: "#111827",
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Thử lại</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={[
            styles.listPad,
            tables.length === 0 && { flexGrow: 1 },
          ]}
          data={tables}
          keyExtractor={(it) => it.id}
          renderItem={renderTable}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 48,
              }}
            >
              <Ionicons name="calendar-outline" size={42} color="#9CA3AF" />
              <Text
                style={{
                  marginTop: 10,
                  color: "#6B7280",
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                {currentRound?.label || "Vòng đấu này"} chưa có trận nào
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
