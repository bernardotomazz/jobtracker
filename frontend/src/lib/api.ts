import type {
  ApiErrorBody,
  ApplicationStatus,
  AuthResponse,
  JobApplication,
  JobFilters,
  JobPayload,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}, authenticated = false): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (authenticated) {
    const token = localStorage.getItem("job-tracker-token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor. Verifique se o backend está em execução.", 0);
  }

  if (!response.ok) {
    let body: ApiErrorBody = {};
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      // Some security responses intentionally have an empty body.
    }

    if (authenticated && (response.status === 401 || response.status === 403)) {
      window.dispatchEvent(new CustomEvent("job-tracker:session-expired"));
    }

    const fallbackMessage = response.status >= 500
      ? "Não foi possível conectar ao servidor. Verifique se o backend está em execução."
      : "Não foi possível concluir a solicitação.";
    throw new ApiError(body.message || fallbackMessage, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function queryString(filters: JobFilters) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.workMode) params.set("workMode", filters.workMode);
  if (filters.company?.trim()) params.set("company", filters.company.trim());
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  const query = params.toString();
  return query ? `?${query}` : "";
}

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  listJobs: (filters: JobFilters = {}) => request<JobApplication[]>(`/jobs${queryString(filters)}`, {}, true),
  getJob: (id: string) => request<JobApplication>(`/jobs/${id}`, {}, true),
  createJob: (payload: JobPayload) =>
    request<JobApplication>("/jobs", { method: "POST", body: JSON.stringify(payload) }, true),
  updateJob: (id: string, payload: JobPayload) =>
    request<JobApplication>(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(payload) }, true),
  updateStatus: (id: string, status: ApplicationStatus) =>
    request<JobApplication>(`/jobs/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }, true),
  deleteJob: (id: string) => request<void>(`/jobs/${id}`, { method: "DELETE" }, true),
};
