import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { changePassword } from "../../services/userService";

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const minLenOk = useMemo(() => newPassword.trim().length >= 8, [newPassword]);

  const canSubmit = useMemo(() => {
    return (
      currentPassword.trim().length > 0 &&
      minLenOk &&
      confirmPassword.trim().length > 0 &&
      newPassword === confirmPassword
    );
  }, [currentPassword, newPassword, confirmPassword, minLenOk]);

  const onSubmit = async () => {
    if (!canSubmit) return;

    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      Alert.alert("Thành công", res?.message || "Đổi mật khẩu thành công.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "Đổi mật khẩu thất bại.";
      Alert.alert("Lỗi", String(msg));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
        }}
      >
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </Pressable>
        <Text
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "700",
            color: "#111827",
          }}
        >
          Đổi mật khẩu
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={{ padding: 16 }}>
          {/* Mật khẩu hiện tại */}
          <Label text="Mật khẩu hiện tại" required />
          <InputPassword
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Nhập mật khẩu hiện tại"
            show={showCurrent}
            setShow={setShowCurrent}
          />

          {/* Mật khẩu mới */}
          <Label text="Mật khẩu mới" required style={{ marginTop: 14 }} />
          <InputPassword
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nhập mật khẩu mới"
            show={showNew}
            setShow={setShowNew}
          />

          {/* Rule */}
          <View style={{ marginTop: 10 }}>
            <Text style={{ color: "#6B7280", marginBottom: 6 }}>
              Mật khẩu cần thoả mãn:
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name={minLenOk ? "checkmark-circle" : "ellipse-outline"}
                size={18}
                color={minLenOk ? "#22C55E" : "#9CA3AF"}
              />
              <Text style={{ marginLeft: 8, color: "#374151" }}>
                Tối thiểu 8 kí tự
              </Text>
            </View>
          </View>

          {/* Xác nhận mật khẩu */}
          <Label text="Xác nhận mật khẩu" required style={{ marginTop: 14 }} />
          <InputPassword
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Nhập xác nhận mật khẩu"
            show={showConfirm}
            setShow={setShowConfirm}
          />

          {/* Button */}
          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit}
            style={{
              marginTop: 18,
              height: 48,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: canSubmit ? "#111827" : "#E5E7EB",
              borderWidth: 1,
              borderColor: "#D1D5DB",
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                color: canSubmit ? "#fff" : "#9CA3AF",
              }}
            >
              Thay đổi
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Label({ text, required, style }) {
  return (
    <Text
      style={[
        { fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 6 },
        style,
      ]}
    >
      {text} {required ? <Text style={{ color: "#EF4444" }}>*</Text> : null}
    </Text>
  );
}

function InputPassword({ value, onChangeText, placeholder, show, setShow }) {
  return (
    <View
      style={{
        height: 48,
        borderRadius: 10,
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={!show}
        style={{ flex: 1, color: "#111827" }}
      />
      <Pressable onPress={() => setShow((s) => !s)} hitSlop={10}>
        <Ionicons
          name={show ? "eye-off-outline" : "eye-outline"}
          size={20}
          color="#6B7280"
        />
      </Pressable>
    </View>
  );
}
