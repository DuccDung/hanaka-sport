// src/components/PairRequestNotificationPopup.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  dismissPairRequestNotification,
  removePairRequestNotification,
} from "../services/realtimeService";
import {
  acceptPairRequest,
  getPairRequestDetail,
  markNotificationRead,
  rejectPairRequest,
} from "../services/tournamentService";

const PAIR_STATUS_LABELS = {
  PAIR_REQUEST: "Lời mời mới",
  PAIR_ACCEPTED: "Đã chấp nhận",
  PAIR_REJECTED: "Đã từ chối",
  PAIR_CANCELED: "Đã hủy",
  PAIR_EXPIRED: "Đã hết hạn",
};

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function asText(...values) {
  const found = firstValue(...values);
  if (found === undefined) return "";
  if (typeof found === "string") return found.trim();
  if (typeof found === "number" || typeof found === "boolean") return String(found);
  return "";
}

function asNumber(value) {
  const found = firstValue(value);
  if (found === undefined) return null;
  const num = Number(found);
  return Number.isFinite(num) ? num : null;
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function inferNameFromMessage(message) {
  const text = asText(message);
  const match = text.match(/^(.+?)\s+mời\s+bạn/i);
  return match?.[1]?.trim() || "";
}

function inferTournamentFromMessage(message) {
  const text = asText(message);
  const match = text.match(/tại\s+giải\s+(.+?)(?:\.|$)/i);
  return match?.[1]?.trim() || "";
}

function normalizeUser(user, fallbackName = "") {
  if (!user) {
    return fallbackName ? { fullName: fallbackName } : null;
  }

  const fullName = asText(
    user.FullName,
    user.fullName,
    user.Name,
    user.name,
    user.DisplayName,
    user.displayName,
    fallbackName,
  );

  return {
    userId: firstValue(user.UserId, user.userId, user.Id, user.id),
    fullName,
    avatarUrl: asText(user.AvatarUrl, user.avatarUrl, user.Avatar, user.avatar),
    ratingDouble: asNumber(user.RatingDouble ?? user.ratingDouble ?? user.DoubleRating ?? user.doubleRating),
    ratingSingle: asNumber(user.RatingSingle ?? user.ratingSingle ?? user.SingleRating ?? user.singleRating),
    city: asText(user.City, user.city, user.Address, user.address),
    verified: Boolean(firstValue(user.Verified, user.verified, user.IsVerified, user.isVerified)),
  };
}

function normalizePairRequestInfo(notification, detail) {
  const details = notification?.Details ?? notification?.details ?? {};
  const body = asText(
    notification?.Body,
    notification?.body,
    detail?.Body,
    detail?.body,
    detail?.Message,
    detail?.message,
    details?.Body,
    details?.body,
    details?.Message,
    details?.message,
  );

  const title = asText(notification?.Title, notification?.title, detail?.Title, detail?.title);
  const inferredRequester = inferNameFromMessage(body);
  const inferredTournament = inferTournamentFromMessage(body);

  const requestedBy = normalizeUser(
    firstValue(
      detail?.RequestedByUser,
      detail?.requestedByUser,
      detail?.RequestedBy,
      detail?.requestedBy,
      notification?.RequestedByUser,
      notification?.requestedByUser,
      notification?.RequestedBy,
      notification?.requestedBy,
      details?.RequestedByUser,
      details?.requestedByUser,
      details?.RequestedBy,
      details?.requestedBy,
    ),
    inferredRequester,
  );

  const requestedTo = normalizeUser(
    firstValue(
      detail?.RequestedToUser,
      detail?.requestedToUser,
      detail?.RequestedTo,
      detail?.requestedTo,
      notification?.RequestedToUser,
      notification?.requestedToUser,
      notification?.RequestedTo,
      notification?.requestedTo,
      details?.RequestedToUser,
      details?.requestedToUser,
      details?.RequestedTo,
      details?.requestedTo,
    ),
  );

  const acceptedBy = normalizeUser(
    firstValue(
      detail?.AcceptedBy,
      detail?.acceptedBy,
      notification?.AcceptedBy,
      notification?.acceptedBy,
      details?.AcceptedBy,
      details?.acceptedBy,
    ),
  );

  const tournamentTitle = asText(
    detail?.TournamentTitle,
    detail?.tournamentTitle,
    detail?.Tournament?.Title,
    detail?.tournament?.title,
    details?.TournamentTitle,
    details?.tournamentTitle,
    details?.Tournament?.Title,
    details?.tournament?.title,
    notification?.TournamentTitle,
    notification?.tournamentTitle,
    inferredTournament,
    "Chưa rõ tên giải",
  );

  const requestedAt = firstValue(
    detail?.RequestedAt,
    detail?.requestedAt,
    notification?.RequestedAt,
    notification?.requestedAt,
    details?.RequestedAt,
    details?.requestedAt,
    notification?.ReceivedAt,
    notification?.receivedAt,
  );

  const expiresAt = firstValue(
    detail?.ExpiresAt,
    detail?.expiresAt,
    notification?.ExpiresAt,
    notification?.expiresAt,
    details?.ExpiresAt,
    details?.expiresAt,
  );

  const pairRequestId = firstValue(
    notification?.PairRequestId,
    notification?.pairRequestId,
    detail?.PairRequestId,
    detail?.pairRequestId,
    details?.PairRequestId,
    details?.pairRequestId,
  );

  const message =
    body ||
    (requestedBy?.fullName && tournamentTitle !== "Chưa rõ tên giải"
      ? `${requestedBy.fullName} mời bạn ghép cặp tại giải ${tournamentTitle}.`
      : title);

  return {
    pairRequestId,
    tournamentTitle,
    requestedBy,
    requestedTo,
    acceptedBy,
    message,
    note: asText(detail?.ResponseNote, detail?.responseNote, detail?.Note, detail?.note),
    requestedAtText: formatDateTime(requestedAt),
    expiresAtText: formatDateTime(expiresAt),
  };
}

const PairRequestNotificationPopup = ({ visible, notification, onClose, onNavigate }) => {
  const [processing, setProcessing] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const notificationId = firstValue(
    notification?.NotificationId,
    notification?.notificationId,
    notification?.id,
    notification?.PairRequestId,
    notification?.pairRequestId,
  );

  // Determine notification type and UI
  const notificationType = String(
    firstValue(notification?.NotificationType, notification?.notificationType) ||
      "PAIR_REQUEST",
  ).toUpperCase();
  let headerTitle = "Thông báo";
  let messageContent = notification?.Body || notification?.body || notification?.Title || notification?.title;
  let showActions = false;

  switch (notificationType) {
    case "PAIR_REQUEST":
      headerTitle = "Lời mời ghép cặp";
      showActions = true;
      break;
    case "PAIR_ACCEPTED":
      headerTitle = "Được chấp nhận";
      messageContent = notification?.Body || notification?.body || "Lời mời ghép cặp của bạn đã được chấp nhận.";
      break;
    case "PAIR_REJECTED":
      headerTitle = "Bị từ chối";
      messageContent = notification?.Body || notification?.body || "Lời mời ghép cặp của bạn đã bị từ chối.";
      break;
    case "PAIR_CANCELED":
      headerTitle = "Lời mời bị hủy";
      messageContent = "Lời mời ghép cặp đã bị hủy bởi người gửi.";
      break;
    case "PAIR_EXPIRED":
      headerTitle = "Lời mời hết hạn";
      messageContent = "Lời mời ghép cặp đã hết hạn.";
      break;
    default:
      headerTitle = "Thông báo";
      showActions = false;
  }

  const info = useMemo(
    () => normalizePairRequestInfo(notification, detail),
    [notification, detail],
  );

  const pairRequestId = info.pairRequestId;
  const displayUser =
    notificationType === "PAIR_REQUEST"
      ? info.requestedBy
      : info.acceptedBy || info.requestedTo || info.requestedBy;
  const userLabel =
    notificationType === "PAIR_REQUEST"
      ? "Người mời"
      : notificationType === "PAIR_ACCEPTED" || notificationType === "PAIR_REJECTED"
        ? "Người phản hồi"
        : "Người liên quan";

  showActions = notificationType === "PAIR_REQUEST";
  headerTitle =
    notificationType === "PAIR_REQUEST"
      ? "Lời mời ghép cặp"
      : PAIR_STATUS_LABELS[notificationType] || "Thông báo";

  useEffect(() => {
    setDetail(null);
  }, [notificationId, notification?.PairRequestId, notification?.pairRequestId]);

  useEffect(() => {
    if (visible && pairRequestId) {
      // Fetch detail for better info
      fetchDetail();
    }
  }, [visible, pairRequestId]);

  const fetchDetail = async () => {
    try {
      setLoadingDetail(true);
      const data = await getPairRequestDetail(pairRequestId);
      setDetail(data);
    } catch (e) {
      console.error("Failed to fetch pair request detail:", e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDismiss = useCallback(async () => {
    if (notificationId && notificationType !== "PAIR_REQUEST") {
      try {
        await markNotificationRead(notificationId);
      } catch (_error) {
      }
      await dismissPairRequestNotification(notificationId);
    }
    onClose(notificationId, notificationType);
  }, [notificationId, notificationType, onClose]);

  const handleViewDetail = useCallback(async () => {
    if (!pairRequestId) {
      Alert.alert("Thông báo", "Chưa có mã lời mời để mở chi tiết.");
      return;
    }

    if (notificationId && notificationType !== "PAIR_REQUEST") {
      try {
        await markNotificationRead(notificationId);
      } catch (_error) {
      }
    }

    onClose(notificationId, notificationType);
    onNavigate?.(pairRequestId);
  }, [notificationId, notificationType, pairRequestId, onClose, onNavigate]);

  const handleAccept = useCallback(async () => {
    if (!notificationId || !pairRequestId) return;
    try {
      setProcessing(true);
      await acceptPairRequest(pairRequestId);
      Alert.alert("Thành công", "Đã chấp nhận lời mời ghép cặp.");
      await removePairRequestNotification(notificationId);
      onClose(notificationId, notificationType);
    } catch (e) {
      Alert.alert("Lỗi", e?.response?.data?.message || e?.message || "Không thể chấp nhận lời mời.");
    } finally {
      setProcessing(false);
    }
  }, [notificationId, notificationType, pairRequestId, onClose]);

  const handleReject = useCallback(async () => {
    if (!notificationId || !pairRequestId) return;
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
              setProcessing(true);
              await rejectPairRequest(pairRequestId);
              await removePairRequestNotification(notificationId);
              onClose(notificationId, notificationType);
            } catch (e) {
              Alert.alert("Lỗi", "Không thể từ chối lời mời.");
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  }, [notificationId, notificationType, pairRequestId, onClose]);

  if (!visible || !notification) return null;

  const userName = displayUser?.fullName || "Chưa rõ người mời";
  const userInitial = userName?.[0]?.toUpperCase() || "?";
  const hasUserAvatar =
    displayUser?.avatarUrl &&
    (displayUser.avatarUrl.startsWith("http://") || displayUser.avatarUrl.startsWith("https://"));
  const ratingLines = [
    displayUser?.ratingDouble != null
      ? `Rating đôi: ${displayUser.ratingDouble.toFixed(1)}`
      : "",
    displayUser?.ratingSingle != null
      ? `Rating đơn: ${displayUser.ratingSingle.toFixed(1)}`
      : "",
    displayUser?.city || "",
  ].filter(Boolean);
  const statusLabel = PAIR_STATUS_LABELS[notificationType] || "Thông báo";
  messageContent = info.message || messageContent;
  const tournament = { TournamentTitle: info.tournamentTitle };
  const otherUser = {
    AvatarUrl: displayUser?.avatarUrl,
    FullName: displayUser?.fullName || userName,
    RatingDouble: displayUser?.ratingDouble,
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleDismiss}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{headerTitle}</Text>
            <Pressable onPress={handleDismiss} hitSlop={10}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            <>
                {/* Tournament info */}
                <View style={styles.tournamentInfo}>
                  <Text style={styles.tournamentName} numberOfLines={2}>
                    {tournament?.TournamentTitle || "Giải đấu"}
                  </Text>
                  <Text style={styles.message}>{messageContent}</Text>
                </View>

                {/* User info - Show who sent the invitation */}
                {otherUser && (
                  <View style={styles.userSection}>
                    <Text style={styles.sectionLabel}>{userLabel}:</Text>
                    <View style={styles.userRow}>
                      {hasUserAvatar ? (
                        <Image source={{ uri: displayUser.avatarUrl }} style={styles.avatar} />
                      ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                          <Text style={styles.avatarInitial}>{userInitial}</Text>
                        </View>
                      )}
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>{userName}</Text>
                        {otherUser.RatingDouble != null && (
                          <Text style={styles.userRating}>Rating đôi: {Number(otherUser.RatingDouble).toFixed(1)}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.detailSummary}>
                  <View style={styles.detailSummaryRow}>
                    <Text style={styles.detailSummaryLabel}>Trạng thái</Text>
                    <Text style={styles.detailSummaryValue}>{statusLabel}</Text>
                  </View>
                  {info.requestedAtText ? (
                    <View style={styles.detailSummaryRow}>
                      <Text style={styles.detailSummaryLabel}>Gửi lúc</Text>
                      <Text style={styles.detailSummaryValue}>{info.requestedAtText}</Text>
                    </View>
                  ) : null}
                  {info.expiresAtText ? (
                    <View style={styles.detailSummaryRow}>
                      <Text style={styles.detailSummaryLabel}>Hết hạn</Text>
                      <Text style={styles.detailSummaryValue}>{info.expiresAtText}</Text>
                    </View>
                  ) : null}
                  {ratingLines.length > 0 ? (
                    <View style={styles.detailSummaryRow}>
                      <Text style={styles.detailSummaryLabel}>Thông tin</Text>
                      <Text style={styles.detailSummaryValue}>{ratingLines.join(" • ")}</Text>
                    </View>
                  ) : null}
                </View>

                {loadingDetail ? (
                  <View style={styles.inlineLoading}>
                    <ActivityIndicator size="small" color="#2563EB" />
                    <Text style={styles.inlineLoadingText}>Đang cập nhật chi tiết...</Text>
                  </View>
                ) : null}

                {info.note ? (
                  <View style={styles.noteBox}>
                    <Text style={styles.sectionLabel}>Ghi chú:</Text>
                    <Text style={styles.noteText}>{info.note}</Text>
                  </View>
                ) : null}

                {/* Actions */}
                {showActions && (
                  <View style={styles.actions}>
                    <Pressable
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={handleReject}
                      disabled={processing}
                    >
                      {processing ? (
                        <ActivityIndicator size="small" color="#DC2626" />
                      ) : (
                        <>
                          <Ionicons name="close-circle-outline" size={18} color="#DC2626" />
                          <Text style={styles.rejectBtnText}>Từ chối</Text>
                        </>
                      )}
                    </Pressable>

                    <Pressable
                      style={[styles.actionBtn, styles.acceptBtn]}
                      onPress={handleAccept}
                      disabled={processing}
                    >
                      {processing ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <>
                          <Ionicons name="checkmark-circle" size={18} color="#fff" />
                          <Text style={styles.acceptBtnText}>Chấp nhận</Text>
                        </>
                      )}
                    </Pressable>
                  </View>
                )}

                <Pressable style={styles.detailBtn} onPress={handleViewDetail}>
                  <Text style={styles.detailBtnText}>Xem chi tiết</Text>
                </Pressable>
            </>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 360,
    maxHeight: "82%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E2430",
  },
  body: {
    maxHeight: 520,
  },
  bodyContent: {
    paddingBottom: 2,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  tournamentInfo: {
    marginBottom: 16,
  },
  tournamentName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  userSection: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
  },
  avatarPlaceholder: {
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6B7280",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 2,
  },
  userRating: {
    fontSize: 12,
    color: "#6B7280",
  },
  detailSummary: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    gap: 8,
  },
  detailSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  detailSummaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  detailSummaryValue: {
    flex: 1,
    fontSize: 12,
    color: "#1E2430",
    fontWeight: "600",
    textAlign: "right",
    lineHeight: 17,
  },
  inlineLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  inlineLoadingText: {
    fontSize: 12,
    color: "#6B7280",
  },
  noteBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 19,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  acceptBtn: {
    backgroundColor: "#22C55E",
  },
  acceptBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  rejectBtn: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  rejectBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
  },
  detailBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  detailBtnText: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "500",
  },
});

export default PairRequestNotificationPopup;
