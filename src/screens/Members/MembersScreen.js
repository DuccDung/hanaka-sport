// src/screens/Members/MembersScreen.js
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
import { COLORS } from "../../constants/colors";
import { styles } from "./styles";
import { membersSeed } from "./data/members";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function MembersScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const data = useMemo(() => {
    const q = normalize(submittedQuery.trim());
    if (!q) return membersSeed;

    return membersSeed.filter((m) => {
      const hay = normalize(`${m.name} ${m.id} ${m.city} ${m.gender}`);
      return hay.includes(q);
    });
  }, [submittedQuery]);

  const onSearch = () => {
    Keyboard.dismiss();
    setSubmittedQuery(query);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />

      <View style={styles.mid}>
        <Text style={styles.name}>{item.name}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>ID: {item.id}</Text>
          <Text style={styles.meta}>{item.city}</Text>
        </View>

        <View style={styles.subRow}>
          <Text style={styles.gender}>{item.gender}</Text>
          {item.verified && <Text style={styles.verified}>Đã xác thực</Text>}
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.score}>{item.rating1}</Text>
        <Text style={styles.score}>{item.rating2}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ===== Header giống ảnh ===== */}
      <View style={styles.headerWrap}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={20} color="#1E2430" />
          </Pressable>

          <Text style={styles.headerTitle}>Thành viên</Text>

          <View style={styles.headerRight}>
            <Pressable style={styles.headerIconBtn} hitSlop={10}>
              <Ionicons name="people-outline" size={20} color="#1E2430" />
            </Pressable>

            <Pressable hitSlop={10}>
              <Text style={styles.headerLink}>Tự chấm trình</Text>
            </Pressable>
          </View>
        </View>

        {/* ===== Search giống ảnh ===== */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Họ tên, Nick, SĐT..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              returnKeyType="search"
              onSubmitEditing={onSearch}
            />
          </View>

          <Pressable style={styles.searchBtn} onPress={onSearch}>
            <Text style={styles.searchBtnText}>Tìm kiếm</Text>
          </Pressable>
        </View>

        {/* ===== Section header (Thành Viên + icon cột điểm) ===== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Thành Viên</Text>

          <View style={styles.sectionRightCols}>
            <Ionicons name="people" size={18} color="#1E2430" />
            <Ionicons name="person" size={18} color="#1E2430" />
          </View>
        </View>
      </View>

      {/* ===== List ===== */}
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
