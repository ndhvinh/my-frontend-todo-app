export function CommButton({ btnText, onClick }) {
  return (
    <button
      className="px-4 text-sm bg-[#f0825c] text-white rounded-full hover:bg-[#d96b3f] cursor-pointer transition-colors"
      onClick={onClick}
    >
      {btnText}
    </button>
  );
}
