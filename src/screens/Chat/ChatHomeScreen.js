import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  PanResponder,
  RefreshControl,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AppStatusBar from "../../components/AppStatusBar";
import CommunityTermsCard from "../../components/CommunityTermsCard";
import { COLORS } from "../../constants/colors";
import { COMMUNITY_PRIVACY_URL } from "../../constants/communitySafety";
import {
  deleteDirectChatRoom,
  getDirectChatSearchPrivacy,
  getDirectChatRooms,
  updateDirectChatSearchPrivacy,
} from "../../services/chatService";
import {
  acceptCommunityChatTerms,
  getCommunityChatTermsState,
} from "../../services/communitySafetyService";
import { addRealtimeListener } from "../../services/realtimeService";
import { useAuth } from "../../context/AuthContext";
import { styles } from "./styles";

function formatTime(value) {
  if (!value) return "";

  const d = new Date(value);
  const hh = `${d.getHours()}`.padStart(2, "0");
  const mm = `${d.getMinutes()}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  const MM = `${d.getMonth() + 1}`.padStart(2, "0");
  return `${hh}:${mm} ${dd}/${MM}`;
}

function getInitials(name) {
  const parts = String(name || "HS")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "HS";
  return parts
    .slice(-2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();
}

const ROOM_ACTION_WIDTH = 82;

function DirectRoomItem({ item, onPress, onDelete, deleting }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const openRef = useRef(false);
  const otherUser = item?.otherUser || {};
  const preview = item?.lastMessagePreview || "Chưa có tin nhắn";
  const blocked = item?.isBlockedByMe || item?.hasBlockedMe;
  const roomId = item?.roomId || item?.directChatRoomId;

  const animateTo = useCallback(
    (value) => {
      openRef.current = value > 0;
      Animated.spring(translateX, {
        toValue: value,
        useNativeDriver: true,
        tension: 70,
        friction: 10,
      }).start();
    },
    [translateX],
  );

  const close = useCallback(() => {
    animateTo(0);
  }, [animateTo]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderMove: (_, gesture) => {
        const base = openRef.current ? ROOM_ACTION_WIDTH : 0;
        const next = Math.max(0, Math.min(ROOM_ACTION_WIDTH, base + gesture.dx));
        translateX.setValue(next);
      },
      onPanResponderRelease: (_, gesture) => {
        const base = openRef.current ? ROOM_ACTION_WIDTH : 0;
        const next = base + gesture.dx;
        animateTo(next > ROOM_ACTION_WIDTH * 0.45 ? ROOM_ACTION_WIDTH : 0);
      },
      onPanResponderTerminate: close,
    }),
  ).current;

  const handlePress = useCallback(() => {
    if (openRef.current) {
      close();
      return;
    }

    onPress?.();
  }, [close, onPress]);

  const handleDeletePress = useCallback(() => {
    if (deleting) return;
    onDelete?.(roomId, close);
  }, [close, deleting, onDelete, roomId]);

  return (
    <View style={styles.swipeRoomWrap}>
      <View style={styles.roomDeleteAction}>
        <Pressable
          style={[styles.roomDeleteBtn, deleting && styles.roomDeleteBtnDisabled]}
          onPress={handleDeletePress}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="trash-outline" size={22} color="#fff" />
          )}
          <Text style={styles.roomDeleteText}>Xóa</Text>
        </Pressable>
      </View>

      <Animated.View
        style={[
          styles.roomSwipeCard,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Pressable style={[styles.roomCard, styles.roomCardSwipe]} onPress={handlePress}>
          {otherUser.avatarUrl ? (
            <Image source={{ uri: otherUser.avatarUrl }} style={styles.roomAvatar} />
          ) : (
            <View style={styles.roomAvatarFallback}>
              <Text style={styles.avatarInitials}>
                {getInitials(otherUser.fullName || item.title)}
              </Text>
            </View>
          )}

          <View style={styles.roomBody}>
            <View style={styles.roomTopRow}>
              <Text style={styles.roomName} numberOfLines={1}>
                {otherUser.fullName || item.title || "Người dùng"}
              </Text>
              <Text style={styles.roomTime}>{formatTime(item.lastMessageAt)}</Text>
            </View>

            <Text style={styles.roomSub} numberOfLines={1}>
              {blocked
                ? item.isBlockedByMe
                  ? "Bạn đang chặn người này"
                  : "Người này hiện không nhận tin nhắn"
                : otherUser.phone || otherUser.city || `ID: ${otherUser.userId || ""}`}
            </Text>

            <View style={styles.roomPreviewRow}>
              <Text
                style={[
                  styles.roomLastMsg,
                  blocked && styles.roomLastMsgHidden,
                  { flex: 1 },
                ]}
                numberOfLines={1}
              >
                {item.lastSenderName && item.lastMessagePreview
                  ? `${item.lastSenderName}: ${preview}`
                  : preview}
              </Text>

              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>
                    {item.unreadCount > 99 ? "99+" : item.unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default function ChatHomeScreen({ navigation }) {
  const { session } = useAuth();
  const isLoggedIn = !!session?.accessToken;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState(null);
  const [termsLoading, setTermsLoading] = useState(true);
  const [termsState, setTermsState] = useState({
    accepted: false,
    acceptedAt: null,
  });
  const [isHiddenFromChatSearch, setIsHiddenFromChatSearch] = useState(false);
  const [searchPrivacyLoading, setSearchPrivacyLoading] = useState(false);
  const [searchPrivacySaving, setSearchPrivacySaving] = useState(false);
  const safetyScopeKey = `${session?.accessToken || "guest"}:${session?.user?.userId || "guest"}`;

  const loadTermsState = useCallback(async () => {
    setTermsLoading(true);

    try {
      const nextTermsState = await getCommunityChatTermsState();
      setTermsState(nextTermsState);
    } finally {
      setTermsLoading(false);
    }
  }, []);

  const fetchRooms = useCallback(async ({ isRefresh = false } = {}) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getDirectChatRooms({ page: 1, pageSize: 50 });
      setItems(res?.items || []);
    } catch (error) {
      console.log(
        "getDirectChatRooms error",
        error?.response?.data || error?.message,
      );
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadSearchPrivacy = useCallback(async () => {
    if (!isLoggedIn) {
      setIsHiddenFromChatSearch(false);
      return;
    }

    try {
      setSearchPrivacyLoading(true);
      const res = await getDirectChatSearchPrivacy();
      setIsHiddenFromChatSearch(!!res?.isHiddenFromChatSearch);
    } catch (error) {
      console.log(
        "getDirectChatSearchPrivacy error",
        error?.response?.data || error?.message,
      );
    } finally {
      setSearchPrivacyLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setItems([]);
    setLoading(true);
    setRefreshing(false);
    setTermsLoading(true);
    setTermsState({
      accepted: false,
      acceptedAt: null,
    });
    setIsHiddenFromChatSearch(false);
    setSearchPrivacyLoading(false);
    setSearchPrivacySaving(false);
  }, [safetyScopeKey]);

  useFocusEffect(
    useCallback(() => {
      loadTermsState();
    }, [loadTermsState, safetyScopeKey]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!termsState.accepted) return undefined;

      loadSearchPrivacy();

      return undefined;
    }, [loadSearchPrivacy, termsState.accepted]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!termsState.accepted) return undefined;

      fetchRooms();

      const unsubscribe = addRealtimeListener((event) => {
        if (
          event?.type === "direct.notification" ||
          event?.type === "direct.message.created" ||
          event?.type === "direct.message.recalled" ||
          event?.type === "direct.message.updated" ||
          event?.type === "direct.message.deleted" ||
          event?.type === "direct.block.changed"
        ) {
          fetchRooms({ isRefresh: false });
        }
      });

      return () => {
        unsubscribe();
      };
    }, [fetchRooms, termsState.accepted]),
  );

  const onAcceptTerms = useCallback(async () => {
    const nextState = await acceptCommunityChatTerms({
      source: "direct_chat_gate",
    });

    setTermsState(nextState);
  }, []);

  const goToLogin = useCallback(() => {
    navigation.navigate("AuthStack", {
      screen: "Login",
    });
  }, [navigation]);

  const handleOpenDirectSearch = useCallback(() => {
    if (!isLoggedIn) {
      Alert.alert(
        "Bạn chưa đăng nhập",
        "Vui lòng đăng nhập để tìm người và bắt đầu trò chuyện.",
        [
          { text: "Để sau", style: "cancel" },
          {
            text: "Đăng nhập",
            onPress: goToLogin,
          },
        ],
      );
      return;
    }

    navigation.navigate("DirectChatSearch");
  }, [goToLogin, isLoggedIn, navigation]);

  const handleToggleSearchPrivacy = useCallback(
    async (value) => {
      if (!isLoggedIn || searchPrivacySaving) return;

      const previousValue = isHiddenFromChatSearch;
      setIsHiddenFromChatSearch(value);
      setSearchPrivacySaving(true);

      try {
        const res = await updateDirectChatSearchPrivacy(value);
        setIsHiddenFromChatSearch(!!res?.isHiddenFromChatSearch);
      } catch (error) {
        console.log(
          "updateDirectChatSearchPrivacy error",
          error?.response?.data || error?.message,
        );
        setIsHiddenFromChatSearch(previousValue);
        Alert.alert(
          "Không cập nhật được",
          error?.response?.data?.message ||
            error?.message ||
            "Vui lòng thử lại sau.",
        );
      } finally {
        setSearchPrivacySaving(false);
      }
    },
    [isHiddenFromChatSearch, isLoggedIn, searchPrivacySaving],
  );

  const handleDeleteRoom = useCallback((roomId, closeSwipe) => {
    const id = Number(roomId);
    if (!Number.isFinite(id) || id <= 0) return;

    Alert.alert(
      "Xóa cuộc trò chuyện",
      "Bạn có muốn xóa cuộc trò chuyện này khỏi danh sách không?",
      [
        {
          text: "Hủy",
          style: "cancel",
          onPress: closeSwipe,
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingRoomId(id);
              await deleteDirectChatRoom(id);
              setItems((current) =>
                current.filter((item) => {
                  const itemId = Number(item?.roomId || item?.directChatRoomId);
                  return itemId !== id;
                }),
              );
            } catch (error) {
              console.log(
                "deleteDirectChatRoom error",
                error?.response?.data || error?.message,
              );
              closeSwipe?.();
              Alert.alert(
                "Không xóa được",
                error?.response?.data?.message ||
                  error?.message ||
                  "Vui lòng thử lại sau.",
              );
            } finally {
              setDeletingRoomId(null);
            }
          },
        },
      ],
    );
  }, []);

  if (termsLoading) {
    return (
      <View style={styles.safe}>
        <AppStatusBar backgroundColor={COLORS.BLUE} />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trò chuyện</Text>
          <Text style={styles.headerSub}>Đang kiểm tra quyền truy cập chat...</Text>
        </View>

        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />
          <Text style={styles.stateText}>Đang tải...</Text>
        </View>
      </View>
    );
  }

  if (!termsState.accepted) {
    return (
      <View style={styles.safe}>
        <AppStatusBar backgroundColor={COLORS.BLUE} />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trò chuyện</Text>
          <Text style={styles.headerSub}>
            Đồng ý điều khoản trước khi nhắn tin với thành viên khác.
          </Text>
        </View>

        <ScrollView
          style={styles.termsGateScroll}
          contentContainerStyle={styles.termsGateScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.termsGateWrap}>
            <CommunityTermsCard
              accepted={false}
              compact
              onAccept={onAcceptTerms}
              onOpenSafetyCenter={() => navigation.navigate("CommunitySafety")}
              onOpenPrivacy={() =>
                navigation.navigate("PolicyWebView", {
                  title: "Chính sách quyền riêng tư",
                  url: COMMUNITY_PRIVACY_URL,
                })
              }
              acceptButtonLabel="Tôi đồng ý và vào khu vực chat"
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <AppStatusBar backgroundColor={COLORS.BLUE} />

      <View style={styles.header}>
        <View style={styles.chatHeaderRow}>
          <View style={styles.roomHeaderBody}>
            <Text style={styles.headerTitle}>Trò chuyện</Text>
          </View>

          <Pressable
            style={styles.headerIconBtn}
            onPress={handleOpenDirectSearch}
            hitSlop={8}
          >
            <Ionicons name="search" size={19} color="#fff" />
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />
          <Text style={styles.stateText}>Đang tải danh sách chat...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.roomId || item.directChatRoomId)}
          renderItem={({ item }) => (
            <DirectRoomItem
              item={item}
              deleting={
                deletingRoomId === Number(item?.roomId || item?.directChatRoomId)
              }
              onDelete={handleDeleteRoom}
              onPress={() =>
                navigation.navigate("DirectChatRoom", {
                  roomId: item.roomId || item.directChatRoomId,
                  room: item,
                  otherUser: item.otherUser,
                })
              }
            />
          )}
          contentContainerStyle={[
            styles.listPad,
            items.length === 0 && { flexGrow: 1 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchRooms({ isRefresh: true })}
              tintColor={COLORS.BLUE}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Ionicons name="chatbubble-ellipses-outline" size={34} color="#94A3B8" />
              <Text style={styles.stateText}>
                Bạn chưa có cuộc trò chuyện cá nhân nào.
              </Text>

              <Pressable
                style={styles.demoActionBtn}
                onPress={handleOpenDirectSearch}
              >
                <Text style={styles.demoActionText}>Tìm người để chat</Text>
              </Pressable>

            </View>
          }
          ListHeaderComponent={
            isLoggedIn ? (
              <View style={styles.chatPrivacyCard}>
                <View style={styles.chatPrivacyIcon}>
                  <Ionicons
                    name={isHiddenFromChatSearch ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={COLORS.BLUE}
                  />
                </View>

                <View style={styles.chatPrivacyBody}>
                  <Text style={styles.chatPrivacyTitle}>
                    Ẩn tôi khỏi tìm kiếm chat
                  </Text>
                  <Text style={styles.chatPrivacyText}>
                    Người khác sẽ không thấy bạn khi tìm người để nhắn tin.
                  </Text>
                </View>

                {searchPrivacyLoading ? (
                  <ActivityIndicator size="small" color={COLORS.BLUE} />
                ) : (
                  <Switch
                    value={isHiddenFromChatSearch}
                    onValueChange={handleToggleSearchPrivacy}
                    disabled={searchPrivacySaving}
                    trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
                    thumbColor={
                      isHiddenFromChatSearch ? COLORS.BLUE : "#F8FAFC"
                    }
                  />
                )}
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
