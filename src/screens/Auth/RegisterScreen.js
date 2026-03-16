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

function isEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
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

    try {
      const data = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      Alert.alert("Thành công", data?.message || "OTP đã được gửi tới email.");

      navigation.navigate("RegisterOtp", {
        email: email.trim(),
        fullName: fullName.trim(),
      });
    } catch (e) {
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

            <Text style={styles.hint}>Mật khẩu tối thiểu 6 ký tự.</Text>

            {errorText ? (
              <Text style={{ marginTop: 8, color: "#DC2626" }}>
                {errorText}
              </Text>
            ) : null}

            <Pressable
              onPress={onSubmit}
              disabled={!canSubmit}
              style={[styles.submitBtn, canSubmit && styles.submitBtnActive]}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
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
