import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./registerStyles";
import { register } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";
function isEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("Nguyễn Văn A");
  const [email, setEmail] = useState("a@test.com");
  const [password, setPassword] = useState("123456");
  const [showPass, setShowPass] = useState(false);
  const { setAuthSession } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length >= 2 &&
      isEmail(email) &&
      password.trim().length >= 6 &&
      !submitting
    );
  }, [fullName, email, password, submitting]);

  const onSubmit = async () => {
    if (!canSubmit) return;

    Keyboard.dismiss();
    setSubmitting(true);
    setErrorText("");

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      password: password, // giữ nguyên (không trim) để tránh mất space nếu user cố tình đặt
    };

    try {
      // ✅ gọi API + lưu token/user trong service
      const data = await register(payload);
      await setAuthSession(data); // data gồm accessToken, expiresAtUtc, user
      // data = { accessToken, expiresAtUtc, user }
      Alert.alert("Thành công", `Chào ${data?.user?.fullName || "bạn"}!`);

      // Tuỳ flow app bạn:
      // 1) Quay về login:
      // navigation.goBack();

      // 2) Hoặc chuyển thẳng vào Home:
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (e) {
      // Map lỗi phổ biến từ axios / asp.net
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "Đăng ký thất bại";

      setErrorText(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.headerWrap}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={10}
            disabled={submitting}
          >
            <Ionicons name="arrow-back" size={20} color="#1E2430" />
          </Pressable>
          <Text style={styles.headerTitle}>Đăng ký</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.centerWrap}>
          <View style={styles.card}>
            {/* Full name */}
            <Text style={styles.label}>Họ và tên</Text>
            <View style={styles.inputWrap}>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nguyễn Văn A"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                returnKeyType="next"
                editable={!submitting}
              />
            </View>

            {/* Email */}
            <Text style={[styles.label, { marginTop: 12 }]}>Email</Text>
            <View style={styles.inputWrap}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="a@test.com"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                editable={!submitting}
              />
            </View>

            {/* Password */}
            <Text style={[styles.label, { marginTop: 12 }]}>Mật khẩu</Text>
            <View style={styles.inputWrap}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="******"
                placeholderTextColor="#9CA3AF"
                style={[styles.input, { paddingRight: 44 }]}
                secureTextEntry={!showPass}
                returnKeyType="done"
                onSubmitEditing={onSubmit}
                editable={!submitting}
              />

              <Pressable
                onPress={() => setShowPass((s) => !s)}
                style={styles.eyeBtn}
                hitSlop={10}
                disabled={submitting}
              >
                <Ionicons
                  name={showPass ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6B7280"
                />
              </Pressable>
            </View>

            {/* Hint */}
            <Text style={styles.hint}>Mật khẩu tối thiểu 6 ký tự.</Text>

            {/* Error */}
            {errorText ? (
              <Text style={{ marginTop: 8, color: "#DC2626" }}>
                {errorText}
              </Text>
            ) : null}

            {/* Submit */}
            <Pressable
              onPress={onSubmit}
              disabled={!canSubmit}
              style={[styles.submitBtn, canSubmit && styles.submitBtnActive]}
            >
              {submitting ? (
                <ActivityIndicator />
              ) : (
                <Text
                  style={[
                    styles.submitText,
                    canSubmit && styles.submitTextActive,
                  ]}
                >
                  Đăng ký
                </Text>
              )}
            </Pressable>

            {/* Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Đã có tài khoản?</Text>
              <Pressable
                onPress={() => navigation.navigate("Login")}
                hitSlop={10}
                disabled={submitting}
              >
                <Text style={styles.footerLink}> Đăng nhập</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
