import { apiClient } from "./apiClient";
import { saveAuthSession } from "./authStorage";

/**
 * payload:
 * { fullName: string, email: string, password: string }
 *
 * response mẫu bạn đưa:
 * {
 *  accessToken: string,
 *  expiresAtUtc: string,
 *  user: {...}
 * }
 */
export async function register({ fullName, email, password }) {
  const res = await apiClient.post("/auths/register", {
    fullName,
    email,
    password,
  });
  const data = res.data;

  if (!data?.accessToken || !data?.user) {
    throw new Error("API trả về dữ liệu không hợp lệ (thiếu accessToken/user)");
  }
  return data;
}
/**
 * Login bằng email hoặc phone
 * payload:
 * {
 *   identifier: string,
 *   password: string
 * }
 *
 * response:
 * {
 *   accessToken: string,
 *   expiresAtUtc: string,
 *   user: {...}
 * }
 */
export async function login({ identifier, password }) {
  const res = await apiClient.post("/auths/login", {
    identifier,
    password,
  });

  const data = res.data;

  if (!data?.accessToken || !data?.user) {
    throw new Error("API trả về dữ liệu không hợp lệ (thiếu accessToken/user)");
  }

  return data;
}
