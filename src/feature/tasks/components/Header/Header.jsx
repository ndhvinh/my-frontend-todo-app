import React from "react";

function Header() {
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
      <div className="flex items-center gap-3">
        <img
          src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
          alt="User avatar"
          className="w-9 h-9 rounded-full border border-gray-300"
        />
        <span className="text-sm font-medium text-gray-700">Anonymous</span>
      </div>
    </header>
  );
}

export default Header;
