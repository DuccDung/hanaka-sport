import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import {
  forgotPassword,
  resetPasswordWithOtp,
  verifyForgotPasswordOtp,
} from "../../services/authApi";
import { styles } from "./loginStyles";

function isPhoneLike(value = "") {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

function isEmailLike(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function normalizeIdentifier(value = "") {
  const raw = value.trim();
  if (!raw) return "";
  if (isEmailLike(raw)) return raw.toLowerCase();
  return raw.replace(/[^\d+]/g, "");
}

function isIdentifierLike(value = "") {
  return isEmailLike(value) || isPhoneLike(value);
}

function buildIdentifierPayload(value = "") {
  const raw = value.trim();
  const identifier = normalizeIdentifier(raw);
  if (isEmailLike(raw)) {
    return { identifier, email: identifier };
  }
  return { identifier, phone: identifier };
}

function getApiMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.title ||
    (typeof error?.response?.data === "string" ? error.response.data : "") ||
    error?.message ||
    fallback
  );
}

export default function ForgotPasswordScreen({ navigation, route }) {
  const { setAuthSession } = useAuth();
  const [step, setStep] = useState("identifier");
  const [identifier, setIdentifier] = useState(
    route?.params?.identifier || route?.params?.phone || route?.params?.email || "",
  );
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [infoText, setInfoText] = useState("");

  const canSubmit = useMemo(() => {
    if (loading) return false;
    if (step === "identifier") return isIdentifierLike(identifier);
    if (step === "otp") return isIdentifierLike(identifier) && otp.trim().length === 6;
    return (
      isIdentifierLike(identifier) &&
      otp.trim().length === 6 &&
      newPassword.trim().length >= 6 &&
      newPassword === confirmPassword
    );
  }, [confirmPassword, identifier, loading, newPassword, otp, step]);

  const setOtpValue = (value) => {
    setOtp(value.replace(/[^0-9]/g, "").slice(0, 6));
  };

  const sendOtp = async ({ showAlert = true } = {}) => {
    if (!isIdentifierLike(identifier) || loading) return;

    try {
      Keyboard.dismiss();
      setLoading(true);
      setErrorText("");
      setInfoText("");

      const identifierPayload = buildIdentifierPayload(identifier);
      const data = await forgotPassword(identifierPayload);
      const message =
        data?.otpDeliveryMessage ||
        data?.message ||
        "Nếu thông tin tồn tại, mã OTP đã được gửi về Zalo hoặc email dự phòng.";

      setInfoText(message);
      setStep("otp");

      if (showAlert) {
        Alert.alert("Kiểm tra OTP", message);
      }
    } catch (error) {
      setErrorText(getApiMessage(error, "Không thể gửi mã OTP."));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!canSubmit || loading) return;

    try {
      Keyboard.dismiss();
      setLoading(true);
      setErrorText("");
      setInfoText("");

      const data = await verifyForgotPasswordOtp({
        ...buildIdentifierPayload(identifier),
        otp: otp.trim(),
      });

      setInfoText(data?.message || "OTP hợp lệ. Vui lòng nhập mật khẩu mới.");
      setStep("reset");
    } catch (error) {
      setErrorText(getApiMessage(error, "OTP không đúng hoặc đã hết hạn."));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (loading) return;

    if (newPassword.trim().length < 6) {
      setErrorText("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorText("Mật khẩu nhập lại không khớp.");
      return;
    }

    try {
      Keyboard.dismiss();
      setLoading(true);
      setErrorText("");
      setInfoText("");

      const data = await resetPasswordWithOtp({
        ...buildIdentifierPayload(identifier),
        otp: otp.trim(),
        newPassword,
        confirmPassword,
      });

      await setAuthSession({
        accessToken: data.accessToken,
        expiresAtUtc: data.expiresAtUtc,
        user: data.user || { identifier: normalizeIdentifier(identifier) },
        replace: true,
      });

      Alert.alert("Thành công", "Đổi mật khẩu thành công.");

      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (error) {
      setErrorText(getApiMessage(error, "Đổi mật khẩu thất bại."));
    } finally {
      setLoading(false);
    }
  };

  const primaryLabel =
    step === "identifier"
      ? "Gửi mã OTP"
      : step === "otp"
        ? "Xác nhận OTP"
        : "Đổi mật khẩu";

  const submitAction =
    step === "identifier" ? sendOtp : step === "otp" ? verifyOtp : resetPassword;

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
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={20} color="#1E2430" />
          </Pressable>
          <Text style={styles.headerTitle}>Quên mật khẩu</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.centerWrap}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Khôi phục mật khẩu</Text>
            <Text style={styles.sectionDesc}>
              Nhập số điện thoại hoặc email đã đăng ký để nhận OTP. Nếu tài khoản có số điện thoại,
              hệ thống sẽ ưu tiên gửi qua Zalo.
            </Text>

            <Text style={styles.label}>Số điện thoại hoặc email</Text>
            <View style={styles.inputWrap}>
              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                onBlur={() => setIdentifier((value) => normalizeIdentifier(value))}
                placeholder="0961848526 hoặc a@test.com"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading && step === "identifier"}
                returnKeyType="next"
                onSubmitEditing={() => sendOtp()}
              />
            </View>

            {step !== "identifier" ? (
              <>
                <Text style={[styles.label, { marginTop: 12 }]}>Mã OTP</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    value={otp}
                    onChangeText={setOtpValue}
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
                    editable={!loading && step === "otp"}
                    returnKeyType="done"
                    onSubmitEditing={verifyOtp}
                  />
                </View>
              </>
            ) : null}

            {step === "reset" ? (
              <>
                <Text style={[styles.label, { marginTop: 12 }]}>
                  Mật khẩu mới
                </Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Tối thiểu 6 ký tự"
                    placeholderTextColor="#9CA3AF"
                    style={[styles.input, { paddingRight: 44 }]}
                    secureTextEntry={!showNewPassword}
                    editable={!loading}
                  />
                  <Pressable
                    onPress={() => setShowNewPassword((value) => !value)}
                    style={styles.eyeBtn}
                    hitSlop={10}
                    disabled={loading}
                  >
                    <Ionicons
                      name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#6B7280"
                    />
                  </Pressable>
                </View>

                <Text style={[styles.label, { marginTop: 12 }]}>
                  Nhập lại mật khẩu mới
                </Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Nhập lại mật khẩu"
                    placeholderTextColor="#9CA3AF"
                    style={[styles.input, { paddingRight: 44 }]}
                    secureTextEntry={!showConfirmPassword}
                    editable={!loading}
                    returnKeyType="done"
                    onSubmitEditing={resetPassword}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword((value) => !value)}
                    style={styles.eyeBtn}
                    hitSlop={10}
                    disabled={loading}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword
                          ? "eye-off-outline"
                          : "eye-outline"
                      }
                      size={20}
                      color="#6B7280"
                    />
                  </Pressable>
                </View>
              </>
            ) : null}

            {infoText ? <Text style={styles.infoText}>{infoText}</Text> : null}
            {errorText ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorText}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={submitAction}
              disabled={!canSubmit}
              style={[styles.submitBtn, canSubmit && styles.submitBtnActive]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>{primaryLabel}</Text>
              )}
            </Pressable>

            {step !== "identifier" ? (
              <View style={styles.secondaryActions}>
                <Pressable
                  onPress={() => sendOtp({ showAlert: true })}
                  disabled={loading}
                  hitSlop={8}
                >
                  <Text style={styles.footerLink}>Gửi lại OTP</Text>
                </Pressable>
                <Text style={styles.footerText}> · </Text>
                <Pressable
                  onPress={() => {
                    setStep("identifier");
                    setOtp("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setErrorText("");
                    setInfoText("");
                  }}
                  disabled={loading}
                  hitSlop={8}
                >
                  <Text style={styles.footerLink}>Đổi thông tin</Text>
                </Pressable>
              </View>
            ) : null}

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Đã nhớ mật khẩu?</Text>
              <Pressable
                onPress={() => navigation.navigate("Login")}
                disabled={loading}
                hitSlop={10}
              >
                <Text style={styles.footerLink}> Đăng nhập</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
