import { useRef, useState } from "react";
import Masonry from "react-masonry-css";
import {
  CommButton,
  IconButton,
  ScrollContainer,
  SearchBar,
  TaskPopup,
} from "../../../../components";
import {
  useAddTask,
  useFetchListName,
  useFetchTasks,
  useFetchTasksByListId,
} from "../../hooks";
import { TASK_TYPE } from "../../services/taskApi";
import { useEditTask } from "../../hooks/useEditTask";
import { useDeleteTask } from "../../hooks/useDeleteTask";
import { AlertPopup } from "../../../../components/Popup/AlertPopup";

function parseChecklistFromText(value = "") {
  if (!value.trim()) return [];

  return value
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const checked = /^\s*-\s*\[x\]/i.test(line);
      const text = line.replace(/^\s*-\s*\[[ xX]\]\s*/, "").trim();
      return { checked, text };
    });
}

function normalizeChecklist(task) {
  if (Array.isArray(task?.checklist)) return task.checklist;
  if (typeof task?.text === "string") return parseChecklistFromText(task.text);
  return [];
}

function TaskList({ listId, listName }) {
  const isOverview = !listId;
  const { listName: listOptions } = useFetchListName();
  const {
    tasks: allTasks,
    setTasks: setAllTasks,
    error: allTasksError,
  } = useFetchTasks();
  const {
    tasks: listTasks,
    setTasks: setListTasks,
    error: listTasksError,
  } = useFetchTasksByListId(listId);

  const tasks = isOverview ? allTasks : listTasks;
  const setTasks = isOverview ? setAllTasks : setListTasks;
  const error = isOverview ? allTasksError : listTasksError;
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(-1);
  const [taskData, setTaskData] = useState();
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isMobileTopHidden, setIsMobileTopHidden] = useState(false);
  const lastScrollTopRef = useRef(0);
  const scrollDeltaRef = useRef(0);

  function togglePopup() {
    setOpen(!open);
  }

  const { handleAddTask } = useAddTask(tasks, setTasks);
  const { handleSaveEdit } = useEditTask(tasks, setTasks);
  const { handleDeleteTask } = useDeleteTask(tasks, setTasks);

  function onClickDeleteTask(index) {
    setDeletingIndex(index);
    setOpenAlert(true);
  }

  async function onConfirmDeleteTask() {
    if (deletingIndex !== -1) {
      await handleDeleteTask(deletingIndex);
    }
    setOpenAlert(false);
    setDeletingIndex(-1);
  }

  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 2,
    640: 1,
  };

  function handleTaskListScroll(event) {
    const target = event.currentTarget;
    const maxTop = Math.max(0, target.scrollHeight - target.clientHeight);
    const currentTop = Math.min(Math.max(target.scrollTop, 0), maxTop);

    const TOP_LOCK = 16;
    const BOTTOM_LOCK = 16;
    const HIDE_THRESHOLD = 28;
    const SHOW_THRESHOLD = 18;

    if (currentTop <= TOP_LOCK) {
      setIsMobileTopHidden(false);
      lastScrollTopRef.current = currentTop;
      scrollDeltaRef.current = 0;
      return;
    }

    if (currentTop >= maxTop - BOTTOM_LOCK) {
      lastScrollTopRef.current = currentTop;
      scrollDeltaRef.current = 0;
      return;
    }

    const delta = currentTop - lastScrollTopRef.current;

    if (Math.abs(delta) < 1) return;

    if (Math.sign(scrollDeltaRef.current) !== Math.sign(delta)) {
      scrollDeltaRef.current = 0;
    }

    scrollDeltaRef.current += delta;

    if (scrollDeltaRef.current > HIDE_THRESHOLD) {
      setIsMobileTopHidden(true);
      scrollDeltaRef.current = 0;
    } else if (scrollDeltaRef.current < -SHOW_THRESHOLD) {
      setIsMobileTopHidden(false);
      scrollDeltaRef.current = 0;
    }

    lastScrollTopRef.current = currentTop;
  }

  return (
    <div className="bg-transparent flex flex-col flex-1 min-h-0 p-3 sm:p-4 md:p-6 overflow-hidden">
      <div
        className={`sm:hidden overflow-hidden transition-all duration-200 ${
          isMobileTopHidden
            ? "max-h-0 opacity-0 mb-0"
            : "max-h-20 opacity-100 mb-3"
        }`}
      >
        <div className="flex items-center gap-2">
          <h1 className="text-xl min-h-8 font-bold truncate flex-1">
            {listName || "Task List"}
          </h1>
          <SearchBar placeholder="Search tasks..." className="max-w-[58%]" />
        </div>
      </div>

      <div className="hidden sm:flex flex-row gap-3 sm:gap-4 mb-4 md:mb-6 justify-between items-center">
        <h1 className="text-2xl min-h-8 font-bold truncate flex-1">
          {listName || "Task List"}
        </h1>
        <SearchBar placeholder="Search tasks..." />
        <CommButton
          btnText="Add Task"
          onClick={togglePopup}
          className="w-auto"
        />
      </div>
      {/* Task Items */}
      <ScrollContainer
        className="flex-1 pb-20 sm:pb-8"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 24px)" }}
        onScroll={handleTaskListScroll}
      >
        {error && <div>Error: {error.message}</div>}
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex gap-4"
          columnClassName="flex flex-col gap-4"
        >
          {tasks.map((task, index) => (
            <div
              key={task._id || index}
              className="group relative p-3 sm:p-4 max-h-[55vh] sm:max-h-[45vh] overflow-hidden border rounded-lg border-gray-300 shadow-sm hover:shadow-md transition-shadow bg-white"
              onClick={() => {
                setEditingIndex(index);
                setTaskData(task);
                togglePopup();
              }}
            >
              <IconButton
                icon="delete"
                className="absolute bottom-2 right-2 z-10"
                onClick={() => {
                  onClickDeleteTask(index);
                }}
              />
              {isOverview && task.listName && (
                <p className="text-xs italic text-gray-500 mb-1">
                  {task.listName}
                </p>
              )}
              <h2 className="text-lg font-semibold truncate">{task.title}</h2>
              {task.taskType === TASK_TYPE.CHECKLIST ? (
                <div className="mt-2 flex flex-col gap-2">
                  {normalizeChecklist(task).map((item, checklistIndex) => (
                    <div
                      key={`${task._id || index}-check-${checklistIndex}`}
                      className={`flex items-center gap-2 rounded-md border px-2 py-1.5 transition-colors border-gray-200 bg-gray-50`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(item.checked)}
                        className="accent-[#e06a43]"
                        readOnly
                      />
                      <span
                        className={`break-words ${
                          item.checked ? "line-through" : "text-gray-900"
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="whitespace-pre-wrap break-words overflow-hidden">
                  {task.text}
                </p>
              )}
              {/* Gradient fade to indicate more content */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-lg" />
            </div>
          ))}
        </Masonry>
      </ScrollContainer>

      {openAlert && (
        <AlertPopup
          text="Bạn có chắc muốn xoá task này?"
          onClose={() => {
            setOpenAlert(false);
            setDeletingIndex(-1);
          }}
          onConfirm={onConfirmDeleteTask}
        />
      )}

      {open && (
        <TaskPopup
          key={editingIndex}
          onClickDone={togglePopup}
          onAddTask={handleAddTask}
          onEditTask={handleSaveEdit}
          onDeleteTask={handleDeleteTask}
          listId={listId}
          isOverviewMode={isOverview}
          listOptions={listOptions}
          index={editingIndex}
          taskData={taskData}
          setTaskData={setTaskData}
          setEditingIndex={setEditingIndex}
        />
      )}

      <button
        type="button"
        className="sm:hidden fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+16px)] z-10 w-14 h-14 rounded-full bg-brand text-white text-2xl leading-none shadow-lg hover:bg-brand-hover active:scale-95 transition"
        onClick={togglePopup}
        aria-label="Add Task"
      >
        +
      </button>
    </div>
  );
}

export default TaskList;
