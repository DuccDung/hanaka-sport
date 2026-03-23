import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  safeTop: {
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 56,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#1E2430",
  },
  headerRightSpace: {
    width: 32,
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 24,
  },
  scrollBottomSpace: {
    height: 210,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  descBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  descText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#4B5563",
  },

  sectionColumns: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  ratingColumn: {
    flex: 1,
  },
  ratingColumnTitle: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },

  scoreSelectorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  scoreChip: {
    width: "18%",
    minWidth: 44,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  scoreChipInactive: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  scoreChipActive: {
    backgroundColor: "#DCE7FF",
    borderColor: COLORS.BLUE,
  },
  scoreChipText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E2430",
  },
  scoreChipTextActive: {
    color: COLORS.BLUE,
  },

  bottomWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 12,
  },

  bottomTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  resultTableHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  resultHeaderCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  resultHeaderLabel: {
    textAlign: "left",
  },

  resultTableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  resultLabelCell: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
  },
  resultMainLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  resultValueBox: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  referenceBox: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  referenceText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },

  bottomBtnsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  resetBtn: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  resetBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  updateBtn: {
    flex: 2,
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  updateBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  btnDisabled: {
    opacity: 0.7,
  },
});
