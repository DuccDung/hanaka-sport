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
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { getClubs, joinClub } from "../../services/clubService";
import { useAuth } from "../../context/AuthContext";

function Stars({ value }) {
  const full = Math.round(Number(value || 0));

  return (
    <View style={styles.starsRow}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Ionicons
          key={i}
          name={i < full ? "star" : "star-outline"}
          size={14}
          color="#9CA3AF"
        />
      ))}
    </View>
  );
}

function RelationButton({ item, navigation, onJoin, joiningClubId }) {
  const status = item?.myClubStatus || "NONE";
  const isJoining = joiningClubId === item?.clubId;

  if (status === "MANAGER") {
    return (
      <Pressable
        style={[
          styles.btnPrimary,
          { backgroundColor: "#16A34A", borderColor: "#16A34A" },
        ]}
        onPress={() =>
          navigation.navigate("ClubDetail", {
            clubId: item.clubId,
            club: item,
            initialTab: "Chờ duyệt",
          })
        }
      >
        <Text style={styles.btnText}>Quản lý</Text>
      </Pressable>
    );
  }

  if (status === "MEMBER") {
    return (
      <Pressable
        style={[
          styles.btnPrimary,
          { backgroundColor: "#16A34A", borderColor: "#16A34A" },
        ]}
        disabled
      >
        <Text style={styles.btnText}>Thành viên</Text>
      </Pressable>
    );
  }

  if (status === "PENDING") {
    return (
      <Pressable
        style={[
          styles.btnPrimary,
          { backgroundColor: "#F59E0B", borderColor: "#F59E0B" },
        ]}
        disabled
      >
        <Text style={styles.btnText}>Chờ duyệt</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={[
        styles.btnPrimary,
        { backgroundColor: "#DC2626", borderColor: "#DC2626" },
      ]}
      onPress={() => onJoin(item)}
      disabled={isJoining}
    >
      {isJoining ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.btnText}>Xin vào</Text>
      )}
    </Pressable>
  );
}

