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
  Share,
  Keyboard,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { styles } from "./styles";
import { getMyClubs } from "../../services/clubService";
import { useAuth } from "../../context/AuthContext";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function mapMyClubItem(apiItem) {
  const ownerLevel =
    apiItem?.owner?.ratingDouble ?? apiItem?.owner?.ratingSingle ?? 0;

  return {
    id: String(apiItem.clubId),
    banner:
      apiItem.coverUrl ||
      "https://via.placeholder.com/1200x600?text=Club+Cover",
    name: apiItem.clubName || "",
    membersCount: apiItem.membersCount ?? 0,
    rating: Number(apiItem.ratingAvg ?? 0),
    reviewsCount: apiItem.reviewsCount ?? 0,
    location: apiItem.areaText || "Chưa cập nhật",
    level: String(ownerLevel || 0),
    wins: apiItem.matchesWin ?? 0,
    draws: apiItem.matchesDraw ?? 0,
    losses: apiItem.matchesLoss ?? 0,
    phone: "",
    myClubStatus: apiItem.myClubStatus,
    myMemberRole: apiItem.myMemberRole,
    canManage: apiItem.canManage,
    allowChallenge: apiItem.allowChallenge,
    createdAt: apiItem.createdAt,
    updatedAt: apiItem.updatedAt,
    joinedAt: apiItem.joinedAt,
    owner: apiItem.owner || null,
  };
}

function ClubCard({ item, onPress }) {
  const onShare = async (e) => {
    e?.stopPropagation?.();

    try {
      await Share.share({
        message: `${item.name}\nKhu vực: ${item.location}\nTrình: ${item.level}\n${item.phone ? `SĐT: ${item.phone}` : ""}`,
      });
    } catch (e) {}
  };

  return (
    <Pressable style={styles.card} onPress={onPress} disabled={!onPress}>
      <Image source={{ uri: item.banner }} style={styles.banner} />

      <View style={styles.cardBody}>
        <View style={styles.titleRow}>
          <Text style={styles.metaText}>{item.name}</Text>
          <Text style={styles.metaLight}> ({item.membersCount ?? 0} tv) </Text>

          <Pressable style={styles.shareBtn} onPress={onShare} hitSlop={10}>
            <Ionicons name="share-social-outline" size={18} color="#1E2430" />
          </Pressable>
        </View>

        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              item.myClubStatus === "MANAGER"
                ? styles.badgeManager
                : item.myClubStatus === "PENDING"
                  ? styles.badgePending
                  : styles.badgeMember,
            ]}
          >
            <Text style={styles.badgeText}>
              {item.myClubStatus === "MANAGER"
                ? "Quản lý"
                : item.myClubStatus === "PENDING"
                  ? "Chờ duyệt"
                  : "Thành viên"}
            </Text>
          </View>
        </View>

        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>{(item.rating ?? 0).toFixed(1)}</Text>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name={
                  i < Math.round(item.rating ?? 0) ? "star" : "star-outline"
                }
                size={14}
                color="#111827"
              />
            ))}
          </View>
          <Text style={styles.ratingLight}>
            ({item.reviewsCount ?? 0} Đánh giá)
          </Text>
        </View>

        <Text style={styles.lineText}>
          Khu vực: <Text style={styles.lineStrong}>{item.location}</Text>
        </Text>

        <View style={styles.statsRow}>
          <Text style={styles.statText}>
            Trình: <Text style={styles.statStrong}>{item.level}</Text>
          </Text>

          <Text style={styles.statText}>
            Thắng: <Text style={styles.statStrong}>{item.wins ?? "-"}</Text>
          </Text>

          <Text style={styles.statText}>
            Hoà: <Text style={styles.statStrong}>{item.draws ?? "-"}</Text>
          </Text>

          <Text style={styles.statText}>
            Thua: <Text style={styles.statStrong}>{item.losses ?? "-"}</Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function MyClubsScreen({ navigation }) {
  const { session } = useAuth();
  const user = session?.user || null;
  const avatarUrl = user?.avatarUrl || null;
  const displayName =
    user?.fullName || user?.name || user?.username || user?.email || "Bạn";

  const [tab, setTab] = useState("ALL");
  const [query, setQuery] = useState("");
  const [serverData, setServerData] = useState([]);
  const [summary, setSummary] = useState({
    totalAll: 0,
    totalManager: 0,
    totalMember: 0,
    totalPending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(
    async ({ isRefresh = false } = {}) => {
      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        const res = await getMyClubs({
          keyword: query,
          status: tab,
          page: 1,
          pageSize: 50,
        });

        setServerData((res?.items || []).map(mapMyClubItem));
        setSummary(
          res?.summary || {
            totalAll: 0,
            totalManager: 0,
            totalMember: 0,
            totalPending: 0,
          },
        );
      } catch (error) {
        console.log(
          "getMyClubs error",
          error?.response?.data || error?.message,
        );
        setServerData([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [query, tab],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const data = useMemo(() => {
    const q = normalize(query.trim());

    return serverData.filter((x) => {
      if (!q) return true;
      const hay = normalize(`${x.name} ${x.location} ${x.level}`);
      return hay.includes(q);
    });
  }, [serverData, query]);

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: COLORS.BLUE }} />
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BLUE} />

      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.helloText}>
            Xin Chào, <Text style={styles.helloStrong}>{displayName}</Text>
          </Text>

          <View style={styles.headerIcons}>
            <Pressable style={styles.headerIconBtn} hitSlop={10}>
              <Ionicons name="help-circle-outline" size={20} color="#fff" />
            </Pressable>

            <Pressable style={styles.headerIconBtn} hitSlop={10}>
              <Ionicons name="notifications-outline" size={20} color="#fff" />
            </Pressable>

            <Pressable style={styles.headerIconBtn} hitSlop={10}>
              <Ionicons name="settings-outline" size={20} color="#fff" />
            </Pressable>

            <Pressable
              onPress={() =>
                user
                  ? navigation.navigate("Account")
                  : navigation.navigate("Login")
              }
              hitSlop={10}
              style={styles.avatarWrap}
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person-circle-outline" size={30} color="#fff" />
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Tất cả: {summary.totalAll}</Text>
          <Text style={styles.summaryText}>
            Quản lý: {summary.totalManager}
          </Text>
          <Text style={styles.summaryText}>
            Tham gia: {summary.totalMember}
          </Text>
          <Text style={styles.summaryText}>
            Chờ duyệt: {summary.totalPending}
          </Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm kiếm CLB..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              fetchData();
            }}
          />
          {!!query && (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />
          <Text style={styles.emptyText}>Đang tải CLB của bạn...</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={[
            styles.listPad,
            data.length === 0 && { flexGrow: 1 },
          ]}
          data={data}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => (
            <ClubCard
              item={item}
              onPress={() => {
                navigation.navigate("ClubDetail", {
                  clubId: Number(item.id),
                  initialTab: "Chung",
                });
              }}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchData({ isRefresh: true })}
              tintColor={COLORS.BLUE}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerBox}>
              <Ionicons name="people-outline" size={42} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Chưa có CLB phù hợp</Text>
              <Text style={styles.emptyText}>
                Bạn chưa có CLB nào trong danh sách hiện tại.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
