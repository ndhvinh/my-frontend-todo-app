import { useState } from "react";
import listCheckIcon from "../../../../assets/list-check-solid-full.svg";
import { TreeView } from "../../../../components";
import { AlertPopup } from "../../../../components/Popup/AlertPopup";
import {
  useAddList,
  useDeleteList,
  useEditList,
  useFetchList,
  useFetchListName,
} from "../../hooks";

function Sidebar({ onSelectCategory, selectedListId, onSelectedName }) {
  const isOverviewSelected = selectedListId === null;
  const { listName, setListName, loadListName } = useFetchListName();
  const { handleAddList } = useAddList(
    listName,
    setListName,
    // setLoading,
    // setError,
  );
  const { handleEditList } = useEditList(listName, setListName);
  const { handleDeleteList } = useDeleteList(listName, setListName);
  const [expandedItem, setExpandedItem] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [deletingCategoryIndex, setDeletingCategoryIndex] = useState(-1);
  const toggleExpand = () => {
    setExpandedItem(!expandedItem);
  };
  const [addCategory, setAddCategory] = useState(false);
  const [editCategory, setEditCategory] = useState(false);

  function handleAddCategory() {
    if (!addCategory) {
      setExpandedItem(true);
      setAddCategory(true);
    } else {
      return;
    }
  }
  const isDisabled =
    addCategory || editCategory ? "pointer-events-none opacity-50" : "";

  async function handleCreateCategory(name) {
    await handleAddList(name);
    // loadListName();
  }

  async function handleEditCategory(index, name) {
    await handleEditList(index, name);
  }

  async function handleDeleteCategory(index) {
    await handleDeleteList(index);
    onSelectCategory(null);
    onSelectedName(null);
  }

  function onClickDeleteCategory(index) {
    setDeletingCategoryIndex(index);
    setOpenDeleteAlert(true);
  }

  async function onConfirmDeleteCategory() {
    if (deletingCategoryIndex !== -1) {
      await handleDeleteCategory(deletingCategoryIndex);
    }
    setOpenDeleteAlert(false);
    setDeletingCategoryIndex(-1);
  }

  return (
    <aside className="w-70 h-full bg-[#fde8dc] p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 text-2xl font-bold mb-8">
        <img src={listCheckIcon} alt="My Tasks" className="w-8 h-8" />
        <span>My Tasks</span>
      </div>

      {/* Task Organizer Section */}
      <div className="flex flex-col flex-1 min-h-0 mb-6">
        <div
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-[15px] transition-colors hover:bg-[#f0825c]/20 ${
            isOverviewSelected ? "font-bold bg-[#f0825c]/20" : ""
          } ${isDisabled}`}
          onClick={() => {
            onSelectCategory(null);
            onSelectedName("OverView");
          }}
        >
          <span>OverView</span>
        </div>
        <TreeView
          title="Categories"
          subTitle={listName}
          expandedItem={expandedItem}
          toggleExpand={toggleExpand}
          isAdding={addCategory}
          toggleCloseInput={() => {
            setAddCategory(false);
          }}
          onSubmit={handleCreateCategory}
          onSelectItem={onSelectCategory}
          selectedId={selectedListId}
          onSelectedName={onSelectedName}
          onEditItem={handleEditCategory}
          isEditting={editCategory}
          setEditting={setEditCategory}
          onDeleteItem={onClickDeleteCategory}
        />
      </div>

      {openDeleteAlert && (
        <AlertPopup
          text="Bạn có chắc muốn xoá category này?"
          onClose={() => {
            setOpenDeleteAlert(false);
            setDeletingCategoryIndex(-1);
          }}
          onConfirm={onConfirmDeleteCategory}
        />
      )}

      {/* Add Task Button */}
      <button
        className={`mt-auto py-3.5 px-6 bg-[#f0825c] text-white border-none rounded-3xl text-base font-medium cursor-pointer transition-all opacity-80 hover:opacity-100 hover:bg-[#e06a45] ${isDisabled}`}
        onClick={handleAddCategory}
      >
        Add Category
      </button>
    </aside>
  );
}

export default Sidebar;
