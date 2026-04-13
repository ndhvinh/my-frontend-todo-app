import { useEffect, useState } from "react";
import { MainPage } from "./feature/index.js";
import AuthPage from "./feature/auth/AuthPage.jsx";
import GlobalApiFeedback from "./components/GlobalApiFeedback.jsx";
import { subscribeApiState } from "./feature/tasks/services/apiClient";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("authToken")),
  );
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeApiState((state) => {
      setGlobalLoading(state.isLoading);

      if (state.error?.message) {
        setGlobalError(state.error.message);
      }
    });

    return unsubscribe;
  }, []);

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
      <GlobalApiFeedback
        isLoading={globalLoading}
        errorMessage={globalError}
        onCloseError={() => setGlobalError("")}
      />

      {isAuthenticated ? (
        <MainPage onLogout={handleLogout} />
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;
