// src/screens/Tournament/RegistrationListScreen.js
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
import { styles } from "./registrationStyles";
import { registrationsSeed } from "./data/registrations";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function Checkbox({ checked, onPress }) {
  return (
    <Pressable onPress={onPress} hitSlop={10}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
      </View>
    </Pressable>
  );
}

export default function RegistrationListScreen({ navigation, route }) {
  const tournament = route?.params?.tournament;
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState({}); // id -> bool

  const data = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return registrationsSeed;
    return registrationsSeed.filter((r) => {
      const hay = normalize(
        `${r.regCode} ${r.regTime} ${r.vdv1.name} ${r.vdv2.name}`,
      );
      return hay.includes(q);
    });
  }, [query]);

  const stats = useMemo(() => {
    const success = registrationsSeed.filter((x) => x.success).length;
    const waitingPair = registrationsSeed.filter((x) => x.waitingPair).length;
    const capacity =
      (tournament?.expectedTeams ?? 64) - registrationsSeed.length;
    return { success, waitingPair, capacity };
  }, [tournament]);

  const toggleChecked = (id) => setChecked((m) => ({ ...m, [id]: !m[id] }));

  const renderPlayer = (p) => (
    <View style={styles.playerCol}>
      <View style={styles.avatarRing}>
        <Image source={{ uri: p.avatar }} style={styles.avatar} />
      </View>
      <Text style={styles.playerName}>{p.name}</Text>
      <Text style={styles.playerLevel}>({p.level})</Text>

      {p.verified ? (
        <Text style={styles.verifiedText}>Đã xác thực</Text>
      ) : (
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>Chờ xác thực</Text>
        </View>
      )}
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      {/* header row */}
      <View style={styles.itemHeaderRow}>
        <Text style={styles.idx}>{item.index}</Text>
        <Text style={styles.itemHeaderText}>
          Mã đk: <Text style={styles.itemHeaderStrong}>{item.regCode}</Text>{" "}
          {item.regTime}
        </Text>
      </View>

      {/* grid */}
      <View style={styles.gridRow}>
        {renderPlayer(item.vdv1)}
        {renderPlayer(item.vdv2)}

        <View style={styles.pointCol}>
          <Text style={styles.pointsText}>{item.points}</Text>
        </View>
      </View>

      {/* bottom actions */}
      {/* <View style={styles.bottomActions}>
        <Pressable style={[styles.actionBtn, styles.actionBlue]} hitSlop={10}>
          <Text style={[styles.actionText, styles.actionBlueText]}>
            Đánh giá
          </Text>
          <Ionicons name="star" size={16} color="#fff" />
        </Pressable>

        <Pressable
          style={[styles.actionBtn, styles.actionOutline]}
          hitSlop={10}
        >
          <Text style={[styles.actionText, styles.actionOutlineText]}>
            Thanh toán
          </Text>
          <Ionicons name="card" size={16} color="#F97316" />
        </Pressable>
      </View> */}
    </View>
  );

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* header */}
      <View style={styles.headerWrap}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={20} color="#1E2430" />
          </Pressable>
          <Text style={styles.headerTitle}>Danh sách đăng ký</Text>
        </View>
      </View>

      {/* links */}
      <View style={styles.linksRow}>
        <Pressable style={styles.linkItem} hitSlop={10}>
          <Ionicons
            name="globe-outline"
            size={16}
            color={styles.linkText.color}
          />
          <Text style={styles.linkText}>Web đăng ký</Text>
        </Pressable>

        <Pressable style={styles.linkItem} hitSlop={10}>
          <Ionicons
            name="link-outline"
            size={16}
            color={styles.linkText.color}
          />
          <Text style={styles.linkText}>Link nhóm Zalo</Text>
        </Pressable>
      </View>

      {/* stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statBadge, styles.statGreen]}>
          <Text style={[styles.statText, styles.statGreenText]}>
            Thành công
          </Text>
          <Text style={[styles.statNum, styles.statGreenText]}>
            {stats.success}
          </Text>
        </View>

        <View style={[styles.statBadge, styles.statOrange]}>
          <Text style={styles.statText}>Chờ ghép</Text>
          <Text style={styles.statNum}>{stats.waitingPair}</Text>
        </View>

        <View style={[styles.statBadge, styles.statGrey]}>
          <Text style={styles.statText}>Còn chỗ</Text>
          <Text style={styles.statNum}>{stats.capacity}</Text>
        </View>
      </View>

      {/* search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Nhập tên, SĐT VĐV để tìm kiếm..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <Ionicons name="search" size={18} color="#9CA3AF" />
        </View>
      </View>

      {/* table header */}
      <View style={styles.tableHeader}>
        <View style={styles.colVdv1}>
          <Text style={styles.thText}>VĐV1</Text>
        </View>
        <View style={styles.colVdv2}>
          <Text style={styles.thText}>VĐV2</Text>
        </View>
        <View style={styles.colPoint}>
          <Text style={styles.thText}>Điểm</Text>
        </View>
      </View>

      {/* list */}
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
