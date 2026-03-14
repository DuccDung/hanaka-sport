import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  // styles cũ của bạn...
  // AccountScreen
  // ChangePasswordScreen
  // SettingsScreen
  // NotificationScreen

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

  languageRow: {
    flexDirection: "row",
    gap: 12,
  },

  languageButton: {
    minWidth: 130,
    height: 46,
    borderWidth: 1,
    borderColor: "#D9DDE6",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "#FAFAFA",
  },

  languageButtonActive: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: "#F6F9FF",
  },

  languageButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
    marginRight: 8,
  },

  languageButtonTextActive: {
    color: COLORS.PRIMARY,
    fontWeight: "700",
  },

  flagText: {
    fontSize: 18,
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

  // =========================
  // NOTIFICATION SCREEN
  // =========================
  notificationSafe: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },

  notificationHeader: {
    height: 56,
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  notificationBackBtn: {
    width: 28,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  notificationHeaderTitle: {
    flex: 1,
    textAlign: "left",
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "800",
    color: "#1E2430",
  },

  notificationHeaderRight: {
    width: 28,
  },

  notificationListContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 24,
  },

  notificationCard: {
    backgroundColor: "#F1F1F1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    marginBottom: 18,
  },

  notificationTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#252525",
    marginBottom: 8,
  },

  notificationMessage: {
    fontSize: 13,
    color: "#8C8C8C",
    lineHeight: 18,
    marginBottom: 8,
  },

  notificationTime: {
    fontSize: 12,
    color: "#9A9A9A",
    textAlign: "right",
    fontWeight: "500",
  },
  // =========================
  // GUIDE SCREEN
  // =========================
  guideSafe: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },

  guideHeader: {
    height: 56,
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  guideBackBtn: {
    width: 28,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  guideHeaderTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "800",
    color: "#222222",
  },

  guideScrollContent: {
    paddingBottom: 28,
  },

  guideTopList: {
    paddingTop: 2,
  },

  guideLinkRow: {
    minHeight: 50,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.WHITE,
  },

  guideLinkText: {
    flex: 1,
    fontSize: 15,
    color: "#4B4B4B",
    fontWeight: "500",
    paddingRight: 12,
  },

  guideDivider: {
    height: 1,
    backgroundColor: "#E6E6E6",
    marginTop: 8,
    marginBottom: 10,
  },

  guideSectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222222",
    paddingHorizontal: 18,
    marginBottom: 14,
  },

  guideContactList: {
    paddingHorizontal: 18,
  },

  guideContactCard: {
    height: 56,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  guideContactLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  guideContactIcon: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  guideContactText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2C2C2C",
  },

  zaloCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EAF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  zaloText: {
    fontSize: 8,
    color: "#1D63FF",
    fontWeight: "800",
  },

  guideBottomBox: {
    marginTop: 10,
    backgroundColor: "#F8F8F8",
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  guideBottomHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  guideBottomTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#2C2C2C",
    paddingRight: 12,
  },

  guideBottomActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  guideAddButton: {
    height: 32,
    minWidth: 96,
    borderRadius: 6,
    backgroundColor: "#F4B62A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    gap: 6,
  },

  guideAddButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  guideSupportList: {
    marginTop: 14,
    gap: 10,
  },

  guideSupportItem: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E4",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  guideSupportItemText: {
    flex: 1,
    fontSize: 14,
    color: "#2C2C2C",
    fontWeight: "600",
    paddingRight: 10,
  },

  // =========================
  // WEBVIEW SCREEN
  // =========================
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
    borderBottomColor: "#F0F0F0",
  },

  webViewBackBtn: {
    width: 28,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  webViewHeaderTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "800",
    color: "#222222",
  },

  webViewHeaderRight: {
    width: 28,
  },

  webViewContainer: {
    flex: 1,
    position: "relative",
  },

  webViewLoading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.65)",
  },
  guideEmptyWrap: {
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  guideEmptyText: {
    fontSize: 14,
    color: "#999999",
  },
});
