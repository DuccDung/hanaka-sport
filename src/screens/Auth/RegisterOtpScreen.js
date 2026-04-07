import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./registerStyles";
import { confirmOtp, resendOtp } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";

export default function RegisterOtpScreen({ navigation, route }) {
  const email = route?.params?.email || "";
  const fullName = route?.params?.fullName || "";
  const { setAuthSession } = useAuth();

  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorText, setErrorText] = useState("");

  const canSubmit = useMemo(() => {
    return otp.trim().length === 6 && !submitting;
  }, [otp, submitting]);

  const onChangeOtp = (value) => {
    const onlyNumber = value.replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(onlyNumber);
  };

  const onConfirm = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    setErrorText("");

    try {
      const data = await confirmOtp({
        email: email.trim(),
        otp: otp.trim(),
      });

      await setAuthSession({
        accessToken: data.accessToken,
        expiresAtUtc: data.expiresAtUtc,
        user: data.user,
      });

      Alert.alert("Thành công", "Xác thực OTP thành công.");

      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "Xác thực OTP thất bại";

      setErrorText(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (!email || resending) return;

    setResending(true);
    setErrorText("");

    try {
      const data = await resendOtp({
        email: email.trim(),
      });

      Alert.alert("Thông báo", data?.message || "OTP mới đã được gửi.");
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "Gửi lại OTP thất bại";

      setErrorText(msg);
    } finally {
      setResending(false);
    }
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
            disabled={submitting || resending}
          >
            <Ionicons name="arrow-back" size={20} color="#1E2430" />
          </Pressable>
          <Text style={styles.headerTitle}>Xác thực OTP</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.centerWrap}>
          <View style={styles.card}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#1E2430" }}>
              Xin chào {fullName || "bạn"}
            </Text>

            <Text
              style={{
                marginTop: 8,
                fontSize: 14,
                color: "#6B7280",
                lineHeight: 22,
              }}
            >
              Hệ thống đã gửi mã OTP đến email:
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontSize: 14,
                fontWeight: "700",
                color: "#2563EB",
              }}
            >
              {email}
            </Text>

            <Text style={[styles.label, { marginTop: 20 }]}>Nhập mã OTP</Text>

            <View style={styles.inputWrap}>
              <TextInput
                value={otp}
                onChangeText={onChangeOtp}
                placeholder="Nhập 6 số"
                placeholderTextColor="#9CA3AF"
                style={[
                  styles.input,
                  {
                    textAlign: "center",
                    fontSize: 20,
                    letterSpacing: 6,
                  },
                ]}
                keyboardType="number-pad"
                maxLength={6}
                editable={!submitting}
                returnKeyType="done"
                onSubmitEditing={onConfirm}
              />
            </View>

            <Text style={styles.hint}>OTP có hiệu lực trong vài phút.</Text>

            {errorText ? (
              <Text style={{ marginTop: 8, color: "#DC2626" }}>
                {errorText}
              </Text>
            ) : null}

            <Pressable
              onPress={onConfirm}
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
                  Xác nhận OTP
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={onResend}
              disabled={resending || submitting}
              style={{
                marginTop: 12,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 10,
              }}
            >
              {resending ? (
                <ActivityIndicator />
              ) : (
                <Text style={{ color: "#2563EB", fontWeight: "700" }}>
                  Gửi lại OTP
                </Text>
              )}
            </Pressable>

            <View style={{ marginTop: 16, alignItems: "center" }}>
              <Pressable
                onPress={() => navigation.navigate("Login")}
                disabled={submitting || resending}
              >
                <Text style={{ color: "#6B7280" }}>Quay lại đăng nhập</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
