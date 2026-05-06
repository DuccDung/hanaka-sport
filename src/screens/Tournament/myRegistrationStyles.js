// src/screens/Tournament/myRegistrationStyles.js
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  // Header
  headerWrap: { backgroundColor: "#fff" },
  headerTop: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { padding: 6, marginRight: 6 },
  headerTitle: { fontSize: 15, fontWeight: "600", color: "#1E2430" },
  headerRight: { marginLeft: "auto" },

  body: {
    padding: 16,
  },

  loading: {
    paddingTop: 40,
    alignItems: "center",
  },

  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 12,
  },

  subsection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 8,
  },

  // Registration Card
  regCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  regCardSuccess: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  regCardWaiting: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  regCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  regCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E2430",
    marginLeft: 8,
  },

  teamSection: {
    marginBottom: 12,
  },
  teamLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  playerAvatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  playerInfo: { flex: 1 },
  playerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E2430",
  },
  playerRating: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  waitingDesc: {
    fontSize: 13,
    color: "#92400E",
    fontStyle: "italic",
    backgroundColor: "#FEF3C7",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    lineHeight: 18,
  },

  regCardFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  regCode: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 4,
  },
  regTime: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeSuccess: {
    backgroundColor: "#D1FAE5",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
  },

  // Empty State
  emptyStateCard: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E2430",
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateDesc: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },

  // Primary Button
  primaryBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Warning Card
  warningCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  warningText: {
    fontSize: 13,
    color: "#DC2626",
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },

  // Pair Request Card
  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    marginBottom: 10,
  },
  requestHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  requestAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#6B7280",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  requestAvatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  requestInfo: { flex: 1 },
  requestName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E2430",
  },
  requestMeta: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  requestTime: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
  },
  statusBadgePending: {
    backgroundColor: "#FEF3C7",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  statusTextPending: {
    color: "#92400E",
  },

  requestMessage: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#4B5563",
    marginTop: 10,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
  },

  requestActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionBtnAccept: {
    backgroundColor: "#10B981",
  },
  actionBtnReject: {
    backgroundColor: "#EF4444",
  },
  actionBtnCancel: {
    backgroundColor: "#F59E0B",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },

  // Secondary Button
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginTop: 16,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
  },
});