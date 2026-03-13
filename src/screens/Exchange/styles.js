import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#EEF2F8",
  },

  headerWrap: {
    backgroundColor: "#fff",
  },

  headerTop: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: {
    padding: 6,
    marginRight: 6,
  },

  headerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E2430",
  },

  headerRight: {
    marginLeft: "auto",
  },

  addBtn: {
    padding: 6,
  },

  searchRow: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 6,
  },

  searchBox: {
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1E2430",
  },

  filterRow: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },

  filterText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6B7280",
  },

  listPad: {
    paddingHorizontal: 12,
    paddingBottom: 18,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  coverImage: {
    width: "100%",
    height: 170,
    backgroundColor: "#E5E7EB",
  },

  coverFallback: {
    width: "100%",
    height: 170,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  coverFallbackText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },

  cardBody: {
    padding: 12,
  },

  statusRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#16A34A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  liveBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  clubName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  metaLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },

  metaText: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
  },

  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  statValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },

  actionRow: {
    marginTop: 14,
  },

  detailBtn: {
    height: 40,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  detailBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  emptyWrap: {
    paddingTop: 56,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
  },
});
