// src/screens/Club/createStyles.js
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

  body: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 18 },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  label: { fontSize: 14, fontWeight: "400", color: "#1E2430" },
  required: {
    marginLeft: "auto",
    fontSize: 14,
    fontWeight: "400",
    color: "#EF4444",
  },

  // Cover pick (ô vuông)
  coverPick: {
    width: 110,
    height: 110,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#EEF2F8",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  coverImage: { width: "100%", height: "100%" },
  coverPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  coverPlaceholderText: { fontSize: 12, fontWeight: "400", color: "#2563EB" },

  // Avatar
  avatarBlock: { alignItems: "center", marginTop: 14, marginBottom: 6 },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: { width: "100%", height: "100%" },
  avatarLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "400",
    color: "#6B7280",
  },

  // Inputs
  inputBox: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: { flex: 1, fontSize: 15, color: "#1E2430" },

  rightIconBtn: { paddingLeft: 10 },

  // Fake dropdown text
  fakeInputText: { fontSize: 15, fontWeight: "400", color: "#1E2430" },
  fakePlaceholder: { color: "#9CA3AF" },
  datePickerWrap: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  datePickerCloseBtn: {
    alignSelf: "flex-end",
    marginRight: 12,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.BLUE,
  },
  datePickerCloseText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  twoColRow: { flexDirection: "row", gap: 10 },
  twoCol: { flex: 1 },

  // Textarea
  textAreaBox: { height: 110, alignItems: "flex-start", paddingTop: 10 },
  textArea: { height: "100%" },

  submitBtnDisabled: { opacity: 0.9 },
  submitText: { fontSize: 15, fontWeight: "700", color: "#9CA3AF" },
  submitTextDisabled: { color: "#9CA3AF" },

  //==========
  submitBtn: {
    marginTop: 18,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
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
