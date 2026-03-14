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

  const flatListRef = useRef(null);
  const pollingRef = useRef(null);

  const fetchMessages = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (!silent) setLoading(true);

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
        if (!silent) setLoading(false);
      }
    },
    [clubId],
  );

  useEffect(() => {
    fetchMessages();

    pollingRef.current = setInterval(() => {
      fetchMessages({ silent: true });
    }, 4000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchMessages]);

  useEffect(() => {
    if (items.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd?.({ animated: true });
      }, 100);
    }
  }, [items.length]);

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
          return [...withoutTemp, savedItem];
        });
      } else {
        fetchMessages({ silent: true });
      }
    } catch (error) {
      console.log(
        "sendClubMessage error",
        error?.response?.data || error?.message,
      );
      setText(content);
      fetchMessages({ silent: true });
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
          <Text style={styles.roomHeaderSub}>Chat thành viên CLB</Text>
        </View>
      </View>
    );
  }, [navigation, clubName]);

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
                onChangeText={setText}
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
