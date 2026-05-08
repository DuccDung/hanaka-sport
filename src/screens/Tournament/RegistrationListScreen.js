// src/screens/Tournament/RegistrationListScreen.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  TextInput,
  FlatList,
  Image,
  Keyboard,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./registrationListStyles";
import {
  getMyPairRequests,
  getMyTournamentRegistrationState,
  publicGetTournamentDetail,
  publicListTournamentRegistrations,
} from "../../services/tournamentService";
import { getAuthSession } from "../../services/authStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

function normalize(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function fmtDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(
    d.getHours(),
  )}:${pad2(d.getMinutes())}`;
}

function getInitial(name = "") {
  const s = String(name || "").trim();
  if (!s) return "?";
  const parts = s.split(/\s+/);
  const last = parts[parts.length - 1] || s;
  return last[0]?.toUpperCase() || "?";
}

function isValidHttpUrl(uri) {
  if (!uri) return false;
  const s = String(uri);
  return s.startsWith("http://") || s.startsWith("https://");
}

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

function normalizeExternalLink(link) {
  const raw = asText(link);
  if (!raw) return "";
  if (/^(https?:\/\/|zalo:\/\/|mailto:|tel:)/i.test(raw)) return raw;
  return `https://${raw}`;
}

function getTournamentZaloLink(tournament) {
  return normalizeExternalLink(
    firstValue(
      tournament?.zaloLink,
      tournament?.ZaloLink,
      tournament?.zaloGroupLink,
      tournament?.ZaloGroupLink,
    ),
  );
}

function asBool(...values) {
  const found = firstValue(...values);
  if (found === undefined) return false;
  if (typeof found === "boolean") return found;
  if (typeof found === "string") return found.toLowerCase() === "true";
  return Boolean(found);
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.Items)) return value.Items;
  return [];
}

function sameId(a, b) {
  if (a === undefined || a === null || b === undefined || b === null) return false;
  return String(a) === String(b);
}

function getStateReason(state) {
  return asText(
    state?.CannotRegisterReason,
    state?.cannotRegisterReason,
    state?.Reason,
    state?.reason,
  );
}

function normalizeRegistrationState(state) {
  const canRegister = firstValue(
    state?.CanCreateRegistration,
    state?.canCreateRegistration,
    state?.CanRegister,
    state?.canRegister,
  );

  return {
    canRegister: asBool(canRegister),
    hasRegistration: asBool(state?.HasRegistration, state?.hasRegistration),
    hasSuccessfulPair: asBool(state?.HasSuccessfulPair, state?.hasSuccessfulPair),
    hasWaitingPair: asBool(state?.HasWaitingPair, state?.hasWaitingPair),
    hasPendingSent: asBool(
      state?.HasPendingSentPairRequest,
      state?.hasPendingSentPairRequest,
    ),
    hasPendingReceived: asBool(
      state?.HasPendingReceivedPairRequest,
      state?.hasPendingReceivedPairRequest,
    ),
    reason: getStateReason(state),
    registration: firstValue(state?.Registration, state?.registration),
  };
}

function normalizeUserBrief(user) {
  if (!user) return null;

  return {
    fullName: asText(
      user.FullName,
      user.fullName,
      user.Name,
      user.name,
      user.DisplayName,
      user.displayName,
    ),
  };
}

function normalizePairRequest(item = {}) {
  const status = asText(item.Status, item.status).toUpperCase() || "PENDING";

  return {
    pairRequestId: firstValue(item.PairRequestId, item.pairRequestId, item.id),
    tournamentId: firstValue(item.TournamentId, item.tournamentId),
    tournamentTitle: asText(item.TournamentTitle, item.tournamentTitle),
    requestedByUser: normalizeUserBrief(
      firstValue(item.RequestedByUser, item.requestedByUser, item.RequestedBy, item.requestedBy),
    ),
    requestedToUser: normalizeUserBrief(
      firstValue(item.RequestedToUser, item.requestedToUser, item.RequestedTo, item.requestedTo),
    ),
    status,
  };
}

function normalizePairRequestList(data, tournamentId) {
  return asArray(data)
    .map(normalizePairRequest)
    .filter((item) => sameId(item.tournamentId, tournamentId))
    .filter((item) => !item.status || item.status === "PENDING");
}

