import axios from "axios";

const locationClient = axios.create({
  baseURL: "https://api.vnappmob.com/api/v2/province",
  timeout: 15000,
});

/**
 * API công khai:
 * GET /province
 * GET /district/{province_id}
 */

export async function getProvinces() {
  const res = await locationClient.get("/");
  return res.data?.results || [];
}

export async function getDistrictsByProvinceId(provinceId) {
  if (!provinceId) return [];
  const res = await locationClient.get(`/district/${provinceId}`);
  return res.data?.results || [];
}
