import React, { useMemo, useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { styles } from "./styles";
import { COLORS } from "../../constants/colors";
const GENDERS = ["Nam", "Nữ", "Khác"];
const PROVINCES = ["Bắc Giang", "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng"]; // bạn thay bằng list thật sau

export default function AccountScreen({ navigation }) {
  const { session, logout } = useAuth();
  const user = session?.user;

  const avatarUrl = user?.avatarUrl ?? null;

  // Các field bạn có thể map từ API user của bạn sau.
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email] = useState(user?.email ?? "");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [province, setProvince] = useState("");
  const [bio, setBio] = useState("");

  const verifiedText = useMemo(() => {
    if (!user) return "Chưa đăng nhập";
    return user?.verified ? "Đã xác thực" : "Chờ xác thực";
  }, [user]);

  const onUpdate = async () => {
    // TODO: call API update profile
    Alert.alert("Thông báo", "Bạn cần API cập nhật profile để lưu thông tin.");
  };

  const onChangePassword = () => {
    Alert.alert(
      "Thông báo",
      "Bạn tạo screen đổi mật khẩu sau (hoặc route tới screen đó).",
    );
  };

  const onPrivacy = () => {
    Alert.alert("Chính sách", "Bạn có thể mở link policy ở đây.");
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

  const requireLogin = () => {
    if (!user) {
      Alert.alert(
        "Bạn chưa đăng nhập",
        "Vui lòng đăng nhập để xem thông tin tài khoản.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }],
      );
      return true;
    }
    return false;
  };

  // Nếu chưa login thì vẫn render nhưng hạn chế tương tác
  const disabled = !user;

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
        <Text style={styles.headerTitle}>Thông tin tài khoản</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar */}
        <View style={styles.avatarWrap}>
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

          <Label text="Ngày sinh" style={{ marginTop: 12 }} />
          <View style={styles.rowInput}>
            <TextInput
              value={dob}
              onChangeText={setDob}
              style={[styles.input, { flex: 1 }]}
              editable={!disabled}
              placeholder="dd/mm/yyyy"
            />
            <View style={styles.iconBox}>
              <Ionicons name="calendar-outline" size={18} color="#6B7280" />
            </View>
          </View>

          <Label text="Giới tính" style={{ marginTop: 12 }} />
          <Pressable
            onPress={() => {
              if (requireLogin()) return;
              // demo: xoay vòng lựa chọn
              const idx = GENDERS.indexOf(gender);
              setGender(GENDERS[(idx + 1) % GENDERS.length]);
            }}
            style={[styles.select, disabled && styles.selectDisabled]}
          >
            <Text style={styles.selectText}>{gender}</Text>
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          </Pressable>

          <Label text="Tỉnh/Thành" style={{ marginTop: 12 }} />
          <Pressable
            onPress={() => {
              if (requireLogin()) return;
              const idx = PROVINCES.indexOf(province);
              setProvince(PROVINCES[(idx + 1) % PROVINCES.length]);
            }}
            style={[styles.select, disabled && styles.selectDisabled]}
          >
            <Text style={styles.selectText}>{province}</Text>
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          </Pressable>

          <Label text="Giới thiệu" style={{ marginTop: 12 }} />
          {/* Đơn giản hoá phần rich text: TextInput multiline (ổn cho Expo). 
              Nếu bạn muốn toolbar như ảnh, mình sẽ hướng dẫn thêm lib rich editor sau. */}
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
            onPress={() => {
              if (requireLogin()) return;
              onUpdate();
            }}
            style={[
              styles.btn,
              styles.btnPrimary,
              disabled && styles.btnDisabled,
            ]}
          >
            <Text style={styles.btnPrimaryText}>
              Cập nhật thay đổi thông tin
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (requireLogin()) return;
              onChangePassword();
            }}
            style={[
              styles.btn,
              styles.btnOutline,
              disabled && styles.btnDisabled,
            ]}
          >
            <Text style={styles.btnOutlineText}>Đổi mật khẩu</Text>
          </Pressable>

          <Pressable onPress={onPrivacy} style={[styles.btn, styles.btnGreen]}>
            <Text style={styles.btnGreenText}>Chính sách quyền riêng tư</Text>
          </Pressable>

          <Pressable onPress={onLogout} style={[styles.btn, styles.btnDanger]}>
            <Text style={styles.btnDangerText}>Đăng Xuất</Text>
          </Pressable>

          <Pressable disabled style={[styles.btn, styles.btnGray]}>
            <Ionicons name="trash-outline" size={16} color="#9CA3AF" />
            <Text style={styles.btnGrayText}> Xoá tài khoản</Text>
          </Pressable>
        </View>
      </ScrollView>
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
