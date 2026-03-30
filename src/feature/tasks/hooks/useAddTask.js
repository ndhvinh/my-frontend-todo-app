import { createTask } from "../services/taskApi";

export function useAddTask(tasks, setTasks) {
  async function handleAddTask(listId, title, text, checklist, taskType) {
    try {
      const newTaskData = await createTask(
        listId,
        title,
        text,
        checklist,
        taskType,
      );
      setTasks([newTaskData, ...tasks]);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  }

  return { handleAddTask };
}
