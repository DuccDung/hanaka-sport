// src/screens/Tournament/RegistrationListScreen.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
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
  ActivityIndicator,
  RefreshControl,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./registrationStyles";
import { publicListTournamentRegistrations } from "../../services/tournamentService";
import { getZaloGroupLink } from "../../services/publicLinkService";

function normalize(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function fmtDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(
    d.getHours(),
  )}:${pad2(d.getMinutes())}`;
}

function getInitial(name = "") {
  const s = String(name || "").trim();
  if (!s) return "?";
  const parts = s.split(/\s+/);
  const last = parts[parts.length - 1] || s;
  return last[0]?.toUpperCase() || "?";
}

function isValidHttpUrl(uri) {
  if (!uri) return false;
  const s = String(uri);
  return s.startsWith("http://") || s.startsWith("https://");
}

function AvatarCircle({ uri, name, size = 44 }) {
  const initial = getInitial(name);
  const showImage = isValidHttpUrl(uri);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E5E7EB",
      }}
    >
      {showImage ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={{
            fontSize: size * 0.42,
            fontWeight: "700",
            color: "#374151",
          }}
        >
          {initial}
        </Text>
      )}
    </View>
  );
}

export default function RegistrationListScreen({ navigation, route }) {
  const tournament = route?.params?.tournament;
  const tournamentId = tournament?.tournamentId || route?.params?.tournamentId;

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resp, setResp] = useState(null);
  const [openingZalo, setOpeningZalo] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setErrorMsg("");
      setLoading(true);

      const res = await publicListTournamentRegistrations(tournamentId, "ALL");
      setResp(res);
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message ||
          e?.message ||
          "Không tải được danh sách đăng ký.",
      );
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    try {
      setErrorMsg("");
      setRefreshing(true);

      const res = await publicListTournamentRegistrations(tournamentId, "ALL");
      setResp(res);
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message ||
          e?.message ||
          "Không tải được danh sách đăng ký.",
      );
    } finally {
      setRefreshing(false);
    }
  }, [tournamentId]);

  const handleOpenZaloGroup = useCallback(async () => {
    try {
      setOpeningZalo(true);

      const zaloLink = await getZaloGroupLink();

      if (!zaloLink) {
        Alert.alert("Thông báo", "Hiện chưa có link nhóm Zalo.");
        return;
      }

      const supported = await Linking.canOpenURL(zaloLink);

      if (!supported) {
        Alert.alert("Thông báo", "Không thể mở link nhóm Zalo.");
        return;
      }

      await Linking.openURL(zaloLink);
    } catch (error) {
      Alert.alert("Lỗi", "Mở link nhóm Zalo thất bại.");
    } finally {
      setOpeningZalo(false);
    }
  }, []);

  const allItems = useMemo(() => {
    const successItems = resp?.successItems || [];
    const waitingItems = resp?.waitingItems || [];
    const merged = [...successItems, ...waitingItems];

    return merged.map((r) => {
      const v1 = r.player1;
      const v2 = r.player2;

      return {
        id: String(r.registrationId),
        index: r.regIndex,
        regCode: r.regCode,
        regTime: fmtDateTime(r.regTime),
        points: r.points ?? 0,
        success: !!r.success,
        waitingPair: !!r.waitingPair,
        vdv1: {
          name: v1?.name || "-",
          avatar: v1?.avatar || "",
          level: v1?.level ?? 0,
          verified: !!v1?.verified,
          isGuest: !!v1?.isGuest,
        },
        vdv2: v2
          ? {
              name: v2?.name || "-",
              avatar: v2?.avatar || "",
              level: v2?.level ?? 0,
              verified: !!v2?.verified,
              isGuest: !!v2?.isGuest,
            }
          : {
              name: "Chờ ghép",
              avatar: "",
              level: 0,
              verified: false,
              isGuest: true,
            },
      };
    });
  }, [resp]);

  const data = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return allItems;

    return allItems.filter((r) => {
      const hay = normalize(
        `${r.regCode} ${r.regTime} ${r.vdv1.name} ${r.vdv2.name}`,
      );
      return hay.includes(q);
    });
  }, [query, allItems]);

  const stats = useMemo(() => {
    const c = resp?.counts;

    if (!c) {
      return {
        success: 0,
        waitingPair: 0,
        capacity: tournament?.expectedTeams ?? 0,
      };
    }

    return {
      success: c.success ?? 0,
      waitingPair: c.waiting ?? 0,
      capacity: c.capacityLeft ?? 0,
    };
  }, [resp, tournament]);

  const renderPlayer = (p) => (
    <View style={styles.playerCol}>
      <View style={styles.avatarRing}>
        <AvatarCircle
          uri={p.avatar}
          name={p.name}
          size={styles.avatar?.width || 44}
        />
      </View>

      <Text style={styles.playerName} numberOfLines={2}>
        {p.name}
      </Text>

      <Text style={styles.playerLevel}>({p.level})</Text>

      {p.verified ? (
        <Text style={styles.verifiedText}>Đã xác thực</Text>
      ) : (
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>
            {p.isGuest ? "Khách" : "Chờ xác thực"}
          </Text>
        </View>
      )}
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHeaderRow}>
        <Text style={styles.idx}>{item.index}</Text>
        <Text style={styles.itemHeaderText}>
          Mã đk: <Text style={styles.itemHeaderStrong}>{item.regCode}</Text>{" "}
          {item.regTime}
        </Text>
      </View>

      <View style={styles.gridRow}>
        {renderPlayer(item.vdv1)}
        {renderPlayer(item.vdv2)}

        <View style={styles.pointCol}>
          <Text style={styles.pointsText}>{item.points}</Text>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={{ paddingTop: 24, alignItems: "center" }}>
        <Text style={{ color: "#6B7280" }}>Không có dữ liệu đăng ký.</Text>
      </View>
    );
  };

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

          <Text style={styles.headerTitle}>Danh sách đăng ký</Text>
        </View>
      </View>

      {loading ? (
        <View style={{ paddingTop: 12 }}>
          <ActivityIndicator />
        </View>
      ) : null}

      {errorMsg ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={{ color: "#DC2626" }}>{errorMsg}</Text>

          <Pressable onPress={fetchData} style={{ marginTop: 8 }}>
            <Text style={{ color: "#2563EB" }}>Thử lại</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.linksRow}>
        <Pressable
          style={styles.linkItem}
          hitSlop={10}
          onPress={handleOpenZaloGroup}
          disabled={openingZalo}
        >
          <Ionicons
            name="link-outline"
            size={16}
            color={styles.linkText.color}
          />
          <Text style={styles.linkText}>
            {openingZalo ? "Đang mở nhóm Zalo..." : "Link nhóm Zalo"}
          </Text>
        </Pressable>
      </View>

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

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Nhập tên, mã đăng ký để tìm kiếm..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <Ionicons name="search" size={18} color="#9CA3AF" />
        </View>
      </View>

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

      <FlatList
        contentContainerStyle={styles.listPad}
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
