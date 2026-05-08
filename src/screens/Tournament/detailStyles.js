// src/screens/Tournament/detailStyles.js
import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

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
  headerIconBtn: { padding: 6 },

  banner: { width, height: 150, backgroundColor: "#E5E7EB" },

  body: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 18 },

  title: { fontSize: 15, fontWeight: "600", color: "#1E2430", lineHeight: 22 },

  line: {
    fontSize: 13,
    fontWeight: "400",
    color: "#1E2430",
    marginTop: 6,
    lineHeight: 20,
  },
  value: { color: "#1E2430" },
  valueBold: { fontWeight: "700" },

  twoColRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 8,
  },

  contentBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 64,
    backgroundColor: "#fff",
  },
  contentEmptyText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
  },

  sectionCaps: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 10,
    letterSpacing: 1,
  },

  // Web-like action buttons (horizontal layout)
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  actionButtonIcon: {
    fontSize: 16,
    color: "#1E2430",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#1E2430",
  },

  // Legacy circle buttons (keep for reference, can remove)
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  actionGridItem: {
    width: (width - 24 - 24) / 3, // 3 columns with gap
    alignItems: "center",
    marginBottom: 16,
  },
  actionIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionIconCirclePrimary: {
    backgroundColor: "#DBEAFE",
  },
  actionIconCircleWarning: {
    backgroundColor: "#FEF3C7",
  },
  actionIconCircleSuccess: {
    backgroundColor: "#D1FAE5",
  },
  actionIconCircleOrange: {
    backgroundColor: "#FFEDD5",
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
  actionLabelWhite: {
    color: "#fff",
  },
});
