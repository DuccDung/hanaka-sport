// src/screens/Coach/styles.js
import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF2F8" },

  headerWrap: { backgroundColor: "#fff" },
  headerTop: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { padding: 6, marginRight: 6 },
  headerTitle: { fontSize: 15, fontWeight: "600", color: "#1E2430" },
  headerRight: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
  },
  addBtn: { padding: 6 },

  // Search
  searchRow: { paddingHorizontal: 12, paddingBottom: 10, paddingTop: 6 },
  searchBox: {
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#1E2430" },

  // Header row of table columns
  tableHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F8",
    flexDirection: "row",
    alignItems: "center",
  },

  colStt: { width: 34 },
  thText: { fontSize: 14, fontWeight: "400", color: "#1E2430" },

  colMember: { flex: 1, paddingRight: 10 },

  colScoreWrap: {
    width: 150, // 2 cột điểm
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  colScore: {
    width: 70,
    alignItems: "flex-end",
  },

  // Item row
  item: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEF2F8",
  },

  sttText: { fontSize: 14, fontWeight: "400", color: "#1E2430" },

  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },

  mid: { flex: 1, paddingRight: 10 },
  name: { fontSize: 14, fontWeight: "600", color: "#1E2430" },
  city: { fontSize: 12, color: "#6B7280", fontWeight: "400", marginTop: 2 },

  statusBad: {
    fontSize: 12,
    fontWeight: "400",
    color: "#EF4444",
    marginTop: 6,
  },
  statusGood: {
    fontSize: 12,
    fontWeight: "400",
    color: "#16A34A",
    marginTop: 6,
  },

  right: {
    width: 150,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  scoreBox: {
    width: 70,
    height: 34,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#1E2430",
  },
  submitBtnActive: { backgroundColor: COLORS.BLUE, borderColor: COLORS.BLUE },
  submitTextActive: { color: "#fff" },
});
