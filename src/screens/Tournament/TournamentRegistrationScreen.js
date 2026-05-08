// src/screens/Tournament/TournamentRegistrationScreen.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./tournamentRegistrationStyles";
import { registerSingle, registerWaitingPair, createPairRequest, searchPartner } from "../../services/tournamentService";

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function TournamentRegistrationScreen({ navigation, route }) {
  const { tournament } = route.params;

  const [gameType, setGameType] = useState(tournament.gameType || "SINGLE");
  const [partnerUsername, setPartnerUsername] = useState("");
  const [searchingPartner, setSearchingPartner] = useState(false);
  const [partnerSearchResult, setPartnerSearchResult] = useState(null);
  const [partnerError, setPartnerError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Check if tournament requires partner (DOUBLE/MIXED) and user must have partner
  const requiresPartner = useMemo(() => {
    return gameType === "DOUBLE" || gameType === "MIXED";
  }, [gameType]);

  // Check if user can register waiting (without partner) for DOUBLE/MIXED
  const canRegisterWaiting = useMemo(() => {
    return requiresPartner && tournament.doubleLimit !== undefined && tournament.doubleLimit > 0;
  }, [requiresPartner, tournament.doubleLimit]);

  const searchPartner = async () => {
    if (!partnerUsername.trim()) {
      setPartnerError("Vui lòng nhập tên người chơi");
      return;
    }
    setPartnerError("");
    setSearchingPartner(true);
    try {
      const results = await searchPartner(tournament.tournamentId, partnerUsername.trim());
      // API returns { items: [...], total, page, pageSize }
      const items = results.items || [];
      if (items.length === 0) {
        setPartnerError("Không tìm thấy người chơi phù hợp");
        setPartnerSearchResult(null);
      } else if (items.length === 1) {
        setPartnerSearchResult(items[0]);
        setPartnerError("");
      } else {
        // Multiple results - show first (could extend to picker modal later)
        setPartnerSearchResult(items[0]);
        setPartnerError("");
      }
    } catch (e) {
      setPartnerError(e.message || "Không tìm thấy người chơi");
      setPartnerSearchResult(null);
    } finally {
      setSearchingPartner(false);
    }
  };

  const handleSubmit = async () => {
    setErrorMsg("");

    if (requiresPartner && !partnerSearchResult) {
      setErrorMsg("Vui lòng chọn đối tác hoặc đăng ký chờ");
      return;
    }

    // Validate partner can be invited (if not waiting)
    if (partnerSearchResult && !partnerSearchResult.waiting && partnerSearchResult.canInvite === false) {
      setErrorMsg("Không thể mời người chơi này (đã đăng ký, bị chặn, hoặc không thể mời)");
      return;
    }

    setSubmitting(true);
    try {
      if (gameType === "SINGLE") {
        await registerSingle({
          tournamentId: tournament.tournamentId,
        });
        Alert.alert(
          "Đăng ký thành công",
          "Bạn đã đăng ký giải đấu đơn thành công.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else if (partnerSearchResult?.waiting) {
        // Register as waiting pair (no partner)
        await registerWaitingPair({
          tournamentId: tournament.tournamentId,
        });
        Alert.alert(
          "Đăng ký thành công",
          "Bạn đã đăng ký chờ ghép cặp. Vui lòng tìm đối tác trong mục quản lý đăng ký.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else if (partnerSearchResult && partnerSearchResult.userId) {
        // Send pair request directly to partner (no prior registration needed)
        await createPairRequest(tournament.tournamentId, {
          requestedToUserId: partnerSearchResult.userId,
        });
        Alert.alert(
          "Gửi lời mời thành công",
          "Lời mời ghép cặp đã được gửi. Bạn sẽ được đăng ký khi đối tác chấp nhận.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        throw new Error("Lựa chọn không hợp lệ");
      }
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || e.message || "Đăng ký thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const renderGameTypeSelector = () => (
    <View style={styles.gameTypeContainer}>
      <Text style={styles.sectionTitle}>Chọn thể loại giải đấu</Text>
      <View style={styles.gameTypeButtons}>
        <Pressable
          style={[
            styles.gameTypeBtn,
            gameType === "SINGLE" && styles.gameTypeBtnActive,
            tournament.singleLimit === 0 && styles.gameTypeBtnDisabled,
          ]}
          onPress={() => {
            if (tournament.singleLimit > 0) setGameType("SINGLE");
          }}
          disabled={tournament.singleLimit === 0}
        >
          <Text
            style={[
              styles.gameTypeBtnText,
              gameType === "SINGLE" && styles.gameTypeBtnTextActive,
            ]}
          >
            Đơn ({tournament.singleLimit || 0} slot)
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.gameTypeBtn,
            gameType === "DOUBLE" && styles.gameTypeBtnActive,
            tournament.doubleLimit === 0 && styles.gameTypeBtnDisabled,
          ]}
          onPress={() => {
            if (tournament.doubleLimit > 0) setGameType("DOUBLE");
          }}
          disabled={tournament.doubleLimit === 0}
        >
          <Text
            style={[
              styles.gameTypeBtnText,
              gameType === "DOUBLE" && styles.gameTypeBtnTextActive,
            ]}
          >
            Đôi ({tournament.doubleLimit || 0} slot)
          </Text>
        </Pressable>
        {tournament.gameType === "MIXED" && (
          <Pressable
            style={[
              styles.gameTypeBtn,
              gameType === "MIXED" && styles.gameTypeBtnActive,
              tournament.doubleLimit === 0 && styles.gameTypeBtnDisabled,
            ]}
            onPress={() => {
              if (tournament.doubleLimit > 0) setGameType("MIXED");
            }}
            disabled={tournament.doubleLimit === 0}
          >
            <Text
              style={[
                styles.gameTypeBtnText,
                gameType === "MIXED" && styles.gameTypeBtnTextActive,
              ]}
            >
              Đôi hỗn hợp
            </Text>
          </Pressable>
        )}
      </View>
      {gameType === "SINGLE" && tournament.singleLimit === 0 && (
        <Text style={styles.warningText}>Giải này không còn slot cho đơn</Text>
      )}
      {requiresPartner && tournament.doubleLimit === 0 && (
        <Text style={styles.warningText}>Giải này không còn slot cho đôi</Text>
      )}
    </View>
  );

  const renderPartnerSearch = () => (
    <View style={styles.partnerSection}>
      <Text style={styles.sectionTitle}>
        {requiresPartner ? "Chọn đối tác" : "Tìm kiếm đối tác (tùy chọn)"}
      </Text>

      <View style={styles.searchRow}>
        <TextInput
          value={partnerUsername}
          onChangeText={setPartnerUsername}
          placeholder="Nhập tên hoặc username người chơi..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          style={[styles.searchBtn, searchingPartner && styles.searchBtnDisabled]}
          onPress={searchPartner}
          disabled={searchingPartner}
        >
          {searchingPartner ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="search" size={18} color="#fff" />
          )}
        </Pressable>
      </View>

      {partnerError ? (
        <Text style={styles.errorText}>{partnerError}</Text>
      ) : null}

      {partnerSearchResult && !partnerSearchResult.waiting && (
        <View style={styles.partnerCard}>
          <View style={styles.partnerInfoMain}>
            <View style={styles.partnerAvatar}>
              <Text style={styles.partnerAvatarText}>
                {partnerSearchResult.fullName?.[0] || "?"}
              </Text>
            </View>
            <View style={styles.partnerDetails}>
              <Text style={styles.partnerName}>{partnerSearchResult.fullName}</Text>
              <Text style={styles.partnerRating}>
                Rating đôi: {(partnerSearchResult.ratingDouble || partnerSearchResult.rating || 0).toFixed(1)}
              </Text>
              {partnerSearchResult.city && (
                <Text style={styles.partnerCity}>{partnerSearchResult.city}</Text>
              )}
            </View>
            {partnerSearchResult.verified && (
              <Ionicons name="checkmark-circle" size={20} color="#10B981" style={styles.verifiedIcon} />
            )}
          </View>
          <Pressable
            style={styles.removePartnerBtn}
            onPress={() => {
              setPartnerSearchResult(null);
              setPartnerUsername("");
            }}
          >
            <Ionicons name="close-circle" size={24} color="#DC2626" />
          </Pressable>
        </View>
      )}

      {canRegisterWaiting && !partnerSearchResult && (
        <Pressable
          style={styles.waitingOptionBtn}
          onPress={() => {
            setPartnerSearchResult({ waiting: true });
            setPartnerUsername("");
          }}
        >
          <Ionicons name="time-outline" size={18} color="#6B7280" />
          <Text style={styles.waitingOptionText}>
            Đăng ký chờ ghép cặp (không có đối tác)
          </Text>
        </Pressable>
      )}
    </View>
  );

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
          <Text style={styles.headerTitle}>Đăng ký tham gia</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        {/* Tournament summary */}
        <View style={styles.tournamentInfo}>
          <Text style={styles.tournamentTitle}>{tournament.title}</Text>
          <Text style={styles.tournamentDate}>
            {formatDate(tournament.startTime)} • {tournament.locationText}
          </Text>
          <Text style={styles.tournamentType}>
            {tournament.gameType === "SINGLE"
              ? "Đơn"
              : tournament.gameType === "DOUBLE"
              ? "Đôi"
              : "Đôi hỗn hợp"}
          </Text>
        </View>

        <View style={styles.separator} />

        {/* Game type selection */}
        {renderGameTypeSelector()}

        <View style={styles.separator} />

        {/* Partner search for DOUBLE/MIXED */}
        {requiresPartner && renderPartnerSearch()}

        {/* Rating info */}
        {gameType === "SINGLE" && tournament.singleLimit && (
          <View style={styles.ratingInfo}>
            <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
            <Text style={styles.ratingInfoText}>
              Giới hạn rating đơn tối đa: {tournament.singleLimit}
            </Text>
          </View>
        )}

        {requiresPartner && tournament.doubleLimit && (
          <View style={styles.ratingInfo}>
            <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
            <Text style={styles.ratingInfoText}>
              Tổng rating cặp tối đa: {tournament.doubleLimit}
            </Text>
          </View>
        )}

        {/* Error message */}
        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Submit button */}
        <Pressable
          style={[
            styles.submitBtn,
            (submitting ||
              (requiresPartner && !partnerSearchResult) ||
              (gameType === "SINGLE" && tournament.singleLimit === 0) ||
              (requiresPartner && tournament.doubleLimit === 0)) &&
              styles.submitBtnDisabled,
          ]}
          onPress={handleSubmit}
          disabled={
            submitting ||
            (requiresPartner && !partnerSearchResult) ||
            (gameType === "SINGLE" && tournament.singleLimit === 0) ||
            (requiresPartner && tournament.doubleLimit === 0)
          }
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>
              {requiresPartner && partnerSearchResult?.waiting
                ? "Đăng ký chờ"
                : "Xác nhận đăng ký"}
            </Text>
          )}
        </Pressable>

        <Text style={styles.note}>
          * Bằng cách đăng ký, bạn đồng ý với thể lệ giải đấu.
        </Text>
      </ScrollView>
    </View>
  );
}