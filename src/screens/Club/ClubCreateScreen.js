import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { styles } from "./createStyles";
import RichTextBlock from "../../components/RichTextBlock";
import { createClub, uploadClubCover } from "../../services/clubService";

function stripHtml(html = "") {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDateDDMMYYYY(date) {
  if (!date) return "";

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

function Label({ text, required = false }) {
  return (
    <View style={styles.labelRow}>
      <Text style={styles.label}>{text}</Text>
      {required ? <Text style={styles.required}>*</Text> : null}
    </View>
  );
}

function InputBox({
  value,
  onChangeText,
  placeholder,
  rightIcon,
  onPressRight,
  editable = true,
}) {
  return (
    <View style={styles.inputBox}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        editable={editable}
      />
      {rightIcon ? (
        <Pressable
          onPress={onPressRight}
          hitSlop={10}
          style={styles.rightIconBtn}
        >
          <Ionicons name={rightIcon} size={18} color="#6B7280" />
        </Pressable>
      ) : null}
    </View>
  );
}

export default function ClubCreateScreen({ navigation }) {
  const [coverUri, setCoverUri] = useState("");

  const [name, setName] = useState("");
  const [descHtml, setDescHtml] = useState("");
  const [foundedDate, setFoundedDate] = useState("");
  const [foundedDateValue, setFoundedDateValue] = useState(null);
  const [showFoundedDatePicker, setShowFoundedDatePicker] = useState(false);
  const [playTime, setPlayTime] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      stripHtml(descHtml).length > 0 &&
      foundedDate.trim().length > 0 &&
      playTime.trim().length > 0 &&
      province.trim().length > 0 &&
      district.trim().length > 0 &&
      address.trim().length > 0
    );
  }, [name, descHtml, foundedDate, playTime, province, district, address]);

  const pickImageFromLibrary = async () => {
    if (Platform.OS !== "ios") {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Thông báo",
          "Bạn cần cấp quyền truy cập thư viện ảnh.",
        );
        return null;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
      selectionLimit: 1,
    });

    if (result.canceled) return null;

    return result.assets?.[0]?.uri || null;
  };

  const pickCover = async () => {
    try {
      const uri = await pickImageFromLibrary();
      if (uri) setCoverUri(uri);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chọn ảnh CLB.");
    }
  };

  const openCalendar = () => {
    setShowFoundedDatePicker(true);
  };

  const onChangeFoundedDate = (event, selectedDate) => {
    if (Platform.OS !== "ios") {
      setShowFoundedDatePicker(false);
    }

    if (event?.type === "set" && selectedDate) {
      setFoundedDateValue(selectedDate);
      setFoundedDate(formatDateDDMMYYYY(selectedDate));
    }

    if (event?.type === "dismissed") {
      setShowFoundedDatePicker(false);
    }
  };

  const onSubmit = async () => {
    if (!canSubmit || submitting) return;

    try {
      setSubmitting(true);

      let uploadedCoverUrl = "";

      if (coverUri) {
        const uploadRes = await uploadClubCover(coverUri);
        uploadedCoverUrl = uploadRes?.coverUrl || "";
      }

      const payload = {
        clubName: name.trim(),
        description: descHtml,
        foundedDate: foundedDate.trim(),
        playTime: playTime.trim(),
        province: province.trim(),
        district: district.trim(),
        address: address.trim(),
        coverUrl: uploadedCoverUrl || null,
      };

      const res = await createClub(payload);

      Alert.alert("Thành công", res?.message || "Tạo CLB thành công.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Tạo CLB thất bại.";
      Alert.alert("Lỗi", message);
    } finally {
      setSubmitting(false);
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
          >
            <Ionicons name="arrow-back" size={20} color="#1E2430" />
          </Pressable>

          <Text style={styles.headerTitle}>Tạo CLB</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Label text="Ảnh CLB" />
          <Pressable style={styles.coverPick} onPress={pickCover}>
            {coverUri ? (
              <Image source={{ uri: coverUri }} style={styles.coverImage} />
            ) : (
              <View style={styles.coverPlaceholder}>
                <Ionicons name="image-outline" size={22} color="#2563EB" />
                <Text style={styles.coverPlaceholderText}>Thêm ảnh</Text>
              </View>
            )}
          </Pressable>

          <Label text="Tên" required />
          <View style={styles.inputBox}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Tên CLB"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          <Label text="Mô tả" required />
          <RichTextBlock
            valueHtml={descHtml}
            onChangeHtml={setDescHtml}
            placeholder=""
          />

          <Label text="Ngày thành lập" required />
          <Pressable style={styles.inputBox} onPress={openCalendar}>
            <Text
              style={[
                styles.fakeInputText,
                !foundedDate && styles.fakePlaceholder,
              ]}
            >
              {foundedDate || "DD/MM/YYYY"}
            </Text>
            <Ionicons name="calendar-outline" size={18} color="#6B7280" />
          </Pressable>

          {showFoundedDatePicker ? (
            <View style={styles.datePickerWrap}>
              <DateTimePicker
                value={foundedDateValue ?? new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()}
                onChange={onChangeFoundedDate}
              />
              {Platform.OS === "ios" ? (
                <Pressable
                  style={styles.datePickerCloseBtn}
                  onPress={() => setShowFoundedDatePicker(false)}
                >
                  <Text style={styles.datePickerCloseText}>Đóng</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          <Label text="Thời gian chơi" required />
          <InputBox
            value={playTime}
            onChangeText={setPlayTime}
            placeholder="Ví dụ: 18:00 - 21:00"
          />

          <Label text="Khu vực" required />
          <View style={styles.twoColRow}>
            <View style={[styles.inputBox, styles.twoCol]}>
              <TextInput
                value={province}
                onChangeText={setProvince}
                placeholder="Tỉnh/Thành"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>

            <View style={[styles.inputBox, styles.twoCol]}>
              <TextInput
                value={district}
                onChangeText={setDistrict}
                placeholder="Quận/Huyện"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>
          </View>

          <Label text="Địa chỉ" required />
          <View style={[styles.inputBox, styles.textAreaBox]}>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Địa chỉ"
              placeholderTextColor="#9CA3AF"
              style={[styles.input, styles.textArea]}
              multiline
              textAlignVertical="top"
            />
          </View>

          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit || submitting}
            style={[
              styles.submitBtn,
              canSubmit && !submitting && styles.submitBtnActiveRed,
              (!canSubmit || submitting) && styles.submitBtnDisabled,
            ]}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={[
                  styles.submitText,
                  (!canSubmit || submitting) && styles.submitTextDisabled,
                ]}
              >
                Tạo CLB
              </Text>
            )}
          </Pressable>

          <View style={{ height: 22 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
