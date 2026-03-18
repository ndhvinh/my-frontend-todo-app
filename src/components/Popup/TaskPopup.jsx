import { useState, useEffect } from "react";
import { ScrollContainer } from "../ScrollContainer/ScrollContainer";

export function TaskPopup({
  onClickDone,
  onAddTask,
  onEditTask,
  listId,
  index,
  taskData,
  setTaskData,
  setEditingIndex,
}) {
  const [title, setTitle] = useState(taskData?.title || "");
  const [content, setContent] = useState(taskData?.text || "");

  function handleTitleChange(event) {
    setTitle(event.target.value);
  }

  function handleContentChange(event) {
    setContent(event.target.value);
  }

  function handleClosePopup() {
    setTaskData(null);
    setEditingIndex(-1);
    onClickDone(false);
  }

  async function handleClickDone() {
    if (title.trim() !== "" && content.trim() !== "" && index === -1) {
      await onAddTask(listId, title, content);
    } else if (index !== -1) {
      await onEditTask(index, title, content);
    }
    handleClosePopup();
  }
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleClosePopup}
    >
      <div
        className="flex flex-col max-h-80% h-[60%] w-[40%] bg-white p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          className="text-xl font-bold mb-4 outline-none"
          value={title}
          onChange={handleTitleChange}
          placeholder="Add New Task"
        />
        <textarea
          className="flex-1 mb-4 h-full w-full outline-none resize-none scrollbar-thin overscroll-contain scrollbar-track-transparent"
          value={content}
          onChange={handleContentChange}
          placeholder="Here you can add a new task."
        />
        <div className="flex gap-1 justify-end mt-auto">
          <button
            className="flex-1 px-4 py-2 bg-[#f0825c]
                    text-white rounded hover:bg-[#d96b3f] justify-self-end"
            onClick={handleClickDone}
          >
            Done
          </button>
          <button className="w-[5%] font-bold bg-gray-500 text-white rounded hover:bg-gray-600 justify-self-end">
            ⋮
          </button>
        </div>
      </div>
    </div>
  );
}
