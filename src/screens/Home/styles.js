import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.BG },
  body: { padding: 16 },

  header: {
    backgroundColor: COLORS.BLUE,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sportPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    minWidth: 170,
  },
  sportText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerIcon: { padding: 6 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5ECFF",
    alignItems: "center",
    justifyContent: "center",
  },

  menuItem: {
    alignItems: "center",
    marginBottom: 18,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 29,
    backgroundColor: "#E6E6E6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  menuLabel: {
    textAlign: "center",
    color: "#434446",
    fontSize: 12,
    fontWeight: "500",
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 6,
    marginBottom: 10,
    color: "#1E2430",
  },

  bannerCard: {
    borderWidth: 2,
    borderColor: COLORS.BLUE,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  bannerImage: { width: width - 32, height: 200 },
  dots: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  dotActive: { backgroundColor: "#fff" },
});
