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

  body: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 18,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoLeft: { flex: 1, paddingRight: 12 },

  bigName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 6,
  },

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

  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 0,
  },
  scoreLabel: { fontSize: 14, fontWeight: "400", color: "#1E2430" },

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

  submitBtn: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#D1D5DB",
    opacity: 0.9,
  },
  submitText: { fontSize: 15, fontWeight: "700", color: "#9CA3AF" },
  submitTextDisabled: { color: "#9CA3AF" },

  submitBtnActive: { backgroundColor: COLORS.BLUE, borderColor: COLORS.BLUE },
  submitTextActive: { color: "#fff" },
});
