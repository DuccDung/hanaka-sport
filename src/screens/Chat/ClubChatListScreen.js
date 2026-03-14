import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { getMyClubChatRooms } from "../../services/chatService";
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

export default function ClubChatListScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: COLORS.BLUE }} />
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BLUE} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tin nhắn CLB</Text>
        <Text style={styles.headerSub}>
          Trao đổi cùng các thành viên trong CLB
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
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Ionicons name="chatbubbles-outline" size={32} color="#9CA3AF" />
              <Text style={styles.stateText}>
                Bạn chưa tham gia CLB nào có thể nhắn tin.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
