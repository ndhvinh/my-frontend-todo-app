export function SearchBar({ placeholder }) {
  return (
    <div className="relative max-w-xs flex-1">
      <input
        type="text"
        className="w-full p-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#f0825c] text-sm"
        placeholder={placeholder}
      />
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
