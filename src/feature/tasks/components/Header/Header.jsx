import React, { useEffect, useRef, useState } from "react";
import { me } from "../../services/authApi";

function Header({ onLogout }) {
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
    <header className="header-container flex items-center justify-between p-4 shadow-md bg-brand-soft">
      <div className="flex items-center gap-3 text-2xl font-bold">
        <img
          src="https://cdn-icons-png.flaticon.com/512/5465/5465709.png"
          alt="My Tasks"
          className="w-8 h-8"
        />
        <span>My Tasks</span>
      </div>
      <div className="relative" ref={userMenuRef}>
        <button
          type="button"
          className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-white/60 transition"
          onClick={() => setOpenUserMenu((prev) => !prev)}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
            alt="User avatar"
            className="w-9 h-9 rounded-full border border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">{username}</span>
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
