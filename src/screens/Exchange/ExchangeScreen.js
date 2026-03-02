// src/screens/Exchange/ExchangeScreen.js
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
import { exchangesSeed } from "./data/exchanges";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function TeamLogo({ uri, placeholder }) {
  return (
    <View style={styles.logoCircle}>
      {uri ? (
        <Image source={{ uri }} style={styles.logoImg} />
      ) : (
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>
          {placeholder}
        </Text>
      )}
    </View>
  );
}

export default function ExchangeScreen({ navigation }) {
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return exchangesSeed;

    return exchangesSeed.filter((it) => {
      const hay = normalize(
        `${it.left.name} ${it.right.name} ${it.locationText} ${it.timeText}`,
      );
      return hay.includes(q);
    });
  }, [query]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* top row */}
      <View style={styles.topRow}>
        {/* left team */}
        <View style={styles.teamCol}>
          <TeamLogo uri={item.left.logo} placeholder="?" />
          <Text style={styles.teamName}>{item.left.name}</Text>
          <Text style={styles.wld}>
            {item.left.w}W {item.left.l}L {item.left.d}D
          </Text>

          <View style={styles.actionRow}>
            <Pressable style={styles.actionBtn} hitSlop={10}>
              <Ionicons name="call" size={16} color="#2563EB" />
            </Pressable>
            <Pressable style={styles.actionBtn} hitSlop={10}>
              <Ionicons name="chatbubble" size={16} color="#2563EB" />
            </Pressable>
          </View>
        </View>

        {/* score */}
        <View style={styles.scoreCol}>
          <Text style={styles.scoreText}>{item.scoreText}</Text>
        </View>

        {/* right team */}
        <View style={styles.teamCol}>
          <TeamLogo uri={item.right.logo} placeholder="?" />
          <Text style={styles.statusText}>{item.right.name}</Text>
        </View>
      </View>

      {/* bottom meta */}
      <View style={styles.metaRow}>
        <View style={styles.metaLine}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.metaText}>
            <Text style={styles.metaStrong}>{item.timeText}</Text>{" "}
            {item.agoText}
          </Text>
        </View>

        <View style={styles.metaLine}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.metaText}>{item.locationText}</Text>
        </View>
      </View>
    </View>
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

          <Text style={styles.headerTitle}>Giao lưu</Text>

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
      </View>

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
