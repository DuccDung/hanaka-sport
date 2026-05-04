import React, { useCallback, useState } from "react";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { COLORS } from "../../constants/colors";
import { styles } from "./notificationStyles";
import { getNotificationInbox } from "../../services/notificationService";
import { addRealtimeListener } from "../../services/realtimeService";

export default function NotificationScreen() {
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(
    async ({ isRefresh = false, silent = false } = {}) => {
      try {
        if (isRefresh) setRefreshing(true);
        else if (!silent) setLoading(true);

        const res = await getNotificationInbox();
        setNotifications(res?.items || []);
      } catch (error) {
        console.log(
          "getNotificationInbox error",
          error?.response?.data || error?.message,
        );
        setNotifications([]);
      } finally {
        if (isRefresh) setRefreshing(false);
        else if (!silent) setLoading(false);
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications]),
  );

  useFocusEffect(
    useCallback(() => {
      const removeListener = addRealtimeListener((event) => {
        if (
          event?.type === "tournament.notification" ||
          event?.type === "__socket_open__"
        ) {
          fetchNotifications({ silent: true });
        }
      });

      return removeListener;
    }, [fetchNotifications]),
  );

  const renderItem = useCallback(({ item }) => {
    const metaLines = item?.metaLines || [];

    return (
      <View style={styles.notificationCard}>
        <Text style={styles.notificationTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.notificationMessage}>{item.message}</Text>

        {metaLines.map((line, index) => (
          <Text
            key={`${item.id}-meta-${index}`}
            style={styles.notificationMessage}
          >
            {line}
          </Text>
        ))}

        <Text style={styles.notificationTime}>{item?.timeText || ""}</Text>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item) => String(item.id), []);

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
                Hiện chưa có thông báo nào.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
