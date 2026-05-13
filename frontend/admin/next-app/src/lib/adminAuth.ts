export type AdminUser = {
  id: string;
  role: "ADMIN" | "SUPERADMIN";
  email: string;
  fullName: string;
};

const ACCESS_TOKEN_KEY = "sne_admin_access_token";
const REFRESH_TOKEN_KEY = "sne_admin_refresh_token";
const ADMIN_USER_KEY = "sne_admin_user";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function setAccessToken(accessToken: string): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function clearAuthTokens(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_USER_KEY);
}

export function setAdminUser(user: AdminUser): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function getAdminUser(): AdminUser | null {
  if (!isBrowser()) {
    return null;
  }

  const value = window.localStorage.getItem(ADMIN_USER_KEY);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AdminUser;
  } catch {
    return null;
  }
}
