import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  settingsSafe: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },

  settingsHeader: {
    height: 56,
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  settingsBackBtn: {
    width: 28,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  settingsHeaderTitle: {
    flex: 1,
    textAlign: "left",
    marginLeft: 8,
    fontSize: 28,
    fontWeight: "800",
    color: "#1E2430",
  },

  settingsHeaderRight: {
    width: 28,
  },

  settingsScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },

  settingsSection: {
    marginBottom: 12,
  },

  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E2430",
    marginBottom: 14,
  },

  settingsDivider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginVertical: 8,
  },

  settingRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  settingLabel: {
    flex: 1,
    fontSize: 17,
    color: "#3B4252",
    fontWeight: "400",
    paddingRight: 12,
  },

  appVersionText: {
    fontSize: 17,
    color: "#4B5563",
    fontWeight: "400",
  },

  navRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  navRowLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingRight: 12,
  },

  navRowLabel: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: "#1F2937",
    fontWeight: "600",
  },

  sectionNote: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: "#64748B",
  },

  webViewSafe: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },

  webViewHeader: {
    height: 56,
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  webViewBackBtn: {
    width: 32,
    height: 32,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  webViewHeaderTitle: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700",
    color: "#1E2430",
    textAlign: "center",
  },

  webViewHeaderRight: {
    width: 32,
  },

  webViewContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },

  webView: {
    flex: 1,
  },

  webViewLoading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.WHITE,
  },

  webViewError: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: COLORS.WHITE,
  },

  webViewErrorTitle: {
    marginTop: 12,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    color: "#1E2430",
    textAlign: "center",
  },

  webViewErrorMessage: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.TEXT_SOFT,
    textAlign: "center",
  },

  webViewErrorUrl: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: "#94A3B8",
    textAlign: "center",
  },

  webViewErrorActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 18,
  },

  webViewRetryBtn: {
    minWidth: 96,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 14,
  },

  webViewRetryText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.WHITE,
  },

  webViewOpenBtn: {
    minWidth: 118,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 14,
  },

  webViewOpenText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E2430",
  },
});
