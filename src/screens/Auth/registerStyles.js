import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  headerWrap: { backgroundColor: "#fff" },
  headerTop: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { padding: 6, marginRight: 6 },
  headerTitle: { fontSize: 15, fontWeight: "600", color: "#1E2430" },

  centerWrap: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    backgroundColor: "#fff",
  },

  label: { fontSize: 13, fontWeight: "700", color: "#1E2430", marginBottom: 8 },

  inputWrap: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, fontSize: 15, color: "#1E2430" },

  eyeBtn: { position: "absolute", right: 10, padding: 6 },

  hint: { marginTop: 8, fontSize: 12, color: "#6B7280" },

  submitBtn: {
    marginTop: 14,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnActive: { backgroundColor: COLORS.BLUE },

  submitText: { fontSize: 15, fontWeight: "700", color: "#9CA3AF" },
  submitTextActive: { color: "#fff" },

  footerRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { fontSize: 13, color: "#6B7280" },
  footerLink: { fontSize: 13, fontWeight: "700", color: COLORS.BLUE },
});
