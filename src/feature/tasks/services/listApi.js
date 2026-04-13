import { request } from "./apiClient";

const API_URL = "/list";

export async function fetchList() {
  return request(API_URL, {
    fallbackMessage: "Không thể tải danh sách list",
  });
}

export async function fetchListName() {
  return request(`${API_URL}/name`, {
    fallbackMessage: "Không thể tải tên list",
  });
}

export async function createCategory(name) {
  return request(API_URL, {
    method: "POST",
    body: {
      name,
    },
    fallbackMessage: "Không thể thêm list",
  });
}

export async function updateCategoryName({ id, name }) {
  return request(`${API_URL}/${id}`, {
    method: "PATCH",
    body: {
      name,
    },
    fallbackMessage: "Không thể cập nhật list",
  });
}

export async function deleteCategoryById(id) {
  return request(`${API_URL}/${id}`, {
    method: "DELETE",
    fallbackMessage: "Không thể xoá list",
  });
}
