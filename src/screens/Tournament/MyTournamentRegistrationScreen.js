// src/screens/Tournament/MyTournamentRegistrationScreen.js
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
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./myRegistrationStyles";
import {
  getMyTournamentRegistrationState,
  getPairRequestNotifications,
  acceptPairRequest,
  rejectPairRequest,
  cancelPairRequest,
} from "../../services/tournamentService";

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function formatTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function MyTournamentRegistrationScreen({ navigation, route }) {
  const { tournamentId } = route.params;

  const [state, setState] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = useCallback(async (refresh = false) => {
    try {
      setErrorMsg("");
      if (refresh) setRefreshing(true);
      else setLoading(true);

      // Get registration state
      const stateRes = await getMyTournamentRegistrationState(tournamentId);
      setState(stateRes);

      // Get pair requests (received only from notifications endpoint)
      const notifRes = await getPairRequestNotifications();
      const allReceived = (notifRes.items || []).filter(item => item.tournamentId === tournamentId);
      setSentRequests([]); // No endpoint for sent yet
      setReceivedRequests(allReceived);
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message || e?.message || "Không tải được dữ liệu."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  const handleCancelRequest = (pairRequestId) => {
    Alert.alert(
      "Hủy lời mời",
      "Bạn có chắc muốn hủy lời mời ghép cặp này?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Hủy",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelPairRequest(pairRequestId);
              Alert.alert("Đã hủy", "Lời mời đã được hủy.", [
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

  const renderRegistrationCard = () => {
    if (!state) return null;

    const { HasRegistration, Registration, HasSuccessfulPair, HasWaitingPair } = state;

    if (!HasRegistration) {
      return (
        <View style={styles.emptyStateCard}>
          <Ionicons name="person-add-outline" size={48} color="#6B7280" />
          <Text style={styles.emptyStateTitle}>Bạn chưa đăng ký giải này</Text>
          <Text style={styles.emptyStateDesc}>
            Hãy đăng ký để tham gia giải đấu
          </Text>
          <Pressable
            style={styles.primaryBtn}
            onPress={() =>
              navigation.navigate("TournamentRegistration", {
                tournament: {
                  tournamentId: tournamentId,
                  title: state.Tournament?.Title || "Giải đấu",
                  gameType: state.Tournament?.GameType,
                  singleLimit: state.Tournament?.SingleLimit,
                  doubleLimit: state.Tournament?.DoubleLimit,
                },
              })
            }
          >
            <Text style={styles.primaryBtnText}>Đăng ký ngay</Text>
          </Pressable>
        </View>
      );
    }

    if (HasSuccessfulPair) {
      const team = Registration;
      return (
        <View style={[styles.regCard, styles.regCardSuccess]}>
          <View style={styles.regCardHeader}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.regCardTitle}>Đã đăng ký & ghép cặp thành công</Text>
          </View>
          <View style={styles.teamSection}>
            <Text style={styles.teamLabel}>Đội 1</Text>
            <View style={styles.playerRow}>
              <View style={styles.playerAvatar}>
                <Text style={styles.playerAvatarText}>
                  {team.Player1Name?.[0] || "?"}
                </Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{team.Player1Name}</Text>
                <Text style={styles.playerRating}>
                  Rating: {team.Player1Level?.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
          {team.Player2Name && (
            <View style={styles.teamSection}>
              <Text style={styles.teamLabel}>Đội 2</Text>
              <View style={styles.playerRow}>
                <View style={styles.playerAvatar}>
                  <Text style={styles.playerAvatarText}>
                    {team.Player2Name?.[0] || "?"}
                  </Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{team.Player2Name}</Text>
                  <Text style={styles.playerRating}>
                    Rating: {team.Player2Level?.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View style={styles.regCardFooter}>
            <Text style={styles.regCode}>Mã đăng ký: {team.RegCode}</Text>
            <Text style={styles.regTime}>Ngày đăng ký: {formatDate(team.RegTime)}</Text>
            <View style={[styles.badge, styles.badgeSuccess]}>
              <Text style={styles.badgeText}>Tổng điểm: {team.Points?.toFixed(1)}</Text>
            </View>
          </View>
        </View>
      );
    }

    if (HasWaitingPair) {
      const team = Registration;
      return (
        <View style={[styles.regCard, styles.regCardWaiting]}>
          <View style={styles.regCardHeader}>
            <Ionicons name="time" size={24} color="#F59E0B" />
            <Text style={styles.regCardTitle}>Đang chờ ghép cặp</Text>
          </View>
          <View style={styles.teamSection}>
            <Text style={styles.teamLabel}>Bạn</Text>
            <View style={styles.playerRow}>
              <View style={styles.playerAvatar}>
                <Text style={styles.playerAvatarText}>
                  {team.Player1Name?.[0] || "?"}
                </Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{team.Player1Name}</Text>
                <Text style={styles.playerRating}>
                  Rating: {team.Player1Level?.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.waitingDesc}>
            Bạn đã đăng ký chờ ghép cặp. Hãy tìm đối tác bằng cách gửi lời mời.
          </Text>
          <View style={styles.regCardFooter}>
            <Text style={styles.regCode}>Mã đăng ký: {team.RegCode}</Text>
            <Text style={styles.regTime}>Ngày đăng ký: {formatDate(team.RegTime)}</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  const renderPairRequestItem = (item) => {
    const isReceived = true; // All from notifications are received
    const isPending = item.status === "PENDING";

    return (
      <View style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <View style={styles.requestAvatar}>
            <Text style={styles.requestAvatarText}>
              {item.requestedBy?.fullName?.[0] || "?"}
            </Text>
          </View>
          <View style={styles.requestInfo}>
            <Text style={styles.requestName}>{item.requestedBy?.fullName}</Text>
            <Text style={styles.requestMeta}>
              {isReceived ? "Đã gửi lời mời cho bạn" : "Bạn đã gửi lời mời"}
            </Text>
            <Text style={styles.requestTime}>
              {formatDate(item.requestedAt)} {formatTime(item.requestedAt)}
            </Text>
          </View>
          <View style={[styles.statusBadge, isPending && styles.statusBadgePending]}>
            <Text style={[styles.statusText, isPending && styles.statusTextPending]}>
              {isPending ? "Chờ xử lý" : item.status}
            </Text>
          </View>
        </View>
        {item.message && (
          <Text style={styles.requestMessage}>"{item.message}"</Text>
        )}
        {isPending && (
          <View style={styles.requestActions}>
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
          </View>
        )}
      </View>
    );
  };

  const canRegister = state?.CanCreateRegistration === true;

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
          <Text style={styles.headerTitle}>Trạng thái đăng ký</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      {errorMsg ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={{ color: "#DC2626" }}>{errorMsg}</Text>
        </View>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.body}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            {/* Registration Card */}
            {renderRegistrationCard()}

            {/* Registration Reason */}
            {!canRegister && state?.CannotRegisterReason && (
              <View style={styles.warningCard}>
                <Ionicons name="warning-outline" size={24} color="#DC2626" />
                <Text style={styles.warningText}>{state.CannotRegisterReason}</Text>
              </View>
            )}

            {/* Pending Requests Section */}
            {receivedRequests.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lời mời ghép cặp</Text>

                <View style={styles.subsection}>
                  <Text style={styles.subsectionTitle}>Đã nhận ({receivedRequests.length})</Text>
                  {receivedRequests.map((item) =>
                    renderPairRequestItem(item)
                  )}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            {state?.HasRegistration && !state?.HasSuccessfulPair && (
              <Pressable
                style={styles.secondaryBtn}
                onPress={() =>
                  navigation.navigate("PairRequestInbox", {
                    tournamentId,
                    tournamentTitle: state.Tournament?.Title,
                  })
                }
              >
                <Ionicons name="mail-outline" size={18} color="#2563EB" />
                <Text style={styles.secondaryBtnText}>Xem hộp thư lời mời</Text>
              </Pressable>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}