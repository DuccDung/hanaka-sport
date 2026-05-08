// src/screens/Tournament/registerStyles.js
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF2F8" },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },

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

  // Scroll content
  scrollContent: {
    paddingBottom: 32,
    paddingHorizontal: 12,
    paddingTop: 12,
  },

  // Error box
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#DC2626",
    fontWeight: "500",
  },

  // Tournament card
  tournamentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tournamentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E2430",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E2430",
    flex: 1,
  },

  // Section card
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E2430",
    marginBottom: 12,
  },

  // Type selector
  typeSelector: {
    flexDirection: "row",
    gap: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  typeButtonActive: {
    backgroundColor: "#2563EB",
  },
  typeButtonDisabled: {
    opacity: 0.4,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  typeButtonTextActive: {
    color: "#fff",
  },

  // User info
  userInfoBox: {
    marginBottom: 16,
  },
  userInfoLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  userInfoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 12,
  },
  ratingExceeded: {
    color: "#DC2626",
  },
  warningText: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 4,
  },

  // Submit button
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#2563EB",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },

  // Option buttons (for double)
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    marginBottom: 8,
  },
  optionButtonDisabled: {
    opacity: 0.5,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 12,
    color: "#6B7280",
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
});
