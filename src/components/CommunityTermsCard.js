import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  COMMUNITY_MODERATION_COMMITMENTS,
  COMMUNITY_SUPPORT_EMAIL,
  COMMUNITY_ZERO_TOLERANCE_ITEMS,
} from "../constants/communitySafety";
import { COLORS } from "../constants/colors";

function BulletList({ items = [] }) {
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={item} style={styles.listRow}>
          <View style={styles.dot} />
          <Text style={styles.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function CommunityTermsCard({
  accepted = false,
  acceptedAt = null,
  onAccept,
  onOpenPrivacy,
  onOpenSafetyCenter,
  acceptButtonLabel = "Tôi đồng ý và tiếp tục",
  showAcceptButton = true,
  showSafetyCenterButton = true,
  compact = false,
}) {
  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.BLUE} />
          <Text style={styles.badgeText}>An toàn chat</Text>
        </View>

        <View style={[styles.statusBadge, accepted && styles.statusBadgeOk]}>
          <Text style={[styles.statusText, accepted && styles.statusTextOk]}>
            {accepted ? "Đã đồng ý" : "Chưa đồng ý"}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>Điều khoản sử dụng & tiêu chuẩn cộng đồng</Text>

      <Text style={styles.subtitle}>
        Người dùng phải đồng ý trước khi truy cập chat CLB.
      </Text>

      {acceptedAt ? (
        <Text style={styles.acceptedAt}>
          Đồng ý lúc: {new Date(acceptedAt).toLocaleString("vi-VN")}
        </Text>
      ) : null}

      <Text style={styles.sectionTitle}>Không dung thứ cho:</Text>
      <BulletList items={COMMUNITY_ZERO_TOLERANCE_ITEMS} />

      <Text style={styles.sectionTitle}>Cam kết moderation:</Text>
      <BulletList items={COMMUNITY_MODERATION_COMMITMENTS} />

      <View style={styles.contactBox}>
        <Ionicons name="mail-outline" size={16} color="#065F46" />
        <Text style={styles.contactText}>
          Liên hệ moderator: {COMMUNITY_SUPPORT_EMAIL}
        </Text>
      </View>

      <View style={styles.actions}>
        {showAcceptButton ? (
          <Pressable onPress={onAccept} style={styles.acceptBtn}>
            <Text style={styles.acceptBtnText}>{acceptButtonLabel}</Text>
          </Pressable>
        ) : null}

        {showSafetyCenterButton ? (
          <Pressable onPress={onOpenSafetyCenter} style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Xem chi tiết</Text>
          </Pressable>
        ) : null}

        <Pressable onPress={onOpenPrivacy} style={styles.linkBtn}>
          <Text style={styles.linkBtnText}>Chính sách quyền riêng tư</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DCE7F5",
    padding: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardCompact: {
    padding: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.BLUE,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#FEF3C7",
  },
  statusBadgeOk: {
    backgroundColor: "#DCFCE7",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  statusTextOk: {
    color: "#166534",
  },
  title: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
  },
  acceptedAt: {
    marginTop: 8,
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "600",
  },
  sectionTitle: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: "800",
    color: "#1E293B",
  },
  list: {
    marginTop: 10,
    gap: 8,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.BLUE,
    marginTop: 7,
  },
  listText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#334155",
  },
  contactBox: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  contactText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: "#065F46",
    fontWeight: "600",
  },
  actions: {
    marginTop: 16,
    gap: 10,
  },
  acceptBtn: {
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryBtn: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    color: COLORS.BLUE,
    fontSize: 14,
    fontWeight: "700",
  },
  linkBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  linkBtnText: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "700",
  },
});
