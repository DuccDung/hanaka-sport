import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  TextInput,
  FlatList,
  Image,
  Keyboard,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "./styles";
import { getReferees } from "../../services/refereeService";
import { useAuth } from "../../context/AuthContext";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatScore(v) {
  const n = Number(v || 0);
  return n % 1 === 0 ? `${n}` : n.toFixed(2).replace(/\.?0+$/, "");
}

export default function RefereeScreen({ navigation, route }) {
  const { session } = useAuth();

  const [query, setQuery] = useState("");
  const [referees, setReferees] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const hasMore = useMemo(
    () => referees.length < total,
    [referees.length, total],
  );

  const fetchReferees = useCallback(
    async ({ nextPage = 1, isRefresh = false, isLoadMore = false } = {}) => {
      try {
        if (isRefresh) setRefreshing(true);
        else if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        const res = await getReferees({
          query: normalize(query.trim()),
          page: nextPage,
          pageSize,
        });

        const items = res?.items || [];

        setTotal(Number(res?.total || 0));
        setPage(nextPage);

        if (nextPage === 1) {
          setReferees(items);
        } else {
          setReferees((prev) => {
            const merged = [...prev, ...items];
            const map = new Map();
            merged.forEach((x) => map.set(x.refereeId, x));
            return Array.from(map.values());
          });
        }
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "Không tải được danh sách trọng tài.";
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
      fetchReferees({ nextPage: 1 });
    }, 350);

    return () => clearTimeout(timer);
  }, [query, fetchReferees]);

  useFocusEffect(
    useCallback(() => {
      const shouldReload = route?.params?.shouldReload;

      if (shouldReload) {
        fetchReferees({ nextPage: 1 });
        navigation.setParams({
          shouldReload: false,
          refreshAt: null,
        });
      }
    }, [route?.params?.shouldReload, fetchReferees, navigation]),
  );

  const onRefresh = () => {
    fetchReferees({ nextPage: 1, isRefresh: true });
  };

  const onEndReached = () => {
    if (loading || loadingMore || refreshing || !hasMore) return;
    fetchReferees({ nextPage: page + 1, isLoadMore: true });
  };

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <View style={styles.colStt}>
        <Text style={styles.thText}>STT</Text>
      </View>

      <View style={styles.colMember}>
        <Text style={styles.thText}>Trọng tài</Text>
      </View>

      <View style={styles.colScoreWrap}>
        <View style={styles.colScore}>
          <Text style={styles.thText}>Điểm đơn</Text>
        </View>
        <View style={styles.colScore}>
          <Text style={styles.thText}>Điểm đôi</Text>
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item, index }) => {
    const stt = index + 1;
    const avatarUrl = item.avatarUrl || "";

    return (
      <Pressable
        style={[styles.item, item.isMine && styles.itemMine]}
        onPress={() =>
          item.isMine
            ? navigation.navigate("RefereeEdit")
            : navigation.navigate("RefereeDetail", {
                refereeId: item.refereeId,
              })
        }
      >
        <View style={styles.colStt}>
          <Text style={[styles.sttText, item.isMine && styles.sttMine]}>
            {stt}
          </Text>
        </View>

        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Ionicons name="person-outline" size={22} color="#9CA3AF" />
          </View>
        )}

        <View style={styles.mid}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.fullName}
            </Text>

            {item.isMine ? (
              <View style={styles.mineBadge}>
                <Text style={styles.mineBadgeText}>Tôi</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.city} numberOfLines={1}>
            {item.city || "Chưa cập nhật"}
          </Text>

          <Text style={item.verified ? styles.statusGood : styles.statusBad}>
            {item.verified ? "Đã xác thực" : "Chưa xác thực"}
          </Text>
        </View>

        <View style={styles.right}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>
              {formatScore(item.levelSingle)}
            </Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>
              {formatScore(item.levelDouble)}
            </Text>
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

          <Text style={styles.headerTitle}>Trọng Tài</Text>

          <View style={styles.headerRight}>
            <Pressable
              style={styles.addBtn}
              hitSlop={10}
              onPress={() => {
                if (!session?.accessToken) {
                  Alert.alert(
                    "Bạn chưa đăng nhập",
                    "Vui lòng đăng nhập để tạo hoặc cập nhật hồ sơ trọng tài.",
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          navigation.navigate("AuthStack", {
                            screen: "Login",
                          });
                        },
                      },
                    ],
                  );
                  return;
                }

                navigation.navigate("RefereeEdit");
              }}
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

        {renderHeader()}
      </View>

      {loading && referees.length === 0 ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={referees}
          keyExtractor={(it) => String(it.refereeId)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.25}
          onEndReached={onEndReached}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>Không có trọng tài nào</Text>
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
