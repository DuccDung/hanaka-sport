// src/screens/Tournament/PairRequestInboxScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./pairRequestStyles";
import { getPairRequestNotifications } from "../../services/tournamentService";

const TAB = {
  received: "Đã nhận",
  sent: "Đã gửi",
};

const STATUS = {
  PENDING: "Đang chờ",
  ACCEPTED: "Đã chấp nhận",
  REJECTED: "Đã từ chối",
  CANCELED: "Đã hủy",
  EXPIRED: "Hết hạn",
};

function formatTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function PairRequestInboxScreen({ navigation, route }) {
  const { tournamentId, tournamentTitle } = route.params;

  const [tab, setTab] = useState("received");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = useCallback(async (refresh = false) => {
    try {
      setErrorMsg("");
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const res = await getPairRequestNotifications();
      let items = (res.items || []).filter(item => item.tournamentId === tournamentId);

      // Filter by tab (received only, since this endpoint returns received)
      if (tab === "received") {
        // items are already received (requestedTo = current user)
      } else if (tab === "sent") {
        // No data for sent from this endpoint
        items = [];
      }

      setItems(items);
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message || e?.message || "Không tải được danh sách."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tournamentId, tab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  const handleAccept = async (pairRequestId) => {
    try {
      await acceptPairRequest(pairRequestId);
      Alert.alert("Thành công", "Đã chấp nhận lời mời ghép cặp.", [
        { text: "OK", onPress: () => fetchData(true) },
      ]);
    } catch (e) {
      Alert.alert("Lỗi", e?.response?.data?.message || e.message || "Không thể chấp nhận.");
    }
  };

  const handleReject = async (pairRequestId) => {
    Alert.alert(
      "Từ chối lời mời",
      "Bạn có chắc muốn từ chối lời mời này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Từ chối",
          style: "destructive",
          onPress: async () => {
            try {
              await rejectPairRequest(pairRequestId);
              Alert.alert("Đã từ chối", "Lời mời đã bị từ chối.", [
                { text: "OK", onPress: () => fetchData(true) },
              ]);
            } catch (e) {
              Alert.alert("Lỗi", e?.response?.data?.message || e.message);
            }
          },
        },
      ]
    );
  };

  const handleCancel = async (pairRequestId) => {
    Alert.alert(
      "Hủy lời mời",
      "Bạn có chắc muốn hủy lời mời này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Hủy lời mời",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelPairRequest(pairRequestId);
              Alert.alert("Đã hủy", "Lời mời đã bị hủy.", [
                { text: "OK", onPress: () => fetchData(true) },
              ]);
            } catch (e) {
              Alert.alert("Lỗi", e?.response?.data?.message || e.message);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isReceived = tab === "received";
    const isPending = item.status === "PENDING";
    const showActions = isPending;

    let avatarName = item.requestedBy?.fullName?.[0] || "?";
    let avatarColor = "#6B7280";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{avatarName}</Text>
          </View>
          <View style={styles.cardHeaderInfo}>
            <Text style={styles.cardTitle}>
              {item.requestedBy?.fullName || "Người dùng"}
            </Text>
            <Text style={styles.cardSub}>
              {isReceived ? "Người gửi lời mời" : "Người được mời"}
            </Text>
            <Text style={styles.cardTime}>
              {formatTime(item.requestedAt)}
            </Text>
          </View>
          <View style={[styles.statusBadge, isPending && styles.statusBadgePending]}>
            <Text style={[styles.statusText, isPending && styles.statusTextPending]}>
              {STATUS[item.status] || item.status}
            </Text>
          </View>
        </View>

        {item.message && (
          <Text style={styles.messageText}>"{item.message}"</Text>
        )}

        {showActions && (
          <View style={styles.cardActions}>
            {isReceived ? (
              <>
                <Pressable
                  style={[styles.actionBtn, styles.actionBtnAccept]}
                  onPress={() => handleAccept(item.pairRequestId)}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.actionBtnText}>Chấp nhận</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionBtn, styles.actionBtnReject]}
                  onPress={() => handleReject(item.pairRequestId)}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                  <Text style={styles.actionBtnText}>Từ chối</Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                style={[styles.actionBtn, styles.actionBtnCancel]}
                onPress={() => handleCancel(item.pairRequestId)}
              >
                <Ionicons name="close-circle" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Hủy lời mời</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} edges={["top"]} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.headerWrap}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={20} color="#1E2430" />
          </Pressable>
          <Text style={styles.headerTitle}>Lời mời ghép cặp</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.tabsRow}>
          {Object.keys(TAB).map((key) => {
            const active = tab === key;
            return (
              <Pressable
                key={key}
                style={styles.tabBtn}
                onPress={() => setTab(key)}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {TAB[key]}
                </Text>
                {active ? <View style={styles.tabUnderline} /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      {errorMsg ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={{ color: "#DC2626" }}>{errorMsg}</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={{ paddingTop: 24 }}>
          <ActivityIndicator />
        </View>
      ) : null}

      <FlatList
        contentContainerStyle={styles.listPad}
        data={data}
        keyExtractor={(item) => String(item.pairRequestId)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading && !errorMsg && items.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="mail-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>
                {tab === "received"
                  ? "Không có lời mời mới"
                  : "Bạn chưa gửi lời mời nào"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}