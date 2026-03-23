import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getRefereeDetail } from "../../services/refereeService";

function formatScore(v) {
  const n = Number(v || 0);
  return n % 1 === 0 ? `${n}` : n.toFixed(2).replace(/\.?0+$/, "");
}

function formatDate(value) {
  if (!value) return "—";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return String(value);
  }
}

function formatDateTime(value) {
  if (!value) return "—";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  } catch {
    return String(value);
  }
}

function htmlToPlainText(html = "") {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<li>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

function HtmlText({ html, emptyText = "Chưa cập nhật" }) {
  const plain = htmlToPlainText(html);

  if (!plain) {
    return (
      <Text style={{ fontSize: 15, color: "#9CA3AF", lineHeight: 22 }}>
        {emptyText}
      </Text>
    );
  }

  return (
    <Text style={{ fontSize: 15, color: "#374151", lineHeight: 23 }}>
      {plain}
    </Text>
  );
}

function SectionHeader({ title, isOpen, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: "#EEF2F7",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827" }}>
        {title}
      </Text>

      <Ionicons
        name={isOpen ? "chevron-up" : "chevron-forward"}
        size={20}
        color="#374151"
      />
    </Pressable>
  );
}

function EmptySection({ text }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: "#EEF2F7",
        padding: 16,
      }}
    >
      <Text style={{ color: "#6B7280" }}>{text}</Text>
    </View>
  );
}

function getAchievementLabel(item) {
  const type = String(item?.achievementType || "").toUpperCase();

  if (type === "FIRST") return "Giải Nhất";
  if (type === "SECOND") return "Giải Nhì";
  if (type === "THIRD") return "Giải Ba";

  return item?.achievementLabel || "Thành tích";
}

function getAchievementIcon(item) {
  const type = String(item?.achievementType || "").toUpperCase();

  if (type === "FIRST") return "trophy";
  if (type === "SECOND") return "medal";
  if (type === "THIRD") return "ribbon";

  return "award";
}

function getAchievementColor(item) {
  const type = String(item?.achievementType || "").toUpperCase();

  if (type === "FIRST") return "#F59E0B";
  if (type === "SECOND") return "#9CA3AF";
  if (type === "THIRD") return "#D97706";

  return "#2563EB";
}

