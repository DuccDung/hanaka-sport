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
  // Convert to primitive if it's an object
  let dateValue;
  if (typeof value === "string" || typeof value === "number") {
    dateValue = value;
  } else if (value && typeof value === "object") {
    // Try to extract ISO string or convert to string
    if (value.toISOString) {
      dateValue = value.toISOString();
    } else if (value.toString) {
      dateValue = value.toString();
    } else {
      return "-";
    }
  } else {
    return "-";
  }
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "-";
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(
    d.getHours()
  )}:${pad2(d.getMinutes())}`;
}

function getExpiryText(expiresAt) {
  if (!expiresAt) return "Không xác định";
  // Convert to primitive if it's an object
  let dateValue;
  if (typeof expiresAt === "string" || typeof expiresAt === "number") {
    dateValue = expiresAt;
  } else if (expiresAt && typeof expiresAt === "object") {
    if (expiresAt.toISOString) {
      dateValue = expiresAt.toISOString();
    } else if (expiresAt.toString) {
      dateValue = expiresAt.toString();
    } else {
      return "Không xác định";
    }
  } else {
    return "Không xác định";
  }
  const now = new Date();
  const exp = new Date(dateValue);
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
  const safeStatus = typeof status === "string" ? status : "PENDING";
  switch (safeStatus) {
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
  const safeStatus = typeof status === "string" ? status : "";
  switch (safeStatus) {
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
      return safeStatus || "Không xác định";
  }
}

function AvatarCircle({ uri, name, size = 40 }) {
  const safeName = typeof name === "string" ? name : (name ?? "");
  const initial = safeName?.[0]?.toUpperCase() || "?";
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

      // Map server response to UI format (support both PascalCase and camelCase)
      const mappedItems = items.map((item) => {
        // Helper to get UserBrief from either naming convention
        const getUserBrief = (user) => {
          if (!user) return null;
          const safeString = (val) => {
            if (val == null) return "";
            return typeof val === "string" ? val : String(val);
          };
          return {
            userId: user.UserId ?? user.userId,
            fullName: safeString(user.FullName ?? user.fullName) || "Người chơi ẩn danh",
            avatarUrl: user.AvatarUrl ?? user.avatarUrl,
            ratingDouble: (user.RatingDouble ?? user.ratingDouble) || 0,
          };
        };

        // Debug: log first raw item to check data types
        if (process.env.NODE_ENV !== "production" && items.length > 0 && item === items[0]) {
          console.log("[PairRequestManagement] Raw item:", JSON.stringify(item, null, 2));
        }

        return {
          pairRequestId: item.PairRequestId ?? item.pairRequestId,
          tournamentId: item.TournamentId ?? item.tournamentId,
          tournamentTitle: (item.TournamentTitle ?? item.tournamentTitle) || "Không xác định",
          tournamentBanner: item.TournamentBanner ?? item.tournamentBanner,
          tournamentDate: item.TournamentDate ?? item.tournamentDate,
          tournamentLocation: item.TournamentLocation ?? item.tournamentLocation,
          requestedToUser: getUserBrief(item.RequestedToUser ?? item.requestedToUser),
          requestedByUser: getUserBrief(item.RequestedByUser ?? item.requestedByUser),
          requestedAt: item.RequestedAt ?? item.requestedAt,
          expiresAt: item.ExpiresAt ?? item.expiresAt,
          status: (item.Status ?? item.status) || "PENDING",
          // Optional fields
          registrationId: item.RegistrationId ?? item.registrationId,
          respondedAt: item.RespondedAt ?? item.respondedAt,
          responseNote: item.ResponseNote ?? item.responseNote,
        };
      }).filter(item => item.pairRequestId != null); // Filter out items with null/undefined ID

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
    const safeString = (val) => {
      if (val == null) return "";
      return typeof val === "string" ? val : String(val);
    };

    const tournamentTitle = safeString(pairRequest.tournamentTitle) || "N/A";
    const receiverName = safeString(pairRequest.requestedToUser?.fullName) || "N/A";

    Alert.alert(
      "Hủy lời mời",
      `Bạn có chắc muốn hủy lời mời ghép cặp này?\n\nGiải: ${tournamentTitle}\nNgười nhận: ${receiverName}`,
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

    // Defensive: ensure all nested values are primitives
    const getString = (obj, key, fallback = "") => {
      const val = obj?.[key];
      if (val == null) return fallback;
      return typeof val === "string" ? val : typeof val === "number" || typeof val === "boolean" ? String(val) : fallback;
    };

    const getNumber = (obj, key, fallback = 0) => {
      const val = obj?.[key];
      if (val == null) return fallback;
      const num = Number(val);
      return isNaN(num) ? fallback : num;
    };

    const tournamentTitle = getString(item, "tournamentTitle", "Không xác định");
    const fullName = getString(otherUser, "fullName", "Người chơi ẩn danh");
    const ratingDouble = getNumber(displayUser, "ratingDouble");

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
          <AvatarCircle uri={getString(displayUser, "avatarUrl")} name={fullName} size={48} />
          <View style={styles.itemInfo}>
            <Text style={styles.tournamentTitle} numberOfLines={2}>
              {tournamentTitle}
            </Text>
            <Text style={styles.receiverName}>
              {activeTab === "sent" ? `Đến: ${fullName}` : `Từ: ${fullName}`}
            </Text>
            {activeTab === "received" && ratingDouble > 0 && (
              <Text style={styles.metaText}>Rating đôi: {ratingDouble.toFixed(1)}</Text>
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
