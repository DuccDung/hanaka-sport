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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./loginStyles";
import { login } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";
import { getMe } from "../../services/userService";
import { COLORS } from "../../constants/colors";
function isEmailLike(v = "") {
  const s = v.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export default function LoginScreen({ navigation }) {
  const { setAuthSession } = useAuth();

  const [email, setEmail] = useState("Dung@gmail.com");
  const [password, setPassword] = useState("123456");
  const [remember, setRemember] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return isEmailLike(email) && password.trim().length >= 6;
  }, [email, password]);

  const onSubmit = async () => {
    if (!canSubmit || loading) return;

    try {
      setLoading(true);

      const data = await login({
        identifier: email.trim(),
        password,
      });

      // Lấy thông tin user đầy đủ sau khi có accessToken
      let me = data.user;
      try {
        me = await getMe();
      } catch (e) {
        console.log(
          "getMe after login failed:",
          e?.response?.data || e?.message,
        );
      }

      await setAuthSession({
        accessToken: data.accessToken,
        expiresAtUtc: data.expiresAtUtc,
        user: me,
      });

      Keyboard.dismiss();

      Alert.alert("Thành công", "Đăng nhập thành công 🎉");

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (err) {
      console.log("Login error:", err?.response?.data || err.message);

      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Đăng nhập thất bại";

      Alert.alert("Lỗi", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.centerWrap}>
          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="vd: admin@hanaka.com"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Text style={[styles.label, { marginTop: 12 }]}>Mật khẩu</Text>
            <View style={styles.inputWrap}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="******"
                style={[styles.input, { paddingRight: 44 }]}
                secureTextEntry={!showPass}
                onSubmitEditing={onSubmit}
              />

              <Pressable
                onPress={() => setShowPass((s) => !s)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPass ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6B7280"
                />
              </Pressable>
            </View>

            <Pressable
              onPress={onSubmit}
              disabled={!canSubmit || loading}
              style={[styles.submitBtn, canSubmit && styles.submitBtnActive]}
            >
              <Text style={styles.submitText}>
                {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Register")}
              style={{ marginTop: 16, alignItems: "center" }}
            >
              <Text style={{ fontSize: 14, color: COLORS.PRIMARY_DARK }}>
                Chưa có tài khoản? Đăng ký
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
