import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
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
import { VIDEO_TABS } from "./data/videos";
import {
  getMatchVideos,
  mapVideoUiTabToApiTab,
  mapMatchVideoItemToCard,
} from "../../services/videoService";
import { useAuth } from "../../context/AuthContext";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function VideoCard({ item, onPress }) {
  const onShare = async () => {
    try {
      await Share.share({
        message: `${item.title} • ${item.dateTime}\n${item.videoUrl || ""}`,
      });
    } catch (e) {}
  };

  const p = item.players || [];

  return (
    <Pressable style={styles.card} onPress={onPress} disabled={!onPress}>
      <Image source={{ uri: item.banner }} style={styles.banner} />

      <View style={styles.cardBody}>
        <View style={styles.titleRow}>
          <Text style={styles.metaText}>{item.dateTime || "Chưa có giờ"}</Text>
          {!!item.code && <Text style={styles.metaLight}> • {item.code}</Text>}

          <Pressable
            style={styles.shareBtn}
            onPress={(e) => {
              e.stopPropagation?.();
              onShare();
            }}
            hitSlop={10}
          >
            <Ionicons name="share-social-outline" size={18} color="#1E2430" />
          </Pressable>
        </View>

        <Text style={styles.mainTitle}>{item.title}</Text>

        {!!item.raw?.roundLabel || !!item.raw?.groupName ? (
          <Text style={styles.subMeta}>
            {[
              item.raw?.roundLabel,
              item.raw?.groupName ? `Bảng ${item.raw.groupName}` : null,
            ]
              .filter(Boolean)
              .join(" • ")}
          </Text>
        ) : null}

        <View style={styles.playersGrid}>
          <View style={styles.teamCol}>
            <View>
              <View style={styles.playerRow}>
                <Image
                  source={{ uri: p[0]?.avatar }}
                  style={styles.playerAvatar}
                />
                <Text style={styles.playerName} numberOfLines={1}>
                  {p[0]?.name || "-"}
                </Text>
              </View>
              <View style={styles.scoreUnder}>
                <Text style={styles.scoreSmall}>
                  {item.scores?.[0] !== "" ? item.scores?.[0] : "-"}
                </Text>
              </View>
            </View>

            {!!p[2]?.name && (
              <View>
                <View style={styles.playerRow}>
                  <Image
                    source={{ uri: p[2]?.avatar }}
                    style={styles.playerAvatar}
                  />
                  <Text style={styles.playerName} numberOfLines={1}>
                    {p[2]?.name}
                  </Text>
                </View>
                <View style={styles.scoreUnder}>
                  <Text style={styles.scoreSmall}>
                    {item.scores?.[2] !== "" ? item.scores?.[2] : "-"}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.teamCol}>
            <View>
              <View style={styles.playerRow}>
                <Image
                  source={{ uri: p[1]?.avatar }}
                  style={styles.playerAvatar}
                />
                <Text style={styles.playerName} numberOfLines={1}>
                  {p[1]?.name || "-"}
                </Text>
              </View>
              <View style={styles.scoreUnder}>
                <Text style={styles.scoreSmall}>
                  {item.scores?.[1] !== "" ? item.scores?.[1] : "-"}
                </Text>
              </View>
            </View>

            {!!p[3]?.name && (
              <View>
                <View style={styles.playerRow}>
                  <Image
                    source={{ uri: p[3]?.avatar }}
                    style={styles.playerAvatar}
                  />
                  <Text style={styles.playerName} numberOfLines={1}>
                    {p[3]?.name}
                  </Text>
                </View>
                <View style={styles.scoreUnder}>
                  <Text style={styles.scoreSmall}>
                    {item.scores?.[3] !== "" ? item.scores?.[3] : "-"}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {!!item.videoUrl && (
          <View style={styles.playHintRow}>
            <Ionicons name="play-circle-outline" size={16} color="#111827" />
            <Text style={styles.playHintText}>Xem video</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function VideosScreen({ navigation, route }) {
  const { session } = useAuth();
  const user = session?.user || null;
  const avatarUrl = user?.avatarUrl || null;
  const displayName =
    user?.fullName || user?.name || user?.username || user?.email || "Bạn";

  const tournamentId = route?.params?.tournamentId || undefined;

  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorText, setErrorText] = useState("");

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchVideos = useCallback(
    async ({ nextPage = 1, isRefresh = false, append = false } = {}) => {
      try {
        if (isRefresh) setRefreshing(true);
        else if (append) setLoadingMore(true);
        else setLoading(true);

        setErrorText("");

        const res = await getMatchVideos({
          tab: mapVideoUiTabToApiTab(tab),
          page: nextPage,
          pageSize,
          tournamentId,
        });

        const mapped = (res?.items || []).map((x) =>
          mapMatchVideoItemToCard({ ...x, tab }),
        );

        if (!mountedRef.current) return;

        setItems((prev) => (append ? [...prev, ...mapped] : mapped));
        setPage(res?.page || nextPage);
        setHasMore(Boolean(res?.hasMore));
      } catch (error) {
        if (!mountedRef.current) return;
        setErrorText(
          error?.response?.data?.message ||
            error?.message ||
            "Không tải được danh sách video.",
        );
      } finally {
        if (!mountedRef.current) return;
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [pageSize, tab, tournamentId],
  );

  useEffect(() => {
    fetchVideos({ nextPage: 1, append: false });
  }, [fetchVideos]);

  const onRefresh = useCallback(() => {
    fetchVideos({ nextPage: 1, isRefresh: true, append: false });
  }, [fetchVideos]);

  const onEndReached = useCallback(() => {
    if (loading || loadingMore || refreshing || !hasMore) return;
    fetchVideos({ nextPage: page + 1, append: true });
  }, [fetchVideos, hasMore, loading, loadingMore, page, refreshing]);

  const filteredData = useMemo(() => {
    const q = normalize(query.trim());

    return items.filter((x) => {
      if (!q) return true;

      const hay = normalize(
        [
          x.title,
          x.code,
          x.dateTime,
          x.raw?.team1Name,
          x.raw?.team2Name,
          x.raw?.team1Player1Name,
          x.raw?.team1Player2Name,
          x.raw?.team2Player1Name,
          x.raw?.team2Player2Name,
          x.raw?.roundLabel,
          x.raw?.groupName,
        ]
          .filter(Boolean)
          .join(" "),
      );

      return hay.includes(q);
    });
  }, [items, query]);

  const renderFooter = () => {
    if (!loadingMore) return <View style={{ height: 10 }} />;
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator color={COLORS.BLUE} />
      </View>
    );
  };

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

        <View style={styles.topTabs}>
          {VIDEO_TABS.map((t) => {
            const active = tab === t.key;
            return (
              <Pressable
                key={t.key}
                style={[styles.topTabBtn, active && styles.topTabBtnActive]}
                onPress={() => setTab(t.key)}
              >
                <Text
                  style={[styles.topTabText, active && styles.topTabTextActive]}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm kiếm trận đấu, giải đấu..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />
          <Text style={styles.stateText}>Đang tải danh sách video...</Text>
        </View>
      ) : errorText ? (
        <View style={styles.centerState}>
          <Ionicons name="alert-circle-outline" size={28} color="#EF4444" />
          <Text style={styles.errorText}>{errorText}</Text>

          <Pressable
            style={styles.retryBtn}
            onPress={() => fetchVideos({ nextPage: 1 })}
          >
            <Text style={styles.retryBtnText}>Thử lại</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listPad}
          data={filteredData}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => (
            <VideoCard
              item={item}
              onPress={
                item.videoUrl
                  ? () =>
                      navigation.navigate("VideoPlayer", {
                        title: item.title,
                        videoUrl: item.videoUrl,
                        poster: item.poster,
                        tournamentTitle: item.code,
                        item: item.raw,
                      })
                  : undefined
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Ionicons
                name="videocam-outline"
                size={28}
                color="rgba(30,36,48,0.45)"
              />
              <Text style={styles.stateText}>Không có video phù hợp.</Text>
            </View>
          }
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.3}
          onEndReached={onEndReached}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
