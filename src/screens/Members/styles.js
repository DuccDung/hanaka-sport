// src/screens/Members/styles.js
import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF2F8" },

  // Header (giống ảnh)
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
    gap: 10,
  },
  headerIconBtn: { padding: 6 },
  headerLink: { fontSize: 15, fontWeight: "700", color: "#1E2430" },

  // Search row
  searchRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 6,
  },
  searchBox: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#1E2430" },
  searchBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: COLORS.BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  // Section header (Thành Viên + icon cột điểm)
  sectionHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F8",
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 14, fontWeight: "400", color: "#1E2430" },
  sectionRightCols: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    width: 60, // ✅ Tổng độ rộng cột phải (2 cột)
    justifyContent: "space-between",
  },
  col: {
    width: 50, // ✅ mỗi cột 50 (khớp score width)
    alignItems: "flex-end", // ✅ icon nằm về phía phải của cột
  },

  // List item
  item: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEF2F8",
  },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },

  mid: { flex: 1, paddingRight: 10 },
  name: { fontSize: 14, fontWeight: "600", color: "#1E2430" },

  metaRow: { flexDirection: "row", gap: 10, marginTop: 2, flexWrap: "wrap" },
  meta: { fontSize: 12, color: "#6B7280", fontWeight: "400" },

  subRow: { flexDirection: "row", gap: 10, marginTop: 6, flexWrap: "wrap" },
  gender: { fontSize: 12, color: "#1E2430", fontWeight: "400" },
  verified: { fontSize: 12, fontWeight: "400", color: "#16A34A" },

  right: {
    width: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  score: {
    width: 50,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "400",
    color: "#1E2430",
  },
});
