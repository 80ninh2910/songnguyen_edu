type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: unknown;
};

type ApiFailure = {
  success: false;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

const defaultBaseUrl = "http://localhost:3000/api/v1";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!raw) return defaultBaseUrl;
  return raw.replace(/\/$/, "");
}

function buildUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${cleanPath}`;
}

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("sne_access_token");
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("sne_refresh_token");
}

export function setStoredAccessToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("sne_access_token", token);
}

export function clearStoredSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("sne_access_token");
  localStorage.removeItem("sne_refresh_token");
  localStorage.removeItem("sne_user");
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: string;
    body?: Record<string, unknown> | null;
    token?: string | null;
    headers?: Record<string, string>;
  } = {},
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as ApiSuccess<T> | ApiFailure) : null;

  if (!response.ok || (payload && "success" in payload && payload.success === false)) {
    const message =
      (payload && "error" in payload && payload.error?.message) ||
      "Yeu cau khong thanh cong. Vui long thu lai.";
    throw new ApiError(message, response.status);
  }

  if (payload && "success" in payload) {
    return payload.data as T;
  }

  return payload as T;
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const result = await apiRequest<{ accessToken: string }>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });

  setStoredAccessToken(result.accessToken);
  return result.accessToken;
}

export async function apiRequestWithAuth<T>(
  path: string,
  options: {
    method?: string;
    body?: Record<string, unknown> | null;
    headers?: Record<string, string>;
  } = {},
): Promise<T> {
  const token = getStoredAccessToken();

  try {
    return await apiRequest<T>(path, { ...options, token });
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error;
    }

    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      clearStoredSession();
      throw error;
    }

    const newToken = await refreshAccessToken(refreshToken);
    return apiRequest<T>(path, { ...options, token: newToken });
  }
}
