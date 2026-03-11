// src/screens/Club/styles.js
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
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEF2F8",
  },
  cover: { width: "100%", height: 180 },

  cardBody: { padding: 12 },

  title: { fontSize: 14, fontWeight: "600", color: "#1E2430" },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  ratingText: { fontSize: 12, fontWeight: "400", color: "#6B7280" },
  starsRow: { flexDirection: "row", alignItems: "center", gap: 2 },

  metaText: { fontSize: 12, fontWeight: "400", color: "#6B7280", marginTop: 6 },

  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 6 },
  statText: { fontSize: 12, fontWeight: "400", color: "#6B7280" },

  btnRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  btnPrimary: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondary: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#22C1D6", // giống ảnh (xanh ngọc)
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { fontSize: 13, fontWeight: "600", color: "#fff" },
  //==========
  submitBtn: {
    marginTop: 18,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },

  submitBtnDisabled: {
    backgroundColor: "#E5E7EB",
  },

  submitBtnActiveRed: {
    backgroundColor: "#DC2626",
  },

  submitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  submitTextDisabled: {
    color: "#9CA3AF",
  },
});
