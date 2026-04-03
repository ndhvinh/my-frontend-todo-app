import { useState, useEffect } from "react";
import { TaskMoreMenu } from "./TaskMoreMenu";
import { TASK_TYPE } from "../../feature/tasks/services/taskApi";

function parseChecklistText(value = "") {
  if (!value.trim()) return [{ checked: false, text: "" }];

  const lines = value.split("\n");
  const parsedItems = lines
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const checked = /^\s*-\s*\[x\]/i.test(line);
      const text = line.replace(/^\s*-\s*\[[ xX]\]\s*/, "").trim();
      return { checked, text };
    });

  return parsedItems.length ? parsedItems : [{ checked: false, text: "" }];
}

function normalizeChecklistItems(value) {
  if (Array.isArray(value)) {
    const normalized = value.map((item) => ({
      checked: Boolean(item?.checked),
      text: typeof item?.text === "string" ? item.text : "",
    }));

    return normalized.length ? normalized : [{ checked: false, text: "" }];
  }

  if (typeof value === "string") {
    return parseChecklistText(value);
  }

  return [{ checked: false, text: "" }];
}

export function TaskPopup({
  onClickDone,
  onAddTask,
  onEditTask,
  listId,
  isOverviewMode = false,
  listOptions = [],
  index,
  taskData,
  setTaskData,
  setEditingIndex,
  onDeleteTask,
}) {
  const initialTaskType = taskData?.taskType || TASK_TYPE.TEXT;
  const [title, setTitle] = useState(taskData?.title || "");
  const [content, setContent] = useState(
    initialTaskType === TASK_TYPE.TEXT ? taskData?.text || "" : "",
  );
  const [taskType, setTaskType] = useState(initialTaskType);
  const [checklistItems, setChecklistItems] = useState(
    initialTaskType === TASK_TYPE.CHECKLIST
      ? normalizeChecklistItems(taskData?.checklist ?? taskData?.text)
      : [{ checked: false, text: "" }],
  );

  const [openMoreMenu, setOpenMoreMenu] = useState(false);
  const [selectedCreateListId, setSelectedCreateListId] = useState(
    listId || "",
  );
  const isEditMode = index !== -1;
  const showListSelector = !isEditMode && isOverviewMode;

  useEffect(() => {
    const nextTaskType = taskData?.taskType || TASK_TYPE.TEXT;
    setTaskType(nextTaskType);
    setTitle(taskData?.title || "");

    if (nextTaskType === TASK_TYPE.CHECKLIST) {
      setChecklistItems(
        normalizeChecklistItems(taskData?.checklist ?? taskData?.text),
      );
      setContent("");
    } else {
      setContent(taskData?.text || "");
      setChecklistItems([{ checked: false, text: "" }]);
    }
  }, [taskData]);

  useEffect(() => {
    if (!showListSelector) {
      setSelectedCreateListId(listId || "");
      return;
    }

    if (selectedCreateListId) return;

    if (Array.isArray(listOptions) && listOptions.length > 0) {
      setSelectedCreateListId(listOptions[0]._id || "");
    }
  }, [showListSelector, listId, listOptions, selectedCreateListId]);

  function handleTitleChange(event) {
    setTitle(event.target.value);
  }

  function handleContentChange(event) {
    setContent(event.target.value);
  }

  function handleChecklistItemChange(itemIndex, field, value) {
    setChecklistItems((prev) =>
      prev.map((item, i) =>
        i === itemIndex ? { ...item, [field]: value } : item,
      ),
    );
  }

  function handleAddChecklistItem() {
    setChecklistItems((prev) => [...prev, { checked: false, text: "" }]);
  }

  function handleRemoveChecklistItem(itemIndex) {
    setChecklistItems((prev) => {
      const nextItems = prev.filter((_, i) => i !== itemIndex);
      return nextItems.length ? nextItems : [{ checked: false, text: "" }];
    });
  }

  function handleSwitchTaskType(nextType) {
    if (isEditMode || nextType === taskType) return;

    setTaskType(nextType);
    setOpenMoreMenu(false);

    if (nextType === TASK_TYPE.TEXT) {
      setContent("");
      setChecklistItems([{ checked: false, text: "" }]);
      return;
    }

    setContent("");
    setChecklistItems([{ checked: false, text: "" }]);
  }

  function handleClosePopup() {
    setOpenMoreMenu(false);
    setTaskData(null);
    setEditingIndex(-1);
    onClickDone(false);
  }

  async function handleDeleteInPopup() {
    if (isEditMode && onDeleteTask) {
      await onDeleteTask(index);
    }
    handleClosePopup();
  }

  async function handleClickDone() {
    if (title.trim() === "") return;

    const text = taskType === TASK_TYPE.TEXT ? content : "";
    const checklist =
      taskType === TASK_TYPE.CHECKLIST ? checklistItems : undefined;
    const createListId = showListSelector ? selectedCreateListId : listId;

    if (!isEditMode) {
      if (!createListId) return;
      await onAddTask(createListId, title, text, checklist, taskType);
    } else {
      await onEditTask(index, title, text, checklist, taskType);
    }

    setOpenMoreMenu(false);
    handleClosePopup();
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleClosePopup}
    >
      <div
        className="flex flex-col max-h-80% h-[60%] w-[40%] bg-white p-6 rounded-lg shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          setOpenMoreMenu(false);
        }}
      >
        {showListSelector && (
          <select
            className="mb-4 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
            value={selectedCreateListId}
            onChange={(e) => setSelectedCreateListId(e.target.value)}
          >
            {listOptions.map((list) => (
              <option key={list._id} value={list._id}>
                {list.name}
              </option>
            ))}
          </select>
        )}
        <input
          className="text-xl font-bold mb-4 outline-none"
          value={title}
          onChange={handleTitleChange}
          placeholder="Add New Task"
        />
        {taskType === TASK_TYPE.TEXT ? (
          <textarea
            className="flex-1 mb-4 h-full w-full outline-none resize-none scrollbar-thin overscroll-contain scrollbar-track-transparent"
            value={content}
            onChange={handleContentChange}
            placeholder="Here you can add a new task."
          />
        ) : (
          <div className="flex-1 mb-4 overflow-auto pr-1">
            <div className="flex flex-col gap-2">
              {checklistItems.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`flex items-center gap-2 rounded-md border px-2 py-1.5 transition-colors border-gray-200 bg-gray-50`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    className="accent-[#e06a43]"
                    onChange={(e) =>
                      handleChecklistItemChange(
                        itemIndex,
                        "checked",
                        e.target.checked,
                      )
                    }
                  />
                  <input
                    className={`flex-1 rounded px-2 py-1 outline-none ${
                      item.checked ? "line-through" : "text-gray-900"
                    }`}
                    value={item.text}
                    onChange={(e) =>
                      handleChecklistItemChange(
                        itemIndex,
                        "text",
                        e.target.value,
                      )
                    }
                    placeholder="Checklist item"
                  />
                  <button
                    className="px-2 py-1 text-[#f0825c] hover:bg-red-50 rounded cursor-pointer"
                    onClick={() => handleRemoveChecklistItem(itemIndex)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                className="self-start mt-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
                onClick={handleAddChecklistItem}
              >
                + Add item
              </button>
            </div>
          </div>
        )}
        <div className="relative flex gap-1 justify-end mt-auto">
          <button
            className="flex-1 px-4 py-2 bg-[#f0825c]
                    text-white rounded hover:bg-[#d96b3f] justify-self-end"
            onClick={handleClickDone}
          >
            Done
          </button>
          <button
            className="w-[5%] font-bold bg-gray-500 text-white rounded hover:bg-gray-600 justify-self-end cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMoreMenu(!openMoreMenu);
            }}
          >
            ⋮
          </button>
          <TaskMoreMenu
            isOpen={openMoreMenu}
            isEditMode={isEditMode}
            currentTaskType={taskType}
            onSwitchType={handleSwitchTaskType}
            onDeleteTask={handleDeleteInPopup}
            onClosePopup={handleClosePopup}
          />
        </div>
      </div>
    </div>
  );
}
