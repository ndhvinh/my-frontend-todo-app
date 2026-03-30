import React, { useEffect } from "react";
import { fetchTasks, fetchTasksByListId } from "../services/taskApi";

export function useFetchTasks() {
  const [tasks, setTasks] = React.useState([]);
  const [error, setError] = React.useState(null);

  async function loadTasks() {
    try {
      const res = await fetchTasks();
      setTasks(res);
    } catch (error) {
      setError(error);
      console.log("Error fetching tasks:", error);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return { tasks, setTasks, error };
}

export function useFetchTasksByListId(id) {
  const [tasks, setTasks] = React.useState([]);
  const [error, setError] = React.useState(null);

  async function loadTasks() {
    if (!id) {
      setTasks([]);
      return;
    }
    try {
      const res = await fetchTasksByListId(id);
      setTasks(res);
    } catch (error) {
      setError(error);
      console.log("Error fetching tasks:", error);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [id]);

  return { tasks, setTasks, error };
}
