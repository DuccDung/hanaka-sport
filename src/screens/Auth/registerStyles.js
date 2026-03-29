import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  safeTop: {
    backgroundColor: "#FFFFFF",
  },

  headerWrap: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  headerTop: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  centerWrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  sectionDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: "#6B7280",
    marginBottom: 18,
  },

  fieldBlock: {
    marginTop: 12,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E2430",
  },

  optionalText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },

  inputWrap: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
  },

  inputWrapFocused: {
    borderColor: COLORS.BLUE,
    backgroundColor: "#FFFFFF",
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    paddingVertical: 12,
  },

  eyeBtn: {
    position: "absolute",
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  hint: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: "#6B7280",
  },

  genderRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },

  genderOption: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  genderOptionActive: {
    backgroundColor: COLORS.BLUE,
    borderColor: COLORS.BLUE,
  },

  genderText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  genderTextActive: {
    color: "#FFFFFF",
  },

  helperBox: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
  },

  errorBox: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },

  submitBtn: {
    marginTop: 18,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  submitBtnActive: {
    backgroundColor: COLORS.BLUE,
  },

  submitText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#9CA3AF",
  },

  submitTextActive: {
    color: "#FFFFFF",
  },

  footerRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },

  footerText: {
    fontSize: 13,
    color: "#6B7280",
  },

  footerLink: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.BLUE,
  },
});
