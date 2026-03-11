import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  header: {
    height: 56,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    width: 32,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "left",
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#1E2430",
  },

  scrollContent: {
    padding: 14,
    paddingBottom: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
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
    color: "#1E2430",
    marginBottom: 8,
  },

  descBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  descText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#4B5563",
  },

  columnsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  colTitle: {
    width: "48%",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#1E2430",
  },

  columnsBody: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colBox: {
    width: "48%",
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
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  scoreChipActive: {
    backgroundColor: "#DCE7FF",
    borderColor: COLORS.BLUE,
  },
  scoreChipText: {
    fontSize: 16,
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
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
  },

  resultHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  resultHeaderSpacer: {
    flex: 1,
  },
  resultHeaderText: {
    width: 120,
    textAlign: "center",
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },

  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  resultLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1E2430",
  },
  resultBox: {
    width: 120,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 14,
    marginLeft: 10,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E2430",
  },

  rawRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
    gap: 36,
  },
  rawText: {
    width: 94,
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },

  bottomBtnsRow: {
    flexDirection: "row",
    gap: 10,
  },
  resetBtn: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  resetBtnText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E2430",
  },

  updateBtn: {
    flex: 2,
    height: 52,
    borderRadius: 10,
    backgroundColor: COLORS.BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  updateBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});
