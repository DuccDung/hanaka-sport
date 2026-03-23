import React, { memo, useMemo, useState, useCallback } from "react";
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
        const isActive = value === score;

        return (
          <Pressable
            key={score}
            onPress={() => onChange(score)}
            style={[
              styles.scoreChip,
              isActive ? styles.scoreChipActive : styles.scoreChipInactive,
            ]}
          >
            <Text
              style={[
                styles.scoreChipText,
                isActive && styles.scoreChipTextActive,
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

const RatingColumn = memo(function RatingColumn({ title, value, onChange }) {
  return (
    <View style={styles.ratingColumn}>
      <Text style={styles.ratingColumnTitle}>{title}</Text>
      <ScoreSelector value={value} onChange={onChange} />
    </View>
  );
});

const SectionCard = memo(function SectionCard({
  section,
  value,
  onChangeSingle,
  onChangeDouble,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{section.title}</Text>

      {!!section.description?.length && (
        <View style={styles.descBox}>
          {section.description.map((line, index) => (
            <Text key={`${section.key}-desc-${index}`} style={styles.descText}>
              • {line}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.sectionColumns}>
        <RatingColumn
          title="Điểm đơn"
          value={value.single}
          onChange={onChangeSingle}
        />

        <RatingColumn
          title="Điểm đôi"
          value={value.double}
          onChange={onChangeDouble}
        />
      </View>
    </View>
  );
});

function ResultPanel({ result, submitting, onReset, onSubmit }) {
  return (
    <View style={styles.bottomWrap}>
      <Text style={styles.bottomTitle}>Kết quả tự chấm</Text>

      <View style={styles.resultTableHeader}>
        <Text style={[styles.resultHeaderCell, styles.resultHeaderLabel]} />
        <Text style={styles.resultHeaderCell}>Đơn</Text>
        <Text style={styles.resultHeaderCell}>Đôi</Text>
      </View>

      <View style={styles.resultTableRow}>
        <Text style={[styles.resultLabelCell, styles.resultMainLabel]}>
          Điểm trình
        </Text>

        <View style={styles.resultValueBox}>
          <Text style={styles.resultValue}>{result.singleRaw}</Text>
        </View>

        <View style={styles.resultValueBox}>
          <Text style={styles.resultValue}>{result.doubleRaw}</Text>
        </View>
      </View>

      <View style={styles.resultTableRow}>
        <Text style={styles.resultLabelCell}>Mức tham chiếu</Text>

        <View style={styles.referenceBox}>
          <Text style={styles.referenceText}>{result.singleLevel}</Text>
        </View>

        <View style={styles.referenceBox}>
          <Text style={styles.referenceText}>{result.doubleLevel}</Text>
        </View>
      </View>

      <View style={styles.bottomBtnsRow}>
        <Pressable
          style={[styles.resetBtn, submitting && styles.btnDisabled]}
          onPress={onReset}
          disabled={submitting}
        >
          <Text style={styles.resetBtnText}>Đặt lại</Text>
        </Pressable>

        <Pressable
          style={[styles.updateBtn, submitting && styles.btnDisabled]}
          onPress={onSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.updateBtnText}>Cập nhật</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export default function SelfRatingScreen({ navigation }) {
  const [values, setValues] = useState(() => buildInitialValues());
  const [submitting, setSubmitting] = useState(false);

  const result = useMemo(() => calculateSelfRating(values), [values]);

  const handleChangeScore = useCallback((sectionKey, mode, score) => {
    setValues((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [mode]: score,
      },
    }));
  }, []);

  const handleReset = useCallback(() => {
    setValues(buildInitialValues());
  }, []);

  const handleUpdate = useCallback(async () => {
    try {
      setSubmitting(true);

      const payload = {
        ratingSingle: Number(result.singleLevel),
        ratingDouble: Number(result.doubleLevel),
      };

      const res = await updateMySelfRating(payload);

      Alert.alert(
        "Thành công",
        res?.message || "Đã cập nhật điểm tự chấm trình thành công.",
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
  }, [result.singleLevel, result.doubleLevel]);

  return (
    <View style={styles.safe}>
      <SafeAreaView style={styles.safeTop} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={22} color="#1E2430" />
        </Pressable>

        <Text style={styles.headerTitle}>Tự chấm trình</Text>

        <View style={styles.headerRightSpace} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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

        <View style={styles.scrollBottomSpace} />
      </ScrollView>

      <ResultPanel
        result={result}
        submitting={submitting}
        onReset={handleReset}
        onSubmit={handleUpdate}
      />
    </View>
  );
}
