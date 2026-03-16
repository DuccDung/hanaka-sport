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
  SafeAreaView,
  StatusBar,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { styles } from "./styles";
import { useAuth } from "../../context/AuthContext";
import {
  deleteClubMessage,
  getClubMessages,
  sendClubMessage,
} from "../../services/chatService";
import {
  addRealtimeListener,
  subscribeClubRoom,
  unsubscribeClubRoom,
  sendTyping,
} from "../../services/realtimeService";

function formatMessageTime(value) {
  if (!value) return "";
  const d = new Date(value);
  const hh = `${d.getHours()}`.padStart(2, "0");
  const mm = `${d.getMinutes()}`.padStart(2, "0");
  return `${hh}:${mm}`;
}

function MessageItem({ item, isMine, onDelete }) {
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
          <Text style={styles.msgSenderName}>
            {item.sender?.fullName || "Thành viên"}
          </Text>
        )}

        <View
          style={[
            styles.msgBubble,
            isMine ? styles.msgBubbleMine : styles.msgBubbleOther,
          ]}
        >
          <Text style={[styles.msgText, isMine && styles.msgTextMine]}>
            {item.content || "[Tin nhắn]"}
          </Text>
        </View>

        <View style={styles.msgMetaRow}>
          <Text style={styles.msgTime}>{formatMessageTime(item.sentAt)}</Text>
          {isMine && (
            <Pressable onPress={() => onDelete?.(item)} hitSlop={8}>
              <Text style={styles.msgDelete}>Xoá</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

export default function ClubChatRoomScreen({ navigation, route }) {
  const { session } = useAuth();
  const me = session?.user || null;
  const myUserId = me?.userId;

  const clubId = route?.params?.clubId;
  const clubName = route?.params?.clubName || "Chat CLB";

  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const fetchMessages = useCallback(async () => {
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
  }, [clubId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
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
  }, [clubId, myUserId]);

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

      sendTyping(clubId, value.trim().length > 0);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(clubId, false);
      }, 1200);
    },
    [clubId],
  );

  const onSend = useCallback(async () => {
    const content = text.trim();
    if (!content || sending) return;

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
  }, [text, sending, clubId, myUserId, me, fetchMessages]);

  const onDelete = useCallback(
    async (item) => {
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
    [clubId],
  );

  const typingText = useMemo(() => {
    if (!typingUsers.length) return "";
    if (typingUsers.length === 1)
      return `${typingUsers[0].fullName} đang nhập...`;
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
            {typingText || "Chat thành viên CLB"}
          </Text>
        </View>
      </View>
    );
  }, [navigation, clubName, typingText]);

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: COLORS.BLUE }} />
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BLUE} />

      {header}

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
                const isMine = String(item.senderUserId) === String(myUserId);
                return (
                  <MessageItem
                    item={item}
                    isMine={isMine}
                    onDelete={onDelete}
                  />
                );
              }}
              contentContainerStyle={styles.msgListPad}
              showsVerticalScrollIndicator={false}
            />

            <View style={styles.inputBar}>
              <TextInput
                value={text}
                onChangeText={onChangeText}
                placeholder="Nhập tin nhắn..."
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                multiline
              />

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
    </View>
  );
}
