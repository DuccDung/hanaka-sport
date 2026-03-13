// src/screens/Tournament/TournamentScreen.js
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

import {
  adminListTournaments,
  mapTabToAdminStatus,
} from "../../services/tournamentService";

function normalize(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

// Format DateTime (server trả ISO) => "dd/MM/yyyy HH:mm"
function formatDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(
    d.getHours(),
  )}:${pad2(d.getMinutes())}`;
}

const TAB = {
  ongoing: "Đang",
  finished: "Kết thúc",
};

export default function TournamentScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("ongoing"); //  ongoing | finished

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const status = useMemo(() => mapTabToAdminStatus(tab), [tab]);

  const fetchPage = useCallback(
    async ({ nextPage = 1, append = false } = {}) => {
      const res = await adminListTournaments({
        status,
        page: nextPage,
        pageSize,
      });

      // res: { page, pageSize, total, items }
      setTotal(res.total || 0);
      setPage(res.page || nextPage);

      const newItems = res.items || [];
      setItems((prev) => (append ? [...prev, ...newItems] : newItems));
    },
    [status, pageSize],
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setErrorMsg("");
        setLoading(true);
        if (!mounted) return;

        await fetchPage({ nextPage: 1, append: false });
      } catch (e) {
        if (!mounted) return;
        setErrorMsg(
          e?.response?.data?.message ||
            e?.message ||
            "Không tải được danh sách giải đấu.",
        );
        setItems([]);
        setTotal(0);
        setPage(1);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fetchPage]);

  const onRefresh = useCallback(async () => {
    try {
      setErrorMsg("");
      setRefreshing(true);
      await fetchPage({ nextPage: 1, append: false });
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message ||
          e?.message ||
          "Không tải được danh sách giải đấu.",
      );
    } finally {
      setRefreshing(false);
    }
  }, [fetchPage]);

  const canLoadMore = useMemo(() => {
    return items.length < total;
  }, [items.length, total]);

  const onEndReached = useCallback(async () => {
    if (loading || refreshing || loadingMore) return;
    if (!canLoadMore) return;

    try {
      setLoadingMore(true);
      await fetchPage({ nextPage: page + 1, append: true });
    } catch (e) {
      // load more fail thì chỉ báo nhẹ
      setErrorMsg(
        e?.response?.data?.message || e?.message || "Tải thêm thất bại.",
      );
    } finally {
      setLoadingMore(false);
    }
  }, [loading, refreshing, loadingMore, canLoadMore, fetchPage, page]);

  // Search client-side trên list đã load
  const data = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return items;

    return (items || []).filter((t) => {
      const hay = normalize(
        `${t.title ?? ""} ${t.areaText ?? ""} ${t.locationText ?? ""} ${t.gameType ?? ""}`,
      );
      return hay.includes(q);
    });
  }, [query, items]);

  const renderItem = ({ item }) => {
    const startTimeText = formatDateTime(item.startTime);
    const deadlineText = formatDateTime(item.registerDeadline);

    // server: BannerUrl
    const bannerUri =
      item.bannerUrl ||
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1400&q=80";

    // server: GameType = SINGLE/DOUBLE/MIXED (string)
    const gameTypeLabel =
      item.gameType === "DOUBLE"
        ? "Đôi"
        : item.gameType === "SINGLE"
          ? "Đơn"
          : item.gameType === "MIXED"
            ? "Đôi hỗn hợp"
            : item.gameType || "";

    return (
      <Pressable
        onPress={() =>
          navigation.navigate("TournamentDetail", {
            tournamentId: item.tournamentId,
            preview: item,
          })
        }
        style={styles.card}
      >
        <Image source={{ uri: bannerUri }} style={styles.banner} />

        <View style={styles.cardBody}>
          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.line}>
            Ngày: <Text style={styles.strong}>{startTimeText || "-"}</Text>
          </Text>

          <Text style={styles.line}>
            Hạn đăng ký:{" "}
            <Text style={styles.strong}>{deadlineText || "-"}</Text>
          </Text>

          <View style={styles.twoColRow}>
            <Text style={styles.line}>
              Thể thức:{" "}
              <Text style={styles.strong}>{item.formatText || "-"}</Text>
            </Text>

            <Text style={styles.line}>
              Giải: <Text style={styles.strong}>{gameTypeLabel || "-"}</Text>
            </Text>
          </View>

          <View style={styles.twoColRow}>
            <Text style={styles.line}>
              Giới hạn trình đơn tối đa:{" "}
              <Text style={styles.strong}>{item.singleLimit ?? 0}</Text>
            </Text>
            <Text style={styles.line}>
              Cặp tối đa:{" "}
              <Text style={styles.strong}>{item.doubleLimit ?? 0}</Text>
            </Text>
          </View>

          <Text style={styles.line}>
            Khu vực: <Text style={styles.strong}>{item.areaText || "-"}</Text>
          </Text>

          <View style={styles.smallRow}>
            <Text style={styles.line}>
              Số đội dự kiến:{" "}
              <Text style={styles.strong}>{item.expectedTeams ?? 0}</Text>
            </Text>

            <Text style={styles.line}>
              Số trận thi đấu:{" "}
              <Text style={styles.strong}>{item.matchesCount ?? 0}</Text>
            </Text>
          </View>

          <Text style={styles.line}>
            Tình trạng:{" "}
            <Text style={styles.strong}>
              {item.stateText || item.status || "-"}
            </Text>
          </Text>
        </View>
      </Pressable>
    );
  };

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

        {/* Filter UI (chưa wire API filter theo area - để nguyên) */}
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

      {/* Error / Loading */}
      {errorMsg ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={{ color: "#DC2626" }}>{errorMsg}</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={{ paddingTop: 24 }}>
          <ActivityIndicator />
        </View>
      ) : null}

      {/* List */}
      <FlatList
        contentContainerStyle={styles.listPad}
        data={data}
        keyExtractor={(it) => String(it.tournamentId)} // server field
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
      />
    </View>
  );
}
