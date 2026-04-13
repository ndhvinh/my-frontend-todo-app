export function CommButton({ btnText, onClick, className = "" }) {
  return (
    <button
      className={`px-4 py-2 text-sm bg-brand text-white rounded-full hover:bg-brand-hover cursor-pointer transition-colors ${className}`}
      onClick={onClick}
    >
      {btnText}
    </button>
  );
}
