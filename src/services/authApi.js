import { apiClient } from "./apiClient";
import { sanitizeUserPayload } from "./userService";

/**
 * REGISTER
 * response:
 * {
 *   message: string,
 *   email: string,
 *   otpExpiredAtUtc: string
 * }
 */
export async function register({
  fullName,
  email,
  password,
  phone,
  city,
  gender,
}) {
  const res = await apiClient.post(
    "/auths/register",
    {
      fullName,
      email,
      password,
      phone,
      city,
      gender,
    },
    { skipAuth: true },
  );

  return res.data;
}

/**
 * CONFIRM OTP
 * response:
 * {
 *   accessToken: string,
 *   expiresAtUtc: string,
 *   user: {...}
 * }
 */
export async function confirmOtp({ email, otp }) {
  const res = await apiClient.post(
    "/auths/confirm-otp",
    {
      email,
      otp,
    },
    { skipAuth: true },
  );

  const data = res.data;
  if (!data?.accessToken || !data?.user) {
    throw new Error("API trả về dữ liệu không hợp lệ (thiếu accessToken/user)");
  }

  return {
    ...data,
    user: sanitizeUserPayload(data.user),
  };
}

/**
 * RESEND OTP
 */
export async function resendOtp({ email }) {
  const res = await apiClient.post(
    "/auths/resend-otp",
    {
      email,
    },
    { skipAuth: true },
  );

  return res.data;
}

/**
 * FORGOT PASSWORD
 * 1. POST /api/auths/forgot-password { email }
 * 2. POST /api/auths/forgot-password/verify-otp { email, otp }
 * 3. POST /api/auths/forgot-password/reset { email, otp, newPassword, confirmPassword }
 */
export async function forgotPassword({ email }) {
  const res = await apiClient.post(
    "/auths/forgot-password",
    {
      email,
    },
    { skipAuth: true },
  );

  return res.data;
}

export async function verifyForgotPasswordOtp({ email, otp }) {
  const res = await apiClient.post(
    "/auths/forgot-password/verify-otp",
    {
      email,
      otp,
    },
    { skipAuth: true },
  );

  return res.data;
}

export async function resetPasswordWithOtp({
  email,
  otp,
  newPassword,
  confirmPassword,
}) {
  const res = await apiClient.post(
    "/auths/forgot-password/reset",
    {
      email,
      otp,
      newPassword,
      confirmPassword,
    },
    { skipAuth: true },
  );

  const data = res.data;
  if (!data?.accessToken || !data?.user) {
    throw new Error("API trả về dữ liệu không hợp lệ (thiếu accessToken/user)");
  }

  return {
    ...data,
    user: sanitizeUserPayload(data.user),
  };
}

/**
 * LOGIN
 */
export async function login({ identifier, password }) {
  const res = await apiClient.post(
    "/auths/login",
    {
      identifier,
      password,
    },
    { skipAuth: true },
  );

  const data = res.data;

  if (!data?.accessToken || !data?.user) {
    throw new Error("API trả về dữ liệu không hợp lệ (thiếu accessToken/user)");
  }

  return {
    ...data,
    user: sanitizeUserPayload(data.user),
  };
}

export async function logoutFromServer() {
  await apiClient.post("/auths/logout", null, {
    skipAuth: true,
    timeout: 3000,
    withCredentials: true,
  });
}
