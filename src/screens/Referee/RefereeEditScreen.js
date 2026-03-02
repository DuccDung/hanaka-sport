// src/screens/referee/refereeEditScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./editStyles";
import RichTextBlock from "../../components/RichTextBlock";

function FieldLabel({ label, required }) {
  return (
    <View style={styles.fieldLabelRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {required ? <Text style={styles.required}>*</Text> : null}
    </View>
  );
}

// strip html để kiểm tra submit
function stripHtml(html = "") {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function RefereeEditScreen({ navigation, route }) {
  const referee = route?.params?.referee;

  // initial data (create vs edit)
  const initial = useMemo(
    () => ({
      name: referee?.name ?? "Nguyễn Đức Dũng",
      nickname: referee?.nickname ?? "dung_dev",
      gender: referee?.gender ?? "Nam",
      city: referee?.city ?? "Bắc Giang",
      avatar:
        referee?.avatar ??
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
      single: referee?.single ?? 2.4,
      double: referee?.double ?? 2.5,

      // rich text content (HTML)
      intro: referee?.intro ?? "",
      area: referee?.area ?? "",
      achievements: referee?.achievements ?? "",
    }),
    [referee],
  );

  // lưu HTML từ RichEditor
  const [introHtml, setIntroHtml] = useState(initial.intro);
  const [areaHtml, setAreaHtml] = useState(initial.area);
  const [achievementsHtml, setAchievementsHtml] = useState(
    initial.achievements,
  );

  const canSubmit =
    stripHtml(introHtml).length > 0 &&
    stripHtml(areaHtml).length > 0 &&
    stripHtml(achievementsHtml).length > 0;

  const onSubmit = () => {
    if (!canSubmit) return;

    const payload = {
      ...initial,
      intro: introHtml,
      area: areaHtml,
      achievements: achievementsHtml,
    };

    // TODO: gọi API hoặc dispatch store
    // console.log("payload", payload);

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

          <Text style={styles.headerTitle}>Sửa thông tin</Text>
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
          {/* Info row */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.bigName}>{initial.name}</Text>
              <Text style={styles.infoText}>Nickname: {initial.nickname}</Text>
              <Text style={styles.infoText}>Giới tính: {initial.gender}</Text>
              <Text style={styles.infoText}>Tỉnh/Thành: {initial.city}</Text>
            </View>

            <Image source={{ uri: initial.avatar }} style={styles.avatar} />
          </View>

          {/* Scores row */}
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Điểm đơn: {initial.single}</Text>
            <Text style={styles.scoreLabel}>Điểm đôi: {initial.double}</Text>
          </View>

          {/* Editors */}
          <View style={{ height: 8 }} />
          <FieldLabel label="Giới thiệu" required />
          <RichTextBlock
            valueHtml={introHtml}
            onChangeHtml={setIntroHtml}
            placeholder=""
          />

          <View style={styles.divider} />

          <FieldLabel label="Khu vực giảng dạy" required />
          <RichTextBlock
            valueHtml={areaHtml}
            onChangeHtml={setAreaHtml}
            placeholder=""
          />

          <View style={styles.divider} />

          <FieldLabel label="Thành tích" required />
          <RichTextBlock
            valueHtml={achievementsHtml}
            onChangeHtml={setAchievementsHtml}
            placeholder=""
          />

          <View style={{ height: 18 }} />

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
              Cập Nhật
            </Text>
          </Pressable>

          <View style={{ height: 26 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
