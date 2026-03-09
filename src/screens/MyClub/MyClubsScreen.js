// src/screens/Club/ClubsScreen.js
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
  Share,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { styles } from "./styles";
import { CLUB_TABS, clubsSeed } from "./data/clubs";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function ClubCard({ item, onPress }) {
  const onShare = async () => {
    try {
      await Share.share({
        message: `${item.name}\nKhu vực: ${item.location}\nTrình: ${item.level}\n${item.phone ? `SĐT: ${item.phone}` : ""}`,
      });
    } catch (e) {}
  };

  return (
    <Pressable style={styles.card} onPress={onPress} disabled={!onPress}>
      <Image source={{ uri: item.banner }} style={styles.banner} />

      <View style={styles.cardBody}>
        <View style={styles.titleRow}>
          <Text style={styles.metaText}>{item.name}</Text>
          <Text style={styles.metaLight}> ({item.membersCount ?? 0} tv) </Text>

          <Pressable style={styles.shareBtn} onPress={onShare} hitSlop={10}>
            <Ionicons name="share-social-outline" size={18} color="#1E2430" />
          </Pressable>
        </View>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>{(item.rating ?? 0).toFixed(1)}</Text>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name={
                  i < Math.round(item.rating ?? 0) ? "star" : "star-outline"
                }
                size={14}
                color="#111827"
              />
            ))}
          </View>
          <Text style={styles.ratingLight}>
            ({item.reviewsCount ?? 0} Đánh giá)
          </Text>
        </View>

        <Text style={styles.lineText}>
          Khu vực: <Text style={styles.lineStrong}>{item.location}</Text>
        </Text>

        <View style={styles.statsRow}>
          <Text style={styles.statText}>
            Trình: <Text style={styles.statStrong}>{item.level}</Text>
          </Text>

          <Text style={styles.statText}>
            Thắng: <Text style={styles.statStrong}>{item.wins ?? "-"}</Text>
          </Text>

          <Text style={styles.statText}>
            Hoà: <Text style={styles.statStrong}>{item.draws ?? "-"}</Text>
          </Text>

          <Text style={styles.statText}>
            Thua: <Text style={styles.statStrong}>{item.losses ?? "-"}</Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function MyClubsScreen({ navigation }) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    const q = normalize(query.trim());

    return clubsSeed
      .filter((x) => (tab === "all" ? true : x.type === tab))
      .filter((x) => {
        if (!q) return true;
        const hay = normalize(`${x.name} ${x.location} ${x.level}`);
        return hay.includes(q);
      });
  }, [tab, query]);

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: COLORS.BLUE }} />
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BLUE} />

      {/* Header blue */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.helloText}>
            Xin Chào, <Text style={styles.helloStrong}>dung_dev</Text>
          </Text>

          <View style={styles.headerIcons}>
            <Pressable style={styles.headerIconBtn} hitSlop={10}>
              <Ionicons name="help-circle-outline" size={20} color="#fff" />
            </Pressable>
            <Pressable style={styles.headerIconBtn} hitSlop={10}>
              <Ionicons name="notifications-outline" size={20} color="#fff" />
            </Pressable>
            <Pressable style={styles.headerIconBtn} hitSlop={10}>
              <Ionicons name="settings-outline" size={20} color="#fff" />
            </Pressable>
            <View style={styles.avatar}>
              <Ionicons name="people" size={16} color={COLORS.BLUE} />
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.topTabs}>
          {CLUB_TABS.map((t) => {
            const active = tab === t.key;
            return (
              <Pressable
                key={t.key}
                style={[styles.topTabBtn, active && styles.topTabBtnActive]}
                onPress={() => setTab(t.key)}
              >
                <Text
                  style={[styles.topTabText, active && styles.topTabTextActive]}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm kiếm CLB..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
        </View>
      </View>

      {/* List */}
      <FlatList
        contentContainerStyle={styles.listPad}
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <ClubCard
            item={item}
            onPress={() => {
              // Nếu bạn muốn có trang chi tiết CLB sau này:
              // navigation.navigate("ClubDetail", { clubId: item.id });
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
