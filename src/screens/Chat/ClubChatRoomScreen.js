import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AppStatusBar from "../../components/AppStatusBar";
import OptionPickerModal from "../../components/OptionPickerModal";
import { COLORS } from "../../constants/colors";
import { COMMUNITY_REPORT_REASONS } from "../../constants/communitySafety";
import { styles } from "./styles";
import { useAuth } from "../../context/AuthContext";
import {
  deleteClubMessage,
  getClubMessages,
  sendClubMessage,
} from "../../services/chatService";
import {
  blockCommunityUser,
  evaluateCommunityContent,
  getBlockedUserIds,
  reportChatMessage,
} from "../../services/communitySafetyService";
import {
  addRealtimeListener,
  subscribeClubRoom,
  unsubscribeClubRoom,
  sendTyping,
} from "../../services/realtimeService";
import {
  getReviewDemoCurrentUser,
  getReviewDemoMessages,
} from "../../mocks/reviewDemoData";

function formatMessageTime(value) {
  if (!value) return "";
  const d = new Date(value);
  const hh = `${d.getHours()}`.padStart(2, "0");
  const mm = `${d.getMinutes()}`.padStart(2, "0");
  return `${hh}:${mm}`;
}

function getSenderId(item) {
  return String(item?.senderUserId ?? item?.sender?.userId ?? "");
}

function getSenderName(item) {
  return item?.sender?.fullName || "Thành viên";
}

