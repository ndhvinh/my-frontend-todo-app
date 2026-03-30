import { useState } from "react";
import Header from "./components/Header/Header.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import TaskList from "./components/TaskList/TaskList.jsx";
import "./MainPage.css";

function MainPage() {
  const [selectedListId, setSelectedListId] = useState(null);
  const [selectedListName, setSelectedListName] = useState("OverView");

  return (
    <div className="h-screen flex flex-col">
      <Header className="fixed top-0 h-16 w-full z-10" />
      <div className="flex flex-1 h-screen overflow-y-auto">
        <Sidebar
          onSelectCategory={setSelectedListId}
          selectedListId={selectedListId}
          onSelectedName={setSelectedListName}
        />
        <TaskList listId={selectedListId} listName={selectedListName} />
      </div>
    </div>
  );
}

export default MainPage;
