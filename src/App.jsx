import { useState } from "react";
import { MainPage } from "./feature/index.js";
import AuthPage from "./feature/auth/AuthPage.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("authToken")),
  );

  function handleAuthSuccess(authData) {
    const token = authData?.token || "authenticated";
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
  }

  function handleLogout() {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  }

  return (
    <div className="font-roboto">
      {isAuthenticated ? (
        <MainPage onLogout={handleLogout} />
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;
