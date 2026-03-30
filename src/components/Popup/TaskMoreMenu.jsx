import { TASK_TYPE } from "../../feature/tasks/services/taskApi";

export function TaskMoreMenu({
  isOpen,
  isEditMode,
  currentTaskType,
  onSwitchType,
  onDeleteTask,
  onClosePopup,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 bottom-12 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20"
      onClick={(e) => e.stopPropagation()}
    >
      {isEditMode ? (
        <button
          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 cursor-pointer"
          onClick={onDeleteTask}
        >
          Delete task
        </button>
      ) : (
        <>
          {currentTaskType !== TASK_TYPE.TEXT && (
            <button
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSwitchType(TASK_TYPE.TEXT)}
            >
              Text
            </button>
          )}
          {currentTaskType !== TASK_TYPE.CHECKLIST && (
            <button
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSwitchType(TASK_TYPE.CHECKLIST)}
            >
              Check list
            </button>
          )}
          <button
            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 cursor-pointer"
            onClick={onClosePopup}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
