import { Platform, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    backgroundColor: COLORS.BLUE,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 0 : 8,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  headerSub: {
    marginTop: 4,
    fontSize: 13,
    color: "#E5ECFF",
  },

  listPad: {
    padding: 16,
    paddingBottom: 20,
  },

  roomCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  roomAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E5E7EB",
  },
  roomAvatarFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  roomBody: {
    flex: 1,
  },
  roomTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  roomName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  roomTime: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },
  roomSub: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },
  roomLastMsg: {
    marginTop: 6,
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },

  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 10,
  },
  stateText: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
  },
  demoActionBtn: {
    marginTop: 12,
    backgroundColor: COLORS.BLUE,
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  demoActionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  roomHeader: {
    backgroundColor: COLORS.BLUE,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 0 : 10,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  roomHeaderBody: {
    flex: 1,
  },
  roomHeaderTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#fff",
  },
  roomHeaderSub: {
    marginTop: 2,
    fontSize: 12,
    color: "#E5ECFF",
  },

  msgListPad: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 10,
  },

  msgRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  msgRowMine: {
    justifyContent: "flex-end",
  },
  msgRowOther: {
    justifyContent: "flex-start",
  },

  msgAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E5E7EB",
  },
  msgAvatarFallback: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
  },

  msgBubbleWrap: {
    maxWidth: "78%",
  },
  msgSenderName: {
    marginBottom: 4,
    marginLeft: 2,
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
  },
  msgBubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  msgBubbleMine: {
    backgroundColor: COLORS.BLUE,
    borderBottomRightRadius: 6,
  },
  msgBubbleOther: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderBottomLeftRadius: 6,
  },
  msgText: {
    fontSize: 14,
    color: "#111827",
    lineHeight: 20,
  },
  msgTextMine: {
    color: "#fff",
  },
  msgMetaRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 4,
  },
  msgTime: {
    fontSize: 11,
    color: "#6B7280",
  },
  msgDelete: {
    fontSize: 11,
    color: "#DC2626",
    fontWeight: "700",
  },

  inputBar: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
});
