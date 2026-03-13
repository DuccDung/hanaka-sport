import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_PAD = 12;
const GAP = 10;
const IMG_W = (width - 24 - CARD_PAD * 2 - GAP) / 2;

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

  searchRow: { paddingHorizontal: 12, paddingBottom: 10, paddingTop: 6 },
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

  listPad: { paddingHorizontal: 12, paddingBottom: 18 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF2F8",
    overflow: "hidden",
    marginBottom: 12,
  },

  imgRow: { flexDirection: "row", gap: GAP, padding: CARD_PAD },

  img: {
    width: IMG_W,
    height: 120,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },

  imgFallback: {
    alignItems: "center",
    justifyContent: "center",
  },

  infoRow: {
    paddingHorizontal: CARD_PAD,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  left: { flex: 1, paddingRight: 10 },

  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 6,
  },

  line: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6B7280",
    marginBottom: 4,
  },

  strong: {
    fontWeight: "600",
    color: "#1E2430",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },

  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEF2F8",
    marginTop: 8,
  },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  footerLoading: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyWrap: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    fontSize: 15,
    color: "#6B7280",
  },
});
