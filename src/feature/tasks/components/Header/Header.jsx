import React from 'react';

function Header() {
  return <header className="header-container flex items-center justify-between p-4 shadow-md bg-[beige]">
    <h1>T.</h1>
    <div className="flex gap-6 text-sm">
        <span>Home</span>
        <span>Tasks</span>
        <span>Settings</span>
    </div>
  </header>;
}

export default Header;