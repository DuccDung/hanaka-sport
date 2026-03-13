// src/screens/Coach/editStyles.js
import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF2F8" },

  // Header giống system của app
  headerWrap: { backgroundColor: "#fff" },
  headerTop: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { padding: 6, marginRight: 6 },
  headerTitle: { fontSize: 15, fontWeight: "600", color: "#1E2430" },

  body: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 18,
  },

  // Info block
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoLeft: { flex: 1, paddingRight: 12 },

  // Tên to hơn một chút nhưng vẫn hợp hệ
  bigName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 6,
  },

  // Text thông tin giống meta của app
  infoText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6B7280",
    marginBottom: 4,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#D1D5DB",
  },

  // Điểm (nhỏ, cùng hệ)
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 0,
  },
  scoreLabel: { fontSize: 14, fontWeight: "400", color: "#1E2430" },

  // Label + dấu *
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 8,
  },
  fieldLabel: { fontSize: 14, fontWeight: "400", color: "#1E2430" },
  required: {
    marginLeft: "auto",
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "400",
  },

  divider: {
    height: 1,
    backgroundColor: "#D1D5DB",
    marginTop: 14,
  },

  submitBtnDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#D1D5DB",
    opacity: 0.9,
  },
  submitText: { fontSize: 15, fontWeight: "700", color: "#9CA3AF" },
  submitTextDisabled: { color: "#9CA3AF" },
  //=========
  submitBtn: {
    minHeight: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginTop: 4,
  },

  submitBtnActive: {
    backgroundColor: "#DC2626",
  },

  submitBtnDisabled: {
    backgroundColor: "#E5E7EB",
  },

  submitText: {
    fontSize: 15,
    fontWeight: "700",
  },

  submitTextActive: {
    color: "#FFFFFF",
  },

  submitTextDisabled: {
    color: "#9CA3AF",
  },
});
