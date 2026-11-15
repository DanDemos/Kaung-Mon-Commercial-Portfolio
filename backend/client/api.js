/** Fetch helpers for the Node API — no server code here. */

export async function fetchSession() {
  const res = await fetch("/api/session", { credentials: "include" });
  if (!res.ok) throw new Error(`session ${res.status}`);
  return res.json();
}

export async function login(password) {
  const res = await fetch("/api/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Login failed (${res.status})`);
  }
  return data;
}

export async function logout() {
  await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchSummary() {
  const res = await fetch("/api/summary", { credentials: "include" });
  if (res.status === 401) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  if (!res.ok) throw new Error(`summary ${res.status}`);
  return res.json();
}
