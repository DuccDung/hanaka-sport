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
  headerRight: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerIconBtn: { padding: 6 },

  filterWrap: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 6,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 8,
  },

  searchBox: {
    height: 42,
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

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  datePickerBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  datePickerText: {
    fontSize: 13,
    color: "#1E2430",
    fontWeight: "500",
  },

  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  filterChipActive: {
    backgroundColor: "#DBEAFE",
    borderColor: "#93C5FD",
  },
  filterChipText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#1D4ED8",
    fontWeight: "700",
  },

  actionRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  clearBtn: {
    height: 40,
    minWidth: 100,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  clearBtnText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
  },
  filterBtn: {
    height: 40,
    minWidth: 130,
    borderRadius: 10,
    backgroundColor: COLORS.BLUE,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  filterBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  listPad: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 18 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 12,
  },

  bannerImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#E5E7EB",
  },
  bannerFallback: {
    width: "100%",
    height: 160,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  bannerFallbackText: {
    fontSize: 13,
    color: "#64748B",
  },

  cardBody: {
    padding: 12,
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 22,
  },

  subText: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },

  metaRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    flex: 1,
    fontSize: 13,
    color: "#475569",
  },

  infoGrid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  infoBox: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },

  bottomText: {
    marginTop: 12,
    fontSize: 12,
    color: "#64748B",
  },

  statusBadgeBase: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeTextBase: {
    fontSize: 12,
    fontWeight: "700",
  },

  statusBadgeOpen: {
    backgroundColor: "#DCFCE7",
  },
  statusBadgeTextOpen: {
    color: "#166534",
  },

  statusBadgeClosed: {
    backgroundColor: "#FEF3C7",
  },
  statusBadgeTextClosed: {
    color: "#92400E",
  },

  statusBadgeFinished: {
    backgroundColor: "#EDE9FE",
  },
  statusBadgeTextFinished: {
    color: "#5B21B6",
  },

  statusBadgeDraft: {
    backgroundColor: "#E2E8F0",
  },
  statusBadgeTextDraft: {
    color: "#334155",
  },

  footerLoader: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  footerLoaderText: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
  },

  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
  },

  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#1E2430",
  },
  emptyDesc: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 30,
  },
});
