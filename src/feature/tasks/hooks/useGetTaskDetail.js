import { data } from "autoprefixer";
import { getTaskDetail } from "../services/taskApi";

export function useGetTaskDetail() {
  async function handleGetTaskDetail(id) {
    const data = await getTaskDetail(id);
    try {
    } catch (error) {
      setError(error.message);
      console.error("Error deleting task:", error);
    }
  }
  return { data };
}