function formatNameList(names) {
  const cleanNames = [...new Set(names.filter(Boolean))];
  if (!cleanNames.length) return "người chơi khác";
  if (cleanNames.length <= 2) return cleanNames.join(", ");
  return `${cleanNames.slice(0, 2).join(", ")} và ${cleanNames.length - 2} người khác`;
}

function getRegistrationPlayerText(registration) {
  const player1 = asText(
    registration?.Player1Name,
    registration?.player1Name,
    registration?.player1?.name,
    registration?.Player1?.Name,
  );
  const player2 = asText(
    registration?.Player2Name,
    registration?.player2Name,
    registration?.player2?.name,
    registration?.Player2?.Name,
  );

  return [player1, player2].filter(Boolean).join(" - ");
}

function buildCannotRegisterMessage({ state, sentRequests = [], receivedRequests = [] }) {
  const status = normalizeRegistrationState(state);
  const lines = [];

  if (status.hasSuccessfulPair) {
    const players = getRegistrationPlayerText(status.registration);
    lines.push(
      players
        ? `Bạn đã có đội trong giải này: ${players}.`
        : "Bạn đã có đội/đã đăng ký thành công trong giải này.",
    );
  } else if (status.hasWaitingPair) {
    lines.push("Bạn đang có đăng ký chờ ghép trong giải này.");
  } else if (status.hasRegistration) {
    const players = getRegistrationPlayerText(status.registration);
    lines.push(
      players
        ? `Bạn đã có đăng ký trong giải này: ${players}.`
        : "Bạn đã có đăng ký trong giải này.",
    );
  }

  if (receivedRequests.length > 0) {
    const names = receivedRequests.map((item) => item.requestedByUser?.fullName);
    lines.push(`Bạn đang có lời mời ghép cặp từ ${formatNameList(names)}.`);
  } else if (status.hasPendingReceived) {
    lines.push("Bạn đang có lời mời ghép cặp cần phản hồi.");
  }

  if (sentRequests.length > 0) {
    const names = sentRequests.map((item) => item.requestedToUser?.fullName);
    lines.push(`Bạn đang chờ ${formatNameList(names)} phản hồi lời mời ghép cặp.`);
  } else if (status.hasPendingSent) {
    lines.push("Bạn đang có lời mời ghép cặp đã gửi và đang chờ phản hồi.");
  }

  if (status.reason && !lines.some((line) => line.includes(status.reason))) {
    lines.push(status.reason);
  }

  if (!lines.length) {
    lines.push("Bạn không thể đăng ký giải này lúc này.");
  }

  return lines.join("\n\n");
}

function AvatarCircle({ uri, name, size = 44 }) {
  const initial = getInitial(name);
  const showImage = isValidHttpUrl(uri);

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
        <Text
          style={{
            fontSize: size * 0.42,
            fontWeight: "700",
            color: "#374151",
          }}
        >
          {initial}
        </Text>
      )}
    </View>
  );
}

