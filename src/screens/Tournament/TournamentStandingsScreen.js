import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./standingsStyles";
import {
  getTournamentStandingRounds,
  getTournamentRoundStandings,
} from "../../services/tournamentService";

function mapStandingResponseToGroups(data) {
  return (data?.groups || []).map((g) => ({
    id: String(g.groupId),
    groupId: g.groupId,
    groupName: g.groupName,
    rows: (g.rows || []).map((r, idx) => ({
      id: `${g.groupId}_${r.registrationId}_${idx}`,
      registrationId: r.registrationId,
      team: r.teamName,
      played: r.played ?? 0,
      win: r.wins ?? 0,
      point: r.points ?? 0,
      hso: r.scoreDiff ?? 0,
      scoreFor: r.scoreFor ?? 0,
      scoreAgainst: r.scoreAgainst ?? 0,
      rank: r.rank ?? idx + 1,
      top: (r.rank ?? idx + 1) === 1,
    })),
  }));
}

export default function TournamentStandingsScreen({ navigation, route }) {
  const tournament = route?.params?.tournament;
  const tournamentId = tournament?.tournamentId || tournament?.id;

  const [rounds, setRounds] = useState([]);
  const [roundKey, setRoundKey] = useState(null);
  const [selectedRoundMapId, setSelectedRoundMapId] = useState(null);

  const [groups, setGroups] = useState([]);
  const [loadingRounds, setLoadingRounds] = useState(true);
  const [loadingStandings, setLoadingStandings] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorText, setErrorText] = useState("");

  const activeRound = useMemo(
    () => rounds.find((r) => r.key === roundKey) || null,
    [rounds, roundKey],
  );

  const loadRounds = useCallback(async () => {
    if (!tournamentId) return;

    setLoadingRounds(true);
    setErrorText("");

    try {
      const roundItems = await getTournamentStandingRounds(tournamentId);
      setRounds(roundItems);

      if (roundItems.length > 0) {
        const first = roundItems[0];
        setRoundKey(String(first.key));
        setSelectedRoundMapId(first.roundMapId);
      } else {
        setRoundKey(null);
        setSelectedRoundMapId(null);
        setGroups([]);
      }
    } catch (err) {
      setErrorText(
        err?.response?.data?.message ||
          err?.message ||
          "Không tải được danh sách vòng đấu.",
      );
    } finally {
      setLoadingRounds(false);
    }
  }, [tournamentId]);

  const loadStandings = useCallback(
    async (roundMapId) => {
      if (!tournamentId || !roundMapId) {
        setGroups([]);
        return;
      }

      setLoadingStandings(true);
      setErrorText("");

      try {
        const data = await getTournamentRoundStandings(
          tournamentId,
          roundMapId,
        );
        const mappedGroups = mapStandingResponseToGroups(data);
        setGroups(mappedGroups);
      } catch (err) {
        setErrorText(
          err?.response?.data?.message ||
            err?.message ||
            "Không tải được bảng xếp hạng.",
        );
        setGroups([]);
      } finally {
        setLoadingStandings(false);
      }
    },
    [tournamentId],
  );

  useEffect(() => {
    loadRounds();
  }, [loadRounds]);

  useEffect(() => {
    if (selectedRoundMapId) {
      loadStandings(selectedRoundMapId);
    }
  }, [selectedRoundMapId, loadStandings]);

  const onRefresh = useCallback(async () => {
    if (!tournamentId) return;
    setRefreshing(true);
    try {
      const roundItems = await getTournamentStandingRounds(tournamentId);
      setRounds(roundItems);

      let nextRound = null;

      if (roundItems.length > 0) {
        nextRound =
          roundItems.find((r) => String(r.key) === String(roundKey)) ||
          roundItems[0];

        setRoundKey(String(nextRound.key));
        setSelectedRoundMapId(nextRound.roundMapId);

        const data = await getTournamentRoundStandings(
          tournamentId,
          nextRound.roundMapId,
        );
        setGroups(mapStandingResponseToGroups(data));
      } else {
        setGroups([]);
      }
    } catch (err) {
      setErrorText(
        err?.response?.data?.message ||
          err?.message ||
          "Không làm mới được bảng xếp hạng.",
      );
    } finally {
      setRefreshing(false);
    }
  }, [tournamentId, roundKey]);

  const handlePressRound = async (round) => {
    setRoundKey(String(round.key));
    setSelectedRoundMapId(round.roundMapId);
  };

  const renderRoundTab = ({ item }) => {
    const active = String(item.key) === String(roundKey);

    return (
      <Pressable style={styles.tabBtn} onPress={() => handlePressRound(item)}>
        <Text style={[styles.tabText, active && styles.tabTextActive]}>
          {item.label}
        </Text>

        {active ? (
          <View style={styles.tabUnderline} />
        ) : (
          <View style={{ height: 3, marginTop: 8 }} />
        )}
      </Pressable>
    );
  };

  const renderGroup = ({ item }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("TournamentStandingsGroup", {
          tournament,
          round: activeRound,
          group: item,
        })
      }
      style={styles.groupCard}
    >
      <Text style={styles.groupTitle}>{item.groupName}</Text>

      <View style={styles.tableHead}>
        <View style={styles.colTeam}>
          <Text style={styles.th}>Đội</Text>
        </View>
        <View style={styles.colWin}>
          <Text style={styles.th}>Thắng</Text>
        </View>
        <View style={styles.colPoint}>
          <Text style={styles.th}>Điểm</Text>
        </View>
        <View style={styles.colHso}>
          <Text style={styles.th}>HSố</Text>
        </View>
        <View style={styles.colRank}>
          <Text style={styles.th}>Hạng</Text>
        </View>
        <View style={styles.colMore} />
      </View>

      {item.rows.map((r) => (
        <View key={r.id} style={[styles.tr, r.top && styles.trTop]}>
          <View style={styles.colTeam}>
            <Text style={styles.teamText}>{r.team}</Text>
          </View>

          <View style={styles.colWin}>
            <Text style={styles.td}>{r.win}</Text>
          </View>

          <View style={styles.colPoint}>
            <Text style={styles.td}>{r.point}</Text>
          </View>

          <View style={styles.colHso}>
            <Text style={styles.td}>{r.hso}</Text>
          </View>

          <View style={styles.colRank}>
            <Text style={styles.td}>{r.rank}</Text>
          </View>

          <View style={styles.colMore}>
            <Pressable
              style={styles.moreBtn}
              hitSlop={10}
              onPress={() =>
                navigation.navigate("TournamentStandingsGroup", {
                  tournament,
                  round: activeRound,
                  group: item,
                })
              }
            >
              <Ionicons name="ellipsis-vertical" size={18} color="#111827" />
            </Pressable>
          </View>
        </View>
      ))}
    </Pressable>
  );

  const renderContent = () => {
    if (loadingRounds) {
      return (
        <View style={{ paddingTop: 32, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#D70018" />
          <Text style={{ marginTop: 10, color: "#6B7280" }}>
            Đang tải vòng đấu...
          </Text>
        </View>
      );
    }

    if (errorText && !groups.length) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: "#DC2626", textAlign: "center" }}>
            {errorText}
          </Text>
        </View>
      );
    }

    if (!rounds.length) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: "#6B7280", textAlign: "center" }}>
            Chưa có vòng đấu nào.
          </Text>
        </View>
      );
    }

    if (loadingStandings && !groups.length) {
      return (
        <View style={{ paddingTop: 32, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#D70018" />
          <Text style={{ marginTop: 10, color: "#6B7280" }}>
            Đang tải bảng xếp hạng...
          </Text>
        </View>
      );
    }

    if (!groups.length) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: "#6B7280", textAlign: "center" }}>
            Chưa có dữ liệu bảng xếp hạng cho vòng này.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        contentContainerStyle={styles.listPad}
        data={groups}
        keyExtractor={(it) => it.id}
        renderItem={renderGroup}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  };

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

          <Text style={styles.headerTitle}>Bảng xếp hạng</Text>
        </View>

        <View style={styles.tabsRow}>
          <FlatList
            data={rounds}
            horizontal
            keyExtractor={(it) => `${it.roundMapId}_${it.key}`}
            renderItem={renderRoundTab}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>

      {renderContent()}
    </View>
  );
}
