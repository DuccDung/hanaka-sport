// src/screens/Tournament/TournamentScreen.js
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
import { tournamentsSeed } from "./data/tournaments";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const TAB = {
  upcoming: "Sắp",
  ongoing: "Đang",
  finished: "Kết thúc",
};

export default function TournamentScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("upcoming"); // upcoming | ongoing | finished

  const data = useMemo(() => {
    const q = normalize(query.trim());
    return tournamentsSeed
      .filter((t) => t.status === tab)
      .filter((t) => {
        if (!q) return true;
        const hay = normalize(`${t.title} ${t.area} ${t.format}`);
        return hay.includes(q);
      });
  }, [query, tab]);

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("TournamentDetail", { tournament: item })
      }
      style={styles.card}
    >
      <Image source={{ uri: item.banner }} style={styles.banner} />

      <View style={styles.cardBody}>
        <Text style={styles.title}>{item.title}</Text>

        <Text style={styles.line}>
          Ngày: <Text style={styles.strong}>{item.dateTime}</Text>
        </Text>

        <Text style={styles.line}>
          Hạn đăng ký:{" "}
          <Text style={styles.strong}>{item.registerDeadline}</Text>
        </Text>

        <View style={styles.twoColRow}>
          <Text style={styles.line}>
            Thể thức: <Text style={styles.strong}>{item.format}</Text>
          </Text>
          <Text style={styles.line}>
            Giải:{" "}
            <Text style={styles.strong}>
              {item.format === "Đôi" ? "Đôi" : "Đơn"}
            </Text>
          </Text>
        </View>

        <View style={styles.twoColRow}>
          <Text style={styles.line}>
            Giới hạn trình đơn tối đa:{" "}
            <Text style={styles.strong}>{item.singleLimit}</Text>
          </Text>
          <Text style={styles.line}>
            Cặp tối đa: <Text style={styles.strong}>{item.doubleLimit}</Text>
          </Text>
        </View>

        <Text style={styles.line}>
          Khu vực: <Text style={styles.strong}>{item.area}</Text>
        </Text>

        <View style={styles.smallRow}>
          <Text style={styles.line}>
            Số đội dự kiến:{" "}
            <Text style={styles.strong}>{item.expectedTeams}</Text>
          </Text>
          <Text style={styles.line}>
            Số trận thi đấu: <Text style={styles.strong}>{item.matches}</Text>
          </Text>
        </View>

        <Text style={styles.line}>
          Tình trạng: <Text style={styles.strong}>{item.stateText}</Text>
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header + Search + Filter + Tabs */}
      <View style={styles.headerWrap}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={20} color="#1E2430" />
          </Pressable>

          <Text style={styles.headerTitle}>Giải đấu</Text>

          <View style={styles.headerRight}>
            <Pressable style={styles.addBtn} hitSlop={10}>
              <Ionicons name="add" size={26} color="#1E2430" />
            </Pressable>
          </View>
        </View>

        <View style={styles.searchRow}>
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

        <View style={styles.filterRow}>
          <Pressable style={styles.filterBtn}>
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text style={styles.filterText}>Khu vực: Tất cả</Text>
            <Ionicons name="chevron-down" size={14} color="#6B7280" />
          </Pressable>
        </View>

        <View style={styles.tabsRow}>
          {Object.keys(TAB).map((key) => {
            const active = tab === key;
            return (
              <Pressable
                key={key}
                style={styles.tabBtn}
                onPress={() => setTab(key)}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {TAB[key]}
                </Text>
                {active ? <View style={styles.tabUnderline} /> : null}
              </Pressable>
            );
          })}
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
