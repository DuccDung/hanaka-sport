import React, { useCallback, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import CommunityTermsCard from "../../components/CommunityTermsCard";
import {
  COMMUNITY_MODERATION_COMMITMENTS,
  COMMUNITY_PRIVACY_URL,
  COMMUNITY_SUPPORT_EMAIL,
  COMMUNITY_SUPPORT_URL,
} from "../../constants/communitySafety";
import {
  acceptCommunityTerms,
  getBlockedUsers,
  getCommunityReports,
  getCommunityReasonLabel,
  getCommunityTermsState,
  unblockCommunityUser,
} from "../../services/communitySafetyService";
import { styles } from "./communitySafetyStyles";

function openExternalUrl(url) {
  if (!url) return;
  Linking.openURL(url).catch((error) => {
    console.log("openExternalUrl error", error?.message);
  });
}

export default function CommunitySafetyScreen({ navigation }) {
  const [termsState, setTermsState] = useState({
    accepted: false,
    acceptedAt: null,
  });
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [reports, setReports] = useState([]);

  const loadData = useCallback(async () => {
    const [nextTermsState, nextBlockedUsers, nextReports] = await Promise.all([
      getCommunityTermsState(),
      getBlockedUsers(),
      getCommunityReports({ limit: 10 }),
    ]);

    setTermsState(nextTermsState);
    setBlockedUsers(nextBlockedUsers);
    setReports(nextReports);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const onAcceptTerms = useCallback(async () => {
    const nextState = await acceptCommunityTerms({
      source: "community_safety_screen",
    });

    setTermsState(nextState);

    Alert.alert(
      "Đã ghi nhận",
      "Bạn đã đồng ý Điều khoản sử dụng và có thể truy cập khu vực chat cộng đồng.",
    );
  }, []);

  const onUnblockUser = useCallback(async (item) => {
    await unblockCommunityUser(item?.userId);
    const nextUsers = await getBlockedUsers();
    setBlockedUsers(nextUsers);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </Pressable>

        <Text style={styles.headerTitle}>An toàn cộng đồng</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>An toàn chat</Text>
          </View>

          <Text style={styles.heroTitle}>
            Quản lý điều khoản, báo cáo và chặn người dùng trong chat CLB.
          </Text>

          <Text style={styles.heroText}>
            Bạn có thể xem cam kết an toàn cộng đồng, liên hệ hỗ trợ và quản lý
            danh sách chặn tại đây.
          </Text>
        </View>

        <CommunityTermsCard
          accepted={!!termsState?.accepted}
          acceptedAt={termsState?.acceptedAt}
          onAccept={onAcceptTerms}
          onOpenPrivacy={() => openExternalUrl(COMMUNITY_PRIVACY_URL)}
          onOpenSafetyCenter={() => {}}
          showAcceptButton={!termsState?.accepted}
          showSafetyCenterButton={false}
          acceptButtonLabel="Tôi đồng ý điều khoản cộng đồng"
        />

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Cam kết moderation</Text>
          <Text style={styles.sectionSubtitle}>
            Đội ngũ Hanaka Sport không dung thứ cho nội dung phản cảm hoặc người
            dùng lạm dụng.
          </Text>

          <View style={styles.list}>
            {COMMUNITY_MODERATION_COMMITMENTS.map((item) => (
              <View key={item} style={styles.listRow}>
                <View style={styles.listDot} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Liên hệ hỗ trợ & moderation</Text>

          <Pressable
            style={styles.contactRow}
            onPress={() => openExternalUrl(`mailto:${COMMUNITY_SUPPORT_EMAIL}`)}
          >
            <Ionicons name="mail-outline" size={18} color="#0A66C2" />
            <View style={styles.contactTextWrap}>
              <Text style={styles.contactLabel}>Email hỗ trợ</Text>
              <Text style={styles.contactValue}>{COMMUNITY_SUPPORT_EMAIL}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>

          <Pressable
            style={styles.contactRow}
            onPress={() => openExternalUrl(COMMUNITY_SUPPORT_URL)}
          >
            <Ionicons name="globe-outline" size={18} color="#0A66C2" />
            <View style={styles.contactTextWrap}>
              <Text style={styles.contactLabel}>Website</Text>
              <Text style={styles.contactValue}>{COMMUNITY_SUPPORT_URL}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={() => openExternalUrl(COMMUNITY_PRIVACY_URL)}
          >
            <Text style={styles.secondaryBtnText}>
              Mở chính sách quyền riêng tư
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Người dùng đã chặn</Text>
          <Text style={styles.sectionSubtitle}>
            Nội dung từ các tài khoản này sẽ bị gỡ khỏi phiên chat của bạn ngay.
          </Text>

          {blockedUsers.length ? (
            blockedUsers.map((item) => (
              <View key={String(item?.userId)} style={styles.blockedRow}>
                <Text style={styles.blockedName}>
                  {item?.fullName || "Người dùng"}
                </Text>
                <Text style={styles.blockedMeta}>
                  Chặn lúc:{" "}
                  {item?.blockedAt
                    ? new Date(item.blockedAt).toLocaleString("vi-VN")
                    : "Chưa rõ"}
                </Text>
                <Text style={styles.blockedMeta}>
                  Lý do: {getCommunityReasonLabel(item?.reason)}
                </Text>

                <Pressable
                  style={styles.unblockBtn}
                  onPress={() => onUnblockUser(item)}
                >
                  <Text style={styles.unblockBtnText}>Bỏ chặn</Text>
                </Pressable>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Bạn chưa chặn tài khoản nào.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Lịch sử báo cáo gần đây</Text>
          <Text style={styles.sectionSubtitle}>
            Các báo cáo gần đây của bạn sẽ hiển thị tại đây để tiện theo dõi.
          </Text>

          {reports.length ? (
            reports.map((item) => (
              <View key={item.reportId} style={styles.reportRow}>
                <Text style={styles.reportTitle}>
                  {item.kind === "user" ? "Báo cáo người dùng" : "Báo cáo tin nhắn"}:
                  {" "}
                  {item.targetUserName || "Người dùng"}
                </Text>

                <Text style={styles.reportMeta}>
                  Lý do: {getCommunityReasonLabel(item.reason)}
                </Text>
                <Text style={styles.reportMeta}>
                  Tạo lúc: {new Date(item.createdAt).toLocaleString("vi-VN")}
                </Text>

                {item.pendingSync ? (
                  <View style={styles.pendingTag}>
                    <Text style={styles.pendingTagText}>Đã ghi nhận trên thiết bị</Text>
                  </View>
                ) : item.developerNotified ? (
                  <View style={styles.pendingTag}>
                    <Text style={styles.pendingTagText}>Đã gửi moderation</Text>
                  </View>
                ) : null}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Chưa có báo cáo nào được tạo trên thiết bị này.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
