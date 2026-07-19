import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AppStatusBar from "../../components/AppStatusBar";
import CommunityTermsCard from "../../components/CommunityTermsCard";
import { COLORS } from "../../constants/colors";
import { COMMUNITY_PRIVACY_URL } from "../../constants/communitySafety";
import { getDirectChatRooms } from "../../services/chatService";
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

function DirectRoomItem({ item, onPress }) {
  const otherUser = item?.otherUser || {};
  const preview = item?.lastMessagePreview || "Chưa có tin nhắn";
  const blocked = item?.isBlockedByMe || item?.hasBlockedMe;

  return (
    <Pressable style={styles.roomCard} onPress={onPress}>
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
  );
}

export default function ChatHomeScreen({ navigation }) {
  const { session } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [termsLoading, setTermsLoading] = useState(true);
  const [termsState, setTermsState] = useState({
    accepted: false,
    acceptedAt: null,
  });
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

  useEffect(() => {
    setItems([]);
    setLoading(true);
    setRefreshing(false);
    setTermsLoading(true);
    setTermsState({
      accepted: false,
      acceptedAt: null,
    });
  }, [safetyScopeKey]);

  useFocusEffect(
    useCallback(() => {
      loadTermsState();
    }, [loadTermsState, safetyScopeKey]),
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

  const listHeader = useMemo(
    () => (
      <View style={styles.chatModeRow}>
        <Pressable style={[styles.chatModeBtn, styles.chatModeBtnActive]}>
          <Ionicons name="person-circle" size={18} color="#fff" />
          <Text style={[styles.chatModeText, styles.chatModeTextActive]}>
            Cá nhân
          </Text>
        </Pressable>

        <Pressable
          style={styles.chatModeBtn}
          onPress={() => navigation.navigate("ClubChatList")}
        >
          <Ionicons name="people-circle-outline" size={18} color={COLORS.BLUE} />
          <Text style={styles.chatModeText}>CLB</Text>
        </Pressable>
      </View>
    ),
    [navigation],
  );

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
            <Text style={styles.headerSub}>
              Nhắn tin cá nhân hoặc trao đổi cùng CLB.
            </Text>
          </View>

          <Pressable
            style={styles.headerIconBtn}
            onPress={() => navigation.navigate("DirectChatSearch")}
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
          ListHeaderComponent={listHeader}
          renderItem={({ item }) => (
            <DirectRoomItem
              item={item}
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
                onPress={() => navigation.navigate("DirectChatSearch")}
              >
                <Text style={styles.demoActionText}>Tìm người để chat</Text>
              </Pressable>

              <Pressable
                style={styles.reviewOutlineBtn}
                onPress={() => navigation.navigate("ClubChatList")}
              >
                <Text style={styles.reviewOutlineBtnText}>Mở chat CLB</Text>
              </Pressable>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
