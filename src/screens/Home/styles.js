import { StyleSheet, Dimensions, Platform } from "react-native";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  body: {
    padding: 16,
  },

  header: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 0 : 6,
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

  sportText: {
    color: COLORS.WHITE,
    fontWeight: "700",
    fontSize: 16,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerIcon: {
    padding: 6,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FDEBED",
    alignItems: "center",
    justifyContent: "center",
  },

  /* MENU */
  radialMenu: {
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  radialRing: {
    position: "absolute",
    top: "9%",
    right: "9%",
    bottom: "9%",
    left: "9%",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(10,102,194,0.18)",
    backgroundColor: "rgba(255,255,255,0.42)",
  },

  radialCenter: {
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: COLORS.WHITE,
    borderWidth: 3,
    borderColor: "rgba(10,102,194,0.24)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#0A3769",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },

  radialLogo: {
    width: 148,
    height: 148,
    borderRadius: 74,
  },

  radialButton: {
    position: "absolute",
    backgroundColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    shadowColor: "#073B75",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 5,
  },

  menuItemPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  radialIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },

  radialLabel: {
    textAlign: "center",
    color: COLORS.WHITE,
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 11,
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
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  bannerImage: {
    width: width - 32,
    height: 200,
  },

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

  dotActive: {
    backgroundColor: "#fff",
  },
});
