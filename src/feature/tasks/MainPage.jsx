import { useState } from "react";
import Header from "./components/Header/Header.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import TaskList from "./components/TaskList/TaskList.jsx";
import "./MainPage.css";

function MainPage({ onLogout }) {
  const [selectedListId, setSelectedListId] = useState(null);
  const [selectedListName, setSelectedListName] = useState("OverView");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        className="shrink-0"
        onLogout={onLogout}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {isSidebarOpen && (
          <button
            type="button"
            className="md:hidden absolute inset-0 z-20 bg-black/40"
            onClick={closeSidebar}
            aria-label="Đóng menu"
          />
        )}

        <Sidebar
          onSelectCategory={setSelectedListId}
          selectedListId={selectedListId}
          onSelectedName={setSelectedListName}
          onRequestClose={closeSidebar}
          className={`absolute md:static inset-y-0 left-0 z-30 transition-transform duration-200 ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        />
        <TaskList listId={selectedListId} listName={selectedListName} />
      </div>
    </div>
  );
}

export default MainPage;
