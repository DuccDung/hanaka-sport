// src/screens/Tournament/PairRequestDetailScreen.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./pairRequestDetailStyles";
import { getPairRequestDetail, acceptPairRequest, rejectPairRequest, cancelPairRequest } from "../../services/tournamentService";

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

function AvatarCircle({ uri, name, size = 56 }) {
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

function normalizeDetail(data) {
  if (!data) return null;

  const safeString = (val) => {
    if (val == null) return "";
    if (typeof val === "string") return val;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    return "";
  };

  const safeNumber = (val, defaultValue = 0) => {
    if (val == null) return defaultValue;
    const num = Number(val);
    return isNaN(num) ? defaultValue : num;
  };

  const normalizeUser = (user) => {
    if (!user) return null;
    return {
      userId: user.UserId ?? user.userId,
      fullName: safeString(user.FullName ?? user.fullName) || "Người chơi ẩn danh",
      avatarUrl: user.AvatarUrl ?? user.avatarUrl,
      ratingDouble: safeNumber(user.RatingDouble ?? user.ratingDouble, 0),
      verified: !!user.Verified ?? !!user.verified,
    };
  };

  const normalizeRegistration = (reg) => {
    if (!reg) return null;
    return {
      registrationId: reg.RegistrationId ?? reg.registrationId,
      regCode: safeString(reg.RegCode ?? reg.regCode),
      player1Name: safeString(reg.Player1Name ?? reg.player1Name),
      player2Name: safeString(reg.Player2Name ?? reg.player2Name),
      points: safeNumber(reg.Points ?? reg.points, 0),
      success: !!reg.Success ?? !!reg.success,
      waitingPair: !!reg.WaitingPair ?? !!reg.waitingPair,
    };
  };

  return {
    pairRequestId: data.PairRequestId ?? data.pairRequestId,
    tournamentId: data.TournamentId ?? data.tournamentId,
    tournamentTitle: (data.TournamentTitle ?? data.tournamentTitle) || "Không xác định",
    tournamentBanner: safeString(data.TournamentBanner ?? data.tournamentBanner),
    tournamentDate: data.TournamentDate ?? data.tournamentDate,
    tournamentLocation: safeString(data.TournamentLocation ?? data.tournamentLocation),
    requestedByUser: normalizeUser(data.RequestedByUser ?? data.requestedByUser),
    requestedToUser: normalizeUser(data.RequestedToUser ?? data.requestedToUser),
    requestedAt: data.RequestedAt ?? data.requestedAt,
    expiresAt: data.ExpiresAt ?? data.expiresAt,
    status: (data.Status ?? data.status) || "PENDING",
    registrationId: data.RegistrationId ?? data.registrationId,
    respondedAt: data.RespondedAt ?? data.respondedAt,
    responseNote: safeString(data.ResponseNote ?? data.responseNote),
    isSent: data.IsSent ?? data.isSent,
    registration: normalizeRegistration(data.Registration ?? data.registration),
  };
}

export default function PairRequestDetailScreen({ navigation, route }) {
  const { pairRequestId } = route.params;
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Helper functions inside component to use closures
  const safeString = useCallback((val) => {
    if (val == null) return "";
    if (typeof val === "string") return val;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    return "";
  }, []);

  const safeNumber = useCallback((val, defaultValue = 0) => {
    if (val == null) return defaultValue;
    const num = Number(val);
    return isNaN(num) ? defaultValue : num;
  }, []);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await getPairRequestDetail(pairRequestId);
      console.log("[PairRequestDetail] Raw API response:", JSON.stringify(data, null, 2));
      const normalized = normalizeDetail(data);
      console.log("[PairRequestDetail] Normalized detail:", {
        ...normalized,
        tournamentBanner: normalized?.tournamentBanner,
      });
      setDetail(normalized);
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message || e?.message || "Không tải được thông tin lời mời."
      );
    } finally {
      setLoading(false);
    }
  }, [pairRequestId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const isSent = detail?.isSent; // true if this user sent the request
  const isPending = detail?.status === "PENDING";
  const canAct = isPending && (!isSent || detail?.registrationId); // can cancel if sent, can accept/reject if received

  const safeRating = useCallback((rating) => {
    const num = safeNumber(rating, null);
    return num !== null ? num.toFixed(1) : "N/A";
  }, [safeNumber]);

  const handleCancel = useCallback(async () => {
    if (!detail) return;
    const tournamentTitle = safeString(detail.tournamentTitle) || "N/A";
    Alert.alert(
      "Hủy lời mời",
      `Bạn có chắc muốn hủy lời mời ghép cặp này?\n\nGiải: ${tournamentTitle}`,
      [
        { text: "Không", style: "cancel" },
        {
          text: "Hủy",
          style: "destructive",
          onPress: async () => {
            try {
              setActionLoading(true);
              await cancelPairRequest(pairRequestId);
              Alert.alert("Thành công", "Đã hủy lời mời.");
              navigation.goBack();
            } catch (e) {
              Alert.alert("Lỗi", e?.response?.data?.message || e?.message || "Hủy thất bại.");
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  }, [detail, pairRequestId, navigation, safeString]);

  const handleAccept = useCallback(async () => {
    if (!detail) return;
    try {
      setActionLoading(true);
      await acceptPairRequest(pairRequestId);
      Alert.alert("Thành công", "Đã chấp nhận lời mời và ghép cặp thành công.");
      // Refresh detail and go back
      await fetchDetail();
      navigation.goBack();
    } catch (e) {
      Alert.alert("Lỗi", e?.response?.data?.message || e?.message || "Chấp nhận thất bại.");
    } finally {
      setActionLoading(false);
    }
  }, [detail, pairRequestId, navigation, fetchDetail]);

  const handleReject = useCallback(async () => {
    if (!detail) return;
    try {
      setActionLoading(true);
      await rejectPairRequest(pairRequestId, rejectReason || undefined);
      Alert.alert("Thành công", "Đã từ chối lời mời.");
      setShowRejectModal(false);
      setRejectReason("");
      await fetchDetail();
      navigation.goBack();
    } catch (e) {
      Alert.alert("Lỗi", e?.response?.data?.message || e?.message || "Từ chối thất bại.");
    } finally {
      setActionLoading(false);
    }
  }, [detail, pairRequestId, navigation, fetchDetail, rejectReason]);

  const renderTimeline = () => {
    if (!detail) return null;

    const timeline = [
      { label: "Đã gửi", time: detail.requestedAt, icon: "send-outline", alwaysShow: true },
      { label: "Hết hạn", time: detail.expiresAt, icon: "time-outline", alwaysShow: true },
    ];

    if (detail.status === "ACCEPTED") {
      timeline.splice(1, 0, { label: "Đã chấp nhận", time: detail.respondedAt, icon: "checkmark-circle-outline", alwaysShow: true });
    } else if (detail.status === "REJECTED") {
      timeline.splice(1, 0, { label: "Đã từ chối", time: detail.respondedAt, icon: "close-circle-outline", alwaysShow: true });
    } else if (detail.status === "CANCELED") {
      timeline.splice(1, 0, { label: "Đã hủy", time: detail.respondedAt, icon: "remove-circle-outline", alwaysShow: true });
    } else if (detail.status === "EXPIRED") {
      // Already have "Hết hạn"
    }

    return (
      <View style={styles.timelineContainer}>
        {timeline.map((item, idx) => (
          <View key={idx} style={styles.timelineItem}>
            <View style={styles.timelineIconContainer}>
              <Ionicons
                name={item.icon}
                size={20}
                color={idx === 0 ? "#2563EB" : (item.label.includes("chấp nhận") ? "#22C55E" : item.label.includes("từ chối") || item.label.includes("hủy") ? "#DC2626" : "#6B7280")}
              />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>{item.label}</Text>
              <Text style={styles.timelineTime}>{formatDateTime(item.time)}</Text>
            </View>
            {idx < timeline.length - 1 && <View style={styles.timelineLine} />}
          </View>
        ))}
      </View>
    );
  };

  const getRegistrationStatusLabel = () => {
    // Nếu pair request đã được accept, ưu tiên hiển thị trạng thái accept
    if (detail?.status === "ACCEPTED") {
      return "Đã chấp nhận";
    }
    // Nếu registration success đã true, hiển thị thành công
    if (registration?.success) {
      return "Thành công";
    }
    // Nếu registration đang chờ ghép (waiting)
    if (registration?.waitingPair) {
      return "Chờ ghép";
    }
    // Registration đã có nhưng chưa success, không phải waiting
    if (registration && !registration.success && !registration.waitingPair) {
      return "Đã đăng ký"; // fallback
    }
    return "Chưa đăng ký";
  };

  const getRegistrationStatusColor = () => {
    if (detail?.status === "ACCEPTED") {
      return "#22C55E"; // xanh
    }
    if (registration?.success) {
      return "#22C55E"; // xanh
    }
    if (registration?.waitingPair) {
      return "#F59E0B"; // vàng
    }
    return "#6B7280"; // xám
  };

  const getPairRequestStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "#F59E0B";
      case "ACCEPTED": return "#22C55E";
      case "REJECTED": return "#DC2626";
      case "CANCELED": return "#6B7280";
      case "EXPIRED": return "#6B7280";
      default: return "#6B7280";
    }
  };

  const getPairRequestStatusLabel = (status) => {
    switch (status) {
      case "PENDING": return "Đang chờ";
      case "ACCEPTED": return "Đã chấp nhận";
      case "REJECTED": return "Đã từ chối";
      case "CANCELED": return "Đã hủy";
      case "EXPIRED": return "Đã hết hạn";
      default: return status || "Không xác định";
    }
  };

  if (loading) {
    return (
      <View style={styles.safe}>
        <SafeAreaView style={{ backgroundColor: "#fff" }} edges={["top"]} />
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </View>
    );
  }

  if (errorMsg || !detail) {
    return (
      <View style={styles.safe}>
        <SafeAreaView style={{ backgroundColor: "#fff" }} edges={["top"]} />
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.headerWrap}>
          <View style={styles.headerTop}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
              <Ionicons name="arrow-back" size={20} color="#1E2430" />
            </Pressable>
            <Text style={styles.headerTitle}>Chi tiết lời mời</Text>
          </View>
        </View>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg || "Không tìm thấy thông tin"}</Text>
          <Pressable onPress={fetchDetail} style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>Thử lại</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const otherUser = isSent ? detail.requestedToUser : detail.requestedByUser;
  const registration = detail.registration;

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} edges={["top"]} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.headerWrap}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
            <Ionicons name="arrow-back" size={20} color="#1E2430" />
          </Pressable>
          <Text style={styles.headerTitle}>Chi tiết lời mời</Text>
          {isPending && (
            <View style={[styles.statusBadgeLarge, { backgroundColor: getPairRequestStatusColor(detail.status) }]}>
              <Text style={styles.statusBadgeLargeText}>{getPairRequestStatusLabel(detail.status)}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tournament Banner */}
        {detail.tournamentBanner ? (
          <Image
            source={{ uri: detail.tournamentBanner }}
            style={styles.tournamentBanner}
            resizeMode="cover"
            onError={(e) => {
              console.error("[PairRequestDetail] Banner load error:", {
                error: e.nativeEvent.error,
                uri: detail.tournamentBanner,
                bannerValue: detail.tournamentBanner,
              });
            }}
            onLoad={() => {
              console.log("[PairRequestDetail] Banner loaded successfully:", detail.tournamentBanner);
            }}
          />
        ) : (
          <View style={[styles.tournamentBanner, styles.bannerPlaceholder]}>
            <Ionicons name="image-outline" size={48} color="#D1D5DB" />
          </View>
        )}

        {/* Tournament Info */}
        <View style={styles.tournamentInfo}>
          <Text style={styles.tournamentTitle}>{safeString(detail.tournamentTitle) || "Không xác định"}</Text>
          <View style={styles.tournamentMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText}>{formatDateTime(detail.tournamentDate)}</Text>
            </View>
            {detail.tournamentLocation && (
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={14} color="#6B7280" />
                <Text style={styles.metaText}>{safeString(detail.tournamentLocation)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Flow Direction */}
        <View style={styles.flowSection}>
          <Text style={styles.flowTitle}>{isSent ? "Bạn đã gửi lời mời cho" : "Người chơi đã gửi lời mời cho bạn"}</Text>
          <View style={styles.partnerCard}>
            <AvatarCircle uri={otherUser?.avatarUrl} name={otherUser?.fullName} size={64} />
            <View style={styles.partnerInfo}>
              <Text style={styles.partnerName}>{safeString(otherUser?.fullName) || "Người chơi ẩn danh"}</Text>
              <Text style={styles.partnerRating}>Rating đôi: {safeRating(otherUser?.ratingDouble)}</Text>
              {otherUser?.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={12} color="#22C55E" />
                  <Text style={styles.verifiedText}>Đã xác thực</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Registration Summary (if exists) */}
        {registration && (
          <View style={styles.registrationSection}>
            <Text style={styles.sectionTitle}>Thông tin đăng ký</Text>
            <View style={styles.regCard}>
              <View style={styles.regRow}>
                <Text style={styles.regLabel}>Mã đăng ký:</Text>
                <Text style={styles.regValue}>{safeString(registration.regCode) || "N/A"}</Text>
              </View>
              <View style={styles.regRow}>
                <Text style={styles.regLabel}>Đội:</Text>
                <Text style={styles.regValue}>
                  {safeString(registration.player1Name)} + {safeString(registration.player2Name) || "(Chờ ghép)"}
                </Text>
              </View>
              <View style={styles.regRow}>
                <Text style={styles.regLabel}>Điểm:</Text>
                <Text style={styles.regValue}>{safeNumber(registration.points, 0).toFixed(1)}</Text>
              </View>
              <View style={styles.regRow}>
                <Text style={styles.regLabel}>Trạng thái:</Text>
                <View style={[styles.regStatusBadge, { backgroundColor: getRegistrationStatusColor() }]}>
                  <Text style={styles.regStatusText}>{getRegistrationStatusLabel()}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Tiến độ</Text>
          {renderTimeline()}
        </View>

        {/* Request Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Chi tiết lời mời</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Yêu cầu gửi lúc:</Text>
              <Text style={styles.detailValue}>{formatDateTime(detail.requestedAt)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hết hạn:</Text>
              <Text style={[styles.detailValue, { color: getPairRequestStatusColor(detail.status) }]}>
                {formatDateTime(detail.expiresAt)}
              </Text>
            </View>
            {detail.respondedAt && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phản hồi lúc:</Text>
                <Text style={styles.detailValue}>{formatDateTime(detail.respondedAt)}</Text>
              </View>
            )}
            {detail.responseNote && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Lời nhắn:</Text>
                <Text style={styles.detailValue}>{safeString(detail.responseNote)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        {canAct && (
          <View style={styles.actionSection}>
            {isSent ? (
              // Sent - can cancel
              <Pressable
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancel}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#DC2626" />
                ) : (
                  <>
                    <Ionicons name="close-circle-outline" size={18} color="#DC2626" />
                    <Text style={styles.cancelButtonText}>Hủy lời mời</Text>
                  </>
                )}
              </Pressable>
            ) : (
              // Received - can accept or reject
              <View style={styles.actionRow}>
                <Pressable
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={handleAccept}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={18} color="#fff" />
                      <Text style={styles.acceptButtonText}>Chấp nhận</Text>
                    </>
                  )}
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => setShowRejectModal(true)}
                  disabled={actionLoading}
                >
                  <Ionicons name="close-circle" size={18} color="#DC2626" />
                  <Text style={styles.rejectButtonText}>Từ chối</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Reject Reason Modal */}
      <Modal
        visible={showRejectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Từ chối lời mời</Text>
            <Text style={styles.modalDesc}>
              Bạn có thể thêm lý do từ chối (không bắt buộc):
            </Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="Nhập lý do từ chối..."
              placeholderTextColor="#9CA3AF"
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
              maxLength={500}
            />
            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
              >
                <Text style={styles.modalButtonCancelText}>Hủy</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleReject}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonConfirmText}>Từ chối</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
