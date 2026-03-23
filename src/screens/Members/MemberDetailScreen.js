import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  Pressable,
  Linking,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import {
  getUserDetail,
  getUserRatingHistory,
  getUserAchievements,
  getUserMatchVideos,
} from "../../services/userService";

export default function MemberDetailScreen({ route, navigation }) {
  const { userId } = route.params;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [matchLoadingMore, setMatchLoadingMore] = useState(false);
  const [matchPage, setMatchPage] = useState(1);
  const [matchHasMore, setMatchHasMore] = useState(false);

  const [openSections, setOpenSections] = useState({
    matchHistory: false,
    ratingHistory: false,
    achievements: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [detailRes, ratingHistoryRes, achievementsRes, matchVideosRes] =
          await Promise.all([
            getUserDetail(userId),
            getUserRatingHistory(userId),
            getUserAchievements(userId),
            getUserMatchVideos(userId, { page: 1, pageSize: 10 }),
          ]);

        const ratingHistoryItems = Array.isArray(ratingHistoryRes?.items)
          ? ratingHistoryRes.items
          : [];

        const achievementItems = Array.isArray(achievementsRes?.items)
          ? achievementsRes.items
          : [];

        const matchItems = Array.isArray(matchVideosRes?.items)
          ? matchVideosRes.items
          : [];

        setMatchPage(matchVideosRes?.page || 1);
        setMatchHasMore(!!matchVideosRes?.hasMore);

        setUser({
          ...detailRes,
          ratingHistory: ratingHistoryItems,
          matchHistory: matchItems,
          achievements: achievementItems,
        });
      } catch (error) {
        console.log(
          "Load member detail error:",
          error?.response?.data || error?.message || error,
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const callUser = () => {
    if (!user?.phone) return;
    Linking.openURL(`tel:${user.phone}`);
  };

  const smsUser = () => {
    if (!user?.phone) return;
    Linking.openURL(`sms:${user.phone}`);
  };

  const loadMoreMatches = async () => {
    if (matchLoadingMore || !matchHasMore) return;

    try {
      setMatchLoadingMore(true);
      const nextPage = matchPage + 1;
      const res = await getUserMatchVideos(userId, {
        page: nextPage,
        pageSize: 10,
      });

      const newItems = Array.isArray(res?.items) ? res.items : [];

      setUser((prev) => ({
        ...prev,
        matchHistory: [...(prev?.matchHistory || []), ...newItems],
      }));

      setMatchPage(res?.page || nextPage);
      setMatchHasMore(!!res?.hasMore);
    } catch (error) {
      console.log(
        "Load more match videos error:",
        error?.response?.data || error?.message || error,
      );
    } finally {
      setMatchLoadingMore(false);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "—";
    try {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const yyyy = date.getFullYear();
      const hh = String(date.getHours()).padStart(2, "0");
      const min = String(date.getMinutes()).padStart(2, "0");
      return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    } catch {
      return value;
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";
    try {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const yyyy = date.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch {
      return value;
    }
  };

  const matchHistory = useMemo(() => {
    return Array.isArray(user?.matchHistory) ? user.matchHistory : [];
  }, [user]);

  const ratingHistory = useMemo(() => {
    return Array.isArray(user?.ratingHistory) ? user.ratingHistory : [];
  }, [user]);

  const achievements = useMemo(() => {
    return Array.isArray(user?.achievements) ? user.achievements : [];
  }, [user]);

  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
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
          Không tải được thông tin thành viên
        </Text>

        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            marginTop: 18,
            backgroundColor: COLORS.BLUE,
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

  const hasAvatar = !!user.avatarUrl;

  const renderSectionHeader = (title, sectionKey) => {
    const isOpen = openSections[sectionKey];

    return (
      <Pressable
        onPress={() => toggleSection(sectionKey)}
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 18,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: "#F1F5F9",
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 1,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}>
          {title}
        </Text>

        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-forward"}
          size={20}
          color="#374151"
        />
      </Pressable>
    );
  };

  const renderEmpty = (text = "Chưa có dữ liệu") => (
    <View
      style={{
        backgroundColor: "#fff",
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: "#F1F5F9",
      }}
    >
      <Text style={{ color: "#6B7280" }}>{text}</Text>
    </View>
  );
  const normalizeText = (value) =>
    String(value || "")
      .trim()
      .toLowerCase();

  const getViewedMemberRegistrationLabel = (item) => {
    const fullName = normalizeText(user?.fullName);
    if (!fullName) return null;

    const team1P1 = normalizeText(item?.team1Player1Name);
    const team1P2 = normalizeText(item?.team1Player2Name);
    const team2P1 = normalizeText(item?.team2Player1Name);
    const team2P2 = normalizeText(item?.team2Player2Name);

    if (fullName === team1P1 || fullName === team1P2) {
      return item?.team1Name || "Đội 1";
    }

    if (fullName === team2P1 || fullName === team2P2) {
      return item?.team2Name || "Đội 2";
    }

    return null;
  };
  const renderMatchHistory = () => {
    if (!matchHistory.length) return renderEmpty("Chưa có lịch sử thi đấu");

    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: "#F1F5F9",
          overflow: "hidden",
        }}
      >
        {matchHistory.map((item, index) => {
          const team1Players = [
            {
              name: item?.team1Player1Name,
              avatarUrl: item?.team1Player1Avatar,
            },
            item?.team1Player2Name
              ? {
                  name: item?.team1Player2Name,
                  avatarUrl: item?.team1Player2Avatar,
                }
              : null,
          ].filter(Boolean);

          const team2Players = [
            {
              name: item?.team2Player1Name,
              avatarUrl: item?.team2Player1Avatar,
            },
            item?.team2Player2Name
              ? {
                  name: item?.team2Player2Name,
                  avatarUrl: item?.team2Player2Avatar,
                }
              : null,
          ].filter(Boolean);

          const memberRegisteredAs = getViewedMemberRegistrationLabel(item);

          const openTournament = () => {
            if (!item?.tournamentId) return;
            navigation.navigate("TournamentDetail", {
              tournamentId: item.tournamentId,
              preview: {
                tournamentId: item.tournamentId,
                title: item.tournamentTitle,
                bannerUrl: item.tournamentBannerUrl,
                startTime: item.startAt,
                status: item.tournamentStatus,
              },
            });
          };

          return (
            <View
              key={item?.matchId || `match-${index}`}
              style={{
                padding: 16,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: "#F3F4F6",
              }}
            >
              <Pressable onPress={openTournament}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "800",
                    color: "#1F2937",
                    marginBottom: 4,
                  }}
                >
                  {formatDateTime(item?.startAt || item?.createdAt)}
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: "#374151",
                    marginBottom: 8,
                    lineHeight: 20,
                  }}
                >
                  {item?.tournamentTitle || "Trận đấu"}
                  {item?.roundLabel ? ` - ${item.roundLabel}` : ""}
                  {item?.groupName ? ` - ${item.groupName}` : ""}
                </Text>

                {memberRegisteredAs ? (
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.BLUE,
                      fontWeight: "700",
                      marginBottom: 14,
                    }}
                  >
                    Đăng ký thi đấu với tên đội: {memberRegisteredAs}
                  </Text>
                ) : null}
              </Pressable>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: "#6B7280",
                      marginBottom: 4,
                    }}
                  >
                    Tên đăng ký: {item?.team1Name || "Đội 1"}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      color: "#9CA3AF",
                      marginBottom: 10,
                    }}
                  >
                    Mã đội: #{item?.team1RegistrationId || "—"}
                  </Text>

                  {team1Players.length ? (
                    team1Players.map((player, pIndex) => (
                      <View
                        key={`a-${pIndex}`}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        {player?.avatarUrl ? (
                          <Image
                            source={{ uri: player.avatarUrl }}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              marginRight: 10,
                            }}
                          />
                        ) : (
                          <View
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              marginRight: 10,
                              backgroundColor: "#E5E7EB",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ionicons name="person" size={18} color="#6B7280" />
                          </View>
                        )}

                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: "#374151",
                            }}
                          >
                            {player?.name || "—"}
                          </Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={{ color: "#6B7280" }}>
                      Không có dữ liệu đội 1
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    width: 72,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "800",
                      color: "#111827",
                    }}
                  >
                    {item?.scoreTeam1 ?? 0} - {item?.scoreTeam2 ?? 0}
                  </Text>

                  {item?.winnerSide ? (
                    <Text
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        color: "#16A34A",
                        fontWeight: "700",
                      }}
                    ></Text>
                  ) : (
                    <Text
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        color: "#9CA3AF",
                        fontWeight: "700",
                      }}
                    >
                      {item?.isCompleted ? "Kết thúc" : "Chưa xong"}
                    </Text>
                  )}
                </View>

                <View style={{ flex: 1, paddingLeft: 8 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: "#6B7280",
                      marginBottom: 4,
                      textAlign: "right",
                    }}
                  >
                    Tên đăng ký: {item?.team2Name || "Đội 2"}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      color: "#9CA3AF",
                      marginBottom: 10,
                      textAlign: "right",
                    }}
                  >
                    Mã đội: #{item?.team2RegistrationId || "—"}
                  </Text>

                  {team2Players.length ? (
                    team2Players.map((player, pIndex) => (
                      <View
                        key={`b-${pIndex}`}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          marginBottom: 12,
                        }}
                      >
                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: "#374151",
                              textAlign: "right",
                            }}
                          >
                            {player?.name || "—"}
                          </Text>
                        </View>

                        {player?.avatarUrl ? (
                          <Image
                            source={{ uri: player.avatarUrl }}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              marginLeft: 10,
                            }}
                          />
                        ) : (
                          <View
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              marginLeft: 10,
                              backgroundColor: "#E5E7EB",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ionicons name="person" size={18} color="#6B7280" />
                          </View>
                        )}
                      </View>
                    ))
                  ) : (
                    <Text style={{ color: "#6B7280", textAlign: "right" }}>
                      Không có dữ liệu đội 2
                    </Text>
                  )}
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#6B7280", fontSize: 13 }}>
                    {item?.courtText || item?.addressText || "—"}
                  </Text>
                </View>

                {item?.videoUrl ? (
                  <Pressable
                    onPress={() => Linking.openURL(item.videoUrl)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#EEF2FF",
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 10,
                    }}
                  >
                    <Ionicons
                      name="play-circle"
                      size={18}
                      color={COLORS.BLUE}
                    />
                    <Text
                      style={{
                        marginLeft: 6,
                        color: COLORS.BLUE,
                        fontWeight: "700",
                      }}
                    >
                      Xem video
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          );
        })}

        {matchHasMore ? (
          <View
            style={{
              paddingHorizontal: 16,
              paddingBottom: 16,
            }}
          >
            <Pressable
              onPress={loadMoreMatches}
              disabled={matchLoadingMore}
              style={{
                backgroundColor: "#EFF6FF",
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              {matchLoadingMore ? (
                <ActivityIndicator size="small" color={COLORS.BLUE} />
              ) : (
                <Text
                  style={{
                    color: COLORS.BLUE,
                    fontWeight: "700",
                    fontSize: 14,
                  }}
                >
                  Xem tiếp
                </Text>
              )}
            </Pressable>
          </View>
        ) : null}
      </View>
    );
  };

  const renderRatingHistory = () => {
    if (!ratingHistory.length) return renderEmpty("Chưa có lịch sử điểm trình");

    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: "#F1F5F9",
          overflow: "hidden",
        }}
      >
        {ratingHistory.map((item, index) => (
          <View
            key={item?.ratingHistoryId || item?.id || `rating-${index}`}
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
                color: "#1F2937",
                marginBottom: 14,
              }}
            >
              {formatDateTime(item?.ratedAt || item?.createdAt || item?.date)}
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
                  style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}
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
                  style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}
                >
                  {item?.ratingDouble != null
                    ? Number(item.ratingDouble).toFixed(2)
                    : "0.00"}
                </Text>
              </View>
            </View>

            <Text
              style={{
                color: "#374151",
                marginBottom: 6,
                lineHeight: 20,
              }}
            >
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

  const getAchievementLabel = (item) => {
    const type = (item?.achievementType || "").toUpperCase();
    if (type === "FIRST") return "Giải Nhất";
    if (type === "SECOND") return "Giải Nhì";
    if (type === "THIRD") return "Giải Ba";
    return item?.achievementLabel || "Thành tích";
  };

  const getAchievementIcon = (item) => {
    const type = (item?.achievementType || "").toUpperCase();
    if (type === "FIRST") return "trophy";
    if (type === "SECOND") return "medal";
    if (type === "THIRD") return "ribbon";
    return "award";
  };

  const getAchievementColor = (item) => {
    const type = (item?.achievementType || "").toUpperCase();
    if (type === "FIRST") return "#F59E0B";
    if (type === "SECOND") return "#9CA3AF";
    if (type === "THIRD") return "#D97706";
    return "#F59E0B";
  };

  const renderAchievementCard = (item, index) => {
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

    return (
      <Pressable
        key={item?.userAchievementId || item?.id || `achievement-${index}`}
        onPress={() =>
          navigation.navigate("TournamentDetail", {
            tournamentId: item.tournamentId,
            preview: item,
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

        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </Pressable>
    );
  };

  const renderAchievements = () => {
    if (!achievements.length) return renderEmpty("Chưa có thành tích");

    return (
      <View
        style={{
          marginTop: 10,
        }}
      >
        {achievements.map(renderAchievementCard)}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" />

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
          Thông tin thành viên
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
            {hasAvatar ? (
              <Image
                source={{ uri: user.avatarUrl }}
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
                color={COLORS.BLUE}
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
              {user.fullName || "—"}
            </Text>

            <Text
              style={{
                color: user.verified ? "#16A34A" : "#DC2626",
                marginTop: 6,
                fontWeight: "600",
              }}
            >
              {user.verified ? "Đã xác thực" : "Chưa xác thực"}
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
                {user.ratingSingle != null
                  ? Number(user.ratingSingle).toFixed(2)
                  : "0.00"}
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
                {user.ratingDouble != null
                  ? Number(user.ratingDouble).toFixed(2)
                  : "0.00"}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
                Giới tính
              </Text>
              <Text
                style={{ fontSize: 15, color: "#111827", fontWeight: "600" }}
              >
                {user.gender || "—"}
              </Text>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
                Tỉnh/Thành
              </Text>
              <Text
                style={{ fontSize: 15, color: "#111827", fontWeight: "600" }}
              >
                {user.city || "—"}
              </Text>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
                Email
              </Text>
              <Text
                style={{ fontSize: 15, color: "#111827", fontWeight: "600" }}
              >
                {user.email || "—"}
              </Text>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
                Số điện thoại
              </Text>
              <Text
                style={{ fontSize: 15, color: "#111827", fontWeight: "600" }}
              >
                {user.phone || "—"}
              </Text>
            </View>

            <View>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
                Giới thiệu
              </Text>
              <Text style={{ fontSize: 15, color: "#4B5563", lineHeight: 22 }}>
                {user.bio || "—"}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 24 }}>
            <Pressable
              onPress={callUser}
              disabled={!user?.phone}
              style={{
                backgroundColor: user?.phone ? "#16A34A" : "#D1D5DB",
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                Gọi điện
              </Text>
            </Pressable>

            <Pressable
              onPress={smsUser}
              disabled={!user?.phone}
              style={{
                backgroundColor: user?.phone ? COLORS.BLUE : "#D1D5DB",
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                Nhắn tin
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          {renderSectionHeader("Lịch sử thi đấu", "matchHistory")}
          {openSections.matchHistory ? renderMatchHistory() : null}
        </View>

        <View style={{ marginTop: 14 }}>
          {renderSectionHeader("Lịch sử điểm trình", "ratingHistory")}
          {openSections.ratingHistory ? renderRatingHistory() : null}
        </View>

        <View style={{ marginTop: 14 }}>
          {renderSectionHeader("Thành tích", "achievements")}
          {openSections.achievements ? renderAchievements() : null}
        </View>
      </ScrollView>
    </View>
  );
}
