import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  container: { padding: 16, paddingBottom: 28 },

  avatarWrap: { alignItems: "center", marginTop: 4, marginBottom: 10 },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  statusText: { textAlign: "center", color: "#374151" },
  statusBold: { fontWeight: "800", color: "#111827" },
  subStatus: { textAlign: "center", marginTop: 4, color: "#9CA3AF" },

  card: {
    marginTop: 14,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },

  label: { fontSize: 13, fontWeight: "700", color: "#111827", marginBottom: 6 },

  input: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    color: "#111827",
  },
  inputDisabled: {
    opacity: 0.7,
  },

  rowInput: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  select: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectDisabled: { opacity: 0.7 },
  selectText: { color: "#111827" },

  textarea: {
    minHeight: 120,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F3F4F6",
    color: "#111827",
    textAlignVertical: "top",
  },

  btn: {
    height: 46,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    flexDirection: "row",
  },
  btnDisabled: { opacity: 0.6 },

  btnPrimary: { backgroundColor: "#1D4ED8" },
  btnPrimaryText: { color: "#fff", fontWeight: "800" },

  btnOutline: {
    borderWidth: 2,
    borderColor: "#1D4ED8",
    backgroundColor: "#fff",
  },
  btnOutlineText: { color: "#1D4ED8", fontWeight: "800" },

  btnGreen: { backgroundColor: "#22C55E" },
  btnGreenText: { color: "#fff", fontWeight: "800" },

  btnDanger: {
    borderWidth: 2,
    borderColor: "#EF4444",
    backgroundColor: "#fff",
  },
  btnDangerText: { color: "#EF4444", fontWeight: "900" },

  btnGray: { backgroundColor: "#F3F4F6" },
  btnGrayText: { color: "#9CA3AF", fontWeight: "700" },
});
