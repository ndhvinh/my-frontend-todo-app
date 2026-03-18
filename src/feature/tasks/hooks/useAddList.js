import { createCategory } from "../services/listApi";

export function useAddList(listName, setListName, setLoading, setError) {
  async function handleAddList(name) {
    try {
      //   setLoading(true);
      //   setError(null);
      const newListData = await createCategory(name);
      setListName([newListData, ...listName]);
    } catch (err) {
      setError(err.message);
      console.error("Error adding task:", err);
    } finally {
      //   setLoading(false);
    }
  }

  return { handleAddList };
}
