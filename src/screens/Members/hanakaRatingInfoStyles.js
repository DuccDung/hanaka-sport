import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  safeTop: {
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 56,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backBtn: {
    width: 32,
    height: 32,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#1E2430",
  },

  rightSpace: {
    width: 32,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 28,
  },

  heroCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginBottom: 16,
  },

  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },

  heroDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4B5563",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  badgePink: {
    minWidth: 48,
    height: 28,
    borderRadius: 999,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    paddingHorizontal: 12,
  },

  badgeBlue: {
    minWidth: 48,
    height: 28,
    borderRadius: 999,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    paddingHorizontal: 12,
  },

  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },

  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: "#4B5563",
  },

  bold: {
    fontWeight: "800",
    color: "#111827",
  },

  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4B5563",
    marginBottom: 12,
  },

  expItem: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  expLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  expLabel: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  expValue: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.BLUE,
  },

  noteBox: {
    marginTop: 4,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  noteText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    lineHeight: 20,
    color: "#1E40AF",
  },

  primaryBtn: {
    height: 54,
    borderRadius: 12,
    backgroundColor: COLORS.BLUE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },

  primaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
