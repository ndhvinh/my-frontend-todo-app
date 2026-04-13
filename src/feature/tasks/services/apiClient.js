const API_BASE_URL = "http://localhost:5001";

let pendingRequestCount = 0;
const listeners = new Set();

function notifyApiState(error = null) {
  const snapshot = {
    isLoading: pendingRequestCount > 0,
    pendingRequestCount,
    error,
  };

  listeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch {
      // Ignore listener errors to avoid breaking request flow
    }
  });
}

function beginRequest(trackGlobal) {
  if (!trackGlobal) return;
  pendingRequestCount += 1;
  notifyApiState();
}

function endRequest(trackGlobal) {
  if (!trackGlobal) return;
  pendingRequestCount = Math.max(0, pendingRequestCount - 1);
  notifyApiState();
}

export function subscribeApiState(listener) {
  listeners.add(listener);

  listener({
    isLoading: pendingRequestCount > 0,
    pendingRequestCount,
    error: null,
  });

  return () => {
    listeners.delete(listener);
  };
}

function getAuthToken() {
  return localStorage.getItem("authToken");
}

export async function request(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    withAuth = true,
    trackGlobal = true,
    suppressGlobalError = false,
    fallbackMessage = "Đã xảy ra lỗi",
  } = options;
  const finalHeaders = { ...headers };

  beginRequest(trackGlobal);

  try {
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

      if (!suppressGlobalError) {
        notifyApiState(error);
      }

      throw error;
    }

    return data;
  } catch (networkError) {
    if (!networkError?.status) {
      const error = new Error(
        networkError?.message || "Lỗi kết nối tới máy chủ",
      );
      error.status = 0;
      error.data = null;

      if (!suppressGlobalError) {
        notifyApiState(error);
      }

      throw error;
    }

    throw networkError;
  } finally {
    endRequest(trackGlobal);
  }
}

export { API_BASE_URL };
