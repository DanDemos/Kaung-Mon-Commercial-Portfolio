import { useState } from "react";
import { login } from "../api.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function LoginPage({ onSuccess, mode, onToggleMode }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(password);
      onSuccess();
    } catch (err) {
      setError(err.message || "Wrong password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-shell">
      <div className="login-top">
        <ThemeToggle mode={mode} onToggle={onToggleMode} />
      </div>
      <aside className="login-aside">
        <div>
          <p className="login-meta">Kaung Mon</p>
          <h1>Admin</h1>
          <p className="lede">
            See which lens, theme, and language people pick on your portfolio.
          </p>
        </div>
      </aside>
      <div className="login-panel">
        <div className="login-card">
          <h2>Sign in</h2>
          <p className="hint">Password required.</p>
          <form className="login-form" onSubmit={onSubmit}>
            <label>
              Password
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" disabled={busy}>
              {busy ? "Checking…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
