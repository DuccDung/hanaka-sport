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
  const [focusedField, setFocusedField] = useState("");

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length >= 2 &&
      isEmail(email) &&
      password.trim().length >= 6 &&
      !submitting
    );
  }, [fullName, email, password, submitting]);

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

    Keyboard.dismiss();
    setSubmitting(true);
    setErrorText("");

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        gender: gender || null,
      };

      const data = await register(payload);

      Alert.alert("Thành công", data?.message || "OTP đã được gửi tới email.");

      navigation.navigate("RegisterOtp", {
        email: email.trim(),
        fullName: fullName.trim(),
        gender: gender || null,
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
      <SafeAreaView style={styles.safeTop} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
            <Text style={styles.sectionTitle}>Tạo tài khoản</Text>
            <Text style={styles.sectionDesc}>
              Điền thông tin để đăng ký tài khoản mới.
            </Text>

            <View style={styles.fieldBlock}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Họ và tên</Text>
              </View>

              <View
                style={[
                  styles.inputWrap,
                  focusedField === "fullName" && styles.inputWrapFocused,
                ]}
              >
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Nguyễn Văn A"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                  returnKeyType="next"
                  editable={!submitting}
                  onFocus={() => setFocusedField("fullName")}
                  onBlur={() => setFocusedField("")}
                />
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Email</Text>
              </View>

              <View
                style={[
                  styles.inputWrap,
                  focusedField === "email" && styles.inputWrapFocused,
                ]}
              >
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="a@test.com"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  editable={!submitting}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                />
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Mật khẩu</Text>
              </View>

              <View
                style={[
                  styles.inputWrap,
                  focusedField === "password" && styles.inputWrapFocused,
                ]}
              >
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
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
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
            </View>

            <View style={styles.fieldBlock}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Giới tính</Text>
                <Text style={styles.optionalText}>Không bắt buộc</Text>
              </View>

              <View style={styles.genderRow}>
                <Pressable
                  onPress={() =>
                    setGender((prev) => (prev === "Nam" ? "" : "Nam"))
                  }
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
                  onPress={() =>
                    setGender((prev) => (prev === "Nữ" ? "" : "Nữ"))
                  }
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

              <View style={styles.helperBox}>
                <Text style={styles.helperText}>
                  Bạn có thể bỏ qua mục này và tiếp tục đăng ký.
                </Text>
              </View>
            </View>

            {errorText ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorText}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={onSubmit}
              disabled={!canSubmit}
              style={[styles.submitBtn, canSubmit && styles.submitBtnActive]}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
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
