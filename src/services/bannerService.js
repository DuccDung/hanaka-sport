import { apiClient } from "./apiClient";

/**
 * GET: /api/public/banners
 * return:
 * {
 *   items: [
 *     {
 *       bannerId,
 *       bannerKey,
 *       title,
 *       imageUrl,
 *       sortOrder
 *     }
 *   ]
 * }
 */
export async function publicGetBanners() {
  const res = await apiClient.get("/public/banners");
  return res.data;
}

/**
 * Map dữ liệu server -> format component BannerCarousel đang dùng
 * output:
 * [
 *   {
 *     key,
 *     title,
 *     image,
 *     bannerId,
 *     sortOrder
 *   }
 * ]
 */
export function mapPublicBannersToUi(items = []) {
  return items.map((x) => ({
    key: x.bannerKey || String(x.bannerId),
    title: x.title || "",
    image: x.imageUrl || "",
    bannerId: x.bannerId,
    sortOrder: x.sortOrder ?? 0,
  }));
}

/**
 * Helper dùng trực tiếp cho màn hình Home
 */
export async function getHomeBanners() {
  const data = await publicGetBanners();
  return mapPublicBannersToUi(data?.items || []);
}
