// src/screens/Match/MatchListScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  TextInput,
  FlatList,
  Image,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { matchesSeed } from "./data/matches";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function Player({ avatar, name, orange }) {
  return (
    <View style={styles.playerRow}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <Text style={orange ? styles.nameOrange : styles.nameBlack}>{name}</Text>
    </View>
  );
}

export default function MatchListScreen({ navigation }) {
  const [fromDate, setFromDate] = useState("01/03/2025");
  const [toDate, setToDate] = useState("02/03/2026");
  const [query, setQuery] = useState("");
  const [allChecked, setAllChecked] = useState(true);

  const data = useMemo(() => {
    // demo: filter theo search
    const q = normalize(query.trim());
    if (!q) return matchesSeed;

    return matchesSeed.filter((m) => {
      const players = [...m.sideA, ...m.sideB].map((p) => p.name).join(" ");
      const hay = normalize(`${m.id} ${m.dateTime} ${players}`);
      return hay.includes(q);
    });
  }, [query]);

  const renderSingle = (m) => (
    <>
      <View style={styles.lineRow}>
        <Player avatar={m.sideA[0].avatar} name={m.sideA[0].name} orange />
        <View style={styles.rightScoreCol}>
          <View style={styles.trophyRow}>
            <Ionicons name="trophy" size={14} color="#16A34A" />
            <Text style={styles.trophyScore}>{m.scoreA}</Text>
          </View>
        </View>
      </View>

      <View style={styles.lineRow}>
        <Player avatar={m.sideB[0].avatar} name={m.sideB[0].name} />
        <View style={styles.rightScoreCol}>
          <Text style={styles.scoreText}>{m.scoreB}</Text>
        </View>
      </View>
    </>
  );

  const renderDouble = (m) => (
    <>
      <View style={styles.lineRow}>
        <View style={styles.doubleCols}>
          <View style={styles.col}>
            <Player avatar={m.sideA[0].avatar} name={m.sideA[0].name} orange />
          </View>
          <View style={styles.col}>
            <Player avatar={m.sideB[0].avatar} name={m.sideB[0].name} orange />
          </View>
        </View>

        <View style={styles.rightScoreCol}>
          <View style={styles.trophyRow}>
            <Ionicons name="trophy" size={14} color="#16A34A" />
            <Text style={styles.trophyScore}>{m.scoreA}</Text>
          </View>
        </View>
      </View>

      <View style={styles.lineRow}>
        <View style={styles.doubleCols}>
          <View style={styles.col}>
            <Player avatar={m.sideA[1].avatar} name={m.sideA[1].name} orange />
          </View>
          <View style={styles.col}>
            <Player avatar={m.sideB[1].avatar} name={m.sideB[1].name} orange />
          </View>
        </View>

        <View style={styles.rightScoreCol}>
          <Text style={styles.scoreText}>{m.scoreB}</Text>
        </View>
      </View>
    </>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardDate}>{item.dateTime}</Text>
        <Text style={styles.cardId}>{item.id}</Text>
      </View>

      {item.type === "single" ? renderSingle(item) : renderDouble(item)}
    </View>
  );

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

          <Text style={styles.headerTitle}>Danh sách trận đấu</Text>

          <View style={styles.headerRight}>
            <Pressable style={styles.headerIconBtn} hitSlop={10}>
              <Ionicons name="home-outline" size={20} color="#1E2430" />
            </Pressable>
            <Pressable style={styles.headerIconBtn} hitSlop={10}>
              <Ionicons name="add" size={26} color="#1E2430" />
            </Pressable>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterWrap}>
          <Text style={styles.filterTitle}>Tìm kiếm</Text>

          <View style={styles.dateRow}>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>{fromDate}</Text>
              <Pressable hitSlop={10} onPress={() => setFromDate("01/03/2025")}>
                <Ionicons name="close" size={18} color="#9CA3AF" />
              </Pressable>
            </View>

            <Text style={styles.dash}>-</Text>

            <View style={styles.dateBox}>
              <Text style={styles.dateText}>{toDate}</Text>
              <Pressable hitSlop={10} onPress={() => setToDate("02/03/2026")}>
                <Ionicons name="close" size={18} color="#9CA3AF" />
              </Pressable>
            </View>
          </View>

          <View style={styles.row2}>
            <Pressable
              onPress={() => setAllChecked((v) => !v)}
              style={styles.radioWrap}
              hitSlop={10}
            >
              <View style={styles.radioOuter}>
                {allChecked ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={styles.radioText}>Tất cả</Text>
            </Pressable>

            <View style={styles.searchBox}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Tìm kiếm..."
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                returnKeyType="search"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <Ionicons name="search" size={18} color="#9CA3AF" />
            </View>
          </View>
        </View>
      </View>

      {/* List */}
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
