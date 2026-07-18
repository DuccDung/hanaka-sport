import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";
import { styles } from "./styles";
import { COLORS } from "../../constants/colors";
import { COMMUNITY_PRIVACY_URL } from "../../constants/communitySafety";
import {
  getMe,
  updateMe,
  uploadAvatar,
  deleteMe,
  getMyRatingHistory,
} from "../../services/userService";
import {
  evaluateCommunityContent,
} from "../../services/communitySafetyService";
import { getAuthSession } from "../../services/authStorage";

const GENDERS = ["Nam", "Nữ", "Khác"];
const PROVINCES = ["Bắc Giang", "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng"];

function formatDateDDMMYYYY(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

function formatDateTimeDDMMYYYY(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

function formatRatingScore(value) {
  if (value === null || value === undefined || value === "") return "--";
  const n = Number(value);
  if (Number.isNaN(n)) return "--";
  return n.toFixed(2).replace(/\.?0+$/, "");
}

function toIsoDateOnly(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

function normalizeAvatarUrl(value) {
  if (!value) return null;
  const s = String(value).trim();
  if (!s || s === "null" || s === "undefined") return null;
  return s;
}

function normalizeIdentityValue(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
}

function confirmAction({
  title,
  message,
  cancelText = "Huỷ",
  confirmText,
  destructive = false,
  onConfirm,
}) {
  if (Platform.OS === "web") {
    const ok =
      typeof globalThis !== "undefined" &&
      typeof globalThis.confirm === "function"
        ? globalThis.confirm(`${title}\n\n${message}`)
        : true;

    if (ok) {
      void onConfirm?.();
    }

    return;
  }

  Alert.alert(title, message, [
    { text: cancelText, style: "cancel" },
    {
      text: confirmText,
      style: destructive ? "destructive" : "default",
      onPress: onConfirm,
    },
  ]);
}

export default function AccountScreen({ navigation }) {
  const { session, logout, setAuthSession, booting } = useAuth();

  const accessToken = session?.accessToken || null;
  const userInSession = session?.user || null;
  const sessionUserId = normalizeIdentityValue(userInSession?.userId);
  const sessionEmail = normalizeIdentityValue(userInSession?.email);
  const isLoggedIn = !!accessToken;

  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [userId, setUserId] = useState(userInSession?.userId ?? null);
  const [avatarUrl, setAvatarUrl] = useState(
    normalizeAvatarUrl(userInSession?.avatarUrl),
  );
  const [fullName, setFullName] = useState(userInSession?.fullName ?? "");
  const [phone, setPhone] = useState(userInSession?.phone ?? "");
  const [email, setEmail] = useState(userInSession?.email ?? "");
  const [gender, setGender] = useState(userInSession?.gender ?? "");
  const [province, setProvince] = useState(userInSession?.city ?? "");
  const [bio, setBio] = useState(userInSession?.bio ?? "");
  const [dobDate, setDobDate] = useState(
    userInSession?.birthOfDate ? new Date(userInSession.birthOfDate) : null,
  );
  const [ratingSingle, setRatingSingle] = useState(userInSession?.ratingSingle ?? null);
  const [ratingDouble, setRatingDouble] = useState(userInSession?.ratingDouble ?? null);
  const [ratingUpdatedAt, setRatingUpdatedAt] = useState(
    userInSession?.ratingUpdatedAt ?? null,
  );
  const [ratingHistoryOpen, setRatingHistoryOpen] = useState(false);
  const [ratingHistoryLoading, setRatingHistoryLoading] = useState(false);
  const [ratingHistoryLoaded, setRatingHistoryLoaded] = useState(false);
  const [ratingHistoryItems, setRatingHistoryItems] = useState([]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [genderModal, setGenderModal] = useState(false);
  const [provinceModal, setProvinceModal] = useState(false);
  const accessTokenRef = useRef(accessToken);
  const profileRequestIdRef = useRef(0);
  const isMountedRef = useRef(true);
  const fullNameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const bioInputRef = useRef(null);

  const clearUserState = useCallback(() => {
    setUserId(null);
    setAvatarUrl(null);
    setFullName("");
    setPhone("");
    setEmail("");
    setGender("");
    setProvince("");
    setBio("");
    setDobDate(null);
    setRatingSingle(null);
    setRatingDouble(null);
    setRatingUpdatedAt(null);
    setRatingHistoryOpen(false);
    setRatingHistoryLoading(false);
    setRatingHistoryLoaded(false);
    setRatingHistoryItems([]);
  }, []);

  const hasLocalProfile = useMemo(() => {
    return Boolean(
      userInSession?.userId ||
        userId ||
        email ||
        fullName ||
        phone ||
        bio ||
        avatarUrl,
    );
  }, [avatarUrl, bio, email, fullName, phone, userId, userInSession?.userId]);

  const canInteractWithProfile = !booting && (isLoggedIn || hasLocalProfile);
  const formEditable = !deletingAccount && !loading;
  const isVerifiedAccount = !!(userInSession?.verified || userInSession?.Verified);
  const profileEditable = formEditable && !isVerifiedAccount;
  const canEditAvatar = profileEditable;
  const canEditPhone = profileEditable;

  const verifiedText = useMemo(() => {
    if (booting) return "Đang tải";
    if (!canInteractWithProfile) return "Chưa đăng nhập";
    return isVerifiedAccount ? "Đã xác thực" : "Chờ xác thực";
  }, [booting, canInteractWithProfile, isVerifiedAccount]);

  const requireLogin = useCallback(() => {
    if (canInteractWithProfile) return false;

    Alert.alert(
      "Bạn chưa đăng nhập",
      "Vui lòng đăng nhập để xem và cập nhật thông tin tài khoản.",
      [
        {
          text: "OK",
          onPress: () =>
            navigation.navigate("AuthStack", {
              screen: "Login",
            }),
        },
      ],
    );

    return true;
  }, [canInteractWithProfile, navigation]);

  const syncUserToState = useCallback((user) => {
    if (!user) return;

    setUserId(user?.userId ?? null);
    setAvatarUrl(normalizeAvatarUrl(user?.avatarUrl));
    setFullName(user?.fullName ?? "");
    setPhone(user?.phone ?? "");
    setEmail(user?.email ?? "");
    setGender(user?.gender ?? "");
    setProvince(user?.city ?? "");
    setBio(user?.bio ?? "");
    setDobDate(user?.birthOfDate ? new Date(user.birthOfDate) : null);
    setRatingSingle(user?.ratingSingle ?? user?.RatingSingle ?? null);
    setRatingDouble(user?.ratingDouble ?? user?.RatingDouble ?? null);
    setRatingUpdatedAt(user?.ratingUpdatedAt ?? user?.RatingUpdatedAt ?? null);
  }, []);

  const loadRatingHistory = useCallback(async () => {
    if (!accessToken || ratingHistoryLoading) return;

    try {
      setRatingHistoryLoading(true);
      const payload = await getMyRatingHistory();
      setRatingHistoryItems(Array.isArray(payload?.items) ? payload.items : []);
      setRatingHistoryLoaded(true);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Không lấy được lịch sử điểm trình.";
      Alert.alert("Lỗi", String(msg));
    } finally {
      setRatingHistoryLoading(false);
    }
  }, [accessToken, ratingHistoryLoading]);

  const toggleRatingHistory = useCallback(() => {
    if (requireLogin()) return;

    const nextOpen = !ratingHistoryOpen;
    setRatingHistoryOpen(nextOpen);

    if (nextOpen && !ratingHistoryLoaded) {
      void loadRatingHistory();
    }
  }, [loadRatingHistory, ratingHistoryLoaded, ratingHistoryOpen, requireLogin]);

  useEffect(() => {
    if (userInSession) {
      syncUserToState(userInSession);
      return;
    }

    if (!accessToken && !booting) {
      clearUserState();
    }
  }, [accessToken, booting, clearUserState, syncUserToState, userInSession]);

  useEffect(() => {
    accessTokenRef.current = accessToken;

    if (!accessToken) {
      profileRequestIdRef.current += 1;
    }
  }, [accessToken]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      profileRequestIdRef.current += 1;
    };
  }, []);

  const resetToHome = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "MainTabs",
          state: {
            index: 0,
            routes: [{ name: "Home" }],
          },
        },
      ],
    });
  }, [navigation]);

  const performLogout = useCallback(async () => {
    profileRequestIdRef.current += 1;
    accessTokenRef.current = null;
    clearUserState();

    try {
      await logout();
    } finally {
      resetToHome();
    }
  }, [clearUserState, logout, resetToHome]);

  const isCurrentProfileRequest = useCallback((requestId, tokenSnapshot) => {
    return (
      isMountedRef.current &&
      profileRequestIdRef.current === requestId &&
      !!tokenSnapshot &&
      accessTokenRef.current === tokenSnapshot
    );
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!accessToken) return;

    const requestId = profileRequestIdRef.current + 1;
    profileRequestIdRef.current = requestId;
    const tokenSnapshot = accessToken;
    const expectedUserId = sessionUserId;
    const expectedEmail = sessionEmail;

    try {
      const me = await getMe({ accessToken: tokenSnapshot });

      if (!isCurrentProfileRequest(requestId, tokenSnapshot)) {
        return;
      }

      const latestSession = await getAuthSession();

      if (latestSession?.accessToken !== tokenSnapshot) {
        return;
      }

      const returnedUserId = normalizeIdentityValue(me?.userId);
      const returnedEmail = normalizeIdentityValue(me?.email);

      if (
        (expectedUserId && returnedUserId && expectedUserId !== returnedUserId) ||
        (expectedEmail && returnedEmail && expectedEmail !== returnedEmail)
      ) {
        return;
      }

      syncUserToState(me);

      await setAuthSession({
        accessToken: tokenSnapshot,
        expiresAtUtc: latestSession?.expiresAtUtc || session?.expiresAtUtc,
        user: me,
      });
    } catch (error) {
      if (!isCurrentProfileRequest(requestId, tokenSnapshot)) {
        return;
      }
      Alert.alert("Lỗi", "Không lấy được thông tin tài khoản.");
    }
  }, [
    accessToken,
    isCurrentProfileRequest,
    session?.expiresAtUtc,
    sessionEmail,
    sessionUserId,
    setAuthSession,
    syncUserToState,
  ]);

  const ensureActiveSession = useCallback(async () => {
    if (accessToken) {
      return {
        accessToken,
        expiresAtUtc: session?.expiresAtUtc || null,
        user: session?.user || null,
      };
    }

    Alert.alert(
      "Bạn chưa đăng nhập",
      "Vui lòng đăng nhập lại để cập nhật thông tin tài khoản.",
      [
        {
          text: "OK",
          onPress: () =>
            navigation.navigate("AuthStack", {
              screen: "Login",
            }),
        },
      ],
    );

    return null;
  }, [
    accessToken,
    navigation,
    session?.expiresAtUtc,
    session?.user,
  ]);

  useEffect(() => {
    if (!accessToken) return;
    refreshProfile();
  }, [accessToken, refreshProfile]);

  const onPickAvatar = async () => {
    if (requireLogin()) return;

    if (isVerifiedAccount) {
      Alert.alert(
        "Không thể cập nhật",
        "Tài khoản đã xác thực nên không thể đổi ảnh đại diện.",
      );
      return;
    }

    try {
      const activeSession = await ensureActiveSession();
      if (!activeSession?.accessToken) return;

      if (Platform.OS !== "ios") {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            "Thiếu quyền",
            "Bạn cần cấp quyền truy cập thư viện ảnh.",
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
        selectionLimit: 1,
      });

      if (result.canceled) return;

      const fileUri = result.assets?.[0]?.uri;
      if (!fileUri) return;

      setAvatarUploading(true);

      const response = await uploadAvatar(fileUri);
      const safeAvatar = normalizeAvatarUrl(response?.avatarUrl);

      if (!safeAvatar) {
        throw new Error("Upload thành công nhưng không nhận được avatarUrl.");
      }

      setAvatarUrl(safeAvatar);

      const nextUser = {
        ...(session?.user || {}),
        avatarUrl: safeAvatar,
      };

      await setAuthSession({
        accessToken: activeSession.accessToken,
        expiresAtUtc: activeSession.expiresAtUtc,
        user: nextUser,
      });

      Alert.alert("Thành công", "Đã cập nhật ảnh đại diện.");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Upload ảnh thất bại.";
      Alert.alert("Lỗi", String(msg));
    } finally {
      setAvatarUploading(false);
    }
  };

  const onUpdate = async () => {
    if (requireLogin()) return;

    if (isVerifiedAccount) {
      Alert.alert(
        "Không thể cập nhật",
        "Tài khoản đã xác thực nên không thể sửa thông tin hồ sơ.",
      );
      return;
    }

    const fullNameModeration = evaluateCommunityContent(fullName);
    if (fullName?.trim() && fullNameModeration.blocked) {
      Alert.alert(
        "Nội dung bị chặn",
        `Họ tên có dấu hiệu ${fullNameModeration.category?.toLowerCase() || "vi phạm tiêu chuẩn cộng đồng"}. Vui lòng chỉnh sửa trước khi lưu.`,
      );
      return;
    }

    const bioModeration = evaluateCommunityContent(bio);
    if (bio?.trim() && bioModeration.blocked) {
      Alert.alert(
        "Nội dung bị chặn",
        `Phần giới thiệu có dấu hiệu ${bioModeration.category?.toLowerCase() || "vi phạm tiêu chuẩn cộng đồng"}. Vui lòng chỉnh sửa trước khi lưu.`,
      );
      return;
    }

    try {
      const activeSession = await ensureActiveSession();
      if (!activeSession?.accessToken) return;

      setLoading(true);

      const payload = {
        fullName: fullName?.trim() || "",
        phone: isVerifiedAccount
          ? String(userInSession?.phone ?? phone ?? "").trim()
          : phone?.trim() || "",
        gender: gender || null,
        city: province || null,
        bio: bio?.trim() || null,
        birthOfDate: dobDate ? toIsoDateOnly(dobDate) : null,
        avatarUrl: isVerifiedAccount
          ? normalizeAvatarUrl(userInSession?.avatarUrl) || avatarUrl || null
          : avatarUrl || null,
      };

      const updated = await updateMe(payload);

      syncUserToState(updated);

      await setAuthSession({
        accessToken: activeSession.accessToken,
        expiresAtUtc: activeSession.expiresAtUtc,
        user: updated,
      });

      Alert.alert("Thành công", "Cập nhật thông tin thành công.");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Cập nhật thất bại.";
      Alert.alert("Lỗi", String(msg));
    } finally {
      setLoading(false);
    }
  };

  const onDeleteAccount = async () => {
    if (requireLogin()) return;

    Alert.alert(
      "Xóa tài khoản",
      "Tài khoản sẽ bị vô hiệu hóa và bạn sẽ bị đăng xuất. Bạn có chắc chắn muốn tiếp tục?",
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xóa tài khoản",
          style: "destructive",
          onPress: async () => {
            try {
              const activeSession = await ensureActiveSession();
              if (!activeSession?.accessToken) return;

              setDeletingAccount(true);

              await deleteMe();

              Alert.alert("Thành công", "Tài khoản của bạn đã được xóa.", [
                {
                  text: "OK",
                  onPress: performLogout,
                },
              ]);
            } catch (error) {
              const msg =
                error?.response?.data?.message ||
                error?.response?.data ||
                error?.message ||
                "Xóa tài khoản thất bại.";

              Alert.alert("Lỗi", String(msg));
            } finally {
              setDeletingAccount(false);
            }
          },
        },
      ],
    );
  };

  const onLogout = () => {
    confirmAction({
      title: "Đăng xuất",
      message: "Bạn chắc chắn muốn đăng xuất?",
      confirmText: "Đăng xuất",
      destructive: true,
      onConfirm: performLogout,
    });
  };

  const onChangeDate = (event, selectedDate) => {
    if (isVerifiedAccount) {
      setShowDatePicker(false);
      return;
    }

    if (Platform.OS !== "ios") {
      setShowDatePicker(false);
    }

    if (event?.type === "set" && selectedDate) {
      setDobDate(selectedDate);
    }

    if (event?.type === "dismissed") {
      setShowDatePicker(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </Pressable>

        <Text style={styles.headerTitle}>Thông tin tài khoản</Text>

        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        >
        <View style={styles.avatarSection}>
          <Pressable
            onPress={onPickAvatar}
            disabled={!formEditable || avatarUploading}
            style={({ pressed }) => [
              styles.avatarPressable,
              (!canEditAvatar || avatarUploading) && styles.inputDisabled,
              pressed && formEditable ? styles.pressed : null,
            ]}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons
                  name="person-circle-outline"
                  size={92}
                  color={COLORS.BLUE}
                />
              </View>
            )}

            <View style={styles.cameraBadge}>
              {avatarUploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : isVerifiedAccount ? (
                <Ionicons name="lock-closed" size={15} color="#fff" />
              ) : (
                <Ionicons name="camera" size={16} color="#fff" />
              )}
            </View>
          </Pressable>

          <Text style={styles.avatarHint}>
            {!canInteractWithProfile
              ? "Đăng nhập để cập nhật ảnh"
              : isVerifiedAccount
                ? "Tài khoản đã xác thực, không thể đổi ảnh đại diện"
              : "Chạm để đổi ảnh đại diện"}
          </Text>
        </View>

        <Text style={styles.statusText}>
          Thành viên: <Text style={styles.statusBold}>{verifiedText}</Text>
        </Text>

        <View style={styles.ratingCard}>
          <View style={styles.ratingHeader}>
            <View style={styles.ratingHeaderText}>
              <Text style={styles.ratingTitle}>Điểm trình</Text>
              <Text style={styles.ratingUpdatedText}>
                {canInteractWithProfile
                  ? ratingUpdatedAt
                    ? `Cập nhật ${formatDateTimeDDMMYYYY(ratingUpdatedAt)}`
                    : "Chưa có lịch sử điểm trình"
                  : "Đăng nhập để xem điểm trình"}
              </Text>
            </View>

            <Pressable
              onPress={toggleRatingHistory}
              disabled={!canInteractWithProfile || booting}
              style={[
                styles.ratingToggle,
                (!canInteractWithProfile || booting) && styles.btnDisabled,
              ]}
            >
              <Text style={styles.ratingToggleText}>
                {ratingHistoryOpen ? "Ẩn lịch sử" : "Xem lịch sử"}
              </Text>
              <Ionicons
                name={ratingHistoryOpen ? "chevron-up" : "chevron-down"}
                size={16}
                color="#166534"
              />
            </Pressable>
          </View>

          <View style={styles.ratingSummary}>
            <View style={styles.ratingSummaryItem}>
              <View style={styles.ratingSummaryLabelRow}>
                <View style={styles.ratingSummaryIcon}>
                  <Ionicons name="person-outline" size={15} color="#166534" />
                </View>
                <Text style={styles.ratingSummaryLabel}>Trình đơn</Text>
              </View>
              <Text style={styles.ratingSummaryValue}>
                {formatRatingScore(ratingSingle)}
              </Text>
            </View>
            <View style={styles.ratingSummaryItem}>
              <View style={styles.ratingSummaryLabelRow}>
                <View style={styles.ratingSummaryIcon}>
                  <Ionicons name="people-outline" size={15} color="#166534" />
                </View>
                <Text style={styles.ratingSummaryLabel}>Trình đôi</Text>
              </View>
              <Text style={styles.ratingSummaryValue}>
                {formatRatingScore(ratingDouble)}
              </Text>
            </View>
          </View>

          {ratingHistoryOpen ? (
            <View style={styles.ratingHistory}>
              {ratingHistoryLoading ? (
                <View style={styles.ratingHistoryLoading}>
                  <ActivityIndicator size="small" color="#16A34A" />
                  <Text style={styles.ratingHistoryEmpty}>
                    Đang tải lịch sử điểm trình...
                  </Text>
                </View>
              ) : ratingHistoryItems.length ? (
                ratingHistoryItems.map((item) => {
                  const key =
                    item?.ratingHistoryId ||
                    item?.RatingHistoryId ||
                    `${item?.ratedAt || item?.RatedAt}-${item?.ratingSingle || item?.RatingSingle}`;
                  const ratedBy =
                    item?.ratedByName ||
                    item?.RatedByName ||
                    (item?.ratedByUserId || item?.RatedByUserId
                      ? `User #${item?.ratedByUserId || item?.RatedByUserId}`
                      : "Hệ thống");

                  return (
                    <View key={String(key)} style={styles.ratingHistoryItem}>
                      <View style={styles.ratingHistoryScores}>
                        <Text style={styles.ratingHistoryScoreText}>
                          Đơn{" "}
                          <Text style={styles.ratingHistoryScoreValue}>
                            {formatRatingScore(item?.ratingSingle ?? item?.RatingSingle)}
                          </Text>
                        </Text>
                        <Text style={styles.ratingHistoryScoreText}>
                          Đôi{" "}
                          <Text style={styles.ratingHistoryScoreValue}>
                            {formatRatingScore(item?.ratingDouble ?? item?.RatingDouble)}
                          </Text>
                        </Text>
                      </View>
                      <Text style={styles.ratingHistoryMeta}>
                        {formatDateTimeDDMMYYYY(item?.ratedAt || item?.RatedAt) || "--"} · {ratedBy}
                      </Text>
                      {item?.note || item?.Note ? (
                        <Text style={styles.ratingHistoryNote}>
                          {item?.note || item?.Note}
                        </Text>
                      ) : null}
                    </View>
                  );
                })
              ) : (
                <Text style={styles.ratingHistoryEmpty}>
                  Chưa có lịch sử điểm trình.
                </Text>
              )}
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Label text="User ID" />
          <TextInput
            value={userId != null ? String(userId) : ""}
            style={[styles.input, styles.inputDisabled]}
            editable={false}
            placeholder="Chưa có dữ liệu"
            placeholderTextColor="#9CA3AF"
          />

          <Label text="Họ tên" required style={styles.labelSpacing} />
          <Pressable
            onPress={() => {
              if (!profileEditable) return;
              fullNameInputRef.current?.focus?.();
            }}
            style={[styles.inputShell, !profileEditable && styles.inputDisabled]}
          >
            <TextInput
              ref={fullNameInputRef}
              value={fullName}
              onChangeText={setFullName}
              style={styles.inputText}
              editable={profileEditable}
              placeholder="Nhập họ tên"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              autoCorrect={false}
              showSoftInputOnFocus={profileEditable}
            />
          </Pressable>

          <Label text="Số điện thoại" required style={styles.labelSpacing} />
          <Pressable
            onPress={() => {
              if (isVerifiedAccount) {
                Alert.alert(
                  "Không thể cập nhật",
                  "Tài khoản đã xác thực nên không thể sửa số điện thoại.",
                );
                return;
              }

              phoneInputRef.current?.focus?.();
            }}
            style={[styles.inputShell, !canEditPhone && styles.inputDisabled]}
          >
            <TextInput
              ref={phoneInputRef}
              value={phone}
              onChangeText={setPhone}
              style={styles.inputText}
              editable={canEditPhone}
              keyboardType="phone-pad"
              placeholder="Ví dụ: 096..."
              placeholderTextColor="#9CA3AF"
              autoCorrect={false}
              showSoftInputOnFocus={canEditPhone}
            />
          </Pressable>

          <Label text="Email" style={styles.labelSpacing} />
          <TextInput
            value={email}
            style={[styles.input, styles.inputDisabled]}
            editable={false}
            placeholder="Chưa có email"
            placeholderTextColor="#9CA3AF"
          />

          <Label text="Ngày sinh" style={styles.labelSpacing} />
          <Pressable
            onPress={() => {
              if (requireLogin() || !profileEditable) return;
              setShowDatePicker(true);
            }}
            style={[styles.select, !profileEditable && styles.selectDisabled]}
          >
            <Text style={dobDate ? styles.selectText : styles.placeholderText}>
              {dobDate ? formatDateDDMMYYYY(dobDate) : "Chọn ngày sinh"}
            </Text>
            <Ionicons name="calendar-outline" size={18} color="#6B7280" />
          </Pressable>

          {showDatePicker ? (
            <DateTimePicker
              value={dobDate ?? new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              onChange={onChangeDate}
            />
          ) : null}

          <Label text="Giới tính" style={styles.labelSpacing} />
          <Pressable
            onPress={() => {
              if (requireLogin() || !profileEditable) return;
              setGenderModal(true);
            }}
            style={[styles.select, !profileEditable && styles.selectDisabled]}
          >
            <Text style={gender ? styles.selectText : styles.placeholderText}>
              {gender || "Chọn giới tính"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          </Pressable>

          <Label text="Tỉnh/Thành" style={styles.labelSpacing} />
          <Pressable
            onPress={() => {
              if (requireLogin() || !profileEditable) return;
              setProvinceModal(true);
            }}
            style={[styles.select, !profileEditable && styles.selectDisabled]}
          >
            <Text style={province ? styles.selectText : styles.placeholderText}>
              {province || "Chọn tỉnh/thành"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          </Pressable>

          <Label text="Giới thiệu" style={styles.labelSpacing} />
          <Pressable
            onPress={() => {
              if (!profileEditable) return;
              bioInputRef.current?.focus?.();
            }}
            style={[styles.textareaShell, !profileEditable && styles.inputDisabled]}
          >
            <TextInput
              ref={bioInputRef}
              value={bio}
              onChangeText={setBio}
              style={styles.textareaInput}
              editable={profileEditable}
              multiline
              placeholder="Viết vài dòng giới thiệu..."
              placeholderTextColor="#9CA3AF"
              autoCorrect={false}
              textAlignVertical="top"
              showSoftInputOnFocus={profileEditable}
            />
          </Pressable>

          <Pressable
            onPress={onUpdate}
            style={[
              styles.btn,
              styles.btnPrimary,
              (!canInteractWithProfile || loading || isVerifiedAccount) && styles.btnDisabled,
            ]}
            disabled={!canInteractWithProfile || loading || isVerifiedAccount}
          >
            <Text style={styles.btnPrimaryText}>
              {loading ? "Đang lưu..." : "Cập nhật thông tin"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (requireLogin()) return;
              navigation.navigate("ChangePassword");
            }}
            style={[
              styles.btn,
              styles.btnOutline,
              !canInteractWithProfile && styles.btnDisabled,
            ]}
            disabled={!canInteractWithProfile}
          >
            <Text style={styles.btnOutlineText}>Đổi mật khẩu</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("CommunitySafety")}
            style={[styles.btn, styles.btnBlueSoft]}
          >
            <Text style={styles.btnBlueSoftText}>
              Điều khoản cộng đồng và quản lý chặn
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate("PolicyWebView", {
                title: "Chính sách quyền riêng tư",
                url: COMMUNITY_PRIVACY_URL,
              })
            }
            style={[styles.btn, styles.btnGreen]}
          >
            <Text style={styles.btnGreenText}>Chính sách quyền riêng tư</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (requireLogin()) return;
              navigation.navigate("DeleteAccount");
            }}
            style={[
              styles.btn,
              styles.btnDanger,
              !canInteractWithProfile && styles.btnDisabled,
            ]}
            disabled={!canInteractWithProfile}
          >
            <Text style={styles.btnDangerText}>
              {deletingAccount ? "Đang xóa tài khoản..." : "Xóa tài khoản"}
            </Text>
          </Pressable>

          <Pressable onPress={onLogout} style={[styles.btn, styles.btnDanger]}>
            <Text style={styles.btnDangerText}>Đăng xuất</Text>
          </Pressable>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SelectModal
        visible={genderModal}
        title="Chọn giới tính"
        options={GENDERS}
        selected={gender}
        onClose={() => setGenderModal(false)}
        onSelect={(value) => {
          if (isVerifiedAccount) {
            setGenderModal(false);
            return;
          }

          setGender(value);
          setGenderModal(false);
        }}
      />

      <SelectModal
        visible={provinceModal}
        title="Chọn tỉnh/thành"
        options={PROVINCES}
        selected={province}
        onClose={() => setProvinceModal(false)}
        onSelect={(value) => {
          if (isVerifiedAccount) {
            setProvinceModal(false);
            return;
          }

          setProvince(value);
          setProvinceModal(false);
        }}
      />
    </SafeAreaView>
  );
}

function Label({ text, required = false, style }) {
  return (
    <Text style={[styles.label, style]}>
      {text} {required ? <Text style={styles.required}>*</Text> : null}
    </Text>
  );
}

function SelectModal({ visible, title, options, selected, onClose, onSelect }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={() => {}}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const active = item === selected;

              return (
                <Pressable
                  onPress={() => onSelect(item)}
                  style={styles.modalItem}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {active ? (
                    <Ionicons name="checkmark" size={20} color="#16A34A" />
                  ) : null}
                </Pressable>
              );
            }}
          />

          <Pressable onPress={onClose} style={styles.modalCloseBtn}>
            <Text style={styles.modalCloseText}>Đóng</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
