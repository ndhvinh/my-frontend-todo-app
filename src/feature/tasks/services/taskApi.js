import { request } from "./apiClient";

const API_URL = "/tasks";

export const TASK_TYPE = Object.freeze({
  TEXT: "text",
  CHECKLIST: "check_list",
});

function normalizeTaskType(taskType) {
  const validTaskTypes = Object.values(TASK_TYPE);
  return validTaskTypes.includes(taskType) ? taskType : TASK_TYPE.TEXT;
}

export async function fetchTasks() {
  return request(API_URL, {
    fallbackMessage: "Không thể tải danh sách task",
  });
}

// Lấy danh sách task theo listId
export async function fetchTasksByListId(id) {
  return request(`${API_URL}/list/${id}`, {
    fallbackMessage: "Không thể tải danh sách task theo list",
  });
}

// Lưu task
export async function createTask(listId, title, text, checklist, taskType) {
  const normalizedTaskType = normalizeTaskType(taskType);

  const body = {
    listId,
    title,
    taskType: normalizedTaskType,
  };

  if (normalizedTaskType === TASK_TYPE.TEXT) {
    body.text = text;
  } else if (normalizedTaskType === TASK_TYPE.CHECKLIST) {
    body.checklist = checklist;
  }

  return request(API_URL, {
    method: "POST",
    body,
    fallbackMessage: "Không thể thêm task",
  });
}

// Xem chi tiết task
export async function getTaskDetail(id) {
  return request(`${API_URL}/${id}`, {
    fallbackMessage: "Không thể lấy chi tiết task",
  });
}

// Chỉnh sửa task
export async function updateTask(body) {
  return request(`${API_URL}/${body._id}`, {
    method: "PATCH",
    body,
    fallbackMessage: "Không thể cập nhật task",
  });
}

// Xoá task
export async function deleteTaskById(id) {
  return request(`${API_URL}/${id}`, {
    method: "DELETE",
    fallbackMessage: "Không thể xoá task",
  });
}