export default function RegistrationListScreen({ navigation, route }) {
  const routeTournament = route?.params?.tournament || route?.params?.preview;
  const tournamentId = firstValue(
    routeTournament?.tournamentId,
    routeTournament?.TournamentId,
    route?.params?.tournamentId,
    route?.params?.TournamentId,
  );

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resp, setResp] = useState(null);
  const [tournamentDetail, setTournamentDetail] = useState(null);
  const [openingZalo, setOpeningZalo] = useState(false);
  const [regState, setRegState] = useState(null);
  const [regStateLoading, setRegStateLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showPendingPopup, setShowPendingPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [checkingRegisterBlock, setCheckingRegisterBlock] = useState(false);
  const tournament = tournamentDetail || routeTournament;

  const fetchData = useCallback(async () => {
    try {
      setErrorMsg("");
      setLoading(true);

      // Always fetch all registrations (no tab filtering)
      const res = await publicListTournamentRegistrations(tournamentId, "ALL");
      setResp(res);
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message ||
          e?.message ||
          "Không tải được danh sách đăng ký.",
      );
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  const fetchRegState = useCallback(async () => {
    if (!tournamentId) return;
    try {
      setRegStateLoading(true);

      const [stateData, session] = await Promise.all([
        getMyTournamentRegistrationState(tournamentId).catch(() => null),
        getAuthSession(),
      ]);

      setRegState(stateData);
      if (session?.user?.userId) {
        setCurrentUserId(session.user.userId);
      }
    } catch (e) {
      console.log("Failed to load registration state:", e?.message);
    } finally {
      setRegStateLoading(false);
    }
  }, [tournamentId]);

  const fetchTournamentDetail = useCallback(async () => {
    if (!tournamentId) return;

    try {
      const detail = await publicGetTournamentDetail(tournamentId);
      setTournamentDetail(detail);
    } catch (e) {
      console.log("Failed to load tournament detail:", e?.message);
    }
  }, [tournamentId]);

  // Check if we should show pending pair request popup
  const checkPendingPopup = useCallback(async (state) => {
    if (popupDismissed) return; // User already dismissed

    // Check if user has pending pair requests that block registration
    const status = normalizeRegistrationState(state);
    const hasPendingPairRequest =
      asArray(state?.PendingPairRequests).length > 0 ||
      asArray(state?.pendingPairRequests).length > 0 ||
      status.hasPendingReceived ||
      status.hasPendingSent;
    const reason = status.reason;

    // Show popup if reason mentions pending pair request
    const shouldShow = hasPendingPairRequest || reason.toLowerCase().includes("lời mời ghép đôi");

    if (shouldShow) {
      setShowPendingPopup(true);
    } else {
      setShowPendingPopup(false);
    }
  }, [popupDismissed]);

  useEffect(() => {
    fetchData();
    fetchRegState();
    fetchTournamentDetail();
  }, [fetchData, fetchRegState, fetchTournamentDetail]);

  // Refresh regState when screen is focused (after navigation back)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRegState();
      fetchTournamentDetail();
    });
    return unsubscribe;
  }, [navigation, fetchRegState, fetchTournamentDetail]);

  // Check popup when regState changes
  useEffect(() => {
    if (regState) {
      checkPendingPopup(regState);
    }
  }, [regState, checkPendingPopup]);

  // Load dismissed state on mount
  useEffect(() => {
    const loadPopupDismissed = async () => {
      try {
        const dismissed = await AsyncStorage.getItem(`pendingPairPopupDismissed_${tournamentId}`);
        if (dismissed === "true") {
          setPopupDismissed(true);
        }
      } catch (e) {
        console.error("Failed to load popup dismissed state:", e);
      }
    };
    loadPopupDismissed();
  }, [tournamentId]);

  const onRefresh = useCallback(async () => {
    try {
      setErrorMsg("");
      setRefreshing(true);

      const [res, stateData] = await Promise.all([
        publicListTournamentRegistrations(tournamentId, "ALL"),
        getMyTournamentRegistrationState(tournamentId).catch(() => null),
        fetchTournamentDetail(),
      ]);

      setResp(res);
      if (stateData) setRegState(stateData);
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message ||
          e?.message ||
          "Không tải được danh sách đăng ký.",
      );
    } finally {
      setRefreshing(false);
    }
  }, [fetchTournamentDetail, tournamentId]);

  const registrationStatus = useMemo(
    () => normalizeRegistrationState(regState),
    [regState],
  );

  const fetchBlockedPairRequests = useCallback(async () => {
    const [sentData, receivedData] = await Promise.all([
      getMyPairRequests(true).catch(() => []),
      getMyPairRequests(false).catch(() => []),
    ]);

    return {
      sentRequests: normalizePairRequestList(sentData, tournamentId),
      receivedRequests: normalizePairRequestList(receivedData, tournamentId),
    };
  }, [tournamentId]);

  const handlePressRegister = useCallback(async () => {
    if (regStateLoading) {
      Alert.alert("Đang kiểm tra", "Hệ thống đang kiểm tra trạng thái đăng ký của bạn. Vui lòng thử lại sau vài giây.");
      return;
    }

    if (registrationStatus.canRegister) {
      navigation.navigate("TournamentRegister", {
        tournamentId,
      });
      return;
    }

    try {
      setCheckingRegisterBlock(true);
      const { sentRequests, receivedRequests } = await fetchBlockedPairRequests();
      const hasPairRequests =
        sentRequests.length > 0 ||
        receivedRequests.length > 0 ||
        registrationStatus.hasPendingSent ||
        registrationStatus.hasPendingReceived;

      const message = buildCannotRegisterMessage({
        state: regState,
        sentRequests,
        receivedRequests,
      });

      const buttons = hasPairRequests
        ? [
            { text: "Đóng", style: "cancel" },
            {
              text: "Xem lời mời",
              onPress: () => navigation.navigate("PairRequestManagement", {}),
            },
          ]
        : [{ text: "Đã hiểu" }];

      Alert.alert("Không thể đăng ký", message, buttons);
    } finally {
      setCheckingRegisterBlock(false);
    }
  }, [
    fetchBlockedPairRequests,
    navigation,
    regState,
    regStateLoading,
    registrationStatus,
    tournamentId,
  ]);

  const handleDismissPendingPopup = useCallback(async () => {
    setShowPendingPopup(false);
    // Mark as dismissed for this tournament
    try {
      await AsyncStorage.setItem(`pendingPairPopupDismissed_${tournamentId}`, "true");
      setPopupDismissed(true);
    } catch (e) {
      console.error("Failed to save popup dismissed state:", e);
    }
  }, [tournamentId]);

  const handleViewPendingRequests = useCallback(() => {
    setShowPendingPopup(false);
    navigation.navigate("PairRequestManagement", {});
  }, [navigation]);

  const handleOpenZaloGroup = useCallback(async () => {
    try {
      setOpeningZalo(true);

      let zaloLink = getTournamentZaloLink(tournament);

      if (!zaloLink && tournamentId) {
        const detail = await publicGetTournamentDetail(tournamentId);
        setTournamentDetail(detail);
        zaloLink = getTournamentZaloLink(detail);
      }

      if (!zaloLink) {
        Alert.alert("Thông báo", "Hiện chưa có link nhóm Zalo.");
        return;
      }

      await Linking.openURL(zaloLink);
    } catch (error) {
      Alert.alert("Lỗi", "Mở link nhóm Zalo thất bại.");
    } finally {
      setOpeningZalo(false);
    }
  }, [tournament, tournamentId]);

  const allItems = useMemo(() => {
    const successItems = resp?.successItems || [];
    const waitingItems = resp?.waitingItems || [];
    const merged = [...successItems, ...waitingItems];

    return merged.map((r) => {
      const v1 = r.player1;
      const v2 = r.player2;

      return {
        id: String(r.registrationId),
        index: r.regIndex,
        regCode: r.regCode,
        regTime: fmtDateTime(r.regTime),
        points: r.points ?? 0,
        success: !!r.success,
        waitingPair: !!r.waitingPair,
        vdv1: {
          name: v1?.name || "-",
          avatar: v1?.avatar || "",
          level: v1?.level ?? 0,
          verified: !!v1?.verified,
          isGuest: !!v1?.isGuest,
          userId: v1?.userId,
        },
        vdv2: v2
          ? {
              name: v2?.name || "-",
              avatar: v2?.avatar || "",
              level: v2?.level ?? 0,
              verified: !!v2?.verified,
              isGuest: !!v2?.isGuest,
              userId: v2?.userId,
            }
          : {
              name: "Chờ ghép",
              avatar: "",
              level: 0,
              verified: false,
              isGuest: true,
              userId: null,
            },
      };
    });
  }, [resp]);

  const displayItems = useMemo(() => {
    // No tab filtering - show all items
    const q = normalize(query.trim());
    if (!q) return allItems;

    return allItems.filter((r) => {
      const hay = normalize(
        `${r.regCode} ${r.regTime} ${r.vdv1.name} ${r.vdv2.name}`,
      );
      return hay.includes(q);
    });
  }, [allItems, query]);

  const stats = useMemo(() => {
    const c = resp?.counts;

    if (!c) {
      return {
        success: 0,
        waitingPair: 0,
        capacity: tournament?.expectedTeams ?? 0,
      };
    }

    return {
      success: c.success ?? 0,
      waitingPair: c.waiting ?? 0,
      capacity: c.capacityLeft ?? 0,
    };
  }, [resp, tournament]);

  const renderPlayer = (p) => (
    <View style={styles.playerCol}>
      <View style={styles.avatarRing}>
        <AvatarCircle
          uri={p.avatar}
          name={p.name}
          size={styles.avatar?.width || 44}
        />
      </View>

      <Text style={styles.playerName} numberOfLines={2}>
        {p.name}
      </Text>

      <Text style={styles.playerLevel}>({p.level})</Text>

      {p.verified ? (
        <Text style={styles.verifiedText}>Đã xác thực</Text>
      ) : (
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>
            {p.isGuest ? "Khách" : "Chờ xác thực"}
          </Text>
        </View>
      )}
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHeaderRow}>
        <Text style={styles.idx}>{item.index}</Text>
        <Text style={styles.itemHeaderText}>
          Mã đk: <Text style={styles.itemHeaderStrong}>{item.regCode}</Text>{" "}
          <Text>{item.regTime}</Text>
        </Text>
      </View>

      <View style={styles.gridRow}>
        {renderPlayer(item.vdv1)}
        {renderPlayer(item.vdv2)}

        <View style={styles.pointCol}>
          <Text style={styles.pointsText}>{item.points}</Text>
        </View>
      </View>

      {/* Nút Mời cho waiting registration của chính user */}
      {item.waitingPair && item.vdv2?.name === "Chờ ghép" && (
        <Pressable
          style={({ pressed }) => [
            styles.inviteBtn,
            pressed && styles.inviteBtnPressed,
          ]}
          onPress={() => {
            if (!currentUserId) {
              Alert.alert("Lỗi", "Không xác định được người dùng hiện tại.");
              return;
            }

            // Chỉ cho phép mời nếu là registration của chính user
            const isOwnWaiting =
              regState?.registration?.registrationId === Number(item.id);

            if (!isOwnWaiting) {
              Alert.alert(
                "Thông báo",
                "Bạn chỉ có thể mời đối tác cho đăng ký chờ ghép của mình."
              );
              return;
            }

            // Điều hướng đến PartnerSearch để tìm đối tác
            navigation.navigate("PartnerSearch", {
              tournamentId,
            });
          }}
        >
          <Ionicons name="person-add-outline" size={16} color="#fff" />
          <Text style={styles.inviteBtnText}>Mời người chơi khác</Text>
        </Pressable>
      )}
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={{ paddingTop: 24, alignItems: "center" }}>
        <Text style={{ color: "#6B7280" }}>Không có dữ liệu đăng ký.</Text>
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

          <Text style={styles.headerTitle}>Danh sách đăng ký</Text>
        </View>
      </View>

      {loading ? (
        <View style={{ paddingTop: 12 }}>
          <ActivityIndicator />
        </View>
      ) : null}

      {errorMsg ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={{ color: "#DC2626" }}>{errorMsg}</Text>

          <Pressable onPress={fetchData} style={{ marginTop: 8 }}>
            <Text style={{ color: "#2563EB" }}>Thử lại</Text>
          </Pressable>
        </View>
      ) : null}

      {/* Action buttons row - no tabs */}
      <View style={styles.actionsRow}>
        {/* Đăng ký button */}
        <Pressable
          style={[
            styles.actionButton,
            styles.actionButtonPrimary,
            (!registrationStatus.canRegister ||
              regStateLoading ||
              checkingRegisterBlock) &&
              styles.actionButtonDisabled,
          ]}
          onPress={handlePressRegister}
          disabled={checkingRegisterBlock}
        >
          <Ionicons name="create-outline" size={14} color="#2563EB" style={styles.actionButtonIcon} />
          <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
            {regStateLoading || checkingRegisterBlock ? "Đang kiểm tra" : "Đăng ký"}
          </Text>
        </Pressable>

        {/* Lời mời của tôi button */}
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            navigation.navigate("PairRequestManagement", {});
          }}
        >
          <Ionicons name="person-add-outline" size={14} color="#1E2430" style={styles.actionButtonIcon} />
          <Text style={styles.actionButtonText}>Lời mời</Text>
        </Pressable>

        {/* Zalo group button */}
        <Pressable
          style={styles.actionButton}
          onPress={handleOpenZaloGroup}
          disabled={openingZalo}
        >
          <Ionicons name="link-outline" size={14} color="#1E2430" style={styles.actionButtonIcon} />
          <Text style={styles.actionButtonText}>
            {openingZalo ? "Đang mở" : "Zalo"}
          </Text>
        </Pressable>

        {/* Thành công button */}
        <Pressable
          style={[styles.actionButton, styles.actionButtonSuccess]}
          onPress={() => {
            Alert.alert("Thành công", `Có ${stats.success} đội đăng ký thành công.`);
          }}
        >
          <Ionicons name="checkmark-circle-outline" size={14} color="#22C55E" style={styles.actionButtonIcon} />
          <Text style={[styles.actionButtonText, styles.actionButtonTextSuccess]}>
            Thành công ({stats.success})
          </Text>
        </Pressable>

        {/* Chờ ghép button */}
        <Pressable
          style={[styles.actionButton, styles.actionButtonWaiting]}
          onPress={() => {
            Alert.alert("Chờ ghép", `${stats.waitingPair} đội đang chờ ghép cặp.`);
          }}
        >
          <Ionicons name="time-outline" size={14} color="#F59E0B" style={styles.actionButtonIcon} />
          <Text style={[styles.actionButtonText, styles.actionButtonTextWaiting]}>
            Chờ ghép ({stats.waitingPair})
          </Text>
        </Pressable>

        {/* Còn chỗ button */}
        <Pressable
          style={[styles.actionButton, styles.actionButtonCapacity]}
          onPress={() => {
            Alert.alert("Còn chỗ", `Giải còn ${stats.capacity} chỗ trống.`);
          }}
        >
          <Ionicons name="people-outline" size={14} color="#6B7280" style={styles.actionButtonIcon} />
          <Text style={[styles.actionButtonText, styles.actionButtonTextCapacity]}>
            Còn chỗ ({stats.capacity})
          </Text>
        </Pressable>
      </View>

      {/* Lý do không thể đăng ký - chỉ hiển thị nếu không phải là pending pair request */}
      {regState &&
        !registrationStatus.canRegister &&
        !regStateLoading &&
        !showPendingPopup &&
        registrationStatus.reason &&
        !registrationStatus.reason.toLowerCase().includes("lời mời ghép đôi") && (
        <View style={styles.reasonRow}>
          <Ionicons name="information-circle-outline" size={16} color="#DC2626" />
          <Text style={styles.reasonText}>
            {registrationStatus.reason}
          </Text>
        </View>
      )}

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Nhập tên, mã đăng ký để tìm kiếm..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <Ionicons name="search" size={18} color="#9CA3AF" />
        </View>
      </View>

      <View style={styles.tableHeader}>
        <View style={styles.colVdv1}>
          <Text style={styles.thText}>VĐV1</Text>
        </View>
        <View style={styles.colVdv2}>
          <Text style={styles.thText}>VĐV2</Text>
        </View>
        <View style={styles.colPoint}>
          <Text style={styles.thText}>Điểm</Text>
        </View>
      </View>

      {/* Pending Pair Request Popup */}
      <Modal
        visible={showPendingPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPendingPopup(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContent}>
            <View style={styles.popupIconContainer}>
              <Ionicons name="time-outline" size={40} color="#F59E0B" />
            </View>
            <Text style={styles.popupTitle}>Lời mời ghép đôi đang chờ</Text>
            <Text style={styles.popupMessage}>
              Bạn có lời mời ghép đôi đang được chờ xử lý. Bạn cần phản hồi các lời mời này trước khi có thể đăng ký tham gia giải.
            </Text>
            <View style={styles.popupButtonRow}>
              <Pressable
                style={[styles.popupButton, styles.popupButtonExit]}
                onPress={handleDismissPendingPopup}
              >
                <Text style={styles.popupButtonExitText}>Thoát</Text>
              </Pressable>
              <Pressable
                style={[styles.popupButton, styles.popupButtonView]}
                onPress={handleViewPendingRequests}
              >
                <Text style={styles.popupButtonViewText}>Xem chi tiết</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        contentContainerStyle={styles.listPad}
        data={displayItems}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
