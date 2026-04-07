import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "./detailStyles";
import {
  getClubOverview,
  getClubMembers,
  getPendingClubMembers,
  approvePendingClubMember,
  rejectPendingClubMember,
  removeClubMember,
  updateClubMemberRole,
  updateClubChallengeMode,
} from "../../services/clubService";

const TABS = ["Chung", "Thành viên", "Chờ duyệt"];

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

function formatMemberRole(role) {
  if (!role) return "Thành viên";
  const r = String(role).toUpperCase();
  if (r === "OWNER") return "Trưởng nhóm";
  if (r === "VICE_OWNER") return "Phó nhóm";
  if (r === "MEMBER") return "Thành viên";
  return role;
}

function formatScore(score) {
  const n = Number(score || 0);
  return n % 1 === 0 ? n.toFixed(0) : n.toFixed(2).replace(/\.?0+$/, "");
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

function CommonTab({
  club,
  canManage,
  challengeLoading,
  onToggleChallengeMode,
}) {
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
  const allowChallenge = !!club?.allowChallenge;

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

      {canManage ? (
        <View style={styles.challengeCard}>
          <View style={styles.challengeHeaderRow}>
            <View style={styles.challengeTitleWrap}>
              <Text style={styles.challengeTitle}>Chế độ khiêu chiến</Text>
              <Text style={styles.challengeDesc}>
                Bật để CLB sẵn sàng nhận khiêu chiến từ CLB khác.
              </Text>
            </View>

            <View
              style={[
                styles.challengeBadge,
                allowChallenge
                  ? styles.challengeBadgeOn
                  : styles.challengeBadgeOff,
              ]}
            >
              <Text style={styles.challengeBadgeText}>
                {allowChallenge ? "Đang bật" : "Đang tắt"}
              </Text>
            </View>
          </View>

          <Pressable
            style={[
              styles.challengeBtn,
              allowChallenge
                ? styles.challengeBtnDisable
                : styles.challengeBtnEnable,
            ]}
            onPress={onToggleChallengeMode}
            disabled={challengeLoading}
          >
            {challengeLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons
                  name={
                    allowChallenge ? "close-circle-outline" : "flash-outline"
                  }
                  size={16}
                  color="#fff"
                />
                <Text style={styles.challengeBtnText}>
                  {allowChallenge ? "Tắt khiêu chiến" : "Bật khiêu chiến"}
                </Text>
              </>
            )}
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function MemberTable({
  items = [],
  query,
  onChangeQuery,
  emptyText,
  canManage = false,
  mode = "members",
  onApprove,
  onReject,
  onRemove,
  onToggleRole,
  actionLoadingKey,
  onPressMember,
}) {
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
      ) : null}

      {filteredItems.map((item, index) => {
        const avatarUrl = item.avatarUrl || "";
        const loadingApprove = actionLoadingKey === `approve-${item.userId}`;
        const loadingReject = actionLoadingKey === `reject-${item.userId}`;
        const loadingRemove = actionLoadingKey === `remove-${item.userId}`;
        const loadingRole = actionLoadingKey === `role-${item.userId}`;

        return (
          <View key={`${item.userId}-${index}`} style={styles.memberCard}>
            <Pressable
              style={styles.memberCardTop}
              onPress={() => onPressMember?.(item)}
            >
              <View style={styles.memberLeft}>
                <Text style={styles.memberIndexBadge}>{index + 1}</Text>

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
                    {item.fullName || "Chưa có tên"}
                  </Text>
                  <Text style={styles.memberRole}>
                    {formatMemberRole(item.memberRole)}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#9CA3AF"
                  style={styles.memberArrow}
                />
              </View>
            </Pressable>

            <View style={styles.memberStatsRow}>
              <View style={styles.memberStatBox}>
                <Text style={styles.memberStatLabel}>Điểm đơn</Text>
                <Text style={styles.memberStatValue}>
                  {formatScore(item.ratingSingle)}
                </Text>
              </View>

              <View style={styles.memberStatBox}>
                <Text style={styles.memberStatLabel}>Điểm đôi</Text>
                <Text style={styles.memberStatValue}>
                  {formatScore(item.ratingDouble)}
                </Text>
              </View>
            </View>

            {canManage ? (
              <View style={styles.memberActionRow}>
                {mode === "pending" ? (
                  <>
                    <Pressable
                      style={[styles.actionBtn, styles.actionBtnApprove]}
                      onPress={() => onApprove?.(item)}
                      disabled={loadingApprove}
                    >
                      {loadingApprove ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text style={styles.actionBtnText}>Duyệt</Text>
                      )}
                    </Pressable>

                    <Pressable
                      style={[styles.actionBtn, styles.actionBtnReject]}
                      onPress={() => onReject?.(item)}
                      disabled={loadingReject}
                    >
                      {loadingReject ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text style={styles.actionBtnText}>Từ chối</Text>
                      )}
                    </Pressable>
                  </>
                ) : (
                  <>
                    {String(item.memberRole).toUpperCase() !== "OWNER" ? (
                      <Pressable
                        style={[styles.actionBtn, styles.actionBtnReject]}
                        onPress={() => onRemove?.(item)}
                        disabled={loadingRemove}
                      >
                        {loadingRemove ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          <Text style={styles.actionBtnText}>Xóa</Text>
                        )}
                      </Pressable>
                    ) : null}
                  </>
                )}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

export default function ClubDetailScreen({ navigation, route }) {
  const clubId = route?.params?.clubId;
  const initialTab = route?.params?.initialTab || "Chung";

  const [activeTab, setActiveTab] = useState(initialTab);

  const [club, setClub] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [pendingMembers, setPendingMembers] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);

  const [memberQuery, setMemberQuery] = useState("");
  const [pendingQuery, setPendingQuery] = useState("");
  const [actionLoadingKey, setActionLoadingKey] = useState("");
  const [challengeLoading, setChallengeLoading] = useState(false);

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
        const code = error?.response?.status;
        if (code === 403) {
          setPendingMembers([]);
        } else {
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Không tải được danh sách chờ duyệt.";
          Alert.alert("Lỗi", msg);
        }
      } finally {
        setLoadingPending(false);
      }
    };

    fetchPendingMembers();
  }, [clubId, activeTab, pendingMembers.length]);

  const handlePressMember = (item) => {
    if (!item?.userId) return;

    navigation.navigate("MemberDetail", {
      userId: item.userId,
    });
  };

  const handleApprovePending = async (item) => {
    try {
      setActionLoadingKey(`approve-${item.userId}`);
      const res = await approvePendingClubMember(clubId, item.userId);

      setPendingMembers((prev) => prev.filter((x) => x.userId !== item.userId));

      setMembers((prev) => [
        ...prev,
        {
          ...item,
          memberRole: item.memberRole || "MEMBER",
        },
      ]);

      setClub((prev) => ({
        ...prev,
        membersCount: Number(prev?.membersCount || 0) + 1,
        pendingMembersCount: Math.max(
          Number(prev?.pendingMembersCount || 0) - 1,
          0,
        ),
      }));

      Alert.alert("Thành công", res?.message || "Duyệt thành viên thành công.");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể duyệt thành viên.";
      Alert.alert("Lỗi", msg);
    } finally {
      setActionLoadingKey("");
    }
  };

  const handleRejectPending = async (item) => {
    try {
      setActionLoadingKey(`reject-${item.userId}`);
      const res = await rejectPendingClubMember(clubId, item.userId);

      setPendingMembers((prev) => prev.filter((x) => x.userId !== item.userId));

      setClub((prev) => ({
        ...prev,
        pendingMembersCount: Math.max(
          Number(prev?.pendingMembersCount || 0) - 1,
          0,
        ),
      }));

      Alert.alert("Thành công", res?.message || "Đã từ chối yêu cầu.");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể từ chối thành viên.";
      Alert.alert("Lỗi", msg);
    } finally {
      setActionLoadingKey("");
    }
  };

  const handleRemoveMember = async (item) => {
    try {
      setActionLoadingKey(`remove-${item.userId}`);
      const res = await removeClubMember(clubId, item.userId);

      setMembers((prev) => prev.filter((x) => x.userId !== item.userId));

      setClub((prev) => ({
        ...prev,
        membersCount: Math.max(Number(prev?.membersCount || 0) - 1, 0),
      }));

      Alert.alert("Thành công", res?.message || "Đã xóa thành viên.");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể xóa thành viên.";
      Alert.alert("Lỗi", msg);
    } finally {
      setActionLoadingKey("");
    }
  };

  const handleToggleRole = async (item) => {
    try {
      setActionLoadingKey(`role-${item.userId}`);

      const currentRole = String(item.memberRole || "MEMBER").toUpperCase();
      const nextRole = currentRole === "VICE_OWNER" ? "MEMBER" : "VICE_OWNER";

      const res = await updateClubMemberRole(clubId, item.userId, nextRole);

      setMembers((prev) =>
        prev.map((x) =>
          x.userId === item.userId
            ? {
                ...x,
                memberRole: nextRole,
              }
            : x,
        ),
      );

      Alert.alert("Thành công", res?.message || "Đã cập nhật vai trò.");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể cập nhật vai trò.";
      Alert.alert("Lỗi", msg);
    } finally {
      setActionLoadingKey("");
    }
  };

  const handleToggleChallengeMode = async () => {
    try {
      const currentValue = !!club?.allowChallenge;
      const nextValue = !currentValue;

      setChallengeLoading(true);

      const res = await updateClubChallengeMode(clubId, nextValue);

      setClub((prev) => ({
        ...prev,
        allowChallenge:
          typeof res?.allowChallenge === "boolean"
            ? res.allowChallenge
            : nextValue,
      }));

      Alert.alert(
        "Thành công",
        res?.message || "Đã cập nhật chế độ khiêu chiến.",
      );
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể cập nhật chế độ khiêu chiến.";
      Alert.alert("Lỗi", msg);
    } finally {
      setChallengeLoading(false);
    }
  };

  const title = useMemo(() => club?.clubName || "Chi tiết CLB", [club]);
  const coverUrl = club?.coverUrl || "";
  const avatarUrl = club?.owner?.avatarUrl || "";
  const canManage = !!club?.canManage;

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: "#fff" }} edges={["top"]} />
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
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Ionicons name="people-outline" size={24} color="#6B7280" />
                </View>
              )}
            </View>
          </View>

          <View style={styles.tabsRow}>
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

          {activeTab === "Chung" && (
            <CommonTab
              club={club}
              canManage={canManage}
              challengeLoading={challengeLoading}
              onToggleChallengeMode={handleToggleChallengeMode}
            />
          )}

          {activeTab === "Thành viên" && (
            <>
              {loadingMembers ? (
                <View style={styles.loadingTabWrap}>
                  <ActivityIndicator />
                </View>
              ) : (
                <MemberTable
                  items={members}
                  query={memberQuery}
                  onChangeQuery={setMemberQuery}
                  emptyText="Chưa có thành viên"
                  canManage={canManage}
                  mode="members"
                  onRemove={handleRemoveMember}
                  onToggleRole={handleToggleRole}
                  actionLoadingKey={actionLoadingKey}
                  onPressMember={handlePressMember}
                />
              )}
            </>
          )}

          {activeTab === "Chờ duyệt" && (
            <>
              {!canManage ? (
                <View style={styles.emptyTabWrap}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={34}
                    color="#9CA3AF"
                  />
                  <Text style={styles.emptyTabText}>
                    Bạn không có quyền xem danh sách chờ duyệt
                  </Text>
                </View>
              ) : loadingPending ? (
                <View style={styles.loadingTabWrap}>
                  <ActivityIndicator />
                </View>
              ) : (
                <MemberTable
                  items={pendingMembers}
                  query={pendingQuery}
                  onChangeQuery={setPendingQuery}
                  emptyText="Không có thành viên chờ duyệt"
                  canManage={canManage}
                  mode="pending"
                  onApprove={handleApprovePending}
                  onReject={handleRejectPending}
                  actionLoadingKey={actionLoadingKey}
                  onPressMember={handlePressMember}
                />
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
