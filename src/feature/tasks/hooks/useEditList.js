import { updateCategoryName } from "../services/listApi";

export function useEditList(listName, setListName) {
  async function handleEditList(editingIndex, editingName) {
    const listToUpdate = listName[editingIndex];
    console.log("listToUpdate :", typeof listToUpdate._id);

    try {
      //   setLoading(true);
      //   setError(null);
      const updatedList = await updateCategoryName({
        id: listToUpdate._id,
        name: editingName,
      });
      const updatedLists = listName.map((list, i) =>
        i === editingIndex ? updatedList : list,
      );
      setListName(updatedLists);
    } catch (err) {
      //   setError(err.message);
      console.error("Error updating task:", err);
    }
    // finally {
    //   setLoading(false);
    // }
  }

  return { handleEditList };
}
