// src/screens/Tournament/PairRequestManagementScreen.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./pairRequestManagementStyles";
import { getMyPairRequests, cancelPairRequest } from "../../services/tournamentService";
import AsyncStorage from "@react-native-async-storage/async-storage";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(
    d.getHours()
  )}:${pad2(d.getMinutes())}`;
}

function getExpiryText(expiresAt) {
  if (!expiresAt) return "Không xác định";
  const now = new Date();
  const exp = new Date(expiresAt);
  const diffMs = exp - now;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffMs <= 0) return "Đã hết hạn";
  if (diffHrs > 0) {
    return `Còn ${diffHrs}h ${diffMins}m`;
  }
  return `Còn ${diffMins}m`;
}

function getStatusColor(status) {
  switch (status) {
    case "PENDING":
      return "#F59E0B"; // vàng
    case "ACCEPTED":
      return "#22C55E"; // xanh
    case "REJECTED":
      return "#DC2626"; // đỏ
    case "CANCELED":
      return "#6B7280"; // xám
    case "EXPIRED":
      return "#6B7280"; // xám
    default:
      return "#6B7280";
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "PENDING":
      return "Đang chờ";
    case "ACCEPTED":
      return "Đã chấp nhận";
    case "REJECTED":
      return "Đã từ chối";
    case "CANCELED":
      return "Đã hủy";
    case "EXPIRED":
      return "Đã hết hạn";
    default:
      return status || "Không xác định";
  }
}

function AvatarCircle({ uri, name, size = 40 }) {
  const initial = name?.[0]?.toUpperCase() || "?";
  const showImage = uri && (uri.startsWith("http://") || uri.startsWith("https://"));

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E5E7EB",
      }}
    >
      {showImage ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      ) : (
        <Text style={{ fontSize: size * 0.45, fontWeight: "700", color: "#374151" }}>
          {initial}
        </Text>
      )}
    </View>
  );
}

export default function PairRequestManagementScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("sent"); // "sent" or "received"
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [guideDismissed, setGuideDismissed] = useState(null); // "sent", "received", or null

  // Check if guide has been shown for current tab
  const checkGuideStatus = useCallback(async (tab) => {
    try {
      const key = `pairRequestGuide_${tab}`;
      const status = await AsyncStorage.getItem(key);
      if (status === null) {
        // First time - show guide
        setShowGuide(true);
        setGuideDismissed(null);
      } else {
        setShowGuide(false);
        setGuideDismissed(status);
      }
    } catch (e) {
      console.error("Failed to check guide status:", e);
    }
  }, []);

  // Mark guide as dismissed/skipped
  const handleDismissGuide = useCallback(async (action) => {
    try {
      const key = `pairRequestGuide_${activeTab}`;
      const value = action === "understood" ? "understood" : "dismissed";
      await AsyncStorage.setItem(key, value);
      setShowGuide(false);
      setGuideDismissed(value);
    } catch (e) {
      console.error("Failed to save guide status:", e);
    }
  }, [activeTab]);

  // Check guide when tab changes
  useEffect(() => {
    checkGuideStatus(activeTab);
  }, [activeTab, checkGuideStatus]);

  const fetchRequests = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
	      }
	      setErrorMsg("");

	      // Call real API
	      const data = await getMyPairRequests(activeTab === "sent");

	      // Handle response format: could be { items: [...] } or array directly
	      const items = Array.isArray(data) ? data : (data?.items || data || []);

	      // Map server response to UI format if needed
	      const mappedItems = items.map((item) => ({
	        pairRequestId: item.pairRequestId,
	        tournamentId: item.tournamentId,
	        tournamentTitle: item.tournamentTitle || "Không xác định",
	        requestedToUser: {
	          userId: item.requestedToUser?.userId,
	          fullName: item.requestedToUser?.fullName || "Người chơi ẩn danh",
	          avatarUrl: item.requestedToUser?.avatarUrl,
	          ratingDouble: item.requestedToUser?.ratingDouble || 0,
	        },
	        requestedAt: item.requestedAt,
	        expiresAt: item.expiresAt,
	        status: item.status || "PENDING",
	        // Optional fields
	        registrationId: item.registrationId,
	        tournamentBanner: item.tournamentBanner,
	        tournamentDate: item.tournamentDate,
	        tournamentLocation: item.tournamentLocation,
	        requestedByUser: item.requestedByUser,
	        registration: item.registration,
	        respondedAt: item.respondedAt,
	        responseNote: item.responseNote,
	      }));

	      setRequests(mappedItems);
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message ||
          e?.message ||
          "Không tải được danh sách lời mời."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests(true);
  }, [fetchRequests]);

  const handleCancel = useCallback((pairRequest) => {
    Alert.alert(
      "Hủy lời mời",
      `Bạn có chắc muốn hủy lời mời ghép cặp này?\n\nGiải: ${pairRequest.tournamentTitle || "N/A"}\nNgười nhận: ${pairRequest.requestedToUser?.fullName || "N/A"}`,
      [
        { text: "Không", style: "cancel" },
        {
          text: "Hủy",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelPairRequest(pairRequest.pairRequestId);
              Alert.alert("Thành công", "Đã hủy lời mời.");
              // Remove from list
              setRequests((prev) => prev.filter((r) => r.pairRequestId !== pairRequest.pairRequestId));
            } catch (e) {
              Alert.alert("Lỗi", e?.response?.data?.message || e?.message || "Hủy thất bại.");
            }
          },
        },
      ]
    );
  }, []);

  const renderItem = ({ item }) => {
    const isPending = item.status === "PENDING";
    const canCancel = isPending && activeTab === "sent";

    // For sent tab, show the receiver (requestedToUser)
    // For received tab, show the sender (requestedByUser)
    const displayUser = activeTab === "sent"
      ? (item.requestedToUser || {})
      : (item.requestedByUser || {});

    const otherUser = item.requestedToUser || item.requestedByUser || {};

    return (
      <Pressable
        style={styles.item}
        onPress={() => {
          navigation.navigate("PairRequestDetail", {
            pairRequestId: item.pairRequestId,
          });
        }}
      >
        <View style={styles.itemHeader}>
          <AvatarCircle uri={displayUser.avatarUrl} name={displayUser.fullName} size={48} />
          <View style={styles.itemInfo}>
            <Text style={styles.tournamentTitle} numberOfLines={2}>
              {item.tournamentTitle || "Không xác định"}
            </Text>
            <Text style={styles.receiverName}>
              {activeTab === "sent"
                ? `Đến: ${otherUser.fullName || "Người chơi ẩn danh"}`
                : `Từ: ${otherUser.fullName || "Người chơi ẩn danh"}`
              }
            </Text>
            {activeTab === "received" && displayUser.ratingDouble && (
              <Text style={styles.metaText}>Rating đôi: {displayUser.ratingDouble.toFixed(1)}</Text>
            )}
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>Gửi: {formatDateTime(item.requestedAt)}</Text>
              <Text style={styles.metaText}>Hết hạn: {getExpiryText(item.expiresAt)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
            </View>
          </View>
        </View>

        {canCancel && (
          <Pressable
            style={styles.cancelButton}
            onPress={(e) => {
              e.stopPropagation();
              handleCancel(item);
            }}
          >
            <Ionicons name="close-circle-outline" size={16} color="#DC2626" />
            <Text style={styles.cancelButtonText}>Hủy lời mời</Text>
          </Pressable>
        )}
      </Pressable>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="mail-outline" size={64} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>
          {activeTab === "sent" ? "Chưa gửi lời mời nào" : "Chưa nhận lời mời nào"}
        </Text>
        <Text style={styles.emptyDesc}>
          {activeTab === "sent"
            ? "Bạn có thể tìm đối tác và gửi lời mời ghép cặp từ danh sách đăng ký."
            : "Lời mời ghép cặp từ người chơi khác sẽ hiển thị ở đây."}
        </Text>
      </View>
    );
  };

  // Guide Modal Component
  const renderGuideModal = () => {
    if (!showGuide) return null;

    const isSent = activeTab === "sent";

    return (
      <Modal
        visible={showGuide}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGuide(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.guideModal}>
            <View style={styles.guideHeader}>
              <Ionicons name="information-circle" size={32} color="#2563EB" />
              <Text style={styles.guideTitle}>
                {isSent ? "Hướng dẫn: Lời mời đã gửi" : "Hướng dẫn: Lời mời đã nhận"}
              </Text>
            </View>

            <View style={styles.guideContent}>
              {isSent ? (
                // Guide for Sent tab
                <>
                  <View style={styles.guideStep}>
                    <View style={styles.guideStepNumber}>
                      <Text style={styles.guideStepNumberText}>1</Text>
                    </View>
                    <View style={styles.guideStepContent}>
                      <Text style={styles.guideStepTitle}>Xem trạng thái lời mời</Text>
                      <Text style={styles.guideStepDesc}>
                        Mỗi lời mời hiển thị thời gian gửi, thời hạn còn lại và trạng thái (Đang chờ, Đã chấp nhận, Đã từ chối, Đã hủy, Đã hết hạn).
                      </Text>
                    </View>
                  </View>

                  <View style={styles.guideStep}>
                    <View style={styles.guideStepNumber}>
                      <Text style={styles.guideStepNumberText}>2</Text>
                    </View>
                    <View style={styles.guideStepContent}>
                      <Text style={styles.guideStepTitle}>Hủy lời mời</Text>
                      <Text style={styles.guideStepDesc}>
                        Với lời mời đang chờ, bạn có thể nhấn "Hủy lời mời" để thu hồi. Lời mời đã hủy sẽ không thể khôi phục.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.guideStep}>
                    <View style={styles.guideStepNumber}>
                      <Text style={styles.guideStepNumberText}>3</Text>
                    </View>
                    <View style={styles.guideStepContent}>
                      <Text style={styles.guideStepTitle}>Theo dõi phản hồi</Text>
                      <Text style={styles.guideStepDesc}>
                        Khi người nhận chấp nhận, từ chối hoặc lời mời hết hạn, trạng thái sẽ tự động cập nhật. Bạn sẽ nhận được thông báo thời gian thực.
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                // Guide for Received tab
                <>
                  <View style={styles.guideStep}>
                    <View style={styles.guideStepNumber}>
                      <Text style={styles.guideStepNumberText}>1</Text>
                    </View>
                    <View style={styles.guideStepContent}>
                      <Text style={styles.guideStepTitle}>Lời mời từ người chơi khác</Text>
                      <Text style={styles.guideStepDesc}>
                        Các lời mời ghép cặp từ người chơi khác sẽ hiển thị ở đây. Bạn có thể xem thông tin tournament và rating của người gửi.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.guideStep}>
                    <View style={styles.guideStepNumber}>
                      <Text style={styles.guideStepNumberText}>2</Text>
                    </View>
                    <View style={styles.guideStepContent}>
                      <Text style={styles.guideStepTitle}>Chấp nhận lời mời</Text>
                      <Text style={styles.guideStepDesc}>
                        Nhấn "Chấp nhận" để đồng ý ghép cặp. Nếu bạn đang đợi ghép, bạn sẽ trở thành Player2 của họ. Nếu cả hai đều chưa đăng ký, một đội mới sẽ được tạo.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.guideStep}>
                    <View style={styles.guideStepNumber}>
                      <Text style={styles.guideStepNumberText}>3</Text>
                    </View>
                    <View style={styles.guideStepContent}>
                      <Text style={styles.guideStepTitle}>Từ chối lời mời</Text>
                      <Text style={styles.guideStepDesc}>
                        Bạn có thể từ chối lời mời. Người gửi sẽ nhận được thông báo về việc từ chối. Lời mời hết hạn cũng sẽ tự động chuyển sang trạng thái Đã hết hạn.
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>

            <View style={styles.guideFooter}>
              <Pressable
                style={[styles.guideBtn, styles.guideBtnSkip]}
                onPress={() => handleDismissGuide("dismissed")}
              >
                <Text style={styles.guideBtnSkipText}>Bỏ qua</Text>
              </Pressable>
              <Pressable
                style={[styles.guideBtn, styles.guideBtnUnderstood]}
                onPress={() => handleDismissGuide("understood")}
              >
                <Text style={styles.guideBtnUnderstoodText}>Đã hiểu</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} edges={["top"]} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
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
          <Pressable
            onPress={() => setShowGuide(true)}
            style={styles.helpBtn}
            hitSlop={10}
          >
            <Ionicons name="help-circle-outline" size={24} color="#2563EB" />
          </Pressable>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <Pressable
          style={[styles.tab, activeTab === "sent" && styles.tabActive]}
          onPress={() => setActiveTab("sent")}
        >
          <Text style={[styles.tabText, activeTab === "sent" && styles.tabTextActive]}>
            Đã gửi
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "received" && styles.tabActive]}
          onPress={() => setActiveTab("received")}
        >
          <Text style={[styles.tabText, activeTab === "received" && styles.tabTextActive]}>
            Đã nhận
          </Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : null}

      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <Pressable onPress={() => fetchRequests()} style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>Thử lại</Text>
          </Pressable>
        </View>
      ) : null}

      {!loading && !errorMsg && (
        <FlatList
          data={requests}
          keyExtractor={(item) => String(item.pairRequestId)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {renderGuideModal()}
    </View>
  );
}
