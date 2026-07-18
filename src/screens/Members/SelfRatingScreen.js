import React, { memo, useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./selfRatingStyles";
import { SELF_RATING_SECTIONS, SCORE_OPTIONS } from "./data/selfRatingData";
import {
  buildInitialValues,
  calculateSelfRating,
} from "./utils/selfRatingCalculator";
import { useAuth } from "../../context/AuthContext";
import { getMe, updateMySelfRating } from "../../services/userService";

function isVerifiedUser(user) {
  return !!(user?.verified || user?.Verified);
}

function ScoreSelector({ value, onChange, disabled }) {
  return (
    <View style={styles.scoreSelectorRow}>
      {SCORE_OPTIONS.map((score) => {
        const isActive = value === score;

        return (
          <Pressable
            key={score}
            onPress={() => onChange(score)}
            disabled={disabled}
            style={[
              styles.scoreChip,
              isActive ? styles.scoreChipActive : styles.scoreChipInactive,
              disabled && styles.scoreChipDisabled,
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

const RatingColumn = memo(function RatingColumn({ title, value, onChange, disabled }) {
  return (
    <View style={styles.ratingColumn}>
      <Text style={styles.ratingColumnTitle}>{title}</Text>
      <ScoreSelector value={value} onChange={onChange} disabled={disabled} />
    </View>
  );
});

const SectionCard = memo(function SectionCard({
  section,
  value,
  onChangeSingle,
  onChangeDouble,
  disabled,
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
          disabled={disabled}
        />

        <RatingColumn
          title="Điểm đôi"
          value={value.double}
          onChange={onChangeDouble}
          disabled={disabled}
        />
      </View>
    </View>
  );
});

function ResultPanel({ result, submitting, disabled, onReset, onSubmit }) {
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
          style={[styles.resetBtn, (submitting || disabled) && styles.btnDisabled]}
          onPress={onReset}
          disabled={submitting || disabled}
        >
          <Text style={styles.resetBtnText}>Đặt lại</Text>
        </Pressable>

        <Pressable
          style={[styles.updateBtn, (submitting || disabled) && styles.btnDisabled]}
          onPress={onSubmit}
          disabled={submitting || disabled}
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
  const { session, booting, setAuthSession } = useAuth();
  const accessToken = session?.accessToken || null;
  const sessionUser = session?.user || null;
  const [values, setValues] = useState(() => buildInitialValues());
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(sessionUser);

  const result = useMemo(() => calculateSelfRating(values), [values]);
  const isVerified = isVerifiedUser(profile);
  const canSelfRate = !!accessToken && !booting && !isVerified;

  useEffect(() => {
    setProfile(sessionUser);
  }, [sessionUser]);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    (async () => {
      try {
        const latestUser = await getMe({ accessToken });
        if (cancelled) return;

        setProfile(latestUser);
        await setAuthSession({
          accessToken,
          expiresAtUtc: session?.expiresAtUtc,
          user: latestUser,
        });
      } catch (_error) {
        // Không chặn màn nếu refresh profile thất bại; API cập nhật vẫn kiểm tra lại.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accessToken, session?.expiresAtUtc, setAuthSession]);

  const goLogin = useCallback(() => {
    const parentNavigation = navigation.getParent?.();
    if (parentNavigation) {
      parentNavigation.navigate("AuthStack", { screen: "Login" });
      return;
    }

    navigation.navigate("AuthStack", { screen: "Login" });
  }, [navigation]);

  const handleChangeScore = useCallback((sectionKey, mode, score) => {
    if (!canSelfRate) return;

    setValues((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [mode]: score,
      },
    }));
  }, [canSelfRate]);

  const handleReset = useCallback(() => {
    if (!canSelfRate) return;
    setValues(buildInitialValues());
  }, [canSelfRate]);

  const handleUpdate = useCallback(async () => {
    if (!accessToken) {
      Alert.alert("Thông báo", "Bạn cần đăng nhập để tự chấm trình.", [
        {
          text: "OK",
          onPress: goLogin,
        },
      ]);
      return;
    }

    if (isVerified) {
      Alert.alert(
        "Không thể tự chấm trình",
        "Tài khoản đã xác thực nên không thể tự cập nhật điểm trình.",
      );
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ratingSingle: Number(result.singleLevel),
        ratingDouble: Number(result.doubleLevel),
      };

      const res = await updateMySelfRating(payload);
      const ratedAt = res?.ratedAt || res?.RatedAt || new Date().toISOString();
      const nextUser = {
        ...(profile || sessionUser || {}),
        ratingSingle: payload.ratingSingle,
        ratingDouble: payload.ratingDouble,
        ratingUpdatedAt: ratedAt,
      };

      setProfile(nextUser);
      await setAuthSession({
        accessToken,
        expiresAtUtc: session?.expiresAtUtc,
        user: nextUser,
      });

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
  }, [
    accessToken,
    goLogin,
    isVerified,
    profile,
    result.singleLevel,
    result.doubleLevel,
    session?.expiresAtUtc,
    sessionUser,
    setAuthSession,
  ]);

  return (
    <View style={styles.safe}>
      <SafeAreaView style={styles.safeTop} edges={["top"]} />
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
        {isVerified ? (
          <View style={styles.noticeCard}>
            <Ionicons name="lock-closed-outline" size={20} color="#047857" />
            <Text style={styles.noticeText}>
              Tài khoản của bạn đã xác thực. Điểm trình hiện tại không thể tự chấm lại.
            </Text>
          </View>
        ) : !accessToken && !booting ? (
          <View style={styles.noticeCard}>
            <Ionicons name="log-in-outline" size={20} color="#2563EB" />
            <Text style={styles.noticeText}>
              Bạn cần đăng nhập để tự chấm trình của mình.
            </Text>
          </View>
        ) : null}

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
            disabled={!canSelfRate}
          />
        ))}

        <View style={styles.scrollBottomSpace} />
      </ScrollView>

      <ResultPanel
        result={result}
        submitting={submitting}
        disabled={booting || isVerified}
        onReset={handleReset}
        onSubmit={handleUpdate}
      />
    </View>
  );
}
