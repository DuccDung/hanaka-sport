import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { COLORS } from "../../constants/colors";
import { styles } from "./notificationStyles";
import { getUpcomingMatchNotifications } from "../../services/notificationService";

function buildOpponentText(item) {
  const p1 = item?.opponentTeam?.player1?.name;
  const p2 = item?.opponentTeam?.player2?.name;

  if (p1 && p2) return `${p1} - ${p2}`;
  if (p1) return p1;
  return "Chưa xác định đối thủ";
}

export default function NotificationScreen() {
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async ({ isRefresh = false } = {}) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getUpcomingMatchNotifications();
      setNotifications(res?.items || []);
    } catch (error) {
      console.log(
        "getUpcomingMatchNotifications error",
        error?.response?.data || error?.message,
      );
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const renderItem = ({ item }) => {
    const opponentText = buildOpponentText(item);

    return (
      <Pressable style={styles.notificationCard}>
        <Text style={styles.notificationTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.notificationMessage}>{item.message}</Text>

        <Text style={styles.notificationMessage}>Đối thủ: {opponentText}</Text>

        <Text style={styles.notificationMessage}>
          Thời gian: {item?.match?.startAtText || "Chưa cập nhật"}
        </Text>

        <Text style={styles.notificationMessage}>
          Địa điểm: {item?.match?.addressText || "Chưa cập nhật"}
        </Text>

        <Text style={styles.notificationMessage}>
          Sân: {item?.match?.courtText || "Chưa cập nhật"}
        </Text>

        <Text style={styles.notificationTime}>
          {item?.match?.startAtText || ""}
        </Text>
      </Pressable>
    );
  };

  const keyExtractor = useMemo(() => (item) => String(item.id), []);

  return (
    <SafeAreaView style={styles.notificationSafe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />

      <View style={styles.notificationHeader}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.notificationBackBtn}
        >
          <Ionicons name="chevron-back" size={24} color="#1E2430" />
        </Pressable>

        <Text style={styles.notificationHeaderTitle}>Thông Báo</Text>

        <View style={styles.notificationHeaderRight} />
      </View>

      {loading ? (
        <View style={styles.notificationEmptyWrap}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />
          <Text style={styles.notificationEmptyText}>
            Đang tải thông báo...
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.notificationListContent,
            notifications.length === 0 && { flexGrow: 1 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchNotifications({ isRefresh: true })}
              tintColor={COLORS.BLUE}
            />
          }
          ListEmptyComponent={
            <View style={styles.notificationEmptyWrap}>
              <Ionicons
                name="notifications-off-outline"
                size={32}
                color="#9CA3AF"
              />
              <Text style={styles.notificationEmptyText}>
                Hiện chưa có thông báo thi đấu sắp tới.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
