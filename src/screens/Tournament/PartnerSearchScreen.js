// src/screens/Tournament/PartnerSearchScreen.js
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./partnerSearchStyles";

import { searchPartner } from "../../services/tournamentService";
import { createPairRequest } from "../../services/tournamentService";

function getInitial(name = "") {
  const s = String(name || "").trim();
  if (!s) return "?";
  const parts = s.split(/\s+/);
  const last = parts[parts.length - 1] || s;
  return last[0]?.toUpperCase() || "?";
}

function AvatarCircle({ uri, name, size = 44 }) {
  const initial = getInitial(name);
  const showImage = uri && (uri.startsWith("http://") || uri.startsWith("https://"));

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E5E7EB",
      }}
    >
      {showImage ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={{
            fontSize: size * 0.42,
            fontWeight: "700",
            color: "#374151",
          }}
        >
          {initial}
        </Text>
      )}
    </View>
  );
}

export default function PartnerSearchScreen({ navigation, route }) {
  const tournamentId = route?.params?.tournamentId;

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [results, setResults] = useState([]);

  const debounceTimer = useRef(null);

  // Debounced search
  const debouncedSearch = useCallback((text) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      const trimmed = text.trim();
      if (trimmed.length < 2) {
        setResults([]);
        setErrorMsg("");
        return;
      }

      try {
        setLoading(true);
        setErrorMsg("");
        const data = await searchPartner(tournamentId, trimmed, 10);
        setResults(data?.items || data || []);
      } catch (e) {
        setErrorMsg(
          e?.response?.data?.message ||
            e?.message ||
            "Tìm kiếm thất bại."
        );
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [tournamentId]);

  const handleQueryChange = useCallback((text) => {
    setQuery(text);
    debouncedSearch(text);
  }, [debouncedSearch]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleInvite = useCallback((user) => {
    if (!user?.userId) return;

    Alert.alert(
      "Mời ghép cặp",
      `Bạn có muốn gửi lời mời ghép cặp cho "${user.fullName}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Gửi lời mời",
          onPress: async () => {
            try {
              setSubmitting(true);
              await createPairRequest(tournamentId, {
                requestedToUserId: user.userId,
                message: "",
              });
              Alert.alert("Thành công", "Đã gửi lời mời ghép cặp!", [
                {
                  text: "OK",
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ]);
            } catch (e) {
              const msg =
                e?.response?.data?.message ||
                e?.message ||
                "Gửi lời mời thất bại.";
              Alert.alert("Lỗi", msg);
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  }, [tournamentId, navigation]);

  const renderItem = ({ item }) => {
    const canInvite = item.canInvite && !submitting;
    const statusText = item.isRegistered
      ? "Đã đăng ký"
      : item.isBlocked
      ? "Đã chặn"
      : item.isWaiting
      ? "Đang chờ"
      : "";

    return (
      <View style={styles.resultItem}>
        <AvatarCircle uri={item.avatarUrl} name={item.fullName} size={50} />
        <View style={styles.resultInfo}>
          <Text style={styles.userName}>{item.fullName}</Text>
          <Text style={styles.userRating}>
            Rating đôi: {item.ratingDouble || "N/A"}
          </Text>
          {item.verified ? (
            <Text style={styles.verifiedText}>Đã xác thực</Text>
          ) : null}
          {statusText ? (
            <Text style={styles.statusText}>{statusText}</Text>
          ) : null}
        </View>
        {canInvite ? (
          <Pressable
            style={styles.inviteButton}
            onPress={() => handleInvite(item)}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="person-add-outline" size={16} color="#fff" />
                <Text style={styles.inviteButtonText}>Mời</Text>
              </>
            )}
          </Pressable>
        ) : (
          <View style={styles.disabledBadge}>
            <Text style={styles.disabledBadgeText}>
              {item.isBlocked ? "Chặn" : statusText || "Không thể mời"}
            </Text>
          </View>
        )}
      </View>
    );
  };

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
          <Text style={styles.headerTitle}>Tìm đối tác</Text>
        </View>
      </View>

      {/* Search box */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            value={query}
            onChangeText={handleQueryChange}
            placeholder="Nhập tên, SĐT, email để tìm..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            returnKeyType="search"
            autoFocus
          />
          {loading ? (
            <ActivityIndicator size="small" color="#9CA3AF" />
          ) : null}
        </View>
        <Text style={styles.hintText}>
          Nhập ít nhất 2 ký tự để tìm kiếm
        </Text>
      </View>

      {/* Error message */}
      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {/* Results list */}
      <FlatList
        data={results}
        keyExtractor={(item) => String(item.userId || item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          if (loading) return null;
          if (query.trim().length < 2) return null;
          return (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                {errorMsg ? "" : "Không tìm thấy người chơi phù hợp."}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}
