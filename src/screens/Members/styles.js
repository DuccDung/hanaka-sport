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
    gap: 10,
  },
  headerLink: { fontSize: 15, fontWeight: "700", color: "#1E2430" },

  searchRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 6,
  },
  searchBox: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#1E2430" },
  searchBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: COLORS.BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  sectionHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F8",
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 14, fontWeight: "400", color: "#1E2430" },
  sectionRightCols: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    width: 60,
    justifyContent: "space-between",
  },

  errorBox: {
    marginHorizontal: 12,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#991B1B",
  },
  retryBtn: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.BLUE,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "#6B7280",
  },

  item: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEF2F8",
  },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },

  mid: { flex: 1, paddingRight: 10 },
  name: { fontSize: 14, fontWeight: "600", color: "#1E2430" },

  metaRow: { flexDirection: "row", gap: 10, marginTop: 2, flexWrap: "wrap" },
  meta: { fontSize: 12, color: "#6B7280", fontWeight: "400" },

  subRow: { flexDirection: "row", gap: 10, marginTop: 6, flexWrap: "wrap" },
  gender: { fontSize: 12, color: "#1E2430", fontWeight: "400" },
  verified: { fontSize: 12, fontWeight: "400", color: "#16A34A" },

  right: {
    width: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  score: {
    width: 50,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "400",
    color: "#1E2430",
  },
});
