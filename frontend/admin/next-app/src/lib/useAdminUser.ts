import { useEffect, useState } from "react";
import { getAdminUser, type AdminUser } from "@/lib/adminAuth";

/**
 * Hook đọc thông tin admin đang đăng nhập từ localStorage.
 * Trả về user + helper isSuperAdmin.
 */
export function useAdminUser() {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    setUser(getAdminUser());
  }, []);

  return {
    user,
    role: user?.role ?? null,
    isSuperAdmin: user?.role === "SUPERADMIN",
    isAdmin: user?.role === "ADMIN" || user?.role === "SUPERADMIN",
  };
}
