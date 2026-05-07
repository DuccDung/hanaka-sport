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
import { publicListTournamentRegistrations } from "../../services/tournamentService";
import { getZaloGroupLink } from "../../services/publicLinkService";
import { getMyTournamentRegistrationState } from "../../services/tournamentService";
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
  const tournament = route?.params?.tournament;
  const tournamentId = tournament?.tournamentId || route?.params?.tournamentId;

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resp, setResp] = useState(null);
  const [openingZalo, setOpeningZalo] = useState(false);
  const [regState, setRegState] = useState(null);
  const [regStateLoading, setRegStateLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showPendingPopup, setShowPendingPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);

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

  // Check if we should show pending pair request popup
  const checkPendingPopup = useCallback(async (state) => {
    if (popupDismissed) return; // User already dismissed

    // Check if user has pending pair requests that block registration
    const hasPendingPairRequest = state?.pendingPairRequests?.length > 0;
    const reason = state?.reason || "";

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
  }, [fetchData, fetchRegState]);

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
  }, [tournamentId]);

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

      const zaloLink = await getZaloGroupLink();

      if (!zaloLink) {
        Alert.alert("Thông báo", "Hiện chưa có link nhóm Zalo.");
        return;
      }

      const supported = await Linking.canOpenURL(zaloLink);

      if (!supported) {
        Alert.alert("Thông báo", "Không thể mở link nhóm Zalo.");
        return;
      }

      await Linking.openURL(zaloLink);
    } catch (error) {
      Alert.alert("Lỗi", "Mở link nhóm Zalo thất bại.");
    } finally {
      setOpeningZalo(false);
    }
  }, []);

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
          {item.regTime}
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
            (!regState?.canRegister || regStateLoading) && styles.actionButtonDisabled,
          ]}
          onPress={() => {
            if (!regState?.canRegister) {
              const reason = regState?.reason || "Bạn không thể đăng ký giải này lúc này.";
              Alert.alert("Thông báo", reason);
              return;
            }
            // Navigate to registration screen
            navigation.navigate("TournamentRegister", {
              tournamentId: tournamentId,
            });
          }}
          disabled={!regState?.canRegister || regStateLoading}
        >
          <Ionicons name="create-outline" size={14} color="#2563EB" style={styles.actionButtonIcon} />
          <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
            {regStateLoading ? "Đang kiểm tra" : "Đăng ký"}
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
      {regState && !regState.canRegister && !regStateLoading && !showPendingPopup && regState.reason && !regState.reason.toLowerCase().includes("lời mời ghép đôi") && (
        <View style={styles.reasonRow}>
          <Ionicons name="information-circle-outline" size={16} color="#DC2626" />
          <Text style={styles.reasonText}>
            {regState.reason}
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
