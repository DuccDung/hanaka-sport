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
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./detailStyles";
import {
  getClubOverview,
  getClubMembers,
  getPendingClubMembers,
} from "../../services/clubService";

const TABS = ["Chung", "Thành viên", "Sự kiện", "Chờ duyệt"];

function Stars({ value = 0 }) {
  const full = Math.round(Number(value || 0));
  return (
    <View style={styles.starsRow}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Ionicons
          key={i}
          name={i < full ? "star" : "star-outline"}
          size={16}
          color="#9CA3AF"
        />
      ))}
    </View>
  );
}

function StatTop({ label, value, align = "left" }) {
  return (
    <View
      style={[
        styles.statTopBox,
        align === "right" && { alignItems: "flex-end" },
      ]}
    >
      <Text style={styles.statTopLabel}>{label}</Text>
      <Text style={styles.statTopValue}>{value}</Text>
    </View>
  );
}

function MatchSummary({ win, draw, loss }) {
  return (
    <View style={styles.matchSummaryWrap}>
      <View style={styles.matchSummaryRow}>
        <Text style={styles.matchSummaryText}>Thắng {win}</Text>
        <Text style={styles.matchSummaryText}>Hoà {draw}</Text>
        <Text style={styles.matchSummaryText}>Thua {loss}</Text>
      </View>

      <View style={styles.matchBarTrack}>
        <View style={[styles.matchBarWin, { flex: Math.max(win, 0.2) }]} />
        <View style={[styles.matchBarDraw, { flex: Math.max(draw, 0.2) }]} />
        <View style={[styles.matchBarLoss, { flex: Math.max(loss, 0.2) }]} />
      </View>
    </View>
  );
}

function CommonTab({ club }) {
  const foundedDate = club?.overview?.foundedAt
    ? new Date(club.overview.foundedAt).toLocaleDateString("vi-VN")
    : "01/10/2021";

  const address =
    club?.overview?.addressText || club?.areaText || "Chưa có địa chỉ";
  const membersCount = club?.membersCount ?? 0;
  const description =
    club?.overview?.introduction ||
    `CLB ${club?.clubName || ""} đang hoạt động tại ${address}.`;

  const level = Number(club?.overview?.level ?? club?.ratingAvg ?? 1.5);
  const reviewsCount = Number(club?.reviewsCount ?? 0);

  return (
    <View style={styles.tabContent}>
      <View style={styles.overviewWrap}>
        <StatTop label="Điểm giao lưu:" value="-" />
        <StatTop
          label="Số trận thi đấu:"
          value={club?.matchesPlayed ?? 0}
          align="right"
        />
      </View>

      <MatchSummary
        win={Number(club?.matchesWin ?? 0)}
        draw={Number(club?.matchesDraw ?? 0)}
        loss={Number(club?.matchesLoss ?? 0)}
      />

      <View style={styles.levelRow}>
        <Text style={styles.levelText}>Điểm trình: {level.toFixed(1)}</Text>
      </View>

      <View style={styles.reviewRow}>
        <Text style={styles.reviewLabel}>Đánh giá: {level.toFixed(1)}</Text>
        <Stars value={Math.min(level, 5)} />
        <Text style={styles.reviewLabel}>({reviewsCount} Đánh giá)</Text>
      </View>

      <Text style={styles.sectionTitle}>Thông Tin Chung</Text>

      <View style={styles.descCard}>
        <Text style={styles.descText}>{description}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.infoLine}>
          Ngày thành lập: <Text style={styles.infoBold}>{foundedDate}</Text>
        </Text>

        <Text style={styles.infoLine}>
          Địa chỉ: <Text style={styles.infoBold}>{address}</Text>
        </Text>

        <Text style={styles.infoLine}>
          Tổng số thành viên:{" "}
          <Text style={styles.infoBold}>{membersCount}</Text>
        </Text>

        <Text style={styles.infoLine}>
          Thành viên chờ duyệt:{" "}
          <Text style={styles.infoBold}>{club?.pendingMembersCount ?? 0}</Text>
        </Text>
      </View>
    </View>
  );
}

