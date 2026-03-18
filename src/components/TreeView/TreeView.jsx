import { useState, useRef, useEffect } from "react";
import AngleRight from "../../assets/angle-right-solid-full.svg?react";
import { ScrollContainer } from "../ScrollContainer/ScrollContainer";
import { MarqueeText } from "../MarqueeText/MarqueeText";
import { TreeSlideOutMenu } from "../TreeDotMenuButton/TreeDotMenuButton";

export function TreeView({
  title,
  subTitle,
  expandedItem,
  toggleExpand,
  isAdding,
  toggleCloseInput,
  onSubmit,
  onSelectItem,
  selectedId,
  onSelectedName,
  onDeleteItem,
  onEditItem,
  isEditting,
  setEditting,
}) {
  const isDisabled =
    isAdding || isEditting ? "pointer-events-none opacity-50" : "";
  const [name, setName] = useState("");
  const scrollContainerRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingIndex, setEdittingIndex] = useState(null);

  useEffect(() => {
    if (isAdding && scrollContainerRef.current) {
      scrollContainerRef.current.scrollToTop();
    }
  }, [isAdding]);

  useEffect(() => {
    function handleClickOutside() {
      setOpenMenuId(null);
    }
    if (openMenuId !== null) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  async function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!name.trim()) return;

      if (editingIndex !== null) {
        await onEditItem(editingIndex, name);
      } else {
        await onSubmit(name);
      }
      setName("");
      setEditting(false);
      setEdittingIndex(null);
      toggleCloseInput(false);
    }
    if (e.key === "Escape") {
      setName("");
      setEditting(false);
      setEdittingIndex(null);
      toggleCloseInput(false);
    }
  }

  function handleClickEdit() {
    setEditting(true);
    setOpenMenuId(null);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-[15px] transition-colors hover:bg-[#f0825c]/20 ${isDisabled}`}
        onClick={toggleExpand}
      >
        <AngleRight
          className={`w-5 h-5 text-gray-500 transition-transform duration-500 ease-in-out ${expandedItem ? "rotate-90" : ""}`}
        />
        <span>{title}</span>
      </div>

      <ScrollContainer ref={scrollContainerRef} visible={expandedItem}>
        {isAdding && (
          <span
            className={`flex items-center gap-2.5 pl-11 pr-3 py-2 rounded-lg text-[15px] transition-colors !bg-[#f0825c]/50 outline-none`}
          >
            <input
              className="outline-none flex-1 min-w-0"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="cursor-pointer"
              onClick={() => {
                setName("");
                toggleCloseInput(false);
              }}
            >
              ×
            </button>
          </span>
        )}
        {subTitle.length > 0 &&
          subTitle.map((item, index) => (
            <div
              key={item._id || index}
              className={`group/item relative flex items-center gap-1.5 pl-3 pr-3 py-2 rounded-lg cursor-pointer text-[15px] transition-colors hover:bg-[#f0825c]/20 ${editingIndex !== index && isDisabled} ${selectedId === item._id ? "bg-[#f0825c]/20 font-semibold" : ""}`}
              onClick={() => {
                (onSelectItem?.(item._id), onSelectedName?.(item.name));
              }}
            >
              <div className="relative flex items-center">
                <button
                  className={`w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors cursor-pointer text-black ${openMenuId === item._id ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === item._id ? null : item._id);
                  }}
                >
                  ⋯
                </button>
                <TreeSlideOutMenu
                  isOpen={openMenuId === item._id}
                  onEdit={() => {
                    handleClickEdit();
                    setName(item.name);
                    setEdittingIndex(index);
                  }}
                  onDelete={() => {
                    onDeleteItem(index);
                    setOpenMenuId(null);
                  }}
                />
              </div>
              <span className="w-5 h-5 flex items-center justify-center text-base">
                📋
              </span>
              {editingIndex === index && isEditting ? (
                <input
                  key={item._id}
                  className="outline-none flex-1 min-w-0"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              ) : (
                <MarqueeText text={item.name} />
              )}
            </div>
          ))}
      </ScrollContainer>
    </div>
  );
}
