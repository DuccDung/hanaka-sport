// src/screens/Tournament/tournamentRegistrationStyles.js
import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

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
  headerRight: { marginLeft: "auto" },

  body: {
    padding: 16,
  },

  // Tournament info card
  tournamentInfo: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tournamentTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E2430",
    marginBottom: 6,
  },
  tournamentDate: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  tournamentType: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },

  separator: {
    height: 8,
  },

  // Section titles
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 12,
  },

  // Game type selector
  gameTypeContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  gameTypeButtons: {
    flexDirection: "row",
    gap: 10,
  },
  gameTypeBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  gameTypeBtnActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
  },
  gameTypeBtnDisabled: {
    opacity: 0.5,
  },
  gameTypeBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  gameTypeBtnTextActive: {
    color: "#2563EB",
  },
  warningText: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 8,
    textAlign: "center",
  },

  // Partner search section
  partnerSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#1E2430",
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnDisabled: {
    backgroundColor: "#93C5FD",
  },
  errorText: {
    fontSize: 13,
    color: "#DC2626",
    marginBottom: 8,
  },

  // Partner card
  partnerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  partnerInfoMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  partnerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  partnerAvatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  partnerDetails: {
    flex: 1,
  },
  partnerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E2430",
  },
  partnerRating: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  partnerCity: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  removePartnerBtn: {
    padding: 4,
  },

  // Waiting option
  waitingOptionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FCD34D",
    borderRadius: 10,
    padding: 12,
  },
  waitingOptionText: {
    fontSize: 14,
    color: "#92400E",
    fontWeight: "500",
  },

  // Rating info
  ratingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  ratingInfoText: {
    fontSize: 13,
    color: "#6B7280",
    flex: 1,
  },

  // Error box
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorBoxText: {
    fontSize: 13,
    color: "#DC2626",
  },

  // Submit button
  submitBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  submitBtnDisabled: {
    backgroundColor: "#93C5FD",
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },

  note: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 18,
  },
});
