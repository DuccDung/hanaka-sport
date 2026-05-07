// src/screens/Tournament/TournamentRegisterScreen.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./registerStyles";

import { getMyTournamentRegistrationState } from "../../services/tournamentService";
import { publicGetTournamentDetail } from "../../services/tournamentService";
import { registerSingle } from "../../services/tournamentService";
import { registerWaitingPair } from "../../services/tournamentService";
import { getAuthSession } from "../../services/authStorage";

function getGameTypeLabel(gameType) {
  if (gameType === "SINGLE") return "Đơn";
  if (gameType === "DOUBLE") return "Đôi";
  if (gameType === "MIXED") return "Đôi hỗn hợp";
  return gameType || "-";
}

function getGameTypeValue(label) {
  if (label === "SINGLE") return "SINGLE";
  if (label === "DOUBLE" || label === "MIXED") return "DOUBLE";
  return label;
}

export default function TournamentRegisterScreen({ navigation, route }) {
  const tournamentId = route?.params?.tournamentId;

  // Tournament detail & registration state
  const [tournament, setTournament] = useState(null);
  const [regState, setRegState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // UI state
  const [selectedType, setSelectedType] = useState("SINGLE"); // SINGLE or DOUBLE
  const [submitting, setSubmitting] = useState(false);

  // User info
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    ratingSingle: 0,
    ratingDouble: 0,
  });

  const isMixed = tournament?.gameType === "MIXED";
  const isDoubleLike = tournament?.gameType === "DOUBLE" || isMixed;

  // Load tournament detail + registration state
  const fetchData = useCallback(async () => {
    if (!tournamentId) return;
    try {
      setLoading(true);
      setErrorMsg("");

      const [tourDetail, regStateData] = await Promise.all([
        publicGetTournamentDetail(tournamentId),
        getMyTournamentRegistrationState(tournamentId).catch(() => null),
      ]);

      setTournament(tourDetail);

      if (regStateData) {
        setRegState(regStateData);
        // Nếu backend trả về canRegister=false, hiển thị lý do
        if (!regStateData.canRegister && regStateData.reason) {
          setErrorMsg(regStateData.reason);
        }
      }

      // Lấy thông tin user từ session để hiển thị rating
      const session = await getAuthSession();
      if (session?.user) {
        setUserInfo({
          fullName: session.user.fullName || "User",
          ratingSingle: session.user.ratingSingle || 0,
          ratingDouble: session.user.ratingDouble || 0,
        });
      }
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message ||
          e?.message ||
          "Không tải được thông tin giải đấu."
      );
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Tự động set selectedType dựa trên gameType của tournament
  useEffect(() => {
    if (tournament?.gameType) {
      if (tournament.gameType === "SINGLE") {
        setSelectedType("SINGLE");
      } else {
        // DOUBLE hoặc MIXED
        setSelectedType("DOUBLE");
      }
    }
  }, [tournament?.gameType]);

  // Kiểm tra có thể đăng ký đơn
  const canRegisterSingle = useMemo(() => {
    if (!tournament) return false;
    if (selectedType !== "SINGLE") return false;
    if (regState && !regState.canRegister) return false;

    const singleLimit = tournament.singleLimit || 0;
    if (singleLimit > 0 && userInfo.ratingSingle > singleLimit) return false;

    return true;
  }, [tournament, selectedType, regState, userInfo.ratingSingle]);

  // Kiểm tra có thể đăng ký chờ ghép
  const canRegisterWaiting = useMemo(() => {
    if (!tournament) return false;
    if (selectedType !== "DOUBLE") return false;
    if (!isDoubleLike) return false;
    if (regState && !regState.canRegister) return false;

    const doubleLimit = tournament.doubleLimit || 0;
    if (doubleLimit > 0 && userInfo.ratingDouble > doubleLimit) return false;

    return true;
  }, [tournament, selectedType, regState, isDoubleLike, userInfo.ratingDouble]);

  // Xử lý đăng ký đơn
  const handleRegisterSingle = useCallback(async () => {
    if (!tournamentId) return;

    if (!canRegisterSingle) {
      Alert.alert(
        "Không thể đăng ký",
        regState?.reason || "Bạn không đủ điều kiện đăng ký đơn."
      );
      return;
    }

    Alert.alert("Xác nhận", "Bạn có chắc muốn đăng ký đơn giải này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng ký",
        onPress: async () => {
          try {
            setSubmitting(true);
            await registerSingle({ tournamentId });
            Alert.alert("Thành công", "Đăng ký đơn thành công!", [
              {
                text: "OK",
                onPress: () => {
                  // Quay về màn hình danh sách đăng ký và refresh
                  navigation.navigate("TournamentRegistration", {
                    tournamentId,
                    shouldRefresh: true,
                  });
                },
              },
            ]);
          } catch (e) {
            const msg =
              e?.response?.data?.message ||
              e?.message ||
              "Đăng ký thất bại.";
            Alert.alert("Lỗi", msg);
          } finally {
            setSubmitting(false);
          }
        },
      },
    ]);
  }, [tournamentId, canRegisterSingle, regState, navigation]);

  // Xử lý đăng ký chờ ghép
  const handleRegisterWaiting = useCallback(async () => {
    if (!tournamentId) return;

    if (!canRegisterWaiting) {
      Alert.alert(
        "Không thể đăng ký",
        regState?.reason || "Bạn không đủ điều kiện đăng ký chờ ghép."
      );
      return;
    }

    Alert.alert(
      "Xác nhận",
      "Bạn sẽ đăng ký trạng thái chờ ghép. Hệ thống sẽ thông báo khi có đối tác.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng ký",
          onPress: async () => {
            try {
              setSubmitting(true);
              await registerWaitingPair({ tournamentId });
              Alert.alert(
                "Thành công",
                "Đăng ký chờ ghép thành công! Bạn có thể tìm đối tác trong phần quản lý.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.navigate("TournamentRegistration", {
                        tournamentId,
                        shouldRefresh: true,
                      });
                    },
                  },
                ]
              );
            } catch (e) {
              const msg =
                e?.response?.data?.message ||
                e?.message ||
                "Đăng ký thất bại.";
              Alert.alert("Lỗi", msg);
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  }, [tournamentId, canRegisterWaiting, regState, navigation]);

  // Loading state
  if (loading) {
    return (
      <View style={styles.centered}>
        <SafeAreaView style={{ backgroundColor: "#fff" }} edges={["top"]} />
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Đang tải thông tin giải đấu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} edges={["top"]} />
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
          <Text style={styles.headerTitle}>Đăng ký giải</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Error message */}
        {errorMsg ? (
          <View style={styles.errorBox}>
            <Ionicons name="warning-outline" size={18} color="#DC2626" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Tournament Info */}
        {tournament ? (
          <View style={styles.tournamentCard}>
            <Text style={styles.tournamentTitle}>{tournament.title}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Loại hình:</Text>
              <Text style={styles.infoValue}>
                {getGameTypeLabel(tournament.gameType)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giới hạn đơn:</Text>
              <Text style={styles.infoValue}>
                {tournament.singleLimit > 0
                  ? tournament.singleLimit
                  : "Không giới hạn"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giới hạn đôi:</Text>
              <Text style={styles.infoValue}>
                {tournament.doubleLimit > 0
                  ? tournament.doubleLimit
                  : "Không giới hạn"}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Game Type Selector */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Chọn hình thức đăng ký</Text>
          <View style={styles.typeSelector}>
            <Pressable
              style={[
                styles.typeButton,
                selectedType === "SINGLE" && styles.typeButtonActive,
                tournament?.gameType !== "SINGLE" && styles.typeButtonDisabled,
              ]}
              onPress={() => setSelectedType("SINGLE")}
              disabled={tournament?.gameType !== "SINGLE"}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === "SINGLE" && styles.typeButtonTextActive,
                ]}
              >
                Đơn (Single)
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.typeButton,
                selectedType === "DOUBLE" && styles.typeButtonActive,
                !isDoubleLike && styles.typeButtonDisabled,
              ]}
              onPress={() => setSelectedType("DOUBLE")}
              disabled={!isDoubleLike}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === "DOUBLE" && styles.typeButtonTextActive,
                ]}
              >
                {isMixed ? "Đôi hỗn hợp (Mixed)" : "Đôi (Double)"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Single Registration */}
        {selectedType === "SINGLE" && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Đăng ký đơn</Text>
            <View style={styles.userInfoBox}>
              <Text style={styles.userInfoLabel}>Người đăng ký:</Text>
              <Text style={styles.userInfoValue}>{userInfo.fullName}</Text>
              <Text style={styles.userInfoLabel}>Rating đơn:</Text>
              <Text
                style={[
                  styles.userInfoValue,
                  userInfo.ratingSingle > (tournament?.singleLimit || 999) &&
                    styles.ratingExceeded,
                ]}
              >
                {userInfo.ratingSingle || "Chưa có"}
              </Text>
              {tournament?.singleLimit > 0 &&
              userInfo.ratingSingle > tournament.singleLimit ? (
                <Text style={styles.warningText}>
                  Rating của bạn vượt quá giới hạn ({tournament.singleLimit})
                </Text>
              ) : null}
            </View>
            <Pressable
              style={[
                styles.submitButton,
                (!canRegisterSingle || submitting) && styles.submitButtonDisabled,
              ]}
              onPress={handleRegisterSingle}
              disabled={!canRegisterSingle || submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                  <Text style={styles.submitButtonText}>Đăng ký đơn</Text>
                </>
              )}
            </Pressable>
          </View>
        )}

        {/* Double Registration */}
        {selectedType === "DOUBLE" && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Đăng ký đôi</Text>
            <View style={styles.userInfoBox}>
              <Text style={styles.userInfoLabel}>Người đăng ký:</Text>
              <Text style={styles.userInfoValue}>{userInfo.fullName}</Text>
              <Text style={styles.userInfoLabel}>Rating đôi:</Text>
              <Text
                style={[
                  styles.userInfoValue,
                  userInfo.ratingDouble > (tournament?.doubleLimit || 999) &&
                    styles.ratingExceeded,
                ]}
              >
                {userInfo.ratingDouble || "Chưa có"}
              </Text>
              {tournament?.doubleLimit > 0 &&
              userInfo.ratingDouble > tournament.doubleLimit ? (
                <Text style={styles.warningText}>
                  Rating của bạn vượt quá giới hạn ({tournament.doubleLimit})
                </Text>
              ) : null}
            </View>

            {/* Option A: Tìm đối tác */}
            <Pressable
              style={styles.optionButton}
              onPress={() => {
                navigation.navigate("PartnerSearch", {
                  tournamentId,
                });
              }}
            >
              <Ionicons name="people-outline" size={20} color="#2563EB" />
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Tìm đối tác</Text>
                <Text style={styles.optionDesc}>
                  Tìm kiếm và gửi lời mời ghép cặp cho người chơi khác
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </Pressable>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Option B: Đăng ký chờ ghép */}
            <Pressable
              style={[
                styles.optionButton,
                (!canRegisterWaiting || submitting) && styles.optionButtonDisabled,
              ]}
              onPress={handleRegisterWaiting}
              disabled={!canRegisterWaiting || submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#2563EB" />
              ) : (
                <>
                  <Ionicons name="time-outline" size={20} color="#2563EB" />
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Đăng ký chờ ghép</Text>
                    <Text style={styles.optionDesc}>
                      Đăng ký trước, hệ thống sẽ tự động ghép cặp khi có đối tác
                    </Text>
                  </View>
                </>
              )}
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
