import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  TextInput,
  FlatList,
  Keyboard,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { publicListTournaments } from "../../services/tournamentService";
import { styles } from "./styles";

function formatDateTime(isoString) {
  if (!isoString) return "Chưa có lịch";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "Chưa có lịch";

  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const mon = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${hh}:${mm} ${dd}/${mon}/${yyyy}`;
}

function formatDateOnly(date) {
  if (!date) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function getStatusText(item) {
  if (item?.statusText?.trim()) return item.statusText;

  switch ((item?.status || "").toUpperCase()) {
    case "OPEN":
      return "Đang mở đăng ký";
    case "CLOSED":
      return "Đã đóng đăng ký";
    case "FINISHED":
      return "Đã kết thúc";
    case "DRAFT":
      return "Bản nháp";
    default:
      return item?.status || "Không xác định";
  }
}

function getStatusStyle(status) {
  switch ((status || "").toUpperCase()) {
    case "OPEN":
      return {
        wrap: styles.statusBadgeOpen,
        text: styles.statusBadgeTextOpen,
      };
    case "CLOSED":
      return {
        wrap: styles.statusBadgeClosed,
        text: styles.statusBadgeTextClosed,
      };
    case "FINISHED":
      return {
        wrap: styles.statusBadgeFinished,
        text: styles.statusBadgeTextFinished,
      };
    case "DRAFT":
    default:
      return {
        wrap: styles.statusBadgeDraft,
        text: styles.statusBadgeTextDraft,
      };
  }
}

function Banner({ uri }) {
  if (!uri) {
    return (
      <View style={styles.bannerFallback}>
        <Ionicons name="image-outline" size={28} color="#94A3B8" />
        <Text style={styles.bannerFallbackText}>Không có banner</Text>
      </View>
    );
  }

  return (
    <Image source={{ uri }} style={styles.bannerImage} resizeMode="cover" />
  );
}

export default function MatchListScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState({
    query: "",
    status: "ALL",
    fromDate: null,
    toDate: null,
  });

  const onEndReachedCalledDuringMomentum = useRef(false);

  const clientFilteredItems = useMemo(() => {
    return items.filter((item) => {
      if (appliedFilters.fromDate || appliedFilters.toDate) {
        const start = item?.startTime ? new Date(item.startTime) : null;
        if (!start || Number.isNaN(start.getTime())) return false;

        if (appliedFilters.fromDate) {
          const from = new Date(appliedFilters.fromDate);
          from.setHours(0, 0, 0, 0);
          if (start < from) return false;
        }

        if (appliedFilters.toDate) {
          const to = new Date(appliedFilters.toDate);
          to.setHours(23, 59, 59, 999);
          if (start > to) return false;
        }
      }

      return true;
    });
  }, [items, appliedFilters.fromDate, appliedFilters.toDate]);

  const loadPage = useCallback(
    async ({ nextPage = 1, append = false, useRefresh = false } = {}) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else if (useRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const data = await publicListTournaments({
          page: nextPage,
          pageSize,
          query: appliedFilters.query,
          status: appliedFilters.status,
        });

        const newItems = Array.isArray(data?.items) ? data.items : [];

        setItems((prev) => (append ? [...prev, ...newItems] : newItems));
        setPage(data?.page || nextPage);
        setHasNextPage(!!data?.hasNextPage);
      } catch (err) {
        Alert.alert("Thông báo", err?.message || "Có lỗi xảy ra.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [appliedFilters.query, appliedFilters.status, pageSize],
  );

  useEffect(() => {
    loadPage({ nextPage: 1, append: false });
  }, [loadPage]);

  const applyFilters = () => {
    Keyboard.dismiss();

    if (fromDate && toDate && fromDate > toDate) {
      Alert.alert(
        "Thông báo",
        "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.",
      );
      return;
    }

    setAppliedFilters({
      query: query?.trim() || "",
      status: selectedStatus,
      fromDate,
      toDate,
    });
  };

  const onRefresh = () => {
    loadPage({ nextPage: 1, append: false, useRefresh: true });
  };

  const onLoadMore = () => {
    if (loading || loadingMore || refreshing || !hasNextPage) return;
    if (onEndReachedCalledDuringMomentum.current) return;

    onEndReachedCalledDuringMomentum.current = true;
    loadPage({ nextPage: page + 1, append: true });
  };

  const onChangeFromDate = (_, selectedDate) => {
    setShowFromPicker(false);
    if (selectedDate) {
      setFromDate(selectedDate);
    }
  };

  const onChangeToDate = (_, selectedDate) => {
    setShowToPicker(false);
    if (selectedDate) {
      setToDate(selectedDate);
    }
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedStatus("ALL");
    setFromDate(null);
    setToDate(null);

    setAppliedFilters({
      query: "",
      status: "ALL",
      fromDate: null,
      toDate: null,
    });
  };

  const renderItem = ({ item }) => {
    const badgeStyle = getStatusStyle(item.status);

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate("TournamentDetail", {
            tournamentId: item.tournamentId,
          })
        }
      >
        <Banner uri={item.bannerUrl} />

        <View style={styles.cardBody}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={2} style={styles.cardTitle}>
                {item.title}
              </Text>

              <Text style={styles.subText}>
                {item.gameType || "-"} • {item.formatText || "Chưa có thể thức"}
              </Text>
            </View>

            <View style={[styles.statusBadgeBase, badgeStyle.wrap]}>
              <Text style={[styles.statusBadgeTextBase, badgeStyle.text]}>
                {getStatusText(item)}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={15} color="#64748B" />
            <Text style={styles.metaText}>
              {formatDateTime(item.startTime)}
            </Text>
          </View>

          {!!item.registerDeadline ? (
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={15} color="#64748B" />
              <Text style={styles.metaText}>
                Hạn đăng ký: {formatDateTime(item.registerDeadline)}
              </Text>
            </View>
          ) : null}

          {!!item.locationText || !!item.areaText ? (
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={15} color="#64748B" />
              <Text style={styles.metaText}>
                {[item.locationText, item.areaText].filter(Boolean).join(" • ")}
              </Text>
            </View>
          ) : null}

          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Số đội dự kiến</Text>
              <Text style={styles.infoValue}>{item.expectedTeams ?? 0}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Đã đăng ký</Text>
              <Text style={styles.infoValue}>{item.registeredCount ?? 0}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Đã ghép cặp</Text>
              <Text style={styles.infoValue}>{item.pairedCount ?? 0}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Số trận</Text>
              <Text style={styles.infoValue}>{item.matchesCount ?? 0}</Text>
            </View>
          </View>

          {!!item.organizer || !!item.creatorName ? (
            <Text style={styles.bottomText}>
              {[item.organizer, item.creatorName].filter(Boolean).join(" • ")}
            </Text>
          ) : null}
        </View>
      </Pressable>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return <View style={{ height: 10 }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#2563EB" />
        <Text style={styles.footerLoaderText}>Đang tải thêm...</Text>
      </View>
    );
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} edges={["top"]} />
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

          <Text style={styles.headerTitle}>Danh sách giải đấu</Text>

          <View style={styles.headerRight} />
        </View>

        <View style={styles.filterWrap}>
          <Text style={styles.filterTitle}>Tìm kiếm & lọc</Text>

          <View style={styles.searchBox}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Tìm tên giải, địa điểm, người tổ chức..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              returnKeyType="search"
              onSubmitEditing={applyFilters}
            />
            <Ionicons name="search" size={18} color="#9CA3AF" />
          </View>

          <View style={styles.dateRow}>
            <Pressable
              style={styles.datePickerBtn}
              onPress={() => setShowFromPicker(true)}
            >
              <Ionicons
                name="calendar-clear-outline"
                size={18}
                color="#2563EB"
              />
              <Text style={styles.datePickerText}>
                {fromDate ? formatDateOnly(fromDate) : "Từ ngày"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.datePickerBtn}
              onPress={() => setShowToPicker(true)}
            >
              <Ionicons
                name="calendar-clear-outline"
                size={18}
                color="#2563EB"
              />
              <Text style={styles.datePickerText}>
                {toDate ? formatDateOnly(toDate) : "Đến ngày"}
              </Text>
            </Pressable>
          </View>

          {showFromPicker ? (
            <DateTimePicker
              value={fromDate || new Date()}
              mode="date"
              display="default"
              onChange={onChangeFromDate}
            />
          ) : null}

          {showToPicker ? (
            <DateTimePicker
              value={toDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeToDate}
            />
          ) : null}

          <View style={styles.actionRow}>
            <Pressable style={styles.clearBtn} onPress={clearFilters}>
              <Ionicons name="refresh-outline" size={16} color="#475569" />
              <Text style={styles.clearBtnText}>Đặt lại</Text>
            </Pressable>

            <Pressable style={styles.filterBtn} onPress={applyFilters}>
              <Ionicons name="funnel-outline" size={16} color="#fff" />
              <Text style={styles.filterBtnText}>Lọc dữ liệu</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.centerText}>Đang tải danh sách giải đấu...</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listPad}
          data={clientFilteredItems}
          keyExtractor={(it) => String(it.tournamentId)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.25}
          onEndReached={onLoadMore}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="file-tray-outline" size={44} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Không có giải đấu</Text>
              <Text style={styles.emptyDesc}>
                Không tìm thấy dữ liệu phù hợp với điều kiện lọc.
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
