const API_URL = "http://localhost:5001/list";

export async function fetchList() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

  return data;
}

export async function fetchListName() {
  const response = await fetch(`${API_URL}/name`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

  return data;
}

export async function createCategory(name) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
    }),
  });
  if (!response.ok) throw new Error("Không thể thêm list");
  return response.json();
}

export async function updateCategoryName({ id, name }) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
    }),
  });
  if (!response.ok) throw new Error("Không thể cập nhật list");
  return response.json();
}

export async function deleteCategoryById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Không thể xoá list");
  return response.json();
}
