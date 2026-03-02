// src/screens/Match/styles.js
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
  headerRight: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerIconBtn: { padding: 6 },

  // Filters block
  filterWrap: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 6,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 8,
  },

  dateRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  dateBox: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: { fontSize: 13, fontWeight: "400", color: "#1E2430" },
  dash: { fontSize: 14, fontWeight: "600", color: "#6B7280" },

  row2: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 10 },

  radioWrap: { flexDirection: "row", alignItems: "center", gap: 8, width: 92 },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: COLORS.BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.BLUE,
  },
  radioText: { fontSize: 14, fontWeight: "400", color: "#1E2430" },

  searchBox: {
    flex: 1,
    height: 40,
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

  // List
  listPad: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 18 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    marginBottom: 12,
  },

  cardHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardDate: { fontSize: 14, fontWeight: "600", color: "#1E2430" },
  cardId: { fontSize: 14, fontWeight: "400", color: "#6B7280" },

  lineRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },

  // player block
  playerRow: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E5E7EB",
  },

  nameOrange: { fontSize: 14, fontWeight: "400", color: "#F97316" },
  nameBlack: { fontSize: 14, fontWeight: "400", color: "#1E2430" },

  // double layout: 2 columns
  doubleCols: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: { width: "48%" },

  // score on right
  rightScoreCol: {
    width: 50,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  scoreText: { fontSize: 14, fontWeight: "600", color: "#1E2430" },

  trophyRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  trophyScore: { fontSize: 14, fontWeight: "600", color: "#1E2430" },
});
