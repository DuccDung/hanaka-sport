// src/screens/Tournament/registrationListStyles.js
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF2F8" },

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

  // Action buttons row - 2 columns
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    // Two cards per row on mobile.
    width: "48%",
  },
  actionButtonPrimary: {
    backgroundColor: "#DBEAFE",
  },
  actionButtonIcon: {
    fontSize: 17,
    color: "#1E2430",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E2430",
  },
  actionButtonTextPrimary: {
    color: "#2563EB",
    fontWeight: "600",
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },

  // Stats button variants
  actionButtonSuccess: {
    backgroundColor: "#F0FDF4",
  },
  actionButtonTextSuccess: {
    color: "#16A34A",
    fontWeight: "600",
  },
  actionButtonWaiting: {
    backgroundColor: "#FFFBEB",
  },
  actionButtonTextWaiting: {
    color: "#D97706",
    fontWeight: "600",
  },
  actionButtonCapacity: {
    backgroundColor: "#F3F4F6",
  },
  actionButtonTextCapacity: {
    color: "#4B5563",
    fontWeight: "600",
  },

  // Reason row for cannot register
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  reasonText: {
    flex: 1,
    fontSize: 13,
    color: "#22C55E",
    fontWeight: "500",
  },

  // Invite button for waiting registration
  inviteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
  },
  inviteBtnPressed: {
    opacity: 0.7,
  },
  inviteBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },

  // Stats badges (keep similar)
  statsRow: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingBottom: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statBadge: {
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 140,
  },
  statText: { fontSize: 14, fontWeight: "500", color: "#1E2430" },
  statNum: { fontSize: 14, fontWeight: "700", color: "#1E2430" },

  statGreen: { backgroundColor: "#22C55E" },
  statGreenText: { color: "#0B1F12" },

  statOrange: { backgroundColor: "#F6B15B" },
  statGrey: { backgroundColor: "#E5E7EB" },

  // Search
  searchRow: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  searchBox: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#1E2430" },

  // Table header
  tableHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F8",
    flexDirection: "row",
    alignItems: "center",
  },
  thText: { fontSize: 12, fontWeight: "600", color: "#111827" },
  colVdv1: { flex: 1.15 },
  colVdv2: { flex: 1.15 },
  colPoint: { width: 52, alignItems: "center" },

  // List
  listPad: { paddingBottom: 18 },

  item: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F8",
  },

  itemHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  idx: { fontSize: 14, fontWeight: "700", color: "#EF4444" },
  itemHeaderText: { fontSize: 13, fontWeight: "400", color: "#1E2430" },
  itemHeaderStrong: { fontWeight: "700" },

  singleItem: {
    marginHorizontal: 8,
    marginTop: 10,
    marginBottom: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    borderWidth: 1,
    borderColor: "#D8E2EF",
    borderRadius: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  singleBody: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  singlePlayerInfo: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  },
  singlePlayerTextWrap: {
    flex: 1,
    minWidth: 0,
    marginLeft: 14,
  },
  singlePlayerName: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: "#111827",
  },
  singlePlayerLevel: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: "#64748B",
  },
  singleVerifiedText: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 18,
    color: "#111827",
  },
  singleStatusPill: {
    marginTop: 7,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
  },
  singlePointsText: {
    textAlign: "center",
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    color: "#EF4444",
  },
  singleMetaCol: {
    width: 58,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  singlePaymentDivider: {
    display: "none",
    height: 1,
    backgroundColor: "#E2E8F0",
    marginTop: 18,
    marginBottom: 14,
  },

  gridRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 10 },
  playerCol: { flex: 1.15, alignItems: "center" },
  pointCol: { width: 52, alignItems: "center", paddingTop: 0 },

  avatarRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  avatar: { width: "100%", height: "100%" },

  playerName: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "400",
    color: "#1E2430",
    textAlign: "center",
  },
  playerLevel: { fontSize: 12, fontWeight: "400", color: "#6B7280" },

  statusPill: {
    marginTop: 8,
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
  },
  statusPillText: { fontSize: 12, fontWeight: "400", color: "#fff" },

  verifiedText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "400",
    color: "#111827",
  },

  pointsText: { fontSize: 13, fontWeight: "700", color: "#EF4444" },

  paymentRow: {
    display: "none",
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  paymentIconButton: {
    width: 42,
    height: 42,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16A34A",
    borderWidth: 1,
    borderColor: "#15803D",
  },
  paymentButtonPressed: {
    opacity: 0.82,
  },
  paymentButtonDisabled: {
    opacity: 0.56,
  },
  paymentPaidBadge: {
    width: 42,
    height: 42,
    borderRadius: 7,
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#34D399",
  },
  paymentTopAction: {
    marginBottom: 8,
  },
  singlePaymentRow: {
    display: "none",
    marginTop: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  singlePaymentButton: {
    alignSelf: "flex-end",
    width: 42,
    height: 42,
    minHeight: 42,
    borderRadius: 7,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  singlePaymentBadge: {
    alignSelf: "flex-end",
    minHeight: 42,
    borderRadius: 7,
  },

  // Pending Pair Request Popup
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  popupContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  popupIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E2430",
    textAlign: "center",
    marginBottom: 12,
  },
  popupMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  popupButtonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  popupButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  popupButtonExit: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  popupButtonExitText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  popupButtonView: {
    backgroundColor: "#2563EB",
  },
  popupButtonViewText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