export default function RefereeDetailScreen({ navigation, route }) {
  const refereeId = route?.params?.refereeId;

  const [loading, setLoading] = useState(true);
  const [referee, setReferee] = useState(null);

  const [openSections, setOpenSections] = useState({
    intro: true,
    workingArea: true,
    refereeAchievements: true,
    ratingHistory: false,
    userAchievements: true,
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getRefereeDetail(refereeId);
        setReferee(res);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "Không tải được thông tin trọng tài.";

        Alert.alert("Lỗi", String(msg), [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (refereeId) {
      fetchDetail();
    } else {
      setLoading(false);
    }
  }, [refereeId, navigation]);

  const ratingHistory = useMemo(() => {
    return Array.isArray(referee?.ratingHistory) ? referee.ratingHistory : [];
  }, [referee]);

  const userAchievements = useMemo(() => {
    return Array.isArray(referee?.userAchievements)
      ? referee.userAchievements
      : [];
  }, [referee]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderRatingHistory = () => {
    if (!ratingHistory.length) {
      return <EmptySection text="Chưa có lịch sử điểm trình" />;
    }

    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: "#EEF2F7",
          overflow: "hidden",
        }}
      >
        {ratingHistory.map((item, index) => (
          <View
            key={item?.ratingHistoryId || `rating-${index}`}
            style={{
              padding: 16,
              borderTopWidth: index === 0 ? 0 : 1,
              borderTopColor: "#F3F4F6",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "800",
                color: "#111827",
                marginBottom: 12,
              }}
            >
              {formatDateTime(item?.ratedAt)}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#6B7280", marginBottom: 4 }}>
                  Điểm đơn
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "800",
                    color: "#111827",
                  }}
                >
                  {item?.ratingSingle != null
                    ? Number(item.ratingSingle).toFixed(2)
                    : "0.00"}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: "#6B7280", marginBottom: 4 }}>
                  Điểm đôi
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "800",
                    color: "#111827",
                  }}
                >
                  {item?.ratingDouble != null
                    ? Number(item.ratingDouble).toFixed(2)
                    : "0.00"}
                </Text>
              </View>
            </View>

            <Text style={{ color: "#374151", marginBottom: 6, lineHeight: 20 }}>
              Người chấm:{" "}
              <Text style={{ fontWeight: "700" }}>
                {item?.ratedByName || "Hệ thống"}
              </Text>
            </Text>

            <Text style={{ color: "#4B5563", lineHeight: 21 }}>
              Ghi chú:{" "}
              <Text style={{ fontWeight: "700", color: "#111827" }}>
                {item?.note || "—"}
              </Text>
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderUserAchievements = () => {
    if (!userAchievements.length) {
      return <EmptySection text="Chưa có thành tích thi đấu" />;
    }

    return (
      <View
        style={{
          marginTop: 10,
        }}
      >
        {userAchievements.map((item, index) => {
          const title =
            item?.title ||
            item?.tournamentName ||
            item?.tournament?.title ||
            "Thành tích";

          const dateValue =
            item?.date ||
            item?.achievedAt ||
            item?.createdAt ||
            item?.tournament?.startTime;

          const canOpenTournament = !!item?.tournamentId;

          return (
            <Pressable
              key={item?.userAchievementId || `achievement-${index}`}
              disabled={!canOpenTournament}
              onPress={() =>
                navigation.navigate("TournamentDetail", {
                  tournamentId: item.tournamentId,
                  preview: item?.tournament || item,
                })
              }
              style={({ pressed }) => ({
                backgroundColor: "#fff",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#EEF2F7",
                paddingHorizontal: 14,
                paddingVertical: 14,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                opacity: pressed ? 0.92 : 1,
              })}
            >
              <View
                style={{
                  width: 30,
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons
                  name={getAchievementIcon(item)}
                  size={22}
                  color={getAchievementColor(item)}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "800",
                    color: "#1F2937",
                    lineHeight: 22,
                  }}
                >
                  {title}
                </Text>

                <Text
                  style={{
                    marginTop: 4,
                    color: "#6B7280",
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {getAchievementLabel(item)}
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    color: "#9CA3AF",
                    fontSize: 14,
                  }}
                >
                  {formatDate(dateValue)}
                </Text>
              </View>

              <Ionicons
                name={canOpenTournament ? "chevron-forward" : "trophy-outline"}
                size={18}
                color="#9CA3AF"
              />
            </Pressable>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (!referee) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Ionicons name="alert-circle-outline" size={54} color="#9CA3AF" />
        <Text
          style={{
            marginTop: 12,
            fontSize: 16,
            fontWeight: "700",
            color: "#111827",
          }}
        >
          Không tải được thông tin trọng tài
        </Text>

        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            marginTop: 18,
            backgroundColor: "#2563EB",
            paddingHorizontal: 18,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Quay lại</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
        }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            width: 32,
            height: 32,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </Pressable>

        <Text
          style={{
            marginLeft: 10,
            fontWeight: "700",
            fontSize: 18,
            color: "#111827",
          }}
        >
          Thông tin Trọng tài
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 1,
          }}
        >
          <View style={{ alignItems: "center" }}>
            {referee?.avatarUrl ? (
              <Image
                source={{ uri: referee.avatarUrl }}
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 55,
                }}
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={110}
                color="#2563EB"
              />
            )}

            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                marginTop: 12,
                color: "#111827",
                textAlign: "center",
              }}
            >
              {referee.fullName || "—"}
            </Text>

            <Text
              style={{
                color: referee.verified ? "#16A34A" : "#DC2626",
                marginTop: 6,
                fontWeight: "700",
              }}
            >
              {referee.verified
                ? "Hồ sơ trọng tài đã xác thực"
                : "Hồ sơ trọng tài chưa xác thực"}
            </Text>

            <Text
              style={{
                color: referee.userVerified ? "#16A34A" : "#DC2626",
                marginTop: 4,
                fontWeight: "600",
                fontSize: 13,
              }}
            >
              {referee.userVerified
                ? "Tài khoản người dùng đã xác thực"
                : "Tài khoản người dùng chưa xác thực"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
              backgroundColor: "#F8FAFC",
              borderRadius: 14,
              paddingVertical: 14,
              paddingHorizontal: 16,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#6B7280", marginBottom: 4 }}>
                Điểm đơn
              </Text>
              <Text
                style={{ fontWeight: "800", fontSize: 18, color: "#111827" }}
              >
                {formatScore(referee.levelSingle)}
              </Text>
            </View>

            <View
              style={{
                width: 1,
                backgroundColor: "#E5E7EB",
                marginHorizontal: 12,
              }}
            />

            <View style={{ flex: 1 }}>
              <Text style={{ color: "#6B7280", marginBottom: 4 }}>
                Điểm đôi
              </Text>
              <Text
                style={{ fontWeight: "800", fontSize: 18, color: "#111827" }}
              >
                {formatScore(referee.levelDouble)}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                marginTop: 10,
                color: "#6B7280",
                fontSize: 13,
              }}
            >
              Cập nhật điểm gần nhất: {formatDateTime(referee.ratingUpdatedAt)}
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
                Giới tính
              </Text>
              <Text
                style={{ fontSize: 15, color: "#111827", fontWeight: "600" }}
              >
                {referee.gender || "—"}
              </Text>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
                Tỉnh/Thành
              </Text>
              <Text
                style={{ fontSize: 15, color: "#111827", fontWeight: "600" }}
              >
                {referee.city || "—"}
              </Text>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
                Email
              </Text>
              <Text
                style={{ fontSize: 15, color: "#111827", fontWeight: "600" }}
              >
                {referee.email || "—"}
              </Text>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
                Số điện thoại
              </Text>
              <Text
                style={{ fontSize: 15, color: "#111827", fontWeight: "600" }}
              >
                {referee.phone || "—"}
              </Text>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
                Ngày sinh
              </Text>
              <Text
                style={{ fontSize: 15, color: "#111827", fontWeight: "600" }}
              >
                {formatDate(referee.birthOfDate)}
              </Text>
            </View>

            <View>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
                Giới thiệu cá nhân
              </Text>
              <Text style={{ fontSize: 15, color: "#4B5563", lineHeight: 22 }}>
                {referee.bio || "—"}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <SectionHeader
            title="Giới thiệu"
            isOpen={openSections.intro}
            onPress={() => toggleSection("intro")}
          />
          {openSections.intro ? (
            <View
              style={{
                backgroundColor: "#fff",
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                borderWidth: 1,
                borderTopWidth: 0,
                borderColor: "#EEF2F7",
                padding: 16,
              }}
            >
              <HtmlText html={referee.introduction} />
            </View>
          ) : null}
        </View>

        <View style={{ marginTop: 14 }}>
          <SectionHeader
            title="Khu vực làm việc"
            isOpen={openSections.workingArea}
            onPress={() => toggleSection("workingArea")}
          />
          {openSections.workingArea ? (
            <View
              style={{
                backgroundColor: "#fff",
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                borderWidth: 1,
                borderTopWidth: 0,
                borderColor: "#EEF2F7",
                padding: 16,
              }}
            >
              <HtmlText html={referee.workingArea} />
            </View>
          ) : null}
        </View>

        <View style={{ marginTop: 14 }}>
          <SectionHeader
            title="Thành tích / chứng chỉ trọng tài"
            isOpen={openSections.refereeAchievements}
            onPress={() => toggleSection("refereeAchievements")}
          />
          {openSections.refereeAchievements ? (
            <View
              style={{
                backgroundColor: "#fff",
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                borderWidth: 1,
                borderTopWidth: 0,
                borderColor: "#EEF2F7",
                padding: 16,
              }}
            >
              <HtmlText html={referee.achievements} />
            </View>
          ) : null}
        </View>

        <View style={{ marginTop: 14 }}>
          <SectionHeader
            title="Lịch sử điểm trình"
            isOpen={openSections.ratingHistory}
            onPress={() => toggleSection("ratingHistory")}
          />
          {openSections.ratingHistory ? renderRatingHistory() : null}
        </View>

        <View style={{ marginTop: 14 }}>
          <SectionHeader
            title="Thành tích thi đấu"
            isOpen={openSections.userAchievements}
            onPress={() => toggleSection("userAchievements")}
          />
          {openSections.userAchievements ? renderUserAchievements() : null}
        </View>
      </ScrollView>
    </View>
  );
}
