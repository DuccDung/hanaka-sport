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

  // Action buttons row (like web)
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#fff",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  actionButtonPrimary: {
    backgroundColor: "#DBEAFE",
  },
  actionButtonIcon: {
    fontSize: 16,
    color: "#1E2430",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#1E2430",
  },
  actionButtonTextPrimary: {
    color: "#2563EB",
    fontWeight: "600",
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

  gridRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 10 },
  playerCol: { flex: 1.15, alignItems: "center" },
  pointCol: { width: 52, alignItems: "center", paddingTop: 10 },

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
});
