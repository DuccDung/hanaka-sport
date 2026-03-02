// src/screens/Tournament/standingsStyles.js
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

  // Tabs
  tabsRow: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EEF2F8",
    paddingHorizontal: 8,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabText: { fontSize: 14, fontWeight: "400", color: "#1E2430" },
  tabTextActive: { fontWeight: "700" },
  tabUnderline: {
    height: 3,
    width: "100%",
    marginTop: 8,
    borderRadius: 2,
    backgroundColor: COLORS.BLUE,
  },

  // List
  listPad: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 20 },

  groupCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 10,
    marginBottom: 12,
  },

  groupTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  // Table header
  tableHead: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  th: { fontSize: 13, fontWeight: "600", color: "#111827" },

  colTeam: { flex: 1.3 },
  colWin: { width: 46, alignItems: "center" },
  colPoint: { width: 46, alignItems: "center" },
  colHso: { width: 52, alignItems: "center" },
  colRank: { width: 46, alignItems: "center" },
  colMore: { width: 32, alignItems: "flex-end" },

  // Rows
  tr: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  trTop: { backgroundColor: "#D7DEE9", borderRadius: 8, paddingHorizontal: 6 },

  teamText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#1E2430",
    lineHeight: 18,
  },
  td: { fontSize: 13, fontWeight: "400", color: "#1E2430" },

  moreBtn: { padding: 6 },
});
