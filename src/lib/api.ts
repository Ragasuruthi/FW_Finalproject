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
    const err: any = new Error("API Error");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export default apiFetch;
