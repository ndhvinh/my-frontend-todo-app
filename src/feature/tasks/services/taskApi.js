const API_URL = "http://localhost:5001/tasks";

export async function fetchTasks() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

  return data;
}

// Lấy danh sách task theo listId
export async function fetchTasksByListId(id) {
  const response = await fetch(`${API_URL}/list/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

  return data;
}

// Lưu task
export async function createTask(listId, title, text, taskType) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      listId,
      title,
      text,
      taskType: "text",
      completed: false,
    }),
  });
  if (!response.ok) throw new Error("Không thể thêm task");
  return response.json();
}

// Xem chi tiết task
export async function getTaskDetail(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

  return data;
}

// Chỉnh sửa task
export async function updateTask(body) {
  const response = await fetch(`${API_URL}/${body._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("Không thể cập nhật task");
  return response.json();
}

// Xoá task
export async function deleteTaskById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}
