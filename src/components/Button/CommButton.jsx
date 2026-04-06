export function CommButton({ btnText, onClick }) {
  return (
    <button
      className="px-4 text-sm bg-brand text-white rounded-full hover:bg-brand-hover cursor-pointer transition-colors"
      onClick={onClick}
    >
      {btnText}
    </button>
  );
}
