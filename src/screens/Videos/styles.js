// src/screens/Videos/styles.js
import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.BG },

  header: {
    backgroundColor: COLORS.BLUE,
    paddingHorizontal: 16,
    paddingTop: 8,
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
  metaText: { fontSize: 13, fontWeight: "700", color: "#1E2430" },
  metaLight: { fontSize: 13, fontWeight: "600", color: "#1E2430" },
  shareBtn: { marginLeft: "auto", padding: 6 },

  mainTitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: "#1E2430",
    lineHeight: 18,
  },

  playersGrid: {
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
  },
  teamCol: { flex: 1, gap: 10 },

  playerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  playerAvatar: { width: 28, height: 28, borderRadius: 14 },
  playerName: { fontSize: 13, fontWeight: "600", color: "#1E2430" },

  scoreUnder: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginLeft: 36, // canh dưới avatar
    marginTop: 2,
  },
  scoreSmall: { fontSize: 12, fontWeight: "400", color: "#1E2430" },
});