export default function ClubScreen({ navigation }) {
  const { session } = useAuth();

  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const pageSize = 10;

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [joiningClubId, setJoiningClubId] = useState(null);

  const canLoadMore = useMemo(
    () => items.length < total,
    [items.length, total],
  );

  const goToLogin = useCallback(() => {
    navigation.navigate("AuthStack", {
      screen: "Login",
    });
  }, [navigation]);

  const requireLogin = useCallback(
    (message) => {
      Alert.alert("Bạn chưa đăng nhập", message, [
        {
          text: "OK",
          onPress: goToLogin,
        },
      ]);
    },
    [goToLogin],
  );

  const fetchClubs = useCallback(
    async ({
      nextPage = 1,
      isRefresh = false,
      isLoadMore = false,
      keyword = submittedQuery,
    } = {}) => {
      try {
        if (isRefresh) setRefreshing(true);
        else if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        const res = await getClubs({
          keyword: String(keyword || "").trim(),
          page: nextPage,
          pageSize,
        });

        const newItems = Array.isArray(res?.items) ? res.items : [];

        setTotal(Number(res?.total || 0));
        setPage(nextPage);

        if (nextPage === 1) {
          setItems(newItems);
        } else {
          setItems((prev) => {
            const merged = [...prev, ...newItems];
            const map = new Map();
            merged.forEach((x) => map.set(x.clubId, x));
            return Array.from(map.values());
          });
        }
      } catch (error) {
        console.log(
          "fetch clubs error:",
          error?.response?.data || error?.message || error,
        );
        Alert.alert("Lỗi", "Không tải được danh sách câu lạc bộ.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [pageSize, submittedQuery],
  );

  useEffect(() => {
    fetchClubs({ nextPage: 1 });
  }, [submittedQuery, fetchClubs]);

  const onSearch = () => {
    Keyboard.dismiss();
    setSubmittedQuery(query);
  };

  const onRefresh = () => {
    fetchClubs({ nextPage: 1, isRefresh: true });
  };

  const onEndReached = () => {
    if (loading || loadingMore || refreshing || !canLoadMore) return;
    fetchClubs({ nextPage: page + 1, isLoadMore: true });
  };

  const handleCreateClub = () => {
    if (!session?.accessToken) {
      requireLogin("Vui lòng đăng nhập để tạo câu lạc bộ.");
      return;
    }

    navigation.navigate("ClubCreate");
  };

  const handleJoinClub = async (item) => {
    if (!session?.accessToken) {
      requireLogin("Vui lòng đăng nhập để gửi yêu cầu tham gia câu lạc bộ.");
      return;
    }

    try {
      setJoiningClubId(item.clubId);

      const res = await joinClub(item.clubId);

      Alert.alert("Thông báo", res?.message || "Đã gửi yêu cầu tham gia.");

      setItems((prev) =>
        prev.map((club) =>
          club.clubId === item.clubId
            ? {
                ...club,
                myClubStatus: "PENDING",
                myMemberRole: "MEMBER",
                canManage: false,
              }
            : club,
        ),
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể gửi yêu cầu tham gia.";
      Alert.alert("Lỗi", String(message));
    } finally {
      setJoiningClubId(null);
    }
  };

  const renderItem = ({ item }) => {
    const membersCount = item.membersCount ?? 0;
    const coverUrl = item.coverUrl || "";
    const areaText = item.areaText || "Chưa có khu vực";
    const ratingAvg = Number(item.ratingAvg || 0);
    const reviewsCount = Number(item.reviewsCount || 0);
    const matchesPlayed = Number(item.matchesPlayed || 0);
    const matchesWin = Number(item.matchesWin || 0);
    const matchesDraw = Number(item.matchesDraw || 0);
    const matchesLoss = Number(item.matchesLoss || 0);

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate("ClubDetail", {
            clubId: item.clubId,
            club: item,
          })
        }
      >
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} style={styles.cover} />
        ) : (
          <View
            style={[
              styles.cover,
              {
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#E5E7EB",
              },
            ]}
          >
            <Ionicons name="image-outline" size={28} color="#9CA3AF" />
          </View>
        )}

        <View style={styles.cardBody}>
          <Text style={styles.title}>
            {item.clubName}
            {membersCount > 0 ? ` (${membersCount} tv)` : ""}
          </Text>

          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>{ratingAvg.toFixed(1)}</Text>
            <Stars value={ratingAvg} />
            <Text style={styles.ratingText}>({reviewsCount} Đánh giá)</Text>
          </View>

          <Text style={styles.metaText}>Khu vực: {areaText}</Text>

          <View style={styles.statsRow}>
            <Text style={styles.statText}>Trận: {matchesPlayed}</Text>
            <Text style={styles.statText}>Thắng: {matchesWin}</Text>
            <Text style={styles.statText}>Hòa: {matchesDraw}</Text>
            <Text style={styles.statText}>Thua: {matchesLoss}</Text>
          </View>

          <View style={styles.btnRow}>
            <RelationButton
              item={item}
              navigation={navigation}
              onJoin={handleJoinClub}
              joiningClubId={joiningClubId}
            />

            <Pressable
              onPress={() =>
                navigation.navigate("ClubDetail", {
                  clubId: item.clubId,
                  club: item,
                })
              }
              style={styles.btnSecondary}
            >
              <Text style={styles.btnText}>Xem chi tiết</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return <View style={{ height: 10 }} />;

    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading || refreshing) return null;

    return (
      <View style={{ paddingTop: 48, alignItems: "center" }}>
        <Ionicons name="people-outline" size={32} color="#9CA3AF" />
        <Text style={{ marginTop: 10, fontSize: 14, color: "#6B7280" }}>
          Không có câu lạc bộ nào
        </Text>
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

          <Text style={styles.headerTitle}>Pickleball</Text>

          <View style={styles.headerRight}>
            <Pressable
              style={styles.addBtn}
              hitSlop={10}
              onPress={handleCreateClub}
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
              placeholder="Tìm kiếm CLB..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              returnKeyType="search"
              onSubmitEditing={onSearch}
            />
            <Pressable onPress={onSearch} hitSlop={10}>
              <Ionicons name="search" size={18} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>

        <View style={styles.filterRow}>
          <Pressable style={styles.filterBtn}>
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text style={styles.filterText}>
              {submittedQuery
                ? `Từ khóa: ${submittedQuery}`
                : "Tất cả câu lạc bộ"}
            </Text>
          </Pressable>
        </View>
      </View>

      {loading && items.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listPad}
          data={items}
          keyExtractor={(it) => String(it.clubId)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onEndReachedThreshold={0.25}
          onEndReached={onEndReached}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
