// src/screens/Court/CourtScreen.js
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
import { courtsSeed } from "./data/courts";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function CourtScreen({ navigation }) {
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return courtsSeed;

    return courtsSeed.filter((c) => {
      const hay = normalize(`${c.name} ${c.area} ${c.manager} ${c.phone}`);
      return hay.includes(q);
    });
  }, [query]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imgRow}>
        <Image source={{ uri: item.images[0] }} style={styles.img} />
        <Image source={{ uri: item.images[1] }} style={styles.img} />
      </View>

      <View style={styles.infoRow}>
        <View style={styles.left}>
          <Text style={styles.name}>{item.name}</Text>

          <Text style={styles.line}>
            Khu vực: <Text style={styles.strong}>{item.area}</Text>
          </Text>

          <Text style={styles.line}>
            Quản lý: <Text style={styles.strong}>{item.manager}</Text>
          </Text>

          <Text style={styles.line}>
            Điện thoại: <Text style={styles.strong}>{item.phone}</Text>
          </Text>

          <View style={styles.divider} />
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.actionBtn} hitSlop={10}>
            <Ionicons name="call" size={16} color="#2563EB" />
          </Pressable>
          <Pressable style={styles.actionBtn} hitSlop={10}>
            <Ionicons name="chatbubble" size={16} color="#2563EB" />
          </Pressable>
        </View>
      </View>
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

          <Text style={styles.headerTitle}>Sân Bãi</Text>
        </View>

        {/* Search */}
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
