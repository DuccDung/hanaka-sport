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
  menuItemOuter: {
    borderRadius: 22,
    marginBottom: 16,
  },

  menuItemInner: {
    borderRadius: 22,
    backgroundColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    minHeight: 96,
  },

  menuItemPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  menuIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  menuLabel: {
    textAlign: "center",
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
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
