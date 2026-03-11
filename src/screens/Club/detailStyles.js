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

  tabsRowNoHero: {
    marginTop: 0,
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
    marginBottom: 10,
  },

  emojiLine: {
    fontSize: 18,
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
    backgroundColor: "#EDEFF7",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 20,
  },

  searchMemberBox: {
    height: 54,
    borderRadius: 8,
    backgroundColor: "#E2E5EC",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },

  searchMemberInput: {
    flex: 1,
    fontSize: 16,
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

  memberRow: {
    minHeight: 66,
    backgroundColor: "#EDEFF7",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 10,
  },

  memberRowAlt: {
    backgroundColor: "#FFFFFF",
  },

  memberIndexText: {
    fontSize: 15,
    color: "#333333",
  },

  memberInfoCell: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 6,
  },

  memberAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },

  memberAvatarFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  memberNameBlock: {
    flex: 1,
    justifyContent: "center",
  },

  memberName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B2B2B",
    lineHeight: 20,
  },

  memberRole: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },

  memberScoreText: {
    fontSize: 16,
    color: "#333333",
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
