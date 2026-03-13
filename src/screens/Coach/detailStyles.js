import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F5FB",
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

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },

  topCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginBottom: 14,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },

  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E2430",
    textAlign: "center",
  },

  city: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },

  statusGood: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    color: "#16A34A",
  },

  statusBad: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    color: "#EF4444",
  },

  scoreRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },

  scoreBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  scoreLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },

  scoreValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E2430",
  },

  block: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },

  blockTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E2430",
    marginBottom: 8,
  },

  blockText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#374151",
  },

  emptyBlockText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});
