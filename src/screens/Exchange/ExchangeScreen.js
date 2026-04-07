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
import { getChallengingClubs } from "../../services/clubService";

function formatUpdatedTime(value) {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";

  return date.toLocaleString("vi-VN");
}

function ClubCover({ uri, clubName }) {
  if (uri) {
    return <Image source={{ uri }} style={styles.coverImage} />;
  }

  return (
    <View style={styles.coverFallback}>
      <Ionicons name="image-outline" size={28} color="#9CA3AF" />
      <Text style={styles.coverFallbackText} numberOfLines={1}>
        {clubName || "Câu lạc bộ"}
      </Text>
    </View>
  );
}

export default function ExchangeScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const canLoadMore = useMemo(
    () => items.length < total,
    [items.length, total],
  );

  const fetchChallengingClubs = useCallback(
    async ({ reset = false, keyword = submittedQuery } = {}) => {
      try {
        if (reset) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const nextPage = reset ? 1 : page;

        const res = await getChallengingClubs({
          keyword: keyword.trim(),
          page: nextPage,
          pageSize,
        });

        const nextItems = res?.items || [];

        setTotal(res?.total || 0);

        if (reset) {
          setItems(nextItems);
          setPage(2);
        } else {
          setItems((prev) => [...prev, ...nextItems]);
          setPage((prev) => prev + 1);
        }
      } catch (error) {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Không tải được danh sách câu lạc bộ đang khiêu chiến.";
        Alert.alert("Lỗi", msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, submittedQuery],
  );

  useEffect(() => {
    fetchChallengingClubs({ reset: true, keyword: submittedQuery });
  }, [submittedQuery, fetchChallengingClubs]);

  const onSearch = () => {
    Keyboard.dismiss();
    setSubmittedQuery(query);
  };

  const onRefresh = () => {
    fetchChallengingClubs({ reset: true, keyword: submittedQuery });
  };

  const renderItem = ({ item }) => {
    const coverUrl = item.coverUrl || "";
    const areaText = item.areaText || "Chưa có khu vực";
    const membersCount = Number(item.membersCount || 0);
    const matchesPlayed = Number(item.matchesPlayed || 0);
    const matchesWin = Number(item.matchesWin || 0);
    const matchesDraw = Number(item.matchesDraw || 0);
    const matchesLoss = Number(item.matchesLoss || 0);
    const updatedText = formatUpdatedTime(
      item.challengeUpdatedAt || item.updatedAt || item.createdAt,
    );

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
        <ClubCover uri={coverUrl} clubName={item.clubName} />

        <View style={styles.cardBody}>
          <View style={styles.statusRow}>
            <View style={styles.liveBadge}>
              <Ionicons name="flash-outline" size={14} color="#fff" />
              <Text style={styles.liveBadgeText}>Đang khiêu chiến</Text>
            </View>
          </View>

          <Text style={styles.clubName} numberOfLines={2}>
            {item.clubName}
          </Text>

          <View style={styles.metaLine}>
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>{areaText}</Text>
          </View>

          <View style={styles.metaLine}>
            <Ionicons name="people-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>{membersCount} thành viên</Text>
          </View>

          <View style={styles.metaLine}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>Cập nhật: {updatedText}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{matchesPlayed}</Text>
              <Text style={styles.statLabel}>Trận</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{matchesWin}</Text>
              <Text style={styles.statLabel}>Thắng</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{matchesDraw}</Text>
              <Text style={styles.statLabel}>Hòa</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{matchesLoss}</Text>
              <Text style={styles.statLabel}>Thua</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={styles.detailBtn}
              onPress={() =>
                navigation.navigate("ClubDetail", {
                  clubId: item.clubId,
                  club: item,
                })
              }
            >
              <Text style={styles.detailBtnText}>Xem chi tiết</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderFooter = () => {
    if (!loading) return <View style={{ height: 12 }} />;

    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading || refreshing) return null;

    return (
      <View style={styles.emptyWrap}>
        <Ionicons name="flash-outline" size={34} color="#9CA3AF" />
        <Text style={styles.emptyText}>Không có CLB nào đang khiêu chiến</Text>
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

          <Text style={styles.headerTitle}>Giao lưu</Text>

          <View style={styles.headerRight}>
            <Pressable style={styles.addBtn} hitSlop={10}>
              <Ionicons name="flash-outline" size={22} color="#1E2430" />
            </Pressable>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Tìm CLB đang khiêu chiến..."
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
            <Ionicons name="flash-outline" size={14} color="#16A34A" />
            <Text style={styles.filterText}>
              {submittedQuery
                ? `Từ khóa: ${submittedQuery}`
                : "Đang hiển thị CLB bật khiêu chiến"}
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        contentContainerStyle={styles.listPad}
        data={items}
        keyExtractor={(it) => String(it.clubId)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReachedThreshold={0.25}
        onEndReached={() => {
          if (!loading && canLoadMore) {
            fetchChallengingClubs({ reset: false });
          }
        }}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
