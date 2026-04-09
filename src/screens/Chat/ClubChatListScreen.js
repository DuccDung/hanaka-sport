import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  RefreshControl,
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
  getCommunityReports,
  getCommunityTermsState,
} from "../../services/communitySafetyService";
import { styles } from "./styles";
import { addRealtimeListener } from "../../services/realtimeService";
import { getReviewDemoChatRoom } from "../../mocks/reviewDemoData";

function formatTime(value) {
  if (!value) return "";
  const d = new Date(value);
  const hh = `${d.getHours()}`.padStart(2, "0");
  const mm = `${d.getMinutes()}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  const MM = `${d.getMonth() + 1}`.padStart(2, "0");
  return `${hh}:${mm} ${dd}/${MM}`;
}

function ChatRoomItem({ item, onPress }) {
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

        <Text style={styles.roomLastMsg} numberOfLines={1}>
          {item.lastSenderName
            ? `${item.lastSenderName}: ${item.lastMessagePreview || "Chưa có tin nhắn"}`
            : item.lastMessagePreview || "Chưa có tin nhắn"}
        </Text>
      </View>
    </Pressable>
  );
}

function ReviewHelperCard({ reportCount, onOpenDemoChat, onOpenSafetyCenter }) {
  return (
    <View style={styles.reviewHelperCard}>
      <View style={styles.reviewHelperTop}>
        <View style={styles.reviewHelperBadge}>
          <Ionicons name="shield-checkmark" size={15} color={COLORS.BLUE} />
          <Text style={styles.reviewHelperBadgeText}>Safety tools</Text>
        </View>

        <Text style={styles.reviewHelperCount}>
          Báo cáo gần đây: {reportCount}
        </Text>
      </View>

      <Text style={styles.reviewHelperTitle}>
        Chat CLB đã bật bộ lọc, báo cáo vi phạm và chặn người dùng.
      </Text>
      <Text style={styles.reviewHelperText}>
        Để App Review kiểm tra: mở chat mẫu, chạm biểu tượng lá chắn cạnh tin
        nhắn để báo cáo, hoặc chặn người dùng để ẩn nội dung ngay lập tức.
      </Text>

      <View style={styles.reviewHelperActions}>
        <Pressable style={styles.demoActionBtn} onPress={onOpenDemoChat}>
          <Text style={styles.demoActionText}>Mở chat mẫu</Text>
        </Pressable>

        <Pressable
          style={styles.reviewOutlineBtn}
          onPress={onOpenSafetyCenter}
        >
          <Text style={styles.reviewOutlineBtnText}>Mở safety center</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function ClubChatListScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [termsLoading, setTermsLoading] = useState(true);
  const [termsState, setTermsState] = useState({
    accepted: false,
    acceptedAt: null,
  });
  const [reportCount, setReportCount] = useState(0);

  const loadSafetyState = useCallback(async () => {
    setTermsLoading(true);

    try {
      const [nextTermsState, reports] = await Promise.all([
        getCommunityTermsState(),
        getCommunityReports({ limit: 20 }),
      ]);

      setTermsState(nextTermsState);
      setReportCount(reports.length);
    } finally {
      setTermsLoading(false);
    }
  }, []);

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
    }, [loadSafetyState]),
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

  const listHeader = useMemo(() => {
    if (!termsState.accepted) return null;

    return (
      <ReviewHelperCard
        reportCount={reportCount}
        onOpenDemoChat={openDemoChat}
        onOpenSafetyCenter={() => navigation.navigate("CommunitySafety")}
      />
    );
  }, [navigation, openDemoChat, reportCount, termsState.accepted]);

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
            Đồng ý điều khoản trước khi truy cập nội dung do người dùng tạo.
          </Text>
        </View>

        <View style={styles.termsGateWrap}>
          <CommunityTermsCard
            accepted={false}
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
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <AppStatusBar backgroundColor={COLORS.BLUE} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tin nhắn CLB</Text>
        <Text style={styles.headerSub}>
          Chat cộng đồng đã bật lọc nội dung, báo cáo và chặn người dùng.
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />
          <Text style={styles.stateText}>Đang tải danh sách chat...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
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
            items.length === 0 && { flexGrow: 1 },
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
                onPress={() => navigation.navigate("CommunitySafety")}
              >
                <Text style={styles.reviewOutlineBtnText}>
                  Xem safety center
                </Text>
              </Pressable>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
