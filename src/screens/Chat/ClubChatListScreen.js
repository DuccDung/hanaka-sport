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
import { getMyClubChatRooms } from "../../services/chatService";
import {
  acceptCommunityTerms,
  getBlockedUsers,
  getCommunityReports,
  getCommunityTermsState,
  getSafeCommunityText,
} from "../../services/communitySafetyService";
import { styles } from "./styles";
import { addRealtimeListener } from "../../services/realtimeService";
import { getReviewDemoChatRoom } from "../../mocks/reviewDemoData";
import { useAuth } from "../../context/AuthContext";

function formatTime(value) {
  if (!value) return "";
  const d = new Date(value);
  const hh = `${d.getHours()}`.padStart(2, "0");
  const mm = `${d.getMinutes()}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  const MM = `${d.getMonth() + 1}`.padStart(2, "0");
  return `${hh}:${mm} ${dd}/${MM}`;
}

function normalizeId(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizeName(value) {
  return String(value || "").trim().toLowerCase();
}

function getRoomLastSenderId(item) {
  return normalizeId(
    item?.lastSenderUserId ??
      item?.lastMessageSenderUserId ??
      item?.lastMessage?.senderUserId ??
      item?.lastMessage?.sender?.userId ??
      item?.senderUserId,
  );
}

function ChatRoomItem({ item, onPress }) {
  const previewText = item.lastMessagePreview || "Chưa có tin nhắn";

  return (
    <Pressable style={styles.roomCard} onPress={onPress}>
      {item.clubCoverUrl ? (
        <Image source={{ uri: item.clubCoverUrl }} style={styles.roomAvatar} />
      ) : (
        <View style={styles.roomAvatarFallback}>
          <Ionicons name="people-outline" size={20} color={COLORS.BLUE} />
        </View>
      )}

      <View style={styles.roomBody}>
        <View style={styles.roomTopRow}>
          <Text style={styles.roomName} numberOfLines={1}>
            {item.clubName}
          </Text>
          <Text style={styles.roomTime}>{formatTime(item.lastMessageAt)}</Text>
        </View>

        <Text style={styles.roomSub} numberOfLines={1}>
          {item.areaText || "Chưa cập nhật khu vực"}
        </Text>

        <Text
          style={[
            styles.roomLastMsg,
            item.isLastMessageHidden && styles.roomLastMsgHidden,
          ]}
          numberOfLines={1}
        >
          {item.lastSenderName && !item.isLastMessageHidden
            ? `${item.lastSenderName}: ${previewText}`
            : previewText}
        </Text>
      </View>
    </Pressable>
  );
}

function ReviewHelperCard({ reportCount, onOpenDemoChat, onManageBlocks }) {
  return (
    <View style={styles.reviewHelperCard}>
      <View style={styles.reviewHelperTop}>
        <View style={styles.reviewHelperBadge}>
          <Ionicons name="shield-checkmark" size={15} color={COLORS.BLUE} />
          <Text style={styles.reviewHelperBadgeText}>Công cụ an toàn</Text>
        </View>

        <Text style={styles.reviewHelperCount}>
          Báo cáo gần đây: {reportCount}
        </Text>
      </View>

      <Text style={styles.reviewHelperTitle}>
        Báo cáo vi phạm và quản lý chặn ngay trong chat CLB.
      </Text>

      <View style={styles.reviewHelperActions}>
        <Pressable style={styles.demoActionBtn} onPress={onOpenDemoChat}>
          <Text style={styles.demoActionText}>Mở chat mẫu</Text>
        </Pressable>

        <Pressable style={styles.reviewOutlineBtn} onPress={onManageBlocks}>
          <Text style={styles.reviewOutlineBtnText}>Quản lý chặn</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function ClubChatListScreen({ navigation }) {
  const { session } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [termsLoading, setTermsLoading] = useState(true);
  const [termsState, setTermsState] = useState({
    accepted: false,
    acceptedAt: null,
  });
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [reportCount, setReportCount] = useState(0);
  const safetyScopeKey = `${session?.accessToken || "guest"}:${session?.user?.userId || "guest"}`;

  const loadSafetyState = useCallback(async () => {
    setTermsLoading(true);

    try {
      const [nextTermsState, nextBlockedUsers, reports] = await Promise.all([
        getCommunityTermsState(),
        getBlockedUsers(),
        getCommunityReports({ limit: 20 }),
      ]);

      setTermsState(nextTermsState);
      setBlockedUsers(Array.isArray(nextBlockedUsers) ? nextBlockedUsers : []);
      setReportCount(reports.length);
    } finally {
      setTermsLoading(false);
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
    setBlockedUsers([]);
    setReportCount(0);
  }, [safetyScopeKey]);

  const fetchRooms = useCallback(async ({ isRefresh = false } = {}) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getMyClubChatRooms({ page: 1, pageSize: 50 });
      setItems(res?.items || []);
    } catch (error) {
      console.log(
        "getMyClubChatRooms error",
        error?.response?.data || error?.message,
      );
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSafetyState();
    }, [loadSafetyState, safetyScopeKey]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!termsState.accepted) return undefined;

      fetchRooms();

      const unsubscribe = addRealtimeListener((event) => {
        if (
          event?.type === "club.notification" ||
          event?.type === "club.message.created" ||
          event?.type === "club.message.deleted"
        ) {
          fetchRooms({ isRefresh: false });
        }
      });

      return () => {
        unsubscribe();
      };
    }, [fetchRooms, termsState.accepted]),
  );

  const openDemoChat = useCallback(() => {
    const demoRoom = getReviewDemoChatRoom();

    navigation.navigate("ClubChatRoom", {
      clubId: demoRoom.clubId,
      clubName: demoRoom.clubName,
      clubCoverUrl: demoRoom.clubCoverUrl,
      demoRoom: true,
    });
  }, [navigation]);

  const onAcceptTerms = useCallback(async () => {
    const nextState = await acceptCommunityTerms({
      source: "chat_gate",
    });

    setTermsState(nextState);
  }, []);

  const openBlockManager = useCallback(() => {
    navigation.navigate("CommunitySafety");
  }, [navigation]);

  const displayItems = useMemo(() => {
    return items.map((item) => {
      const rawPreview = String(item?.lastMessagePreview || "").trim();
      const safePreview = getSafeCommunityText(rawPreview, "Chưa có tin nhắn");
      const lastSenderId = getRoomLastSenderId(item);
      const lastSenderName = normalizeName(item?.lastSenderName);

      const blockedItem = blockedUsers.find((blockedUser) => {
        const blockedUserId = normalizeId(blockedUser?.userId);
        const blockedUserName = normalizeName(blockedUser?.fullName);

        if (lastSenderId && blockedUserId && blockedUserId === lastSenderId) {
          return true;
        }

        return lastSenderName && blockedUserName && blockedUserName === lastSenderName;
      });

      if (blockedItem) {
        return {
          ...item,
          lastSenderName: null,
          lastMessagePreview: "Tin nhắn từ người dùng bị chặn đã được ẩn.",
          isLastMessageHidden: true,
        };
      }

      return {
        ...item,
        lastMessagePreview: safePreview,
        isLastMessageHidden: !!rawPreview && safePreview !== rawPreview,
      };
    });
  }, [blockedUsers, items]);

  const listHeader = useMemo(() => {
    if (!termsState.accepted) return null;

    return (
      <ReviewHelperCard
        reportCount={reportCount}
        onOpenDemoChat={openDemoChat}
        onManageBlocks={openBlockManager}
      />
    );
  }, [openDemoChat, openBlockManager, reportCount, termsState.accepted]);

  if (termsLoading) {
    return (
      <View style={styles.safe}>
        <AppStatusBar backgroundColor={COLORS.BLUE} />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tin nhắn CLB</Text>
          <Text style={styles.headerSub}>
            Đang kiểm tra điều khoản sử dụng cộng đồng...
          </Text>
        </View>

        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />
          <Text style={styles.stateText}>Đang tải quyền truy cập chat...</Text>
        </View>
      </View>
    );
  }

  if (!termsState.accepted) {
    return (
      <View style={styles.safe}>
        <AppStatusBar backgroundColor={COLORS.BLUE} />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tin nhắn CLB</Text>
          <Text style={styles.headerSub}>
            Đồng ý điều khoản trước khi vào khu vực chat.
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
              onOpenSafetyCenter={openBlockManager}
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
        <Text style={styles.headerTitle}>Tin nhắn CLB</Text>
        <Text style={styles.headerSub}>
          Trao đổi cùng thành viên CLB và quản lý an toàn ngay trong chat.
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />
          <Text style={styles.stateText}>Đang tải danh sách chat...</Text>
        </View>
      ) : (
        <FlatList
          data={displayItems}
          keyExtractor={(item) => String(item.clubId)}
          renderItem={({ item }) => (
            <ChatRoomItem
              item={item}
              onPress={() =>
                navigation.navigate("ClubChatRoom", {
                  clubId: item.clubId,
                  clubName: item.clubName,
                  clubCoverUrl: item.clubCoverUrl,
                })
              }
            />
          )}
          contentContainerStyle={[
            styles.listPad,
            displayItems.length === 0 && { flexGrow: 1 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchRooms({ isRefresh: true })}
              tintColor={COLORS.BLUE}
            />
          }
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Ionicons name="chatbubbles-outline" size={32} color="#9CA3AF" />
              <Text style={styles.stateText}>
                Bạn chưa tham gia CLB nào có thể nhắn tin.
              </Text>

              <Pressable style={styles.demoActionBtn} onPress={openDemoChat}>
                <Text style={styles.demoActionText}>Mở chat mẫu</Text>
              </Pressable>

              <Pressable
                style={styles.reviewOutlineBtn}
                onPress={openBlockManager}
              >
                <Text style={styles.reviewOutlineBtnText}>Quản lý chặn</Text>
              </Pressable>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
