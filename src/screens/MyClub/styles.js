// src/screens/Club/styles.js
import { StyleSheet, Dimensions, Platform } from "react-native";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.BG },

  header: {
    backgroundColor: COLORS.BLUE,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 0 : 8,
    paddingBottom: 12,
  },

  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  helloText: { color: "#E5ECFF", fontSize: 14, fontWeight: "500" },
  helloStrong: { color: "#fff", fontWeight: "700" },

  headerIcons: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerIconBtn: { padding: 6 },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E5ECFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  // tabs
  topTabs: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 10,
    padding: 4,
    gap: 6,
  },
  topTabBtn: {
    flex: 1,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  topTabBtnActive: { backgroundColor: "#fff" },
  topTabText: { fontSize: 13, fontWeight: "600", color: "#E5ECFF" },
  topTabTextActive: { color: "#1E2430" },

  // search
  searchRow: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 },
  searchBox: {
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#1E2430" },

  // list
  listPad: { paddingHorizontal: 16, paddingBottom: 18 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 14,
  },

  banner: { width: width - 32, height: 190 },

  cardBody: { padding: 12 },

  titleRow: { flexDirection: "row", alignItems: "center" },
  metaText: { fontSize: 16, fontWeight: "800", color: "#1E2430" },
  metaLight: { fontSize: 14, fontWeight: "700", color: "#1E2430" },
  shareBtn: { marginLeft: "auto", padding: 6 },

  ratingRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingText: { fontSize: 14, fontWeight: "800", color: "#1E2430" },
  starsRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  ratingLight: { fontSize: 13, fontWeight: "600", color: "#1E2430" },

  lineText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#1E2430",
  },
  lineStrong: { fontWeight: "800" },

  statsRow: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  statText: { fontSize: 14, fontWeight: "500", color: "#1E2430" },
  statStrong: { fontWeight: "800" },
  summaryRow: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  summaryText: {
    color: "#E5ECFF",
    fontSize: 12,
    fontWeight: "600",
  },

  badgeRow: {
    marginTop: 8,
    flexDirection: "row",
  },
  badge: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeManager: {
    backgroundColor: "#DCFCE7",
  },
  badgeMember: {
    backgroundColor: "#DBEAFE",
  },
  badgePending: {
    backgroundColor: "#FEF3C7",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E2430",
  },

  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#1E2430",
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#6B7280",
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  primaryActionBtn: {
    marginTop: 16,
    backgroundColor: COLORS.BLUE,
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryActionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
