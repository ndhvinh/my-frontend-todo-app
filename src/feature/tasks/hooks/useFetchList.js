import { useEffect, useState } from "react";
import { fetchList, fetchListName } from "../services/listApi";

export function useFetchList() {
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  async function loadList() {
    try {
      const res = await fetchList();
      setList(res);
    } catch (error) {
      setError(error);
      console.log("Error fetching tasks:", error);
    }
  }

  useEffect(() => {
    loadList();
  }, []);

  return { list, error };
}

export function useFetchListName() {
  const [listName, setListName] = useState([]);
  const [error, setError] = useState(null);

  async function loadListName() {
    try {
      const res = await fetchListName();
      setListName(res);
    } catch (error) {
      setError(error);
      console.log("Error fetching tasks:", error);
    }
  }

  useEffect(() => {
    loadListName();
  }, []);

  return { listName, setListName, error, setError, loadListName };
}
