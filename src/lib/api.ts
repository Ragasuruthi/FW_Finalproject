export interface ApiOptions extends RequestInit {
  json?: any;
}

async function apiFetch(path: string, opts: ApiOptions = {}) {
  const url = path.startsWith("/") ? path : `/api/${path}`; // allow full paths as well

  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string>),
  };

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (opts.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.json);
  } else if (opts.body) {
    body = opts.body as BodyInit;
  }

  const res = await fetch(url, { method: opts.method || (body ? "POST" : "GET"), headers, body });

  const contentType = res.headers.get("content-type") || "";
  let data: any = null;
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => null);
  }

  if (!res.ok) {
    let message = `Request failed (${res.status} ${res.statusText || ""})`.trim();
    if (data && typeof data === "object") {
      const o = data as Record<string, unknown>;
      if (typeof o.error === "string" && o.error) message = o.error;
      else if (typeof o.details === "string" && o.details) message = `${message}: ${o.details}`;
      else if (typeof o.message === "string" && o.message) message = o.message;
    } else if (typeof data === "string" && data.trim()) {
      const t = data.trim();
      message = t.length > 300 ? `${message} — ${t.slice(0, 300)}…` : `${message} — ${t}`;
    }
    const err: any = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export default apiFetch;
