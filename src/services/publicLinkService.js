import { apiClient } from "./apiClient";

/**
 * GET: /api/links
 * response:
 * {
 *   items: [
 *     {
 *       linkId,
 *       link,
 *       type
 *     }
 *   ]
 * }
 */
export async function publicGetLinks(type) {
  const res = await apiClient.get("/links", {
    params: type ? { type } : undefined,
  });
  return res.data;
}

function normalizeType(type) {
  return String(type || "")
    .trim()
    .toLowerCase();
}

function normalizePhone(phone) {
  const raw = String(phone || "").trim();
  if (!raw) return "";
  if (raw.startsWith("tel:")) return raw;
  return `tel:${raw}`;
}

function normalizeGmail(email) {
  const raw = String(email || "").trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;

  // mở trong webview bằng gmail compose
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    raw,
  )}`;
}

function normalizeCommonUrl(url) {
  const raw = String(url || "").trim();
  if (!raw) return "";

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  return `https://${raw}`;
}

/**
 * Map dữ liệu API sang item hiển thị contact
 * Mỗi type chỉ có 1 link
 */
export function mapLinksToContactUi(items = []) {
  return items
    .map((x) => {
      const type = normalizeType(x.type);
      const rawLink = String(x.link || "").trim();

      switch (type) {
        case "facebook":
          return {
            id: String(x.linkId),
            title: "Facebook",
            kind: "facebook",
            type,
            url: normalizeCommonUrl(rawLink),
            isPhone: false,
          };

        case "youtube":
          return {
            id: String(x.linkId),
            title: "Youtube",
            kind: "youtube",
            type,
            url: normalizeCommonUrl(rawLink),
            isPhone: false,
          };

        case "gmail":
          return {
            id: String(x.linkId),
            title: "Gmail",
            kind: "email",
            type,
            url: normalizeGmail(rawLink),
            isPhone: false,
          };

        case "phone":
          return {
            id: String(x.linkId),
            title: "Phone",
            kind: "phone",
            type,
            url: normalizePhone(rawLink),
            isPhone: true,
          };

        case "website":
          return {
            id: String(x.linkId),
            title: "Website",
            kind: "website",
            type,
            url: normalizeCommonUrl(rawLink),
            isPhone: false,
          };

        case "zalo":
          return {
            id: String(x.linkId),
            title: "Zalo",
            kind: "zalo",
            type,
            url: normalizeCommonUrl(rawLink),
            isPhone: false,
          };

        default:
          return {
            id: String(x.linkId),
            title: type || "Link",
            kind: "link",
            type,
            url: normalizeCommonUrl(rawLink),
            isPhone: false,
          };
      }
    })
    .filter((x) => !!x.url);
}

/**
 * Sắp xếp theo thứ tự mong muốn trên UI
 */
export function sortContactLinks(items = []) {
  const orderMap = {
    gmail: 1,
    email: 1,
    zalo: 2,
    phone: 3,
    website: 4,
    facebook: 5,
    youtube: 6,
    link: 999,
  };

  return [...items].sort((a, b) => {
    const oa = orderMap[a.type] ?? orderMap[a.kind] ?? 999;
    const ob = orderMap[b.type] ?? orderMap[b.kind] ?? 999;
    return oa - ob;
  });
}

/**
 * Helper dùng cho GuideScreen
 */
export async function getGuideScreenLinks() {
  const data = await publicGetLinks();
  const items = data?.items || [];

  const contactLinks = sortContactLinks(mapLinksToContactUi(items));

  return {
    contactLinks,
  };
}
