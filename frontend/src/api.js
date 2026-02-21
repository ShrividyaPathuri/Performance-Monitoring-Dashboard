const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

export async function fetchJSON(path) {
  const r = await fetch(`${BASE}${path}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
