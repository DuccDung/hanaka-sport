import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppStatusBar from "../../components/AppStatusBar";
import { COLORS } from "../../constants/colors";
import {
  createDirectChatRoom,
  searchDirectChatUsers,
} from "../../services/chatService";
import { styles } from "./styles";

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

function UserItem({ item, onPress, opening }) {
  const blocked = item?.isBlockedByMe || item?.hasBlockedMe;

  return (
    <Pressable style={styles.roomCard} onPress={onPress} disabled={opening}>
      {item.avatarUrl ? (
        <Image source={{ uri: item.avatarUrl }} style={styles.roomAvatar} />
      ) : (
        <View style={styles.roomAvatarFallback}>
          <Text style={styles.avatarInitials}>{getInitials(item.fullName)}</Text>
        </View>
      )}

      <View style={styles.roomBody}>
        <View style={styles.roomTopRow}>
          <Text style={styles.roomName} numberOfLines={1}>
            {item.fullName || "Người dùng"}
          </Text>

          {item.verified && (
            <Ionicons name="checkmark-circle" size={16} color={COLORS.BLUE} />
          )}
        </View>

        <Text style={styles.roomSub} numberOfLines={1}>
          {item.phone || item.city || `ID: ${item.userId}`}
        </Text>

        <Text
          style={[styles.roomLastMsg, blocked && styles.roomLastMsgHidden]}
          numberOfLines={1}
        >
          {blocked
            ? item.isBlockedByMe
              ? "Bạn đang chặn người này"
              : "Người này hiện không nhận tin nhắn"
            : item.existingRoomId
              ? "Đã có cuộc trò chuyện"
              : "Bấm để bắt đầu chat"}
        </Text>
      </View>

      {opening ? (
        <ActivityIndicator color={COLORS.BLUE} />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      )}
    </Pressable>
  );
}

export default function DirectChatSearchScreen({ navigation }) {
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openingUserId, setOpeningUserId] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const canSearch = keyword.trim().length >= 2 || /^\d+$/.test(keyword.trim());

  const runSearch = useCallback(async () => {
    const value = keyword.trim();
    if (!value || !canSearch || loading) return;

    Keyboard.dismiss();
    setHasSearched(true);
    setLoading(true);

    try {
      const res = await searchDirectChatUsers({
        keyword: value,
        page: 1,
        pageSize: 30,
      });

      setItems(res?.items || []);
    } catch (error) {
      console.log(
        "searchDirectChatUsers error",
        error?.response?.data || error?.message,
      );
      Alert.alert(
        "Không thể tìm kiếm",
        error?.response?.data?.message ||
          "Vui lòng nhập số điện thoại hoặc ID hợp lệ.",
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [canSearch, keyword, loading]);

  const openChat = useCallback(
    async (item) => {
      if (item?.isBlockedByMe && !item?.existingRoomId) {
        Alert.alert(
          "Đang chặn người này",
          "Bạn cần bỏ chặn trong quản lý an toàn trước khi tạo cuộc trò chuyện mới.",
        );
        return;
      }

      if (item?.hasBlockedMe && !item?.existingRoomId) {
        Alert.alert(
          "Không thể nhắn tin",
          "Người này hiện không thể nhận tin nhắn từ bạn.",
        );
        return;
      }

      if (item?.existingRoomId) {
        navigation.navigate("DirectChatRoom", {
          roomId: item.existingRoomId,
          otherUser: item,
        });
        return;
      }

      try {
        setOpeningUserId(item.userId);
        const res = await createDirectChatRoom(item.userId);
        const room = res?.item;
        navigation.replace("DirectChatRoom", {
          roomId: room?.roomId || room?.directChatRoomId,
          room,
          otherUser: room?.otherUser || item,
        });
      } catch (error) {
        console.log(
          "createDirectChatRoom error",
          error?.response?.data || error?.message,
        );
        Alert.alert(
          "Không thể mở chat",
          error?.response?.data?.message ||
            "Vui lòng kiểm tra lại kết nối và thử lại.",
        );
      } finally {
        setOpeningUserId(null);
      }
    },
    [navigation],
  );

  return (
    <View style={styles.safe}>
      <AppStatusBar backgroundColor={COLORS.BLUE} />

      <View style={styles.roomHeader}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        <View style={styles.roomHeaderBody}>
          <Text style={styles.roomHeaderTitle}>Tìm người chat</Text>
          <Text style={styles.roomHeaderSub}>Nhập số điện thoại hoặc ID</Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={runSearch}
            placeholder="Số điện thoại hoặc ID người dùng"
            placeholderTextColor="#94A3B8"
            keyboardType="default"
            autoCapitalize="none"
            style={styles.searchInput}
            returnKeyType="search"
          />

          {!!keyword && (
            <Pressable onPress={() => setKeyword("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>

        <Pressable
          style={[styles.searchBtn, (!canSearch || loading) && { opacity: 0.55 }]}
          onPress={runSearch}
          disabled={!canSearch || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          )}
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.userId)}
        renderItem={({ item }) => (
          <UserItem
            item={item}
            opening={String(openingUserId) === String(item.userId)}
            onPress={() => openChat(item)}
          />
        )}
        contentContainerStyle={[
          styles.listPad,
          items.length === 0 && { flexGrow: 1 },
        ]}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.centerState}>
            <Ionicons
              name={hasSearched ? "person-remove-outline" : "person-add-outline"}
              size={34}
              color="#94A3B8"
            />
            <Text style={styles.stateText}>
              {hasSearched
                ? "Không tìm thấy thành viên phù hợp."
                : "Tìm theo số điện thoại hoặc ID để bắt đầu chat 1v1."}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
