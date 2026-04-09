import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./editStyles";
import RichTextBlock from "../../components/RichTextBlock";
import { getMe } from "../../services/userService";
import {
  getMyCoachProfile,
  registerMeAsCoach,
  updateMyCoachProfile,
} from "../../services/coachService";
import { evaluateCommunityContent } from "../../services/communitySafetyService";

function FieldLabel({ label, required }) {
  return (
    <View style={styles.fieldLabelRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {required ? <Text style={styles.required}>*</Text> : null}
    </View>
  );
}

function stripHtml(html = "") {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function CoachEditScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [coachId, setCoachId] = useState(null);

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [avatar, setAvatar] = useState("");
  const [single, setSingle] = useState(0);
  const [doubleScore, setDoubleScore] = useState(0);
  const [verified, setVerified] = useState(false);

  const [introHtml, setIntroHtml] = useState("");
  const [areaHtml, setAreaHtml] = useState("");
  const [achievementsHtml, setAchievementsHtml] = useState("");

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setLoading(true);

        const me = await getMe();

        setName(me?.fullName ?? "");
        setNickname(
          me?.email?.split("@")?.[0] || me?.phone || me?.fullName || "",
        );
        setGender(me?.gender ?? "");
        setCity(me?.city ?? "");
        setAvatar(me?.avatarUrl ?? "");
        setSingle(Number(me?.ratingSingle ?? 0));
        setDoubleScore(Number(me?.ratingDouble ?? 0));

        try {
          const coach = await getMyCoachProfile();

          setCoachId(coach?.coachId ?? null);
          setVerified(!!coach?.verified);

          setIntroHtml(coach?.introduction ?? "");
          setAreaHtml(coach?.teachingArea ?? "");
          setAchievementsHtml(coach?.achievements ?? "");
        } catch (e) {
          setCoachId(null);
          setVerified(false);
        }
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "Không tải được dữ liệu huấn luyện viên.";
        Alert.alert("Lỗi", String(msg));
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      stripHtml(introHtml).length > 0 &&
      stripHtml(areaHtml).length > 0 &&
      stripHtml(achievementsHtml).length > 0 &&
      !saving
    );
  }, [introHtml, areaHtml, achievementsHtml, saving]);

  const onSubmit = async () => {
    if (!canSubmit) return;

    const blockedField = [
      { label: "Giới thiệu giảng dạy", value: introHtml },
      { label: "Khu vực giảng dạy", value: areaHtml },
      { label: "Thành tích", value: achievementsHtml },
    ].find(({ value }) => evaluateCommunityContent(value).blocked);

    if (blockedField) {
      const moderation = evaluateCommunityContent(blockedField.value);
      Alert.alert(
        "Nội dung bị chặn",
        `${blockedField.label} có dấu hiệu ${moderation.category?.toLowerCase() || "vi phạm tiêu chuẩn cộng đồng"}. Vui lòng chỉnh sửa trước khi lưu.`,
      );
      return;
    }

    try {
      setSaving(true);

      let currentCoachId = coachId;
      let currentVerified = verified;

      if (!currentCoachId) {
        const createdRes = await registerMeAsCoach({
          coachType: "COACH",
        });

        const createdCoach = createdRes?.data;
        currentCoachId = createdCoach?.coachId ?? null;
        currentVerified = !!createdCoach?.verified;

        setCoachId(currentCoachId);
        setVerified(currentVerified);
      }

      const updated = await updateMyCoachProfile({
        introduction: introHtml,
        teachingArea: areaHtml,
        achievements: achievementsHtml,
      });

      const updatedCoach = updated?.data;
      setIntroHtml(updatedCoach?.introduction ?? introHtml);
      setAreaHtml(updatedCoach?.teachingArea ?? areaHtml);
      setAchievementsHtml(updatedCoach?.achievements ?? achievementsHtml);

      Alert.alert(
        "Thành công",
        updated?.message || "Đã cập nhật hồ sơ huấn luyện viên.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Coach", {
                shouldReload: true,
                refreshAt: Date.now(),
              });
            },
          },
        ],
      );
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "Không thể cập nhật hồ sơ huấn luyện viên.";
      Alert.alert("Lỗi", String(msg));
    } finally {
      setSaving(false);
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

          <Text style={styles.headerTitle}>
            {coachId ? "Cập nhật thông tin HLV" : "Tạo hồ sơ HLV"}
          </Text>

          <View style={{ marginLeft: "auto" }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: verified ? "#16A34A" : "#DC2626",
              }}
            >
              {verified ? "Đã xác thực" : "Chưa xác thực"}
            </Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Text style={styles.bigName}>{name || "Chưa có tên"}</Text>
                <Text style={styles.infoText}>
                  Nickname: {nickname || "Chưa cập nhật"}
                </Text>
                <Text style={styles.infoText}>
                  Giới tính: {gender || "Chưa cập nhật"}
                </Text>
                <Text style={styles.infoText}>
                  Tỉnh/Thành: {city || "Chưa cập nhật"}
                </Text>
              </View>

              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    {
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#F3F4F6",
                    },
                  ]}
                >
                  <Ionicons name="person-outline" size={36} color="#9CA3AF" />
                </View>
              )}
            </View>

            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Điểm đơn: {single}</Text>
              <Text style={styles.scoreLabel}>Điểm đôi: {doubleScore}</Text>
            </View>

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

            <Pressable
              onPress={onSubmit}
              disabled={!canSubmit}
              style={[
                styles.submitBtn,
                canSubmit ? styles.submitBtnActive : styles.submitBtnDisabled,
              ]}
            >
              <Text
                style={[
                  styles.submitText,
                  canSubmit
                    ? styles.submitTextActive
                    : styles.submitTextDisabled,
                ]}
              >
                {saving
                  ? "Đang cập nhật..."
                  : coachId
                    ? "Cập Nhật"
                    : "Tạo hồ sơ huấn luyện viên"}
              </Text>
            </Pressable>

            <View style={{ height: 26 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
