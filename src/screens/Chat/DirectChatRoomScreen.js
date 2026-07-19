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
import { Ionicons } from "@expo/vector-icons";
import AppStatusBar from "../../components/AppStatusBar";
import { COLORS } from "../../constants/colors";
import { styles } from "./styles";
import { useAuth } from "../../context/AuthContext";
import {
  blockDirectChatUser,
  getDirectChatMessages,
  recallDirectChatMessage,
  sendDirectChatMessage,
  unblockDirectChatUser,
} from "../../services/chatService";
import {
  addRealtimeListener,
  sendDirectTyping,
  subscribeDirectRoom,
  unsubscribeDirectRoom,
} from "../../services/realtimeService";
import {
  evaluateCommunityContent,
  getSafeCommunityText,
} from "../../services/communitySafetyService";

function formatMessageTime(value) {
  if (!value) return "";
  const d = new Date(value);
  const hh = `${d.getHours()}`.padStart(2, "0");
  const mm = `${d.getMinutes()}`.padStart(2, "0");
  return `${hh}:${mm}`;
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

function getSenderId(item) {
  return String(item?.senderUserId ?? item?.sender?.userId ?? "");
}

function getSenderName(item) {
  return item?.sender?.fullName || "Thành viên";
}

function sanitizeIncomingMessage(item) {
  if (!item || typeof item !== "object") return item;

  return {
    ...item,
    content: item?.isRecalled ? "" : getSafeCommunityText(item?.content, ""),
    sender: item?.sender
      ? {
          ...item.sender,
          fullName: getSafeCommunityText(item?.sender?.fullName, ""),
        }
      : item?.sender,
  };
}

function MessageItem({ item, isMine, moderation, onOpenActions }) {
  const isMasked = moderation?.blocked && !item?.isRecalled;
  const text = item?.isRecalled
    ? "Tin nhắn đã được thu hồi."
    : moderation?.maskedText || item.content || "[Tin nhắn]";

  return (
    <Pressable
      onLongPress={() => onOpenActions?.(item)}
      delayLongPress={220}
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
            <Text style={styles.msgAvatarInitials}>
              {getInitials(item.sender?.fullName)}
            </Text>
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
            item?.isRecalled && styles.msgRecalledBubble,
          ]}
        >
          <Text
            style={[
              styles.msgText,
              isMine && styles.msgTextMine,
              isMasked && styles.msgMaskedText,
              item?.isRecalled && styles.msgRecalledText,
            ]}
          >
            {text}
          </Text>
        </View>

        <View style={styles.msgMetaRow}>
          <Text style={styles.msgTime}>{formatMessageTime(item.sentAt)}</Text>
          <Text style={styles.msgHint}>
            {isMine && !item?.isRecalled ? "Giữ để thu hồi" : "Giữ để quản lý"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function DirectChatRoomScreen({ navigation, route }) {
  const { session } = useAuth();
  const roomId = route?.params?.roomId || route?.params?.directChatRoomId;
  const routeRoom = route?.params?.room || {};
  const otherUser = route?.params?.otherUser || routeRoom?.otherUser || {};
  const me = session?.user || null;
  const myUserId = String(me?.userId ?? "");
  const otherUserId = otherUser?.userId || routeRoom?.otherUser?.userId;

  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isBlockedByMe, setIsBlockedByMe] = useState(!!routeRoom?.isBlockedByMe);
  const [hasBlockedMe, setHasBlockedMe] = useState(!!routeRoom?.hasBlockedMe);
  const [typingText, setTypingText] = useState("");

  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const canSend = !isBlockedByMe && !hasBlockedMe;

  const fetchMessages = useCallback(async () => {
    if (!roomId) return;

    try {
      setLoading(true);
      const res = await getDirectChatMessages({
        roomId,
        page: 1,
        pageSize: 100,
      });

      setItems(res?.items || []);
      setIsBlockedByMe(!!res?.isBlockedByMe);
      setHasBlockedMe(!!res?.hasBlockedMe);
    } catch (error) {
      console.log(
        "getDirectChatMessages error",
        error?.response?.data || error?.message,
      );
      Alert.alert(
        "Không thể tải tin nhắn",
        error?.response?.data?.message || "Vui lòng thử lại sau.",
      );
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!roomId) return undefined;

    subscribeDirectRoom(roomId);

    const unsubscribe = addRealtimeListener((event) => {
      if (!event?.type) return;
      const eventRoomId = event.roomId || event.directChatRoomId;

      if (
        event.type === "direct.message.created" &&
        String(eventRoomId) === String(roomId)
      ) {
        const newItem = sanitizeIncomingMessage(event.item);
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
        event.type === "direct.message.recalled" &&
        String(eventRoomId) === String(roomId)
      ) {
        const nextItem = sanitizeIncomingMessage(event.item);
        setItems((prev) =>
          prev.map((x) =>
            String(x.messageId) === String(event.messageId)
              ? nextItem || { ...x, isRecalled: true, content: "" }
              : x,
          ),
        );
      }

      if (
        event.type === "direct.typing" &&
        String(eventRoomId) === String(roomId)
      ) {
        if (String(event.userId) === String(myUserId)) return;

        setTypingText(
          event.isTyping
            ? `${getSafeCommunityText(event.fullName, "Thành viên")} đang nhập...`
            : "",
        );
      }

      if (event.type === "direct.block.changed") {
        const payload = event.payload || {};
        const payloadRoomId = payload.roomId || payload.directChatRoomId;
        const sameRoom = payloadRoomId && String(payloadRoomId) === String(roomId);
        const samePair =
          String(payload.blockerUserId) === String(otherUserId) ||
          String(payload.blockedUserId) === String(otherUserId);

        if (!sameRoom && !samePair) return;

        if (String(payload.blockerUserId) === String(myUserId)) {
          setIsBlockedByMe(!!payload.isBlocked);
        }

        if (String(payload.blockedUserId) === String(myUserId)) {
          setHasBlockedMe(!!payload.isBlocked);
        }
      }
    });

    return () => {
      unsubscribeDirectRoom(roomId);
      sendDirectTyping(roomId, false);
      unsubscribe();
    };
  }, [myUserId, otherUserId, roomId]);

  useEffect(() => {
    if (items.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd?.({ animated: true });
      }, 100);
    }
  }, [items.length]);

  const onChangeText = useCallback(
    (value) => {
      setText(value);

      if (!roomId || !canSend) return;

      sendDirectTyping(roomId, value.trim().length > 0);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        sendDirectTyping(roomId, false);
      }, 1200);
    },
    [canSend, roomId],
  );

  const onSend = useCallback(async () => {
    const content = text.trim();
    if (!content || sending || !canSend) return;

    const moderation = evaluateCommunityContent(content);
    if (moderation.blocked) {
      Alert.alert(
        "Tin nhắn bị chặn",
        `Nội dung bạn nhập có dấu hiệu ${moderation.category?.toLowerCase()}. Vui lòng chỉnh lại trước khi gửi.`,
      );
      return;
    }

    const optimistic = {
      messageId: `temp-${Date.now()}`,
      roomId,
      senderUserId: myUserId,
      messageType: "text",
      content,
      sentAt: new Date().toISOString(),
      isRecalled: false,
      sender: {
        userId: myUserId,
        fullName: me?.fullName || me?.name || me?.username || "Bạn",
        avatarUrl: me?.avatarUrl || null,
      },
    };

    try {
      setSending(true);
      setItems((prev) => [...prev, optimistic]);
      setText("");
      sendDirectTyping(roomId, false);

      const res = await sendDirectChatMessage(roomId, {
        messageType: "text",
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
        "sendDirectChatMessage error",
        error?.response?.data || error?.message,
      );
      setText(content);
      setItems((prev) =>
        prev.filter((x) => x.messageId !== optimistic.messageId),
      );

      const data = error?.response?.data;
      setIsBlockedByMe(!!data?.isBlockedByMe);
      setHasBlockedMe(!!data?.hasBlockedMe);
      Alert.alert(
        "Không thể gửi tin nhắn",
        data?.message ||
          "Tin nhắn chưa được gửi. Vui lòng kiểm tra kết nối mạng.",
      );
    } finally {
      setSending(false);
    }
  }, [canSend, fetchMessages, me, myUserId, roomId, sending, text]);

  const handleRecall = useCallback(
    async (item) => {
      if (!item?.messageId || item.messageId?.toString?.().startsWith?.("temp-")) {
        return;
      }

      try {
        const res = await recallDirectChatMessage(item.messageId);
        const nextItem = res?.item || { ...item, isRecalled: true, content: "" };
        setItems((prev) =>
          prev.map((x) =>
            String(x.messageId) === String(item.messageId) ? nextItem : x,
          ),
        );
      } catch (error) {
        console.log(
          "recallDirectChatMessage error",
          error?.response?.data || error?.message,
        );
        Alert.alert(
          "Không thể thu hồi",
          error?.response?.data?.message || "Vui lòng thử lại sau.",
        );
      }
    },
    [],
  );

  const blockUser = useCallback(
    async (sourceMessage) => {
      if (!otherUserId) return;

      try {
        await blockDirectChatUser(otherUserId, {
          roomId,
          messageId: sourceMessage?.messageId,
          reason: "other",
          notes: "Blocked from direct chat screen.",
        });
        setIsBlockedByMe(true);
      } catch (error) {
        console.log(
          "blockDirectChatUser error",
          error?.response?.data || error?.message,
        );
        Alert.alert(
          "Không thể chặn",
          error?.response?.data?.message || "Vui lòng thử lại sau.",
        );
      }
    },
    [otherUserId, roomId],
  );

  const unblockUser = useCallback(async () => {
    if (!otherUserId) return;

    try {
      await unblockDirectChatUser(otherUserId);
      setIsBlockedByMe(false);
    } catch (error) {
      console.log(
        "unblockDirectChatUser error",
        error?.response?.data || error?.message,
      );
      Alert.alert(
        "Không thể bỏ chặn",
        error?.response?.data?.message || "Vui lòng thử lại sau.",
      );
    }
  }, [otherUserId]);

  const onOpenMessageActions = useCallback(
    (item) => {
      const isMine = String(getSenderId(item)) === String(myUserId);

      if (isMine) {
        if (item?.isRecalled) return;

        Alert.alert("Tin nhắn của bạn", "Chọn thao tác cho tin nhắn này.", [
          { text: "Thu hồi tin nhắn", style: "destructive", onPress: () => handleRecall(item) },
          { text: "Hủy", style: "cancel" },
        ]);
        return;
      }

      Alert.alert(
        getSenderName(item),
        "Bạn có thể chặn người này để dừng nhận tin nhắn.",
        [
          { text: "Chặn người này", style: "destructive", onPress: () => blockUser(item) },
          { text: "Hủy", style: "cancel" },
        ],
      );
    },
    [blockUser, handleRecall, myUserId],
  );

  const onToggleBlock = useCallback(() => {
    if (isBlockedByMe) {
      Alert.alert(
        "Bỏ chặn người dùng",
        "Sau khi bỏ chặn, hai bên có thể tiếp tục nhắn tin nếu không còn trạng thái chặn khác.",
        [
          { text: "Bỏ chặn", onPress: unblockUser },
          { text: "Hủy", style: "cancel" },
        ],
      );
      return;
    }

    Alert.alert(
      "Chặn người dùng",
      "Bạn sẽ không thể gửi hoặc nhận tin nhắn mới từ người này cho đến khi bỏ chặn.",
      [
        { text: "Chặn", style: "destructive", onPress: () => blockUser(null) },
        { text: "Hủy", style: "cancel" },
      ],
    );
  }, [blockUser, isBlockedByMe, unblockUser]);

  const statusText = useMemo(() => {
    if (typingText) return typingText;
    if (isBlockedByMe) return "Bạn đang chặn người này";
    if (hasBlockedMe) return "Hiện chưa thể nhắn tin";
    return otherUser?.phone || otherUser?.city || "Chat cá nhân";
  }, [hasBlockedMe, isBlockedByMe, otherUser, typingText]);

  return (
    <View style={styles.safe}>
      <AppStatusBar backgroundColor={COLORS.BLUE} />

      <View style={styles.roomHeader}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        {otherUser?.avatarUrl ? (
          <Image source={{ uri: otherUser.avatarUrl }} style={styles.headerAvatar} />
        ) : (
          <View style={styles.headerAvatarFallback}>
            <Text style={styles.headerAvatarInitials}>
              {getInitials(otherUser?.fullName)}
            </Text>
          </View>
        )}

        <View style={styles.roomHeaderBody}>
          <Text style={styles.roomHeaderTitle} numberOfLines={1}>
            {otherUser?.fullName || "Chat cá nhân"}
          </Text>
          <Text style={styles.roomHeaderSub} numberOfLines={1}>
            {statusText}
          </Text>
        </View>

        <Pressable onPress={onToggleBlock} hitSlop={10}>
          <Ionicons
            name={isBlockedByMe ? "lock-open-outline" : "ban-outline"}
            size={20}
            color="#fff"
          />
        </Pressable>
      </View>

      {(isBlockedByMe || hasBlockedMe) && (
        <View style={styles.blockBanner}>
          <Ionicons name="information-circle-outline" size={18} color="#9A3412" />
          <Text style={styles.blockBannerText}>
            {isBlockedByMe
              ? "Bạn đã chặn người này. Bỏ chặn để tiếp tục nhắn tin."
              : "Người này hiện không thể nhận tin nhắn từ bạn."}
          </Text>
        </View>
      )}

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
              data={items}
              keyExtractor={(item) => String(item.messageId)}
              renderItem={({ item }) => {
                const isMine = String(getSenderId(item)) === String(myUserId);
                const moderation = evaluateCommunityContent(item.content);

                return (
                  <MessageItem
                    item={item}
                    isMine={isMine}
                    moderation={moderation}
                    onOpenActions={onOpenMessageActions}
                  />
                );
              }}
              contentContainerStyle={[
                styles.msgListPad,
                items.length === 0 && { flexGrow: 1 },
              ]}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.centerState}>
                  <Ionicons name="chatbubble-outline" size={30} color="#94A3B8" />
                  <Text style={styles.stateText}>
                    Chưa có tin nhắn. Bắt đầu cuộc trò chuyện bằng lời chào.
                  </Text>
                </View>
              }
            />

            <View style={styles.inputBar}>
              <TextInput
                value={text}
                onChangeText={onChangeText}
                placeholder={canSend ? "Nhập tin nhắn..." : "Chat đang bị khóa"}
                placeholderTextColor="#9CA3AF"
                style={[styles.input, !canSend && styles.inputDisabled]}
                editable={canSend}
                multiline
              />

              <Pressable
                style={[
                  styles.sendBtn,
                  (!text.trim() || sending || !canSend) && { opacity: 0.5 },
                ]}
                onPress={onSend}
                disabled={!text.trim() || sending || !canSend}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </Pressable>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
