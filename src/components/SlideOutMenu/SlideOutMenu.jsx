import { IconButton } from "../IconButton/IconButton";

export function SlideOutMenu({ isOpen, onEdit, onDelete }) {
  return (
    <div
      className={`absolute left-6 flex justify-center items-center bg-white shadow-md rounded-r-full overflow-hidden transition-all duration-300 ease-in-out z-10 ${isOpen ? "w-16 opacity-100" : "w-0 opacity-0"}`}
    >
      <IconButton
        icon="edit"
        hoverColor="hover:text-blue-500"
        className="opacity-100"
        onClick={onEdit}
      />
      <IconButton
        icon="delete"
        hoverColor="hover:text-red-500"
        className="opacity-100"
        onClick={onDelete}
      />
    </div>
  );
}
