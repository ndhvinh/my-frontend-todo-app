import React, { useEffect, useRef, useState } from "react";
import { me } from "../../services/authApi";

function Header({
  onLogout,
  onToggleSidebar,
  isSidebarOpen = false,
  className = "",
}) {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [username, setUsername] = useState("Anonymous");
  const userMenuRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMe() {
      try {
        const profile = await me();

        const resolvedUsername = profile?.user?.name || "Anonymous";

        if (isMounted) {
          setUsername(resolvedUsername);
        }
      } catch {
        if (isMounted) {
          setUsername("Anonymous");
        }
      }
    }

    loadMe();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false);
      }
    }

    if (openUserMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openUserMenu]);

  return (
    <header
      className={`header-container flex items-center justify-between px-3 py-3 md:px-4 shadow-md bg-brand-soft ${className}`}
    >
      <div className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold min-w-0">
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-white/70"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Đóng menu" : "Mở menu"}
        >
          ☰
        </button>
        <img
          src="https://cdn-icons-png.flaticon.com/512/5465/5465709.png"
          alt="My Tasks"
          className="w-7 h-7 md:w-8 md:h-8 shrink-0"
        />
        <span className="truncate">My Tasks</span>
      </div>
      <div className="relative" ref={userMenuRef}>
        <button
          type="button"
          className="flex items-center gap-2 md:gap-3 rounded-lg px-2 py-1 hover:bg-white/60 transition"
          onClick={() => setOpenUserMenu((prev) => !prev)}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
            alt="User avatar"
            className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-gray-300"
          />
          <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
            {username}
          </span>
        </button>

        {openUserMenu && (
          <div className="absolute right-0 mt-2 min-w-[140px] bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20">
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              onClick={() => {
                setOpenUserMenu(false);
                onLogout?.();
              }}
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
