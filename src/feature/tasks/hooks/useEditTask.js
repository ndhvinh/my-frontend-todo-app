import { updateTask } from "../services/taskApi";

export function useEditTask(tasks, setTasks) {
  async function handleSaveEdit(editingIndex, editingTitle, editingText) {
    const taskToUpdate = tasks[editingIndex];

    try {
      //   setLoading(true);
      //   setError(null);
      const updatedTask = await updateTask({
        _id: taskToUpdate._id,
        title: editingTitle,
        text: editingText,
      });
      const updatedTasks = tasks.map((task, i) =>
        i === editingIndex ? updatedTask : task,
      );
      setTasks(updatedTasks);
    } catch (err) {
      //   setError(err.message);
      console.error("Error updating task:", err);
    }
    // finally {
    //   setLoading(false);
    // }
  }

  return { handleSaveEdit };
}
