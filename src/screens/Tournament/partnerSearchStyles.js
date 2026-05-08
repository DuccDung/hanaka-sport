// src/screens/Tournament/partnerSearchStyles.js
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

  // Search
  searchContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  searchBox: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#1E2430" },
  hintText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 6,
    paddingHorizontal: 4,
  },

  // Error
  errorBox: {
    marginHorizontal: 12,
    marginTop: 8,
    padding: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  errorText: { fontSize: 13, color: "#DC2626", fontWeight: "500" },

  // List
  listContent: { paddingBottom: 24 },

  // Result item
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F8",
    gap: 12,
  },
  resultInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 2,
  },
  userRating: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: "#16A34A",
    fontWeight: "500",
  },
  statusText: {
    fontSize: 12,
    color: "#DC2626",
  },

  // Invite button
  inviteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#2563EB",
  },
  inviteButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },

  // Disabled badge
  disabledBadge: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledBadgeText: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  // Empty
  emptyBox: {
    paddingTop: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
  },
});
