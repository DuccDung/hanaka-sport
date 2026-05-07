// src/screens/Tournament/pairRequestDetailStyles.js
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
    gap: 10,
  },
  backBtn: { padding: 6 },
  headerTitle: { fontSize: 15, fontWeight: "600", color: "#1E2430", flex: 1 },
  statusBadgeLarge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeLargeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },

  // Content
  content: {
    flex: 1,
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
    marginTop: 24,
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
    textAlign: "center",
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

  // Tournament Banner
  tournamentBanner: {
    width: "100%",
    height: 160,
    backgroundColor: "#E5E7EB",
  },

  // Tournament Info
  tournamentInfo: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
  },
  tournamentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E2430",
    marginBottom: 8,
  },
  tournamentMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: "#6B7280",
  },

  // Flow Section
  flowSection: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
  },
  flowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  partnerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 4,
  },
  partnerRating: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  verifiedText: {
    fontSize: 12,
    color: "#22C55E",
    fontWeight: "500",
  },

  // Registration Section
  registrationSection: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E2430",
    marginBottom: 12,
  },
  regCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
  },
  regRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  regLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  regValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1E2430",
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },
  regStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  regStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },

  // Timeline Section
  timelineSection: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
  },
  timelineContainer: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: "row",
    gap: 12,
    position: "relative",
    paddingBottom: 16,
  },
  timelineIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  timelineTime: {
    fontSize: 12,
    color: "#6B7280",
  },
  timelineLine: {
    position: "absolute",
    left: 17,
    top: 36,
    bottom: 0,
    width: 2,
    backgroundColor: "#E5E7EB",
  },

  // Details Section
  detailsSection: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
  },
  detailCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
  },
  detailRow: {
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1E2430",
  },

  // Action Section
  actionSection: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 8,
    paddingBottom: 32,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
  },
  acceptButton: {
    backgroundColor: "#22C55E",
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  rejectButton: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
  },
  cancelButton: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E2430",
    marginBottom: 8,
    textAlign: "center",
  },
  modalDesc: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    textAlign: "center",
  },
  reasonInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#1E2430",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  modalButtonCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  modalButtonConfirm: {
    backgroundColor: "#DC2626",
  },
  modalButtonConfirmText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
