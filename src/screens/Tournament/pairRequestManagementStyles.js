// src/screens/Tournament/pairRequestManagementStyles.js
import { StyleSheet } from "react-native";

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

  // Tabs
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#2563EB",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#2563EB",
  },

  // List
  listContent: { paddingBottom: 24 },

  // Item
  item: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    gap: 12,
  },
  itemInfo: {
    flex: 1,
  },
  tournamentTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E2430",
    marginBottom: 4,
  },
  receiverName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 11,
    color: "#6B7280",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },

  // Cancel button
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DC2626",
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#DC2626",
  },

  // Centered loading
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },

  // Error box
  errorBox: {
    marginHorizontal: 12,
    marginTop: 12,
    padding: 12,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    alignItems: "center",
  },
  errorText: {
    fontSize: 13,
    color: "#DC2626",
    fontWeight: "500",
    marginBottom: 8,
  },
  retryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "#DC2626",
    borderRadius: 6,
  },
  retryBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E2430",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },

  // Help button
  helpBtn: {
    marginLeft: "auto",
    padding: 6,
  },

  // Guide Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  guideModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  guideHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E2430",
    marginTop: 8,
    textAlign: "center",
  },
  guideContent: {
    maxHeight: 400,
    marginBottom: 16,
  },
  guideStep: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  guideStepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  guideStepNumberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  guideStepContent: {
    flex: 1,
  },
  guideStepTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 4,
  },
  guideStepDesc: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  guideFooter: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  guideBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  guideBtnSkip: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  guideBtnSkipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  guideBtnUnderstood: {
    backgroundColor: "#2563EB",
  },
  guideBtnUnderstoodText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