function MessageItem({ item, isMine, moderation, onDelete, onOpenActions }) {
  const isMasked = moderation?.blocked;

  return (
    <View
      style={[styles.msgRow, isMine ? styles.msgRowMine : styles.msgRowOther]}
    >
      {!isMine &&
        (item.sender?.avatarUrl ? (
          <Image
            source={{ uri: item.sender.avatarUrl }}
            style={styles.msgAvatar}
          />
        ) : (
          <View style={styles.msgAvatarFallback}>
            <Ionicons name="person-outline" size={14} color={COLORS.BLUE} />
          </View>
        ))}

      <View
        style={[styles.msgBubbleWrap, isMine && { alignItems: "flex-end" }]}
      >
        {!isMine && (
          <Text style={styles.msgSenderName}>{getSenderName(item)}</Text>
        )}

        <View
          style={[
            styles.msgBubble,
            isMine ? styles.msgBubbleMine : styles.msgBubbleOther,
            isMasked && styles.msgMaskedBubble,
          ]}
        >
          <Text
            style={[
              styles.msgText,
              isMine && styles.msgTextMine,
              isMasked && styles.msgMaskedText,
            ]}
          >
            {moderation?.maskedText || item.content || "[Tin nhắn]"}
          </Text>
        </View>

        <View style={styles.msgMetaRow}>
          <Text style={styles.msgTime}>{formatMessageTime(item.sentAt)}</Text>

          {isMine ? (
            <Pressable onPress={() => onDelete?.(item)} hitSlop={8}>
              <Text style={styles.msgDelete}>Xóa</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => onOpenActions?.(item)}
              hitSlop={8}
              style={styles.msgActionBtn}
            >
              <Ionicons name="shield-outline" size={13} color={COLORS.BLUE} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

export default function ClubChatRoomScreen({ navigation, route }) {
  const { session } = useAuth();
  const clubId = route?.params?.clubId;
  const clubName = route?.params?.clubName || "Chat CLB";
  const isDemoRoom = !!route?.params?.demoRoom;
  const me =
    session?.user || (isDemoRoom ? getReviewDemoCurrentUser() : null);
  const myUserId = String(me?.userId ?? "");

  const [items, setItems] = useState(() =>
    isDemoRoom ? getReviewDemoMessages() : [],
  );
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(!isDemoRoom);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [blockedUserIds, setBlockedUserIds] = useState([]);
  const [reportPickerVisible, setReportPickerVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const loadBlockedUsers = useCallback(async () => {
    const blockedIds = await getBlockedUserIds();
    setBlockedUserIds(blockedIds);
  }, []);

  const fetchMessages = useCallback(async () => {
    if (isDemoRoom) {
      setItems(getReviewDemoMessages());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await getClubMessages({
        clubId,
        page: 1,
        pageSize: 100,
      });

      setItems(res?.items || []);
    } catch (error) {
      console.log(
        "getClubMessages error",
        error?.response?.data || error?.message,
      );
    } finally {
      setLoading(false);
    }
  }, [clubId, isDemoRoom]);

  useFocusEffect(
    useCallback(() => {
      loadBlockedUsers();
    }, [loadBlockedUsers]),
  );

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (isDemoRoom) return undefined;

    subscribeClubRoom(clubId);

    const unsubscribe = addRealtimeListener((event) => {
      if (!event?.type) return;

      if (
        event.type === "club.message.created" &&
        String(event.clubId) === String(clubId)
      ) {
        const newItem = event.item;
        if (!newItem) return;

        setItems((prev) => {
          const exists = prev.some(
            (x) => String(x.messageId) === String(newItem.messageId),
          );
          if (exists) return prev;

          const withoutTemp = prev.filter(
            (x) =>
              !(
                String(x.senderUserId) === String(newItem.senderUserId) &&
                x.messageId?.toString?.().startsWith?.("temp-") &&
                x.content === newItem.content
              ),
          );

          return [...withoutTemp, newItem];
        });
      }

      if (
        event.type === "club.message.deleted" &&
        String(event.clubId) === String(clubId)
      ) {
        setItems((prev) =>
          prev.filter((x) => String(x.messageId) !== String(event.messageId)),
        );
      }

      if (
        event.type === "club.typing" &&
        String(event.clubId) === String(clubId)
      ) {
        if (String(event.userId) === String(myUserId)) return;
        if (blockedUserIds.includes(String(event.userId))) return;

        setTypingUsers((prev) => {
          const others = prev.filter(
            (x) => String(x.userId) !== String(event.userId),
          );
          if (!event.isTyping) return others;

          return [
            ...others,
            {
              userId: event.userId,
              fullName: event.fullName || "Thành viên",
            },
          ];
        });
      }
    });

    return () => {
      unsubscribeClubRoom(clubId);
      unsubscribe();
      sendTyping(clubId, false);
    };
  }, [blockedUserIds, clubId, isDemoRoom, myUserId]);

  const visibleItems = useMemo(() => {
    return items.filter(
      (item) => !blockedUserIds.includes(String(getSenderId(item))),
    );
  }, [blockedUserIds, items]);

  useEffect(() => {
    if (visibleItems.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd?.({ animated: true });
      }, 100);
    }
  }, [visibleItems.length]);

  const onChangeText = useCallback(
    (value) => {
      setText(value);

      if (isDemoRoom) return;

      sendTyping(clubId, value.trim().length > 0);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(clubId, false);
      }, 1200);
    },
    [clubId, isDemoRoom],
  );

  const onSend = useCallback(async () => {
    const content = text.trim();
    if (!content || sending) return;

    const moderation = evaluateCommunityContent(content);
    if (moderation.blocked) {
      Alert.alert(
        "Tin nhắn bị chặn",
        `Nội dung bạn nhập có dấu hiệu ${moderation.category?.toLowerCase()}. Vui lòng chỉnh lại trước khi gửi.`,
      );
      return;
    }

    if (isDemoRoom) {
      setItems((prev) => [
        ...prev,
        {
          messageId: `demo-${Date.now()}`,
          senderUserId: myUserId,
          content,
          sentAt: new Date().toISOString(),
          sender: {
            fullName: me?.fullName || "Bạn",
            avatarUrl: me?.avatarUrl || null,
          },
        },
      ]);
      setText("");
      return;
    }

    try {
      setSending(true);

      const optimistic = {
        messageId: `temp-${Date.now()}`,
        senderUserId: myUserId,
        content,
        sentAt: new Date().toISOString(),
        sender: {
          fullName: me?.fullName || me?.name || me?.username || "Bạn",
          avatarUrl: me?.avatarUrl || null,
        },
      };

      setItems((prev) => [...prev, optimistic]);
      setText("");
      sendTyping(clubId, false);

      const res = await sendClubMessage(clubId, {
        messageType: "TEXT",
        content,
      });

      const savedItem = res?.item;
      if (savedItem) {
        setItems((prev) => {
          const withoutTemp = prev.filter(
            (x) => x.messageId !== optimistic.messageId,
          );

          const exists = withoutTemp.some(
            (x) => String(x.messageId) === String(savedItem.messageId),
          );
          if (exists) return withoutTemp;

          return [...withoutTemp, savedItem];
        });
      } else {
        fetchMessages();
      }
    } catch (error) {
      console.log(
        "sendClubMessage error",
        error?.response?.data || error?.message,
      );
      setText(content);
      fetchMessages();
    } finally {
      setSending(false);
    }
  }, [text, sending, isDemoRoom, myUserId, me, clubId, fetchMessages]);

  const onDelete = useCallback(
    async (item) => {
      if (isDemoRoom) {
        setItems((prev) => prev.filter((x) => x.messageId !== item.messageId));
        return;
      }

      try {
        await deleteClubMessage(clubId, item.messageId);
        setItems((prev) => prev.filter((x) => x.messageId !== item.messageId));
      } catch (error) {
        console.log(
          "deleteClubMessage error",
          error?.response?.data || error?.message,
        );
      }
    },
    [clubId, isDemoRoom],
  );

  const openBlockManager = useCallback(() => {
    navigation.navigate("CommunitySafety");
  }, [navigation]);

  const handleBlockUser = useCallback(
    (item) => {
      const senderId = String(getSenderId(item));
      if (!senderId) return;

      Alert.alert(
        "Chặn người dùng",
        `Tin nhắn của ${getSenderName(item)} sẽ bị gỡ khỏi màn hình ngay và một báo cáo moderation sẽ được tạo cho đội ngũ Hanaka Sport.`,
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Chặn",
            style: "destructive",
            onPress: async () => {
              try {
                await blockCommunityUser({
                  clubId,
                  userId: senderId,
                  fullName: getSenderName(item),
                  reason: "hate_or_harassment",
                  messageId: item.messageId,
                  source: isDemoRoom ? "demo_chat_block" : "chat_block",
                });

                setBlockedUserIds((prev) =>
                  prev.includes(senderId) ? prev : [...prev, senderId],
                );

                Alert.alert(
                  "Đã chặn người dùng",
                  "Người dùng đã bị chặn và nội dung của họ đã bị gỡ khỏi cuộc trò chuyện. Bạn có thể bỏ chặn trong mục quản lý chặn.",
                  [
                    {
                      text: "Mở danh sách chặn",
                      onPress: openBlockManager,
                    },
                    {
                      text: "Đóng",
                      style: "cancel",
                    },
                  ],
                );
              } catch (error) {
                Alert.alert(
                  "Không thể chặn",
                  error?.message || "Đã xảy ra lỗi khi chặn người dùng.",
                );
              }
            },
          },
        ],
      );
    },
    [clubId, isDemoRoom, openBlockManager],
  );

  const onOpenMessageActions = useCallback(
    (item) => {
      setSelectedMessage(item);

      Alert.alert(
        getSenderName(item),
        "Chọn hành động moderation cho nội dung này.",
        [
          {
            text: "Báo cáo tin nhắn",
            onPress: () => setReportPickerVisible(true),
          },
          {
            text: "Chặn người dùng",
            style: "destructive",
            onPress: () => {
              setSelectedMessage(null);
              handleBlockUser(item);
            },
          },
          {
            text: "Hủy",
            style: "cancel",
            onPress: () => setSelectedMessage(null),
          },
        ],
      );
    },
    [handleBlockUser],
  );

  const onSelectReportReason = useCallback(
    async (option) => {
      if (!selectedMessage) return;

      try {
        await reportChatMessage({
          clubId,
          messageId: selectedMessage.messageId,
          messageContent: selectedMessage.content || "",
          targetUserId: getSenderId(selectedMessage),
          targetUserName: getSenderName(selectedMessage),
          reason: option?.value || "other",
          source: isDemoRoom ? "demo_chat_report" : "chat_report",
        });

        Alert.alert(
          "Đã gửi báo cáo",
          "Báo cáo của bạn đã được ghi nhận. Đội ngũ Hanaka Sport sẽ xử lý trong vòng 24 giờ.",
        );
      } catch (error) {
        Alert.alert(
          "Không thể báo cáo",
          error?.message || "Đã xảy ra lỗi khi gửi báo cáo.",
        );
      } finally {
        setSelectedMessage(null);
      }
    },
    [clubId, isDemoRoom, selectedMessage],
  );

  const typingText = useMemo(() => {
    if (!typingUsers.length) return "";
    if (typingUsers.length === 1) {
      return `${typingUsers[0].fullName} đang nhập...`;
    }
    return `${typingUsers.length} người đang nhập...`;
  }, [typingUsers]);

  const header = useMemo(() => {
    return (
      <View style={styles.roomHeader}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        <View style={styles.roomHeaderBody}>
          <Text style={styles.roomHeaderTitle} numberOfLines={1}>
            {clubName}
          </Text>
          <Text style={styles.roomHeaderSub}>
            {typingText ||
              (isDemoRoom
                ? "Chat mẫu cho App Review kiểm tra report, block và filter"
                : "Chat thành viên CLB đã bật moderation")}
          </Text>
        </View>

        <Pressable onPress={openBlockManager} hitSlop={10}>
          <Ionicons name="shield-half-outline" size={20} color="#fff" />
        </Pressable>
      </View>
    );
  }, [navigation, clubName, typingText, isDemoRoom, openBlockManager]);

  return (
    <View style={styles.safe}>
      <AppStatusBar backgroundColor={COLORS.BLUE} />

      {header}

      <View style={styles.safetyBanner}>
        <Ionicons name="shield-checkmark" size={18} color={COLORS.BLUE} />
        <View style={styles.safetyBannerBody}>
          <Text style={styles.safetyBannerTitle}>Bộ lọc an toàn đang hoạt động</Text>
          <Text style={styles.safetyBannerText}>
            Tin nhắn phản cảm có thể bị chặn hoặc ẩn. Chạm biểu tượng lá chắn
            cạnh tin nhắn của người khác để báo cáo hoặc chặn người dùng. Muốn
            bỏ chặn, dùng biểu tượng lá chắn trên góc phải.
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={COLORS.BLUE} />
            <Text style={styles.stateText}>Đang tải tin nhắn...</Text>
          </View>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={visibleItems}
              keyExtractor={(item) => String(item.messageId)}
              renderItem={({ item }) => {
                const isMine = String(getSenderId(item)) === String(myUserId);
                const moderation = evaluateCommunityContent(item.content);

                return (
                  <MessageItem
                    item={item}
                    isMine={isMine}
                    moderation={moderation}
                    onDelete={onDelete}
                    onOpenActions={onOpenMessageActions}
                  />
                );
              }}
              contentContainerStyle={styles.msgListPad}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.centerState}>
                  <Ionicons name="shield-outline" size={30} color="#94A3B8" />
                  <Text style={styles.stateText}>
                    Không còn tin nhắn hiển thị. Có thể bạn đã chặn các tài khoản
                    còn lại trong cuộc trò chuyện này.
                  </Text>
                  <Pressable
                    style={styles.reviewOutlineBtn}
                    onPress={openBlockManager}
                  >
                    <Text style={styles.reviewOutlineBtnText}>
                      Mở danh sách chặn
                    </Text>
                  </Pressable>
                </View>
              }
            />

            <View style={styles.inputBar}>
              <View style={{ flex: 1 }}>
                <TextInput
                  value={text}
                  onChangeText={onChangeText}
                  placeholder="Nhập tin nhắn..."
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                  multiline
                />
                <Text style={styles.inputNotice}>
                  Nội dung xúc phạm, đe dọa hoặc phản cảm sẽ bị bộ lọc chặn.
                </Text>
              </View>

              <Pressable
                style={[
                  styles.sendBtn,
                  (!text.trim() || sending) && { opacity: 0.5 },
                ]}
                onPress={onSend}
                disabled={!text.trim() || sending}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </Pressable>
            </View>
          </>
        )}
      </KeyboardAvoidingView>

      <OptionPickerModal
        visible={reportPickerVisible}
        title="Chọn lý do báo cáo"
        options={COMMUNITY_REPORT_REASONS}
        selectedValue={null}
        getLabel={(item) => item.label}
        getValue={(item) => item.value}
        onClose={() => {
          setReportPickerVisible(false);
          setSelectedMessage(null);
        }}
        onSelect={(item) => {
          setReportPickerVisible(false);
          onSelectReportReason(item);
        }}
      />
    </View>
  );
}
