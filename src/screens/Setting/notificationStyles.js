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
});
