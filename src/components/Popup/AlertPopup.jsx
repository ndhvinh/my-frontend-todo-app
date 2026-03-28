export function AlertPopup({
  text = "Bạn có chắc muốn xoá mục này?",
  onConfirm,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-5 min-w-[320px]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-gray-800 mb-4">{text}</p>
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 rounded-lg bg-[#f0825c] text-white hover:bg-[#e06a45]"
            onClick={onClose}
          >
            No
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-white text-[#f0825c] border border-[#f0825c] hover:bg-[#fff4ef]"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
