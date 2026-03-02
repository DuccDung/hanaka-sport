// src/screens/Club/ClubCreateScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./createStyles";
import RichTextBlock from "../../components/RichTextBlock"; // dùng lại component rich editor (bạn đã có)

function stripHtml(html = "") {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function Label({ text, required }) {
  return (
    <View style={styles.labelRow}>
      <Text style={styles.label}>{text}</Text>
      {required ? <Text style={styles.required}>*</Text> : null}
    </View>
  );
}

// input 1 dòng có icon bên phải (calendar / dropdown)
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
  // Images (demo only). Khi làm thật bạn thay bằng ImagePicker
  const [coverUri, setCoverUri] = useState(""); // ảnh CLB
  const [avatarUri, setAvatarUri] = useState(""); // ảnh đại diện

  // Fields
  const [name, setName] = useState("");
  const [descHtml, setDescHtml] = useState(""); // rich text HTML
  const [foundedDate, setFoundedDate] = useState(""); // DD/MM/YYYY
  const [playTime, setPlayTime] = useState("");
  const [province, setProvince] = useState(""); // Tỉnh/Thành
  const [district, setDistrict] = useState(""); // Quận/Huyện
  const [address, setAddress] = useState("");

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

  // Demo actions
  const pickCover = () => {
    // TODO: dùng expo-image-picker
    setCoverUri(
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80",
    );
  };

  const pickAvatar = () => {
    // TODO: dùng expo-image-picker
    setAvatarUri(
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
    );
  };

  const openCalendar = () => {
    // TODO: date picker
    // tạm demo
    setFoundedDate("01/03/2026");
  };

  const openProvincePicker = () => {
    // TODO: mở bottom sheet picker
    setProvince("Hà Nội");
  };

  const openDistrictPicker = () => {
    // TODO: mở bottom sheet picker theo province
    setDistrict("Cầu Giấy");
  };

  const onSubmit = () => {
    if (!canSubmit) return;

    const payload = {
      name,
      description: descHtml,
      foundedDate,
      playTime,
      province,
      district,
      address,
      coverUri,
      avatarUri,
    };

    // TODO: gọi API tạo CLB
    // console.log("Create club payload:", payload);

    navigation.goBack();
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
          {/* Ảnh CLB */}
          <Label text="Ảnh CLB" required={false} />
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

          {/* Ảnh đại diện */}
          <View style={styles.avatarBlock}>
            <Pressable onPress={pickAvatar} style={styles.avatarCircle}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="add" size={30} color="#fff" />
              )}
            </Pressable>
            <Text style={styles.avatarLabel}>Ảnh đại diện</Text>
          </View>

          {/* Tên */}
          <Label text="Tên" required />
          <View style={styles.inputBox}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Tên"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          {/* Mô tả (Rich) */}
          <Label text="Mô tả" required />
          <RichTextBlock
            valueHtml={descHtml}
            onChangeHtml={setDescHtml}
            placeholder=""
          />

          {/* Ngày thành lập */}
          <Label text="Ngày thành lập" required />
          <InputBox
            value={foundedDate}
            onChangeText={setFoundedDate}
            placeholder="DD/MM/YYYY"
            rightIcon="calendar-outline"
            onPressRight={openCalendar}
          />

          {/* Thời gian chơi */}
          <Label text="Thời gian chơi" required />
          <InputBox
            value={playTime}
            onChangeText={setPlayTime}
            placeholder="Thời gian chơi"
          />

          {/* Khu vực */}
          <Label text="Khu vực" required />
          <View style={styles.twoColRow}>
            <Pressable
              style={[styles.inputBox, styles.twoCol]}
              onPress={openProvincePicker}
            >
              <Text
                style={[
                  styles.fakeInputText,
                  !province && styles.fakePlaceholder,
                ]}
              >
                {province || "Tỉnh/Thành"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#6B7280" />
            </Pressable>

            <Pressable
              style={[styles.inputBox, styles.twoCol]}
              onPress={openDistrictPicker}
            >
              <Text
                style={[
                  styles.fakeInputText,
                  !district && styles.fakePlaceholder,
                ]}
              >
                {district || "Quận/Huyện"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#6B7280" />
            </Pressable>
          </View>

          {/* Địa chỉ */}
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

          {/* Submit */}
          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit}
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          >
            <Text
              style={[
                styles.submitText,
                !canSubmit && styles.submitTextDisabled,
              ]}
            >
              Tạo CLB
            </Text>
          </Pressable>

          <View style={{ height: 22 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
