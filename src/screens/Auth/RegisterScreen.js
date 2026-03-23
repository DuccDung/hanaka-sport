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
  const [gender, setGender] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length >= 2 &&
      isEmail(email) &&
      password.trim().length >= 6 &&
      (gender === "Nam" || gender === "Nữ") &&
      !submitting
    );
  }, [fullName, email, password, gender, submitting]);

  const onSubmit = async () => {
    if (!fullName.trim()) {
      setErrorText("Vui lòng nhập họ và tên.");
      return;
    }

    if (fullName.trim().length < 2) {
      setErrorText("Họ và tên phải có ít nhất 2 ký tự.");
      return;
    }

    if (!isEmail(email)) {
      setErrorText("Email không hợp lệ.");
      return;
    }

    if (password.trim().length < 6) {
      setErrorText("Mật khẩu tối thiểu 6 ký tự.");
      return;
    }

    if (gender !== "Nam" && gender !== "Nữ") {
      setErrorText("Vui lòng chọn giới tính.");
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);
    setErrorText("");

    try {
      const data = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        gender,
      });

      Alert.alert("Thành công", data?.message || "OTP đã được gửi tới email.");

      navigation.navigate("RegisterOtp", {
        email: email.trim(),
        fullName: fullName.trim(),
        gender,
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

            <Text style={[styles.label, { marginTop: 12 }]}>Giới tính</Text>
            <View style={styles.genderRow}>
              <Pressable
                onPress={() => setGender("Nam")}
                disabled={submitting}
                style={[
                  styles.genderOption,
                  gender === "Nam" && styles.genderOptionActive,
                ]}
              >
                <Ionicons
                  name={
                    gender === "Nam" ? "radio-button-on" : "radio-button-off"
                  }
                  size={18}
                  color={gender === "Nam" ? "#FFFFFF" : "#6B7280"}
                />
                <Text
                  style={[
                    styles.genderText,
                    gender === "Nam" && styles.genderTextActive,
                  ]}
                >
                  Nam
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setGender("Nữ")}
                disabled={submitting}
                style={[
                  styles.genderOption,
                  gender === "Nữ" && styles.genderOptionActive,
                ]}
              >
                <Ionicons
                  name={
                    gender === "Nữ" ? "radio-button-on" : "radio-button-off"
                  }
                  size={18}
                  color={gender === "Nữ" ? "#FFFFFF" : "#6B7280"}
                />
                <Text
                  style={[
                    styles.genderText,
                    gender === "Nữ" && styles.genderTextActive,
                  ]}
                >
                  Nữ
                </Text>
              </Pressable>
            </View>

            {errorText ? (
              <Text style={styles.errorText}>{errorText}</Text>
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
