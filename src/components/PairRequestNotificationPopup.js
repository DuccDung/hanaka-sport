// src/components/PairRequestNotificationPopup.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  dismissPairRequestNotification,
  removePairRequestNotification,
  isPairRequestNotificationDismissed,
} from "../services/realtimeService";
import { acceptPairRequest, getPairRequestDetail, rejectPairRequest } from "../services/tournamentService";
import { useAuth } from "../context/AuthContext";

const PairRequestNotificationPopup = ({ visible, notification, onClose, onNavigate }) => {
  const { session } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const pairRequestId = notification?.PairRequestId;
  const notificationId = notification?.NotificationId;

  // Determine notification type and UI
  const notificationType = notification?.NotificationType || "PAIR_REQUEST";
  let headerTitle = "Thông báo";
  let messageContent = notification.Body || notification.Title;
  let showActions = false;

  switch (notificationType) {
    case "PAIR_REQUEST":
      headerTitle = "Lời mời ghép cặp";
      showActions = true;
      break;
    case "PAIR_ACCEPTED":
      headerTitle = "Được chấp nhận";
      messageContent = notification.Body || "Lời mời ghép cặp của bạn đã được chấp nhận.";
      break;
    case "PAIR_REJECTED":
      headerTitle = "Bị từ chối";
      messageContent = notification.Body || "Lời mời ghép cặp của bạn đã bị từ chối.";
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
    if (notificationId) {
      await dismissPairRequestNotification(notificationId);
    }
    onClose(notificationId);
  }, [notificationId, onClose]);

  const handleViewDetail = useCallback(() => {
    onClose(notificationId);
    onNavigate?.(pairRequestId);
  }, [notificationId, pairRequestId, onClose, onNavigate]);

  const handleAccept = useCallback(async () => {
    if (!notificationId || !pairRequestId) return;
    try {
      setProcessing(true);
      await acceptPairRequest(pairRequestId);
      Alert.alert("Thành công", "Đã chấp nhận lời mời ghép cặp.");
      await removePairRequestNotification(notificationId);
      onClose(notificationId);
    } catch (e) {
      Alert.alert("Lỗi", e?.response?.data?.message || e?.message || "Không thể chấp nhận lời mời.");
    } finally {
      setProcessing(false);
    }
  }, [notificationId, pairRequestId, onClose]);

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
              onClose(notificationId);
            } catch (e) {
              Alert.alert("Lỗi", "Không thể từ chối lời mời.");
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  }, [notificationId, pairRequestId, onClose]);

  if (!visible || !notification) return null;

  const otherUser = detail?.requestedByUser || detail?.requestedToUser || notification.Details?.requestedBy || notification.Details?.requestedTo;
  const tournament = detail || notification.Details;

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

          <View style={styles.body}>
            {loadingDetail ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#2563EB" />
                <Text style={styles.loadingText}>Đang tải...</Text>
              </View>
            ) : (
              <>
                {/* Tournament info */}
                <View style={styles.tournamentInfo}>
                  <Text style={styles.tournamentName} numberOfLines={2}>
                    {tournament?.TournamentTitle || "Giải đấu"}
                  </Text>
                  <Text style={styles.message}>{messageContent}</Text>
                </View>

                {/* User info */}
                {otherUser && (
                  <View style={styles.userSection}>
                    <Text style={styles.sectionLabel}>Người được mời:</Text>
                    <View style={styles.userRow}>
                      {otherUser.AvatarUrl ? (
                        <Image source={{ uri: otherUser.AvatarUrl }} style={styles.avatar} />
                      ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                          <Text style={styles.avatarInitial}>
                            {otherUser.FullName?.[0]?.toUpperCase() || "?"}
                          </Text>
                        </View>
                      )}
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>{otherUser.FullName || "Người chơi"}</Text>
                        {otherUser.RatingDouble !== undefined && (
                          <Text style={styles.userRating}>Rating đôi: {Number(otherUser.RatingDouble).toFixed(1)}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                )}

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
            )}
          </View>
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
    // flex: 1,
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
  },
  userSection: {
    marginBottom: 20,
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
