import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
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
import AppStatusBar from "../../components/AppStatusBar";
import { COLORS } from "../../constants/colors";
import { styles } from "./styles";
import { getMyClubs } from "../../services/clubService";
import { useAuth } from "../../context/AuthContext";
import { getReviewDemoClubBundle } from "../../mocks/reviewDemoData";

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

function GuestState({ onLoginPress, onDemoPress }) {
  return (
    <View style={styles.centerBox}>
      <Ionicons name="lock-closed-outline" size={44} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>Bạn chưa đăng nhập</Text>
      <Text style={styles.emptyText}>
        Vui lòng đăng nhập để xem và tham gia câu lạc bộ của bạn.
      </Text>

      <Pressable style={styles.primaryActionBtn} onPress={onLoginPress}>
        <Text style={styles.primaryActionText}>Đăng nhập ngay</Text>
      </Pressable>

      <Pressable style={styles.secondaryActionBtn} onPress={onDemoPress}>
        <Text style={styles.secondaryActionText}>Xem CLB mẫu</Text>
      </Pressable>
    </View>
  );
}

function NoClubState({ onGoClubPress, onDemoPress }) {
  return (
    <View style={styles.centerBox}>
      <Ionicons name="people-outline" size={44} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>Bạn chưa tham gia câu lạc bộ</Text>
      <Text style={styles.emptyText}>
        Hãy tham gia một câu lạc bộ để theo dõi thông tin của bạn tại đây.
      </Text>

      <Pressable style={styles.primaryActionBtn} onPress={onGoClubPress}>
        <Text style={styles.primaryActionText}>Đi tới trang CLB</Text>
      </Pressable>

      <Pressable style={styles.secondaryActionBtn} onPress={onDemoPress}>
        <Text style={styles.secondaryActionText}>Xem CLB mẫu</Text>
      </Pressable>
    </View>
  );
}

export default function MyClubsScreen({ navigation }) {
  const { session } = useAuth();
  const user = session?.user || null;
  const isLoggedIn = !!session?.accessToken;

  const avatarUrl = user?.avatarUrl || null;
  const displayName =
    user?.fullName || user?.name || user?.username || user?.email || "Bạn";

  const rootNavigation =
    navigation.getParent?.()?.getParent?.() ||
    navigation.getParent?.() ||
    navigation;

  const [tab, setTab] = useState("ALL");
  const [query, setQuery] = useState("");
  const [serverData, setServerData] = useState([]);
  const [summary, setSummary] = useState({
    totalAll: 0,
    totalManager: 0,
    totalMember: 0,
    totalPending: 0,
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(
    async ({ isRefresh = false } = {}) => {
      if (!isLoggedIn) {
        setServerData([]);
        setSummary({
          totalAll: 0,
          totalManager: 0,
          totalMember: 0,
          totalPending: 0,
        });
        setLoading(false);
        setRefreshing(false);
        return;
      }

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
        setSummary({
          totalAll: 0,
          totalManager: 0,
          totalMember: 0,
          totalPending: 0,
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [isLoggedIn, query, tab],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData({ isRefresh: false });
    });

    return unsubscribe;
  }, [navigation, fetchData]);

  const data = useMemo(() => {
    const q = normalize(query.trim());

    return serverData.filter((x) => {
      if (!q) return true;
      const hay = normalize(`${x.name} ${x.location} ${x.level}`);
      return hay.includes(q);
    });
  }, [serverData, query]);

  const handleGoLogin = () => {
    rootNavigation.navigate("AuthStack", {
      screen: "Login",
    });
  };

  const handleGoClubPage = () => {
    rootNavigation.navigate("MainTabs", {
      screen: "Home",
      params: {
        screen: "Club",
      },
    });
  };

  const handleOpenDemoClub = () => {
    const demo = getReviewDemoClubBundle();

    navigation.navigate("ClubDetail", {
      clubId: demo.club.clubId,
      initialTab: "Chung",
      demoClub: demo.club,
      demoMembers: demo.members,
      demoPendingMembers: demo.pendingMembers,
    });
  };

  const renderBody = () => {
    if (!isLoggedIn) {
      return (
        <GuestState
          onLoginPress={handleGoLogin}
          onDemoPress={handleOpenDemoClub}
        />
      );
    }

    if (loading) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />
          <Text style={styles.emptyText}>Đang tải CLB của bạn...</Text>
        </View>
      );
    }

    if (!loading && data.length === 0) {
      return (
        <NoClubState
          onGoClubPress={handleGoClubPage}
          onDemoPress={handleOpenDemoClub}
        />
      );
    }

    return (
      <FlatList
        contentContainerStyle={styles.listPad}
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
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.safe}>
      <AppStatusBar backgroundColor={COLORS.BLUE} />

      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.helloText}>
            Xin Chào, <Text style={styles.helloStrong}>{displayName}</Text>
          </Text>

          <View style={styles.headerIcons}>
            <Pressable
              style={styles.headerIconBtn}
              hitSlop={10}
              onPress={() => rootNavigation.navigate("Notification")}
            >
              <Ionicons name="notifications-outline" size={20} color="#fff" />
            </Pressable>

            <Pressable
              style={styles.headerIconBtn}
              hitSlop={10}
              onPress={() => rootNavigation.navigate("Settings")}
            >
              <Ionicons name="settings-outline" size={20} color="#fff" />
            </Pressable>

            <Pressable
              onPress={() =>
                user
                  ? rootNavigation.navigate("Account")
                  : rootNavigation.navigate("AuthStack", {
                      screen: "Login",
                    })
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

        {isLoggedIn ? (
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
        ) : (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              Đăng nhập để xem danh sách câu lạc bộ của bạn
            </Text>
          </View>
        )}
      </View>

      {isLoggedIn ? (
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
      ) : null}

      {renderBody()}
    </View>
  );
}
