import { deleteCategoryById } from "../services/listApi";

export function useDeleteList(listName, setListName) {
  async function handleDeleteList(index) {
    const listTodelete = listName[index];
    try {
      await deleteCategoryById(listTodelete._id);
      const updatedList = await listName.filter((_, i) => i !== index);
      setListName(updatedList);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
  return { handleDeleteList };
}
