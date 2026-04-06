const icons = {
  delete: "https://cdn-icons-png.flaticon.com/512/484/484662.png",
  edit: "https://cdn-icons-png.flaticon.com/512/1827/1827933.png",
};

export function IconButton({
  icon,
  onClick,
  className = "",
  hoverColor = "hover:text-red-500",
}) {
  const iconUrl = icons[icon];

  return (
    <button
      className={`w-6 h-6 flex items-center justify-center rounded-full text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${hoverColor} ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      <span
        className="w-3.5 h-3.5 bg-current transition-colors"
        style={{
          WebkitMaskImage: `url(${iconUrl})`,
          maskImage: `url(${iconUrl})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    </button>
  );
}
