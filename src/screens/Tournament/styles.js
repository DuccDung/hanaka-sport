// src/screens/Tournament/styles.js
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

  // Filter row
  filterRow: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  filterText: { fontSize: 12, fontWeight: "400", color: "#6B7280" },

  // Tabs
  tabsRow: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 24,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F8",
  },
  tabBtn: { paddingVertical: 12 },
  tabText: { fontSize: 14, fontWeight: "400", color: "#6B7280" },
  tabTextActive: { color: "#1E2430", fontWeight: "600" },
  tabUnderline: {
    height: 3,
    backgroundColor: COLORS.BLUE,
    borderRadius: 2,
    marginTop: 8,
  },

  // List
  listPad: { paddingHorizontal: 12, paddingBottom: 18, paddingTop: 10 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEF2F8",
    marginBottom: 12,
  },
  banner: { width: "100%", height: 200 },

  cardBody: { padding: 12 },

  title: { fontSize: 17, fontWeight: "700", color: "#1E2430" },

  line: { fontSize: 14, fontWeight: "400", color: "#6B7280", marginTop: 6 },
  strong: { fontWeight: "600", color: "#1E2430" },

  twoColRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 6,
  },
  col: { flex: 1 },

  smallRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 6,
  },
});