function MemberListTab({ items = [], query, onChangeQuery, emptyText }) {
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) =>
      `${item.fullName || ""} ${item.memberRole || ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [items, query]);

  return (
    <View style={styles.memberTabWrap}>
      <View style={styles.searchMemberBox}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" />
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Nickname..."
          placeholderTextColor="#C4C4C4"
          style={styles.searchMemberInput}
        />
      </View>

      <View style={styles.memberHeaderRow}>
        <Text style={[styles.memberHeaderText, styles.colIndex]}>STT</Text>
        <Text style={[styles.memberHeaderText, styles.colMember]}>
          Thành Viên
        </Text>
        <Text style={[styles.memberHeaderText, styles.colScore]}>Điểm đơn</Text>
        <Text style={[styles.memberHeaderText, styles.colScore]}>Điểm đôi</Text>
      </View>

      {filteredItems.length === 0 ? (
        <View style={styles.memberEmptyWrap}>
          <Text style={styles.memberEmptyText}>{emptyText}</Text>
        </View>
      ) : (
        filteredItems.map((item, index) => {
          const avatarUrl = item.avatarUrl || "";
          const single = Number(item.ratingSingle || 0);
          const double = Number(item.ratingDouble || 0);

          return (
            <View
              key={`${item.userId}-${index}`}
              style={[styles.memberRow, index % 2 === 1 && styles.memberRowAlt]}
            >
              <Text style={[styles.memberIndexText, styles.colIndex]}>
                {index + 1}
              </Text>

              <View style={[styles.memberInfoCell, styles.colMember]}>
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    style={styles.memberAvatar}
                  />
                ) : (
                  <View style={styles.memberAvatarFallback}>
                    <Ionicons name="person-outline" size={16} color="#9CA3AF" />
                  </View>
                )}

                <View style={styles.memberNameBlock}>
                  <Text style={styles.memberName} numberOfLines={2}>
                    {item.fullName}
                  </Text>
                  <Text style={styles.memberRole}>
                    {formatMemberRole(item.memberRole)}
                  </Text>
                </View>
              </View>

              <Text style={[styles.memberScoreText, styles.colScore]}>
                {single % 1 === 0
                  ? single.toFixed(0)
                  : single.toFixed(2).replace(/\.?0+$/, "")}
              </Text>

              <Text style={[styles.memberScoreText, styles.colScore]}>
                {double % 1 === 0
                  ? double.toFixed(0)
                  : double.toFixed(2).replace(/\.?0+$/, "")}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );
}

function formatMemberRole(role) {
  if (!role) return "Thành viên";

  const r = String(role).toUpperCase();

  if (r === "OWNER") return "Trưởng nhóm";
  if (r === "VICE_OWNER" || r === "VICE") return "Phó nhóm";
  if (r === "RESERVE") return "Dự bị";
  if (r === "MEMBER") return "Thành viên";

  return role;
}

export default function ClubDetailScreen({ navigation, route }) {
  const clubId = route?.params?.clubId;

  const [activeTab, setActiveTab] = useState("Chung");

  const [club, setClub] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [pendingMembers, setPendingMembers] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);

  const [memberQuery, setMemberQuery] = useState("");
  const [pendingQuery, setPendingQuery] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      if (!clubId) return;

      try {
        setLoadingOverview(true);
        const res = await getClubOverview(clubId);
        setClub(res);
      } catch (error) {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Không tải được chi tiết CLB.";
        Alert.alert("Lỗi", msg);
      } finally {
        setLoadingOverview(false);
      }
    };

    fetchOverview();
  }, [clubId]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!clubId || activeTab !== "Thành viên" || members.length > 0) return;

      try {
        setLoadingMembers(true);
        const res = await getClubMembers({
          clubId,
          page: 1,
          pageSize: 100,
        });
        setMembers(res?.items || []);
      } catch (error) {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Không tải được danh sách thành viên.";
        Alert.alert("Lỗi", msg);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [clubId, activeTab, members.length]);

  useEffect(() => {
    const fetchPendingMembers = async () => {
      if (!clubId || activeTab !== "Chờ duyệt" || pendingMembers.length > 0) {
        return;
      }

      try {
        setLoadingPending(true);
        const res = await getPendingClubMembers({
          clubId,
          page: 1,
          pageSize: 100,
        });
        setPendingMembers(res?.items || []);
      } catch (error) {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Không tải được danh sách chờ duyệt.";
        Alert.alert("Lỗi", msg);
      } finally {
        setLoadingPending(false);
      }
    };

    fetchPendingMembers();
  }, [clubId, activeTab, pendingMembers.length]);

  const title = useMemo(() => club?.clubName || "Chi tiết CLB", [club]);
  const coverUrl = club?.coverUrl || "";
  const avatarUrl = club?.owner?.avatarUrl || "";

  const showHeroImage = activeTab !== "Chờ duyệt";

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.headerIconBtn}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={22} color="#1E2430" />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.headerActions}>
          <Pressable style={styles.headerIconBtn} hitSlop={10}>
            <Ionicons name="share-social-outline" size={20} color="#1E2430" />
          </Pressable>

          <Pressable style={styles.headerIconBtn} hitSlop={10}>
            <Ionicons name="settings-outline" size={20} color="#1E2430" />
          </Pressable>
        </View>
      </View>

      {loadingOverview ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {showHeroImage ? (
            <View style={styles.heroWrap}>
              {coverUrl ? (
                <Image source={{ uri: coverUrl }} style={styles.heroImage} />
              ) : (
                <View style={[styles.heroImage, styles.heroFallback]}>
                  <Ionicons name="image-outline" size={34} color="#9CA3AF" />
                </View>
              )}

              <View style={styles.avatarFloating}>
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Ionicons name="people-outline" size={24} color="#6B7280" />
                  </View>
                )}
              </View>
            </View>
          ) : null}

          <View
            style={[styles.tabsRow, !showHeroImage && styles.tabsRowNoHero]}
          >
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  style={styles.tabBtn}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[styles.tabText, active && styles.tabTextActive]}
                  >
                    {tab}
                  </Text>
                  {active ? <View style={styles.tabUnderline} /> : null}
                </Pressable>
              );
            })}
          </View>

          {activeTab === "Chung" && <CommonTab club={club} />}

          {activeTab === "Thành viên" && (
            <>
              {loadingMembers ? (
                <View style={styles.loadingTabWrap}>
                  <ActivityIndicator />
                </View>
              ) : (
                <MemberListTab
                  items={members}
                  query={memberQuery}
                  onChangeQuery={setMemberQuery}
                  emptyText="Chưa có thành viên"
                />
              )}
            </>
          )}
          {activeTab === "Chờ duyệt" && (
            <>
              {loadingPending ? (
                <View style={styles.loadingTabWrap}>
                  <ActivityIndicator />
                </View>
              ) : (
                <MemberListTab
                  items={pendingMembers}
                  query={pendingQuery}
                  onChangeQuery={setPendingQuery}
                  emptyText="Không có thành viên chờ duyệt"
                />
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
