import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 56,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },

  headerIconBtn: {
    padding: 6,
  },

  headerTitle: {
    flex: 1,
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#1E2430",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingTabWrap: {
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingBottom: 24,
    backgroundColor: "#F1F3F9",
  },

  heroWrap: {
    position: "relative",
    backgroundColor: "#fff",
  },

  heroImage: {
    width: "100%",
    height: 148,
    backgroundColor: "#F3F4F6",
  },

  heroFallback: {
    alignItems: "center",
    justifyContent: "center",
  },

  avatarFloating: {
    position: "absolute",
    left: 20,
    bottom: -28,
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#fff",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },

  tabsRow: {
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    backgroundColor: "#fff",
  },

  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
    paddingBottom: 10,
    position: "relative",
  },

  tabText: {
    fontSize: 15,
    fontWeight: "400",
    color: "#3F3F46",
  },

  tabTextActive: {
    fontWeight: "700",
    color: "#1E2430",
  },

  tabUnderline: {
    position: "absolute",
    bottom: 0,
    width: "72%",
    height: 3,
    borderRadius: 3,
    backgroundColor: "#3157C7",
  },

  tabContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    backgroundColor: "#fff",
  },

  overviewWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  statTopBox: {
    flex: 1,
  },

  statTopLabel: {
    fontSize: 14,
    color: "#404040",
  },

  statTopValue: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "500",
    color: "#1E2430",
  },

  matchSummaryWrap: {
    marginBottom: 12,
  },

  matchSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  matchSummaryText: {
    fontSize: 14,
    color: "#404040",
  },

  matchBarTrack: {
    height: 4,
    borderRadius: 999,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
  },

  matchBarWin: {
    backgroundColor: "#22C55E",
  },

  matchBarDraw: {
    backgroundColor: "#FACC15",
  },

  matchBarLoss: {
    backgroundColor: "#EF4444",
  },

  levelRow: {
    marginBottom: 6,
  },

  levelText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1E2430",
  },

  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 18,
    flexWrap: "wrap",
  },

  reviewLabel: {
    fontSize: 14,
    color: "#52525B",
  },

  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  sectionTitle: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "800",
    color: "#1E2430",
    marginBottom: 12,
  },

  descCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    padding: 14,
    marginBottom: 14,
  },

  descText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#404040",
  },

  infoBlock: {
    gap: 8,
    paddingBottom: 20,
  },

  infoLine: {
    fontSize: 15,
    lineHeight: 23,
    color: "#404040",
  },

  infoBold: {
    fontWeight: "800",
    color: "#1F2937",
  },

  challengeCard: {
    marginTop: 4,
    marginBottom: 20,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
  },

  challengeHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  challengeTitleWrap: {
    flex: 1,
  },

  challengeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  challengeDesc: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
  },

  challengeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  challengeBadgeOn: {
    backgroundColor: "#DCFCE7",
  },

  challengeBadgeOff: {
    backgroundColor: "#F3F4F6",
  },

  challengeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },

  challengeBtn: {
    marginTop: 14,
    minHeight: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  challengeBtnEnable: {
    backgroundColor: "#16A34A",
  },

  challengeBtnDisable: {
    backgroundColor: "#DC2626",
  },

  challengeBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },

  emptyTabWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },

  emptyTabText: {
    marginTop: 10,
    fontSize: 15,
    color: "#6B7280",
  },

  memberTabWrap: {
    backgroundColor: "#F3F5FB",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 20,
  },

  searchMemberBox: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  searchMemberInput: {
    flex: 1,
    fontSize: 15,
    color: "#1E2430",
  },

  memberHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
    marginBottom: 8,
  },

  memberHeaderText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#404040",
  },

  colIndex: {
    width: 38,
    textAlign: "center",
  },

  colMember: {
    flex: 1,
  },

  colScore: {
    width: 72,
    textAlign: "center",
  },

  memberCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  memberCardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  memberLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },

  memberIndexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    color: "#3157C7",
    textAlign: "center",
    lineHeight: 28,
    fontWeight: "700",
    fontSize: 13,
    marginRight: 10,
  },

  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },

  memberAvatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  memberNameBlock: {
    flex: 1,
    minWidth: 0,
  },

  memberName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    lineHeight: 20,
  },

  memberRole: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  memberStatsRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },

  memberStatBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  memberStatLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },

  memberStatValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  memberActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },

  actionBtn: {
    minHeight: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  actionBtnApprove: {
    backgroundColor: "#16A34A",
  },

  actionBtnReject: {
    backgroundColor: "#DC2626",
  },

  actionBtnRole: {
    backgroundColor: "#3157C7",
  },

  actionBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  memberEmptyWrap: {
    paddingVertical: 30,
    alignItems: "center",
  },

  memberEmptyText: {
    fontSize: 15,
    color: "#6B7280",
  },
});
