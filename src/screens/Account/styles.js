import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  headerRight: {
    width: 36,
  },

  container: {
    padding: 16,
    paddingBottom: 32,
  },

  avatarSection: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  avatarPressable: {
    position: "relative",
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
  },
  avatarFallback: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
  },
  cameraBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarHint: {
    marginTop: 8,
    fontSize: 12,
    color: "#6B7280",
  },

  statusText: {
    textAlign: "center",
    color: "#374151",
    fontSize: 14,
  },
  statusSubText: {
    marginTop: 4,
    textAlign: "center",
    color: "#475569",
    fontSize: 13,
  },
  statusBold: {
    fontWeight: "800",
    color: "#111827",
  },

  card: {
    marginTop: 16,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },

  ratingCard: {
    marginTop: 16,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    backgroundColor: "#F0FDF4",
  },
  ratingHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  ratingHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#14532D",
  },
  ratingUpdatedText: {
    marginTop: 4,
    fontSize: 12,
    color: "#4B5563",
  },
  ratingToggle: {
    minHeight: 34,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#86EFAC",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  ratingToggleText: {
    color: "#166534",
    fontSize: 12,
    fontWeight: "800",
  },
  ratingSummary: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
  },
  ratingSummaryItem: {
    flex: 1,
    minHeight: 92,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCFCE7",
    backgroundColor: "#FFFFFF",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingSummaryLabelRow: {
    minHeight: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    alignSelf: "stretch",
  },
  ratingSummaryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DCFCE7",
  },
  ratingSummaryLabel: {
    color: "#4B5563",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
    textAlign: "center",
  },
  ratingSummaryValue: {
    marginTop: 8,
    color: "#15803D",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 26,
    textAlign: "center",
    includeFontPadding: false,
  },
  ratingHistory: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#DCFCE7",
    gap: 8,
  },
  ratingHistoryLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingHistoryItem: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  ratingHistoryScores: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  ratingHistoryScoreText: {
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "700",
  },
  ratingHistoryScoreValue: {
    color: "#166534",
    fontWeight: "900",
  },
  ratingHistoryMeta: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 17,
  },
  ratingHistoryNote: {
    marginTop: 6,
    color: "#374151",
    fontSize: 12,
    lineHeight: 17,
  },
  ratingHistoryEmpty: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 17,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  labelSpacing: {
    marginTop: 12,
  },
  required: {
    color: "#EF4444",
  },

  input: {
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    color: "#111827",
    fontSize: 14,
  },
  inputShell: {
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
  },
  inputText: {
    flex: 1,
    color: "#111827",
    fontSize: 14,
    paddingVertical: 0,
  },
  inputDisabled: {
    opacity: 0.7,
  },

  select: {
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectDisabled: {
    opacity: 0.7,
  },
  selectText: {
    color: "#111827",
    fontSize: 14,
  },
  placeholderText: {
    color: "#9CA3AF",
    fontSize: 14,
  },

  textarea: {
    minHeight: 120,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
    color: "#111827",
    fontSize: 14,
    textAlignVertical: "top",
  },
  textareaShell: {
    minHeight: 120,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
  },
  textareaInput: {
    minHeight: 96,
    color: "#111827",
    fontSize: 14,
    paddingVertical: 0,
    textAlignVertical: "top",
  },

  btn: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    flexDirection: "row",
  },
  btnDisabled: {
    opacity: 0.6,
  },

  btnPrimary: {
    backgroundColor: "#1D4ED8",
  },
  btnPrimaryText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },

  btnOutline: {
    borderWidth: 2,
    borderColor: "#1D4ED8",
    backgroundColor: "#FFFFFF",
  },
  btnOutlineText: {
    color: "#1D4ED8",
    fontWeight: "800",
    fontSize: 14,
  },

  btnGreen: {
    backgroundColor: "#22C55E",
  },
  btnGreenText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },

  btnBlueSoft: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  btnBlueSoftText: {
    color: "#1D4ED8",
    fontWeight: "800",
    fontSize: 14,
  },

  btnDanger: {
    borderWidth: 2,
    borderColor: "#EF4444",
    backgroundColor: "#FFFFFF",
  },
  btnDangerText: {
    color: "#EF4444",
    fontWeight: "900",
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    maxHeight: "70%",
  },
  modalHeader: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalItemText: {
    fontSize: 15,
    color: "#111827",
  },
  modalCloseBtn: {
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  modalCloseText: {
    fontWeight: "700",
    color: "#111827",
  },

  pressed: {
    opacity: 0.85,
  },
});
