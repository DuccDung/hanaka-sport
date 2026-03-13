import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const HORIZONTAL = 12;
const HERO_WIDTH = width - HORIZONTAL * 2;
const GALLERY_GAP = 8;
const GALLERY_ITEM_WIDTH = (width - HORIZONTAL * 2 - GALLERY_GAP) / 2;

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
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#1E2430",
  },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingBottom: 24,
  },

  heroWrap: {
    marginTop: 12,
  },

  heroList: {
    paddingHorizontal: HORIZONTAL,
  },

  heroImage: {
    width: HERO_WIDTH,
    height: 250,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    marginRight: 10,
  },

  heroFallback: {
    marginHorizontal: HORIZONTAL,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    marginHorizontal: HORIZONTAL,
    marginTop: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F8",
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E2430",
    marginBottom: 10,
  },

  line: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
    marginBottom: 8,
  },

  strong: {
    fontWeight: "600",
    color: "#1E2430",
  },

  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  primaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  primaryBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  secondaryBtnText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "700",
  },

  galleryBlock: {
    marginHorizontal: HORIZONTAL,
    marginTop: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F8",
  },

  galleryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E2430",
    marginBottom: 12,
  },
  galleryList: {
    gap: 10,
  },

  galleryImage: {
    width: "100%",
    height: 190,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
});
