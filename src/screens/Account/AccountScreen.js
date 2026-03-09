import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useAuth } from "../../context/AuthContext";
import { styles } from "./styles";
import { COLORS } from "../../constants/colors";

import { getMe, updateMe } from "../../services/userService";
import * as ImagePicker from "expo-image-picker";
import { uploadAvatar } from "../../services/userService";

const GENDERS = ["Nam", "Nữ", "Khác"];
const PROVINCES = ["Bắc Giang", "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng"]; // thay list thật sau

function formatDateDDMMYYYY(date) {
  if (!date) return "";
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function toIsoDateOnly(date) {
  // "YYYY-MM-DD"
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AccountScreen({ navigation }) {
  const { session, logout, setAuthSession } = useAuth();
  const userInSession = session?.user;
  const disabled = !session?.accessToken; // chỉ cần token là được (đỡ phụ thuộc session.user)

  const [loading, setLoading] = useState(false);

  // profile state
  const [avatarUrl, setAvatarUrl] = useState(userInSession?.avatarUrl ?? null);
  const [fullName, setFullName] = useState(userInSession?.fullName ?? "");
  const [phone, setPhone] = useState(userInSession?.phone ?? "");
  const [email, setEmail] = useState(userInSession?.email ?? "");
  const [gender, setGender] = useState(userInSession?.gender ?? "");
  const [province, setProvince] = useState(userInSession?.city ?? "");
  const [bio, setBio] = useState(userInSession?.bio ?? "");
  const [avatarUploading, setAvatarUploading] = useState(false);
  // date
  const [dobDate, setDobDate] = useState(
    userInSession?.birthOfDate ? new Date(userInSession.birthOfDate) : null,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // modals
  const [genderModal, setGenderModal] = useState(false);
  const [provinceModal, setProvinceModal] = useState(false);

  const verifiedText = useMemo(() => {
    if (!session?.accessToken) return "Chưa đăng nhập";
    return userInSession?.verified ? "Đã xác thực" : "Chờ xác thực";
  }, [session?.accessToken, userInSession?.verified]);

  const onPickAvatar = async () => {
    if (!session?.accessToken) {
      Alert.alert("Bạn chưa đăng nhập", "Vui lòng đăng nhập để cập nhật ảnh.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
      return;
    }

    try {
      // xin quyền
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Thiếu quyền", "Bạn cần cho phép truy cập thư viện ảnh.");
        return;
      }

      // mở picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // crop hình vuông cho avatar
        quality: 0.85,
      });

      if (result.canceled) return;

      const fileUri = result.assets?.[0]?.uri;
      if (!fileUri) return;

      setAvatarUploading(true);

      // upload
      const { avatarUrl: newAvatarUrl } = await uploadAvatar(fileUri);

      if (!newAvatarUrl) {
        throw new Error("Upload thành công nhưng không nhận được avatarUrl");
      }

      // update UI
      setAvatarUrl(newAvatarUrl);

      // update session.user để chỗ khác sync avatar
      const nextUser = { ...(session.user || {}), avatarUrl: newAvatarUrl };

      await setAuthSession({
        accessToken: session.accessToken,
        expiresAtUtc: session.expiresAtUtc,
        user: nextUser,
      });

      Alert.alert("Thành công", "Đã cập nhật ảnh đại diện.");
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "Upload ảnh thất bại.";
      Alert.alert("Lỗi", String(msg));
    } finally {
      setAvatarUploading(false);
    }
  };

  const requireLogin = () => {
    if (!session?.accessToken) {
      Alert.alert(
        "Bạn chưa đăng nhập",
        "Vui lòng đăng nhập để xem thông tin tài khoản.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }],
      );
      return true;
    }
    return false;
  };

  useEffect(() => {
    (async () => {
      if (!session?.accessToken) return;

      try {
        setLoading(true);
        const me = await getMe();

        // update UI state
        setAvatarUrl(me?.avatarUrl ?? null);
        setFullName(me?.fullName ?? "");
        setPhone(me?.phone ?? "");
        setEmail(me?.email ?? "");
        setGender(me?.gender ?? "");
        setProvince(me?.city ?? "");
        setBio(me?.bio ?? "");
        setDobDate(me?.birthOfDate ? new Date(me.birthOfDate) : null);

        // update session.user để header/avatar chỗ khác sync theo
        await setAuthSession({
          accessToken: session.accessToken,
          expiresAtUtc: session.expiresAtUtc,
          user: me,
        });
      } catch (e) {
        Alert.alert("Lỗi", "Không lấy được thông tin tài khoản (getMe).");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken]);

  //  Update profile (PUT /users/me)
  const onUpdate = async () => {
    if (requireLogin()) return;

    try {
      setLoading(true);

      const payload = {
        fullName: fullName?.trim(),
        phone: phone?.trim(),
        gender: gender || null,
        city: province || null,
        bio: bio || null,
        birthOfDate: dobDate ? toIsoDateOnly(dobDate) : null, // server nhận DateTime? ok
        avatarUrl: avatarUrl || null,
      };

      const updated = await updateMe(payload);

      // sync UI + session
      setAvatarUrl(updated?.avatarUrl ?? null);

      await setAuthSession({
        accessToken: session.accessToken,
        expiresAtUtc: session.expiresAtUtc,
        user: updated,
      });

      Alert.alert("Thành công", "Cập nhật thông tin thành công.");
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.response?.data || "Cập nhật thất bại.";
      Alert.alert("Lỗi", String(msg));
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn chắc chắn muốn đăng xuất?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: "Home" }] });
        },
      },
    ]);
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>
          Thông tin tài khoản{loading ? "..." : ""}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <Pressable
            onPress={onPickAvatar}
            disabled={disabled || avatarUploading}
            style={styles.avatarWrap}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons
                  name="person-circle-outline"
                  size={86}
                  color={COLORS.BLUE}
                />
              </View>
            )}
          </Pressable>
        </View>

        {/* Status */}
        <Text style={styles.statusText}>
          Thành Viên: <Text style={styles.statusBold}>{verifiedText}</Text>
        </Text>

        {/* Form */}
        <View style={styles.card}>
          <Label text="Họ tên" required />
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            editable={!disabled}
            placeholder="Nhập họ tên"
          />

          <Label text="Số điện thoại" required style={{ marginTop: 12 }} />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            editable={!disabled}
            keyboardType="phone-pad"
            placeholder="vd: 096..."
          />

          <Label text="Email" style={{ marginTop: 12 }} />
          <TextInput
            value={email}
            style={[styles.input, styles.inputDisabled]}
            editable={false}
          />

          {/* Date of birth - bấm mở lịch */}
          <Label text="Ngày sinh" style={{ marginTop: 12 }} />
          <Pressable
            onPress={() => {
              if (requireLogin()) return;
              setShowDatePicker(true);
            }}
            style={[styles.rowInput, disabled && styles.selectDisabled]}
          >
            <TextInput
              value={dobDate ? formatDateDDMMYYYY(dobDate) : ""}
              style={[styles.input, { flex: 1 }]}
              editable={false}
              placeholder="Chọn ngày sinh"
            />
            <View style={styles.iconBox}>
              <Ionicons name="calendar-outline" size={18} color="#6B7280" />
            </View>
          </Pressable>

          {showDatePicker ? (
            <DateTimePicker
              value={dobDate ?? new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              onChange={(event, selected) => {
                // Android: dismiss khi chọn/huỷ
                if (Platform.OS !== "ios") setShowDatePicker(false);

                if (event.type === "set" && selected) {
                  setDobDate(selected);
                }
                if (event.type === "dismissed") {
                  setShowDatePicker(false);
                }
              }}
            />
          ) : null}

          {/* Gender */}
          <Label text="Giới tính" style={{ marginTop: 12 }} />
          <Pressable
            onPress={() => {
              if (requireLogin()) return;
              setGenderModal(true);
            }}
            style={[styles.select, disabled && styles.selectDisabled]}
          >
            <Text style={styles.selectText}>{gender || "Chọn giới tính"}</Text>
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          </Pressable>

          {/* Province */}
          <Label text="Tỉnh/Thành" style={{ marginTop: 12 }} />
          <Pressable
            onPress={() => {
              if (requireLogin()) return;
              setProvinceModal(true);
            }}
            style={[styles.select, disabled && styles.selectDisabled]}
          >
            <Text style={styles.selectText}>
              {province || "Chọn tỉnh/thành"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          </Pressable>

          {/* Bio */}
          <Label text="Giới thiệu" style={{ marginTop: 12 }} />
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={styles.textarea}
            editable={!disabled}
            multiline
            placeholder="Viết vài dòng giới thiệu..."
          />

          {/* Buttons */}
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
              {loading ? "Đang lưu..." : "Cập nhật thay đổi thông tin"}
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
              Alert.alert("Chính sách", "Bạn có thể mở link policy ở đây.")
            }
            style={[styles.btn, styles.btnGreen]}
          >
            <Text style={styles.btnGreenText}>Chính sách quyền riêng tư</Text>
          </Pressable>

          <Pressable onPress={onLogout} style={[styles.btn, styles.btnDanger]}>
            <Text style={styles.btnDangerText}>Đăng Xuất</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Gender Modal */}
      <SelectModal
        visible={genderModal}
        title="Chọn giới tính"
        options={GENDERS}
        selected={gender}
        onClose={() => setGenderModal(false)}
        onSelect={(v) => {
          setGender(v);
          setGenderModal(false);
        }}
      />

      {/* Province Modal */}
      <SelectModal
        visible={provinceModal}
        title="Chọn tỉnh/thành"
        options={PROVINCES}
        selected={province}
        onClose={() => setProvinceModal(false)}
        onSelect={(v) => {
          setProvince(v);
          setProvinceModal(false);
        }}
      />
    </View>
  );
}

function Label({ text, required, style }) {
  return (
    <Text style={[styles.label, style]}>
      {text} {required ? <Text style={{ color: "#EF4444" }}>*</Text> : null}
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
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          padding: 16,
          justifyContent: "center",
        }}
      >
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              padding: 14,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}>
              {title}
            </Text>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const active = item === selected;
              return (
                <Pressable
                  onPress={() => onSelect(item)}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "#f2f2f2",
                  }}
                >
                  <Text style={{ fontSize: 15, color: "#111827" }}>{item}</Text>
                  {active ? (
                    <Ionicons name="checkmark" size={20} color="#16A34A" />
                  ) : null}
                </Pressable>
              );
            }}
          />

          <Pressable
            onPress={onClose}
            style={{
              paddingVertical: 12,
              alignItems: "center",
              backgroundColor: "#F3F4F6",
            }}
          >
            <Text style={{ fontWeight: "700", color: "#111827" }}>Đóng</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
