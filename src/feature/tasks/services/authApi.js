import { request } from "./apiClient";

const API_URL = "/auth";

function postAuth(path, payload, fallbackMessage) {
  return request(`${API_URL}${path}`, {
    method: "POST",
    body: payload,
    withAuth: false,
    fallbackMessage,
  });
}

export async function register(username, email, password) {
  return postAuth(
    "/register",
    {
      username,
      email,
      password,
    },
    "Đăng ký thất bại",
  );
}

export async function verifyEmail(email, code) {
  return postAuth(
    "/verify-email",
    {
      email,
      code,
    },
    "Xác thực email thất bại",
  );
}

export async function login(identifier, password) {
  return postAuth(
    "/login",
    {
      identifier,
      password,
    },
    "Đăng nhập thất bại",
  );
}

export async function resendVerificationCode(email) {
  return postAuth("/resend-code", { email }, "Không thể gửi lại mã xác thực");
}

export function loginWithGoogle(idToken) {
  return postAuth(`/google`, { idToken }, "Không thể sử dụng tính năng này");
}

export async function me() {
  return request(`${API_URL}/me`, {
    method: "GET",
    withAuth: true,
    fallbackMessage: "Không thể lấy thông tin người dùng",
  });
}
