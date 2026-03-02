// src/screens/Tournament/TournamentStandingsScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./standingsStyles";
import { standingRounds, standingsSeed } from "./data/standings";

export default function TournamentStandingsScreen({ navigation, route }) {
  const tournament = route?.params?.tournament;
  const [roundKey, setRoundKey] = useState("r1");

  const groups = useMemo(
    () => standingsSeed.filter((g) => g.roundKey === roundKey),
    [roundKey],
  );

  const renderRoundTab = ({ item }) => {
    const active = item.key === roundKey;
    return (
      <Pressable style={styles.tabBtn} onPress={() => setRoundKey(item.key)}>
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

      {item.rows.map((r, idx) => (
        <View key={idx} style={[styles.tr, r.top && styles.trTop]}>
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
            <Pressable style={styles.moreBtn} hitSlop={10}>
              <Ionicons name="ellipsis-vertical" size={18} color="#111827" />
            </Pressable>
          </View>
        </View>
      ))}
    </Pressable>
  );

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
          <Text style={styles.headerTitle}>Bảng xếp hạng</Text>
        </View>

        <View style={styles.tabsRow}>
          <FlatList
            data={standingRounds}
            horizontal
            keyExtractor={(it) => it.key}
            renderItem={renderRoundTab}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>

      <FlatList
        contentContainerStyle={styles.listPad}
        data={groups}
        keyExtractor={(it) => it.id}
        renderItem={renderGroup}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
