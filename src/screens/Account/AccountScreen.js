import React, { useEffect, useMemo, useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

import { useAuth } from "../../context/AuthContext";
import { styles } from "./styles";
import { COLORS } from "../../constants/colors";
import {
  getMe,
  updateMe,
  uploadAvatar,
  deleteMe,
} from "../../services/userService";

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

export default function AccountScreen({ navigation }) {
  const { session, logout, setAuthSession } = useAuth();

  const accessToken = session?.accessToken || null;
  const userInSession = session?.user || null;
  const isLoggedIn = !!accessToken;
  const disabled = !isLoggedIn;

  const [loading, setLoading] = useState(false);
  const [refreshingProfile, setRefreshingProfile] = useState(false);
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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [genderModal, setGenderModal] = useState(false);
  const [provinceModal, setProvinceModal] = useState(false);

  const verifiedText = useMemo(() => {
    if (!isLoggedIn) return "Chưa đăng nhập";
    return userInSession?.verified ? "Đã xác thực" : "Chờ xác thực";
  }, [isLoggedIn, userInSession?.verified]);

  const requireLogin = () => {
    if (isLoggedIn) return false;

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
  };

  const syncUserToState = (user) => {
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
  };

  const refreshProfile = async () => {
    if (!accessToken) return;

    try {
      setRefreshingProfile(true);
      const me = await getMe();

      syncUserToState(me);

      await setAuthSession({
        accessToken: session.accessToken,
        expiresAtUtc: session.expiresAtUtc,
        user: me,
      });
    } catch (error) {
      Alert.alert("Lỗi", "Không lấy được thông tin tài khoản.");
    } finally {
      setRefreshingProfile(false);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    refreshProfile();
  }, [accessToken]);

  const onPickAvatar = async () => {
    if (requireLogin()) return;

    try {
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
        accessToken: session.accessToken,
        expiresAtUtc: session.expiresAtUtc,
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

    try {
      setLoading(true);

      const payload = {
        fullName: fullName?.trim() || "",
        phone: phone?.trim() || "",
        gender: gender || null,
        city: province || null,
        bio: bio?.trim() || null,
        birthOfDate: dobDate ? toIsoDateOnly(dobDate) : null,
        avatarUrl: avatarUrl || null,
      };

      const updated = await updateMe(payload);

      syncUserToState(updated);

      await setAuthSession({
        accessToken: session.accessToken,
        expiresAtUtc: session.expiresAtUtc,
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
              setDeletingAccount(true);

              await deleteMe();

              Alert.alert("Thành công", "Tài khoản của bạn đã được xóa.", [
                {
                  text: "OK",
                  onPress: async () => {
                    try {
                      await logout();
                    } finally {
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
                    }
                  },
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

  const onLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn chắc chắn muốn đăng xuất?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } finally {
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
          }
        },
      },
    ]);
  };

  const onChangeDate = (event, selectedDate) => {
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

        <Text style={styles.headerTitle}>
          Thông tin tài khoản
          {refreshingProfile ? "..." : ""}
        </Text>

        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <Pressable
            onPress={onPickAvatar}
            disabled={disabled || avatarUploading}
            style={({ pressed }) => [
              styles.avatarPressable,
              pressed && !disabled ? styles.pressed : null,
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
              ) : (
                <Ionicons name="camera" size={16} color="#fff" />
              )}
            </View>
          </Pressable>

          <Text style={styles.avatarHint}>
            {disabled
              ? "Đăng nhập để cập nhật ảnh"
              : "Chạm để đổi ảnh đại diện"}
          </Text>
        </View>

        <Text style={styles.statusText}>
          Thành viên: <Text style={styles.statusBold}>{verifiedText}</Text>
        </Text>

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
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            editable={!disabled}
            placeholder="Nhập họ tên"
            placeholderTextColor="#9CA3AF"
          />

          <Label text="Số điện thoại" required style={styles.labelSpacing} />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            editable={!disabled}
            keyboardType="phone-pad"
            placeholder="Ví dụ: 096..."
            placeholderTextColor="#9CA3AF"
          />

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
              if (requireLogin()) return;
              setShowDatePicker(true);
            }}
            style={[styles.select, disabled && styles.selectDisabled]}
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
              if (requireLogin()) return;
              setGenderModal(true);
            }}
            style={[styles.select, disabled && styles.selectDisabled]}
          >
            <Text style={gender ? styles.selectText : styles.placeholderText}>
              {gender || "Chọn giới tính"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          </Pressable>

          <Label text="Tỉnh/Thành" style={styles.labelSpacing} />
          <Pressable
            onPress={() => {
              if (requireLogin()) return;
              setProvinceModal(true);
            }}
            style={[styles.select, disabled && styles.selectDisabled]}
          >
            <Text style={province ? styles.selectText : styles.placeholderText}>
              {province || "Chọn tỉnh/thành"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          </Pressable>

          <Label text="Giới thiệu" style={styles.labelSpacing} />
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={styles.textarea}
            editable={!disabled}
            multiline
            placeholder="Viết vài dòng giới thiệu..."
            placeholderTextColor="#9CA3AF"
          />

          <Pressable
            onPress={onUpdate}
            style={[
              styles.btn,
              styles.btnPrimary,
              (disabled || loading) && styles.btnDisabled,
            ]}
            disabled={disabled || loading}
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
              disabled && styles.btnDisabled,
            ]}
            disabled={disabled}
          >
            <Text style={styles.btnOutlineText}>Đổi mật khẩu</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate("PolicyWebView", {
                title: "Chính sách quyền riêng tư",
                url: "https://hanakasport.click/policy/index",
              })
            }
            style={[styles.btn, styles.btnGreen]}
          >
            <Text style={styles.btnGreenText}>Chính sách quyền riêng tư</Text>
          </Pressable>

          <Pressable
            onPress={onDeleteAccount}
            style={[
              styles.btn,
              styles.btnDanger,
              (disabled || deletingAccount) && styles.btnDisabled,
            ]}
            disabled={disabled || deletingAccount}
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

      <SelectModal
        visible={genderModal}
        title="Chọn giới tính"
        options={GENDERS}
        selected={gender}
        onClose={() => setGenderModal(false)}
        onSelect={(value) => {
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
