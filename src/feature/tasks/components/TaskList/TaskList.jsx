import { useState } from "react";
import Masonry from "react-masonry-css";
import {
  CommButton,
  IconButton,
  ScrollContainer,
  SearchBar,
  TaskPopup,
} from "../../../../components";
import { useAddTask, useFetchTasksByListId } from "../../hooks";
import { getTaskDetail } from "../../services/taskApi";
import { useEditTask } from "../../hooks/useEditTask";
import { useDeleteTask } from "../../hooks/useDeleteTask";
import { AlertPopup } from "../../../../components/Popup/AlertPopup";

function TaskList({ listId, listName }) {
  const { tasks, setTasks, error } = useFetchTasksByListId(listId);
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(-1);
  const { handleAddTask } = useAddTask(tasks, setTasks);
  const [taskData, setTaskData] = useState();
  const [editingIndex, setEditingIndex] = useState(-1);

  function togglePopup() {
    setOpen(!open);
  }

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
    1280: 3,
    1024: 2,
    640: 1,
  };

  return (
    <div className="bg-transparent flex flex-col flex-1 min-h-0 p-6">
      <h1 className="text-2xl h-8 font-bold mb-6">{listName || "Task List"}</h1>
      <div className="flex flex-row h-8 gap-4 mb-6 justify-between">
        {/* Search Bar */}
        <SearchBar placeholder="Search tasks..." />
        {/* Add Task Button */}
        <CommButton btnText="Add Task" onClick={togglePopup} />
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
            listId={listId}
            index={editingIndex}
            taskData={taskData}
            setTaskData={setTaskData}
            setEditingIndex={setEditingIndex}
          />
        )}
      </div>
      {/* Task Items */}
      <ScrollContainer className="flex-1">
        {error && <div>Error: {error.message}</div>}
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex gap-4"
          columnClassName="flex flex-col gap-4"
        >
          {tasks.map((task, index) => (
            <div
              key={task._id || index}
              className="group relative p-4 max-h-[45vh] overflow-hidden border rounded-lg border-gray-300 shadow-sm hover:shadow-md transition-shadow bg-white"
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
              <h2 className="text-lg font-semibold truncate">{task.title}</h2>
              <p className="whitespace-pre-wrap break-words overflow-hidden">
                {task.text}
              </p>
              {/* Gradient fade to indicate more content */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-lg" />
            </div>
          ))}
        </Masonry>
      </ScrollContainer>
    </div>
  );
}

export default TaskList;
