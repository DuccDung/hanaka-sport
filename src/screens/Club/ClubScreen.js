// src/screens/Club/ClubScreen.js
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
import { clubsSeed } from "./data/clubs";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function Stars({ value }) {
  const full = Math.round(value); 
  return (
    <View style={styles.starsRow}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Ionicons
          key={i}
          name={i < full ? "star" : "star-outline"}
          size={14}
          color="#9CA3AF"
        />
      ))}
    </View>
  );
}

export default function ClubScreen({ navigation }) {
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return clubsSeed;

    return clubsSeed.filter((c) => {
      const hay = normalize(`${c.name} ${c.area} ${c.members}`);
      return hay.includes(q);
    });
  }, [query]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.cover }} style={styles.cover} />

      <View style={styles.cardBody}>
        <Text style={styles.title}>
          {item.name} ({item.members} tv)
        </Text>

        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          <Stars value={item.rating} />
          <Text style={styles.ratingText}>({item.reviews} Đánh giá)</Text>
        </View>

        <Text style={styles.metaText}>Khu vực: {item.area}</Text>

        <View style={styles.statsRow}>
          <Text style={styles.statText}>Trận: {item.matches.played}</Text>
          <Text style={styles.statText}>Thắng: {item.matches.win}</Text>
          <Text style={styles.statText}>Hòa: {item.matches.draw}</Text>
          <Text style={styles.statText}>Thua: {item.matches.loss}</Text>
        </View>

        <View style={styles.btnRow}>
          <Pressable style={styles.btnPrimary}>
            <Text style={styles.btnText}>Mời giao lưu</Text>
          </Pressable>
          <Pressable style={styles.btnSecondary}>
            <Text style={styles.btnText}>Tuyển thành viên</Text>
          </Pressable>
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

          <Text style={styles.headerTitle}>Pickleball</Text>

          <View style={styles.headerRight}>
            <Pressable
              style={styles.addBtn}
              hitSlop={10}
              onPress={() => navigation.navigate("ClubCreate")}
            >
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
