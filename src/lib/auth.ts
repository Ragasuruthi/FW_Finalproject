import apiFetch from "./api";

export async function logout() {
  try {
    // Call backend to revoke token (best-effort)
    await apiFetch("/api/auth/logout", { method: "POST" });
  } catch (err) {
    // ignore errors — still remove local token
    console.warn("Logout API failed", err);
  } finally {
    localStorage.removeItem("token");
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}
