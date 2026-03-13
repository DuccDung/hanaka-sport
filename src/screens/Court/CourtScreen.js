import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Alert,
  RefreshControl,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { getPublicCourts } from "../../services/courtService";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function CourtScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [courts, setCourts] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const hasMore = useMemo(() => {
    return courts.length < total;
  }, [courts.length, total]);

  const fetchCourts = useCallback(
    async ({ nextPage = 0, isRefresh = false, isLoadMore = false } = {}) => {
      try {
        if (isRefresh) setRefreshing(true);
        else if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        const res = await getPublicCourts({
          query: normalize(query.trim()),
          page: nextPage,
          pageSize,
        });

        const items = res?.items || [];

        setTotal(Number(res?.total || 0));
        setPage(nextPage);

        if (nextPage === 0) {
          setCourts(items);
        } else {
          setCourts((prev) => {
            const merged = [...prev, ...items];
            const map = new Map();
            merged.forEach((x) => map.set(x.courtId, x));
            return Array.from(map.values());
          });
        }
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "Không tải được danh sách sân.";
        Alert.alert("Lỗi", String(msg));
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [pageSize, query],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourts({ nextPage: 0 });
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchCourts]);

  const onRefresh = () => {
    fetchCourts({ nextPage: 0, isRefresh: true });
  };

  const onEndReached = () => {
    if (loading || loadingMore || refreshing || !hasMore) return;
    fetchCourts({ nextPage: page + 1, isLoadMore: true });
  };

  const onCall = async (phone) => {
    if (!phone) {
      Alert.alert("Thông báo", "Sân chưa có số điện thoại.");
      return;
    }

    const url = `tel:${phone}`;
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert("Thông báo", "Thiết bị không hỗ trợ gọi điện.");
      return;
    }

    await Linking.openURL(url);
  };

  const onSms = async (phone) => {
    if (!phone) {
      Alert.alert("Thông báo", "Sân chưa có số điện thoại.");
      return;
    }

    const url = `sms:${phone}`;
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert("Thông báo", "Thiết bị không hỗ trợ nhắn tin.");
      return;
    }

    await Linking.openURL(url);
  };

  const renderItem = ({ item }) => {
    const images = item.images || [];
    const image1 = images[0] || "";
    const image2 = images[1] || images[0] || "";

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate("CourtDetail", { courtId: item.courtId })
        }
      >
        <View style={styles.imgRow}>
          {image1 ? (
            <Image source={{ uri: image1 }} style={styles.img} />
          ) : (
            <View style={[styles.img, styles.imgFallback]}>
              <Ionicons name="image-outline" size={28} color="#9CA3AF" />
            </View>
          )}

          {image2 ? (
            <Image source={{ uri: image2 }} style={styles.img} />
          ) : (
            <View style={[styles.img, styles.imgFallback]}>
              <Ionicons name="image-outline" size={28} color="#9CA3AF" />
            </View>
          )}
        </View>

        <View style={styles.infoRow}>
          <View style={styles.left}>
            <Text style={styles.name}>{item.courtName}</Text>

            <Text style={styles.line}>
              Khu vực:{" "}
              <Text style={styles.strong}>
                {item.areaText || "Chưa cập nhật"}
              </Text>
            </Text>

            <Text style={styles.line}>
              Quản lý:{" "}
              <Text style={styles.strong}>
                {item.managerName || "Chưa cập nhật"}
              </Text>
            </Text>

            <Text style={styles.line}>
              Điện thoại:{" "}
              <Text style={styles.strong}>{item.phone || "Chưa cập nhật"}</Text>
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.actionBtn}
              hitSlop={10}
              onPress={() => onCall(item.phone)}
            >
              <Ionicons name="call" size={16} color="#2563EB" />
            </Pressable>

            <Pressable
              style={styles.actionBtn}
              hitSlop={10}
              onPress={() => onSms(item.phone)}
            >
              <Ionicons name="chatbubble" size={16} color="#2563EB" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return <View style={{ height: 16 }} />;
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator />
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

          <Text style={styles.headerTitle}>Sân Bãi</Text>
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
      </View>

      {loading && courts.length === 0 ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listPad}
          data={courts}
          keyExtractor={(it) => String(it.courtId)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.25}
          onEndReached={onEndReached}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>Không có sân nào</Text>
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
