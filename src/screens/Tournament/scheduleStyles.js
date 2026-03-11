// src/screens/Tournament/scheduleStyles.js
import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

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
  headerRight: { marginLeft: "auto" },
  headerIconBtn: { padding: 6 },

  // Meta row
  metaRow: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  metaLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaText: { fontSize: 13, fontWeight: "400", color: "#1E2430" },
  metaStrong: { fontWeight: "700" },
  metaSpacer: { flex: 1 },

  // Tabs
  tabsRow: {
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F8",
  },
  tabBtn: { paddingVertical: 12, paddingHorizontal: 16 },
  tabText: { fontSize: 14, fontWeight: "400", color: "#1E2430" },
  tabTextActive: { fontWeight: "700" },
  tabUnderline: {
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.BLUE,
    marginTop: 8,
  },

  // List
  listPad: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 20 },

  // ===== Tree group (Bảng) =====
  groupWrap: {
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 14,
  },

  // Khối trắng (chứa các trận) giống ảnh
  groupCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },

  groupHeader: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F8",
  },

  groupHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  groupTitle: { fontSize: 13, fontWeight: "700", color: "#1E2430" },
  groupSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  // Right column (vòng tròn xanh + mũi tên) như ảnh
  rightCol: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  rightGreenCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  rightGreenText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  // ===== Match row inside group =====
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  // divider giữa các trận
  matchDivider: {
    height: 1,
    backgroundColor: "#EEF2F8",
    marginLeft: 12,
  },

  leftCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: COLORS.BLUE,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginRight: 10,
  },
  leftCircleText: { fontSize: 14, fontWeight: "700", color: COLORS.BLUE },

  matchBody: { flex: 1 },

  cardTop: { fontSize: 13, fontWeight: "600", color: "#1E2430" },

  teamsRow: { flexDirection: "row", marginTop: 8 },
  teamsLeft: { flex: 1, gap: 8 },
  teamText: { fontSize: 13, fontWeight: "400", color: "#1E2430" },

  scoresRight: { width: 24, alignItems: "flex-end", gap: 8 },
  scoreText: { fontSize: 13, fontWeight: "400", color: "#1E2430" },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginTop: 10,
  },
  actionItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionText: { fontSize: 13, fontWeight: "400", color: "#6B7280" },
  actionTextStrong: { color: "#1E2430", fontWeight: "600" },

  matchRowWinner: {
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },

  leftCircleWinner: {
    backgroundColor: "#DCFCE7",
    borderColor: "#86EFAC",
  },

  leftCircleTextWinner: {
    color: "#166534",
    fontWeight: "700",
  },

  teamWinnerText: {
    fontWeight: "700",
    color: "#166534",
  },

  scoreWinnerText: {
    fontWeight: "800",
    color: "#166534",
  },
});
