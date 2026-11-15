import { useCallback, useEffect, useState } from "react";
import { fetchSession, logout as apiLogout } from "./api.js";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import {
  applyMode,
  persistMode,
  readStoredMode,
  toggleMode,
} from "./theme.js";

export default function App() {
  const [auth, setAuth] = useState("loading"); // loading | yes | no
  const [mode, setMode] = useState(() => readStoredMode());

  useEffect(() => {
    applyMode(mode);
    persistMode(mode);
  }, [mode]);

  useEffect(() => {
    let cancelled = false;
    fetchSession()
      .then((data) => {
        if (!cancelled) setAuth(data.authenticated ? "yes" : "no");
      })
      .catch(() => {
        if (!cancelled) setAuth("no");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onLoggedIn = useCallback(() => setAuth("yes"), []);

  const onLogout = useCallback(async () => {
    await apiLogout();
    setAuth("no");
  }, []);

  const onToggleMode = useCallback(() => {
    setMode((prev) => toggleMode(prev));
  }, []);

  if (auth === "loading") {
    return <p className="boot">Loading…</p>;
  }

  if (auth !== "yes") {
    return (
      <LoginPage
        onSuccess={onLoggedIn}
        mode={mode}
        onToggleMode={onToggleMode}
      />
    );
  }

  return (
    <DashboardPage
      onLogout={onLogout}
      mode={mode}
      onToggleMode={onToggleMode}
    />
  );
}
