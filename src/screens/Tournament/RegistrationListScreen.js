// src/screens/Tournament/RegistrationListScreen.js
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./registrationListStyles";
import {
  getMyTournamentRegistrationState,
  publicGetTournamentDetail,
  publicListTournamentRegistrations,
} from "../../services/tournamentService";
import { API_BASE_URL } from "../../constants/config";

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

function buildTournamentPaymentWebUrl(tournamentId, registrationId) {
  const baseUrl = String(API_BASE_URL || "").replace(/\/+$/, "");
  const path = `/PickleballWeb/App/Tournament/${encodeURIComponent(
    tournamentId,
  )}/Registration/${encodeURIComponent(registrationId)}/Payment`;
  return `${baseUrl}${path}`;
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

function isSingleTournament(tournament) {
  const value = asText(
    tournament?.tournamentTypeCode,
    tournament?.TournamentTypeCode,
    tournament?.gameType,
    tournament?.GameType,
  ).toUpperCase();

  return value === "SINGLE" || value.includes("SINGLE");
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

function getRegistrationId(registration) {
  return firstValue(
    registration?.RegistrationId,
    registration?.registrationId,
    registration?.Id,
    registration?.id,
  );
}

function getViewerUserIdFromState(state) {
  const me = firstValue(state?.Me, state?.me, state?.User, state?.user);
  return firstValue(me?.UserId, me?.userId, me?.Id, me?.id);
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
  const registration = firstValue(
    state?.ExistingRegistration,
    state?.existingRegistration,
    state?.Registration,
    state?.registration,
  );
  const canRegister = firstValue(
    state?.CanCreateRegistration,
    state?.canCreateRegistration,
    state?.CanRegister,
    state?.canRegister,
  );

  return {
    canRegister: asBool(canRegister),
    hasRegistration:
      asBool(state?.HasRegistration, state?.hasRegistration) || !!registration,
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
    registration,
  };
}

function findRegistrationItemIdForState(state, items = []) {
  const status = normalizeRegistrationState(state);
  const directRegistrationId = getRegistrationId(status.registration);

  if (directRegistrationId) {
    return String(directRegistrationId);
  }

  const viewerUserId = getViewerUserIdFromState(state);
  if (!viewerUserId) {
    return "";
  }

  const match = items.find(
    (item) =>
      sameId(item?.vdv1?.userId, viewerUserId) ||
      sameId(item?.vdv2?.userId, viewerUserId),
  );

  return match?.id ? String(match.id) : "";
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
  const listRef = useRef(null);
  const scrollTargetRef = useRef("");
  const scrollRetryCountRef = useRef(0);
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
  const [registrationState, setRegistrationState] = useState(null);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  const [pendingScrollRegistrationId, setPendingScrollRegistrationId] = useState("");
  const [openingZalo, setOpeningZalo] = useState(false);
  const [payingRegistrationId, setPayingRegistrationId] = useState(null);
  const tournament = tournamentDetail || routeTournament;
  const isSingle = isSingleTournament(resp?.tournament || tournament);

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

  const fetchTournamentDetail = useCallback(async () => {
    if (!tournamentId) return;

    try {
      const detail = await publicGetTournamentDetail(tournamentId);
      setTournamentDetail(detail);
    } catch (e) {
      console.log("Failed to load tournament detail:", e?.message);
    }
  }, [tournamentId]);

  const fetchRegistrationState = useCallback(async () => {
    if (!tournamentId) {
      setRegistrationState(null);
      return null;
    }

    try {
      const state = await getMyTournamentRegistrationState(tournamentId);
      setRegistrationState(state);
      return state;
    } catch (e) {
      if (e?.response?.status !== 401) {
        console.log("Failed to load tournament registration state:", e?.message);
      }
      setRegistrationState(null);
      return null;
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchData();
    fetchTournamentDetail();
    fetchRegistrationState();
  }, [fetchData, fetchTournamentDetail, fetchRegistrationState]);

  // Refresh data when screen is focused (after navigation back)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
      fetchTournamentDetail();
      fetchRegistrationState();
    });
    return unsubscribe;
  }, [navigation, fetchData, fetchTournamentDetail, fetchRegistrationState]);

  const onRefresh = useCallback(async () => {
    try {
      setErrorMsg("");
      setRefreshing(true);

      const [res] = await Promise.all([
        publicListTournamentRegistrations(tournamentId, "ALL"),
        fetchTournamentDetail(),
        fetchRegistrationState(),
      ]);

      setResp(res);
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message ||
          e?.message ||
          "Không tải được danh sách đăng ký.",
      );
    } finally {
      setRefreshing(false);
    }
  }, [fetchRegistrationState, fetchTournamentDetail, tournamentId]);

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

  const handleOpenPayment = useCallback(async (item) => {
    if (!item?.id || item.paid || payingRegistrationId) return;

    try {
      setPayingRegistrationId(item.id);

      const checkout = {
        tournamentId,
        registrationId: item.id,
      };
      const paymentTournamentId = firstValue(
        checkout?.tournamentId,
        checkout?.TournamentId,
        tournamentId,
      );
      const paymentRegistrationId = firstValue(
        checkout?.registrationId,
        checkout?.RegistrationId,
        item.id,
      );

      navigation.navigate("AppWebView", {
        title: "Chi tiết đăng ký",
        url: buildTournamentPaymentWebUrl(
          paymentTournamentId,
          paymentRegistrationId,
        ),
      });
    } catch (error) {
      Alert.alert(
        "Không mở được trang",
        error?.response?.data?.message ||
          error?.message ||
          "Vui lòng thử lại sau.",
      );
    } finally {
      setPayingRegistrationId(null);
    }
  }, [navigation, payingRegistrationId, tournamentId]);

  const allItems = useMemo(() => {
    const successItems = resp?.successItems || [];
    const merged = successItems;

    return merged.map((r) => {
      const v1 = r.player1;
      const v2 = r.player2;
      const paid = asBool(r.paid, r.Paid);
      const canPay = !!r.success && !r.waitingPair && !paid;
      const showPaymentState = !!r.success && !r.waitingPair && (paid || canPay);

      return {
        id: String(r.registrationId),
        index: r.regIndex,
        regCode: r.regCode,
        regTime: fmtDateTime(r.regTime),
        points: r.points ?? 0,
        success: !!r.success,
        waitingPair: !!r.waitingPair,
        paid,
        paidAt: r.paidAt,
        canPay,
        showPaymentState,
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

  const scrollToRegistration = useCallback(
    (registrationId) => {
      const targetId = String(registrationId || "");
      if (!targetId) return;
      scrollTargetRef.current = targetId;

      const itemExists = allItems.some((item) => sameId(item.id, targetId));
      if (!itemExists) {
        setPendingScrollRegistrationId(targetId);
        if (query) {
          setQuery("");
        }
        return;
      }

      const index = displayItems.findIndex((item) => sameId(item.id, targetId));
      if (index < 0) {
        setPendingScrollRegistrationId(targetId);
        if (query) {
          setQuery("");
        }
        return;
      }

      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.25,
      });
    },
    [allItems, displayItems, query],
  );

  useEffect(() => {
    if (!pendingScrollRegistrationId) return undefined;

    const index = displayItems.findIndex((item) =>
      sameId(item.id, pendingScrollRegistrationId),
    );
    if (index < 0) return undefined;

    const timer = setTimeout(() => {
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.25,
      });
      setPendingScrollRegistrationId("");
    }, 80);

    return () => clearTimeout(timer);
  }, [displayItems, pendingScrollRegistrationId]);

  const handleScrollToIndexFailed = useCallback((info) => {
    const targetId = scrollTargetRef.current || pendingScrollRegistrationId;
    const offset = Math.max(0, info.averageItemLength * (info.index + 1));

    setTimeout(() => {
      listRef.current?.scrollToOffset({ offset, animated: true });
    }, 60);

    if (!targetId || scrollRetryCountRef.current >= 5) {
      return;
    }

    scrollRetryCountRef.current += 1;
    setTimeout(() => {
      scrollToRegistration(targetId);
    }, 260);
  }, [pendingScrollRegistrationId, scrollToRegistration]);

  const navigateToLogin = useCallback(() => {
    const parentNavigation = navigation.getParent?.();
    if (parentNavigation) {
      parentNavigation.navigate("AuthStack", { screen: "Login" });
      return;
    }

    navigation.navigate("AuthStack", { screen: "Login" });
  }, [navigation]);

  const handlePressRegister = useCallback(async () => {
    let state = registrationState;
    let registrationId = findRegistrationItemIdForState(state, allItems);

    if (!registrationId && !checkingRegistration) {
      try {
        setCheckingRegistration(true);
        state = await getMyTournamentRegistrationState(tournamentId);
        setRegistrationState(state);
        registrationId = findRegistrationItemIdForState(state, allItems);
      } catch (e) {
        if (e?.response?.status === 401) {
          Alert.alert("Thông báo", "Bạn cần đăng nhập để đăng kí giải đấu", [
            {
              text: "OK",
              onPress: navigateToLogin,
            },
          ]);
          return;
        }

        if (e?.response?.status !== 401) {
          console.log("Failed to check registration state:", e?.message);
        }
      } finally {
        setCheckingRegistration(false);
      }
    }

    if (registrationId) {
      scrollRetryCountRef.current = 0;
      Alert.alert("Thông báo", "Bạn đã đăng kí", [
        {
          text: "OK",
          onPress: () => scrollToRegistration(registrationId),
        },
      ]);
      return;
    }

    navigation.navigate("TournamentRegister", {
      tournamentId,
    });
  }, [
    allItems,
    checkingRegistration,
    navigateToLogin,
    navigation,
    registrationState,
    scrollToRegistration,
    tournamentId,
  ]);

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
          size={50}
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

  const renderPaymentIcon = (item, extraStyle) => {
    if (!item.showPaymentState) return null;

    if (item.paid) {
      return (
        <View
          accessibilityRole="image"
          accessibilityLabel="Hoan tat"
          style={[styles.paymentPaidBadge, extraStyle]}
        >
          <Ionicons name="checkmark-circle" size={22} color="#047857" />
        </View>
      );
    }

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Mo"
        hitSlop={6}
        style={({ pressed }) => [
          styles.paymentIconButton,
          extraStyle,
          pressed && styles.paymentButtonPressed,
          payingRegistrationId && payingRegistrationId !== item.id
            ? styles.paymentButtonDisabled
            : null,
        ]}
        onPress={() => handleOpenPayment(item)}
        disabled={!!payingRegistrationId}
      >
        {payingRegistrationId === item.id ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="card-outline" size={21} color="#fff" />
        )}
      </Pressable>
    );
  };

  const renderSingleItem = ({ item }) => (
    <View style={[styles.item, styles.singleItem]}>
      <View style={styles.itemHeaderRow}>
        <Text style={styles.idx}>{item.index}</Text>
        <Text style={styles.itemHeaderText}>
          Mã đk: <Text style={styles.itemHeaderStrong}>{item.regCode}</Text>{" "}
          <Text>{item.regTime}</Text>
        </Text>
      </View>

      <View style={styles.singleBody}>
        <View style={styles.singlePlayerInfo}>
          <View style={styles.avatarRing}>
            <AvatarCircle
              uri={item.vdv1.avatar}
              name={item.vdv1.name}
              size={50}
            />
          </View>

          <View style={styles.singlePlayerTextWrap}>
            <Text style={styles.singlePlayerName} numberOfLines={2}>
              {item.vdv1.name}
            </Text>
            <Text style={styles.singlePlayerLevel}>
              Pick Single: {item.vdv1.level}
            </Text>
            {item.vdv1.verified ? (
              <Text style={styles.singleVerifiedText}>Đã xác thực</Text>
            ) : (
              <View style={styles.singleStatusPill}>
                <Text style={styles.statusPillText}>
                  {item.vdv1.isGuest ? "Khách" : "Chờ xác thực"}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.singleMetaCol}>
          {renderPaymentIcon(item, styles.paymentTopAction)}
          <Text style={styles.singlePointsText}>{item.points}</Text>
        </View>
      </View>

      {item.showPaymentState && (
        <>
          <View style={styles.singlePaymentDivider} />
          <View style={styles.singlePaymentRow}>
            {item.paid ? (
              <View
                accessibilityRole="image"
                accessibilityLabel="Hoàn tất"
                style={[styles.paymentPaidBadge, styles.singlePaymentBadge]}
              >
                <Ionicons name="checkmark-circle" size={22} color="#047857" />
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Mở"
                hitSlop={6}
                style={({ pressed }) => [
                  styles.paymentIconButton,
                  styles.singlePaymentButton,
                  pressed && styles.paymentButtonPressed,
                  payingRegistrationId && payingRegistrationId !== item.id
                    ? styles.paymentButtonDisabled
                    : null,
                ]}
                onPress={() => handleOpenPayment(item)}
                disabled={!!payingRegistrationId}
              >
                {payingRegistrationId === item.id ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="card-outline" size={21} color="#fff" />
                )}
              </Pressable>
            )}
          </View>
        </>
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
          {renderPaymentIcon(item, styles.paymentTopAction)}
          <Text style={styles.pointsText}>{item.points}</Text>
        </View>
      </View>

      {item.showPaymentState && (
        <View style={styles.paymentRow}>
          {item.paid ? (
            <View
              accessibilityRole="image"
              accessibilityLabel="Hoàn tất"
              style={styles.paymentPaidBadge}
            >
              <Ionicons name="checkmark-circle" size={22} color="#047857" />
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mở"
              hitSlop={6}
              style={({ pressed }) => [
                styles.paymentIconButton,
                pressed && styles.paymentButtonPressed,
                payingRegistrationId && payingRegistrationId !== item.id
                  ? styles.paymentButtonDisabled
                  : null,
              ]}
              onPress={() => handleOpenPayment(item)}
              disabled={!!payingRegistrationId}
            >
              {payingRegistrationId === item.id ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="card-outline" size={21} color="#fff" />
              )}
            </Pressable>
          )}
        </View>
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
            checkingRegistration && styles.actionButtonDisabled,
          ]}
          onPress={handlePressRegister}
          disabled={checkingRegistration}
        >
          <Ionicons name="create-outline" size={18} color="#2563EB" style={styles.actionButtonIcon} />
          <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
            Đăng ký
          </Text>
        </Pressable>

        {/* Zalo group button */}
        <Pressable
          style={styles.actionButton}
          onPress={handleOpenZaloGroup}
          disabled={openingZalo}
        >
          <Ionicons name="link-outline" size={18} color="#1E2430" style={styles.actionButtonIcon} />
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
          <Ionicons name="checkmark-circle-outline" size={18} color="#22C55E" style={styles.actionButtonIcon} />
          <Text style={[styles.actionButtonText, styles.actionButtonTextSuccess]}>
            Thành công ({stats.success})
          </Text>
        </Pressable>

        {/* Còn chỗ button */}
        <Pressable
          style={[styles.actionButton, styles.actionButtonCapacity]}
          onPress={() => {
            Alert.alert("Còn chỗ", `Giải còn ${stats.capacity} chỗ trống.`);
          }}
        >
          <Ionicons name="people-outline" size={18} color="#6B7280" style={styles.actionButtonIcon} />
          <Text style={[styles.actionButtonText, styles.actionButtonTextCapacity]}>
            Còn chỗ ({stats.capacity})
          </Text>
        </Pressable>
      </View>

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

      {!isSingle && (
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
      )}

      <FlatList
        ref={listRef}
        contentContainerStyle={styles.listPad}
        data={displayItems}
        keyExtractor={(it) => it.id}
        renderItem={isSingle ? renderSingleItem : renderItem}
        ListEmptyComponent={renderEmpty}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
