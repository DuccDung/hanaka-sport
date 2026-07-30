import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  headerMeasureWrap: {
    position: "relative",
    zIndex: 2,
  },

  watermarkLayer: {
    position: "absolute",
    right: 0,
    left: 0,
    zIndex: 0,
    alignItems: "center",
  },

  watermarkLogo: {},

  body: {
    position: "relative",
    zIndex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },

  header: {
    position: "relative",
    zIndex: 2,
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: COLORS.BLUE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  brandWrap: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  brandMark: {
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  brandTitle: {
    flex: 1,
    minWidth: 0,
    color: COLORS.WHITE,
    fontWeight: "800",
    letterSpacing: 0,
  },

  headerRight: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  headerActionButton: {
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerAvatarButton: {
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  menuGrid: {
    position: "relative",
    zIndex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 28,
  },

  menuCard: {
    borderRadius: 8,
    backgroundColor: COLORS.BLUE,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    shadowColor: "#073B75",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },

  menuItemPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  menuIconWrap: {
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },

  menuLabel: {
    color: COLORS.WHITE,
    fontWeight: "800",
    lineHeight: 19,
    textAlign: "center",
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionTitle: {
    color: "#17233B",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
    letterSpacing: 0,
  },

  tournamentList: {
    gap: 14,
  },

  tournamentCard: {
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#1F2937",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },

  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },

  tournamentImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#DCE8F6",
  },

  tournamentBody: {
    padding: 12,
  },

  tournamentTitle: {
    color: "#1E2430",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24,
  },

  tournamentInfoText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    marginTop: 6,
  },

  tournamentStrong: {
    color: "#1E2430",
    fontWeight: "700",
  },

  tournamentInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  tournamentInfoLeft: {
    flex: 1,
  },

  tournamentInfoRight: {
    flexShrink: 0,
    maxWidth: "42%",
    textAlign: "left",
  },

  sectionStateCard: {
    minHeight: 118,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8E5F1",
    backgroundColor: "rgba(255,255,255,0.86)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    gap: 10,
  },

  sectionStateText: {
    color: COLORS.TEXT_SOFT,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },

  sectionErrorText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
  },

  retryButton: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: COLORS.BLUE,
    alignItems: "center",
    justifyContent: "center",
  },

  retryButtonText: {
    color: COLORS.WHITE,
    fontSize: 13,
    fontWeight: "800",
  },
});
