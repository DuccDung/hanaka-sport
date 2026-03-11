import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./selfRatingStyles";
import { SELF_RATING_SECTIONS, SCORE_OPTIONS } from "./data/selfRatingData";
import {
  buildInitialValues,
  calculateSelfRating,
} from "./utils/selfRatingCalculator";
import { updateMySelfRating } from "../../services/userService";

function ScoreSelector({ value, onChange }) {
  return (
    <View style={styles.scoreSelectorRow}>
      {SCORE_OPTIONS.map((score) => {
        const active = value === score;
        return (
          <Pressable
            key={score}
            onPress={() => onChange(score)}
            style={[styles.scoreChip, active && styles.scoreChipActive]}
          >
            <Text
              style={[
                styles.scoreChipText,
                active && styles.scoreChipTextActive,
              ]}
            >
              {score}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SectionCard({ section, value, onChangeSingle, onChangeDouble }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{section.title}</Text>

      <View style={styles.descBox}>
        {section.description.map((line, index) => (
          <Text key={index} style={styles.descText}>
            - {line}
          </Text>
        ))}
      </View>

      <View style={styles.columnsHeader}>
        <Text style={styles.colTitle}>Điểm đơn</Text>
        <Text style={styles.colTitle}>Điểm đôi</Text>
      </View>

      <View style={styles.columnsBody}>
        <View style={styles.colBox}>
          <ScoreSelector value={value.single} onChange={onChangeSingle} />
        </View>

        <View style={styles.colBox}>
          <ScoreSelector value={value.double} onChange={onChangeDouble} />
        </View>
      </View>
    </View>
  );
}

export default function SelfRatingScreen({ navigation }) {
  const [values, setValues] = useState(buildInitialValues());
  const [submitting, setSubmitting] = useState(false);

  const result = useMemo(() => calculateSelfRating(values), [values]);

  const handleChangeScore = (sectionKey, mode, score) => {
    setValues((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [mode]: score,
      },
    }));
  };

  const handleReset = () => {
    setValues(buildInitialValues());
  };

  const handleUpdate = async () => {
    try {
      setSubmitting(true);

      const payload = {
        ratingSingle: Number(result.singleLevel),
        ratingDouble: Number(result.doubleLevel),
      };

      const res = await updateMySelfRating(payload);

      Alert.alert(
        "Thành công",
        res?.message || "Đã cập nhật điểm tự chấm trình.",
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Cập nhật điểm tự chấm trình thất bại.";
      Alert.alert("Lỗi", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={22} color="#1E2430" />
        </Pressable>

        <Text style={styles.headerTitle}>Tự chấm trình</Text>

        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentInset={{ bottom: 220 }}
        scrollIndicatorInsets={{ bottom: 220 }}
      >
        {SELF_RATING_SECTIONS.map((section) => (
          <SectionCard
            key={section.key}
            section={section}
            value={values[section.key]}
            onChangeSingle={(score) =>
              handleChangeScore(section.key, "single", score)
            }
            onChangeDouble={(score) =>
              handleChangeScore(section.key, "double", score)
            }
          />
        ))}
      </ScrollView>

      <View style={styles.bottomWrap}>
        <View style={styles.resultHeaderRow}>
          <Text style={styles.resultHeaderSpacer} />
          <Text style={styles.resultHeaderText}>Điểm đơn</Text>
          <Text style={styles.resultHeaderText}>Điểm đôi</Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Điểm trình</Text>

          <View style={styles.resultBox}>
            <Text style={styles.resultValue}>{result.singleRaw}</Text>
          </View>

          <View style={styles.resultBox}>
            <Text style={styles.resultValue}>{result.doubleRaw}</Text>
          </View>
        </View>

        <View style={styles.rawRow}>
          <Text style={styles.rawText}>
            Mức tham chiếu: {result.singleLevel}
          </Text>
          <Text style={styles.rawText}>
            Mức tham chiếu: {result.doubleLevel}
          </Text>
        </View>

        <View style={styles.bottomBtnsRow}>
          <Pressable
            style={styles.resetBtn}
            onPress={handleReset}
            disabled={submitting}
          >
            <Text style={styles.resetBtnText}>Đặt lại</Text>
          </Pressable>

          <Pressable
            style={[styles.updateBtn, submitting && { opacity: 0.7 }]}
            onPress={handleUpdate}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateBtnText}>Cập Nhật</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
