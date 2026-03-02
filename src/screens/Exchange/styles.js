// src/screens/Exchange/styles.js
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

  // Filter
  filterRow: {
    paddingHorizontal: 12,
    paddingBottom: 10,
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

  // List
  listPad: { paddingHorizontal: 12, paddingBottom: 18 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF2F8",
    padding: 12,
    marginBottom: 12,
  },

  // Top row: left team - score - right team
  topRow: { flexDirection: "row", alignItems: "center" },

  teamCol: { flex: 1, alignItems: "center" },

  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoImg: { width: "100%", height: "100%" },

  teamName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#1E2430",
    textAlign: "center",
  },

  wld: { marginTop: 4, fontSize: 12, fontWeight: "400", color: "#6B7280" },

  // Score center
  scoreCol: { width: 76, alignItems: "center" },
  scoreText: { fontSize: 16, fontWeight: "700", color: "#F97316" }, // cam giống ảnh

  // Right status line under logo
  statusText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "400",
    color: "#6B7280",
    textAlign: "center",
  },

  // Actions under left team
  actionRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  // bottom meta
  metaRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F8",
    gap: 8,
  },
  metaLine: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaText: { fontSize: 12, fontWeight: "400", color: "#6B7280" },
  metaStrong: { fontWeight: "600", color: "#1E2430" },
});
