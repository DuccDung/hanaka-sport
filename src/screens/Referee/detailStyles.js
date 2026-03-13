import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#EEF2F8",
  },

  header: {
    height: 56,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  headerIconBtn: {
    padding: 6,
    width: 34,
    alignItems: "flex-start",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: "#1E2430",
  },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  scrollContent: {
    padding: 14,
    paddingBottom: 24,
  },

  topCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#D1D5DB",
  },

  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#1E2430",
  },

  city: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
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
    justifyContent: "space-between",
    gap: 12,
    marginTop: 14,
  },

  scoreBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },

  scoreLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },

  scoreValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E2430",
  },

  block: {
    marginTop: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
  },

  blockTitle: {
    fontSize: 14,
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
