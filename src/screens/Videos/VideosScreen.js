// src/screens/Videos/VideosScreen.js
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
import { VIDEO_TABS, videosSeed } from "./data/videos";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function VideoCard({ item }) {
  const onShare = async () => {
    try {
      await Share.share({ message: `${item.title} • ${item.dateTime}` });
    } catch (e) {}
  };

  const p = item.players;

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.banner }} style={styles.banner} />

      <View style={styles.cardBody}>
        <View style={styles.titleRow}>
          <Text style={styles.metaText}>{item.dateTime}</Text>
          <Text style={styles.metaLight}> {item.code} </Text>

          <Pressable style={styles.shareBtn} onPress={onShare} hitSlop={10}>
            <Ionicons name="share-social-outline" size={18} color="#1E2430" />
          </Pressable>
        </View>

        <Text style={styles.mainTitle}>{item.title}</Text>

        {/* 2 cột, mỗi cột 2 VĐV */}
        <View style={styles.playersGrid}>
          <View style={styles.teamCol}>
            <View>
              <View style={styles.playerRow}>
                <Image
                  source={{ uri: p[0]?.avatar }}
                  style={styles.playerAvatar}
                />
                <Text style={styles.playerName} numberOfLines={1}>
                  {p[0]?.name}
                </Text>
              </View>
              <View style={styles.scoreUnder}>
                <Text style={styles.scoreSmall}>{item.scores?.[0] ?? 0}</Text>
              </View>
            </View>

            <View>
              <View style={styles.playerRow}>
                <Image
                  source={{ uri: p[2]?.avatar }}
                  style={styles.playerAvatar}
                />
                <Text style={styles.playerName} numberOfLines={1}>
                  {p[2]?.name}
                </Text>
              </View>
              <View style={styles.scoreUnder}>
                <Text style={styles.scoreSmall}>{item.scores?.[2] ?? 0}</Text>
              </View>
            </View>
          </View>

          <View style={styles.teamCol}>
            <View>
              <View style={styles.playerRow}>
                <Image
                  source={{ uri: p[1]?.avatar }}
                  style={styles.playerAvatar}
                />
                <Text style={styles.playerName} numberOfLines={1}>
                  {p[1]?.name}
                </Text>
              </View>
              <View style={styles.scoreUnder}>
                <Text style={styles.scoreSmall}>{item.scores?.[1] ?? 0}</Text>
              </View>
            </View>

            <View>
              <View style={styles.playerRow}>
                <Image
                  source={{ uri: p[3]?.avatar }}
                  style={styles.playerAvatar}
                />
                <Text style={styles.playerName} numberOfLines={1}>
                  {p[3]?.name}
                </Text>
              </View>
              <View style={styles.scoreUnder}>
                <Text style={styles.scoreSmall}>{item.scores?.[3] ?? 0}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function VideosScreen() {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    const q = normalize(query.trim());

    return videosSeed
      .filter((x) => (tab === "all" ? true : x.type === tab))
      .filter((x) => {
        if (!q) return true;
        const hay = normalize(`${x.title} ${x.code} ${x.dateTime}`);
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
              <Ionicons name="person" size={16} color={COLORS.BLUE} />
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.topTabs}>
          {VIDEO_TABS.map((t) => {
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
            placeholder="Tìm kiếm..."
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
        renderItem={({ item }) => <VideoCard item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
