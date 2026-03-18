import { deleteTaskById } from "../services/taskApi";

export function useDeleteTask(tasks, setTasks) {
  async function handleDeleteTask(index) {
    const taskToDelete = tasks[index];
    try {
      // setLoading(true);
      // setError(null);
      await deleteTaskById(taskToDelete._id);
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
    } catch (err) {
      // setError(err.message);
      console.error("Error deleting task:", err);
    }
    // finally {
    //     setLoading(false);
    // }
  }

  return { handleDeleteTask };
}
