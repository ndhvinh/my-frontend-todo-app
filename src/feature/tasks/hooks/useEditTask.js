import { updateTask } from "../services/taskApi";
import { TASK_TYPE } from "../services/taskApi";

export function useEditTask(tasks, setTasks) {
  async function handleSaveEdit(
    editingIndex,
    editingTitle,
    editingText,
    editingChecklist,
    taskType,
  ) {
    const taskToUpdate = tasks[editingIndex];

    try {
      const updateBody = {
        _id: taskToUpdate._id,
        title: editingTitle,
      };

      if (taskType === TASK_TYPE.TEXT) {
        updateBody.text = editingText;
      } else if (taskType === TASK_TYPE.CHECKLIST) {
        updateBody.checklist = editingChecklist;
      }

      const updatedTask = await updateTask(updateBody);
      const updatedTasks = tasks.map((task, i) =>
        i === editingIndex ? updatedTask : task,
      );
      setTasks(updatedTasks);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  }

  return { handleSaveEdit };
}
