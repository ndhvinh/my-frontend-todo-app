const API_BASE_URL = "http://localhost:5001";

function getAuthToken() {
  return localStorage.getItem("authToken");
}

export async function request(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    withAuth = true,
    fallbackMessage = "Đã xảy ra lỗi",
  } = options;
  const finalHeaders = { ...headers };

  if (withAuth) {
    const token = getAuthToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  if (body !== undefined && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || data?.error || fallbackMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export { API_BASE_URL };
