"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AdminIcon, type AdminIconName } from "@/components/admin/AdminIcon";
import { fetchAdminDashboard, type AdminDashboardResponse } from "@/lib/adminApi";
import { clearAuthTokens } from "@/lib/adminAuth";
import { useAdminUser } from "@/lib/useAdminUser";

type AdminNavItem = {
  href: string;
  label: string;
  icon: AdminIconName;
  superAdminOnly?: boolean;
};

const navItems: AdminNavItem[] = [
  { href: "/dashboard", label: "Tổng quan", icon: "dashboard" },
  { href: "/tutors", label: "Gia sư", icon: "group" },
  { href: "/classes", label: "Lớp học", icon: "school" },
  { href: "/requests", label: "Yêu cầu", icon: "list_alt" },
  { href: "/audit-logs", label: "Nhật ký hệ thống", icon: "history", superAdminOnly: true },
  { href: "/admin-accounts", label: "Tài khoản Admin", icon: "manage_accounts", superAdminOnly: true },
  { href: "/settings", label: "Cài đặt", icon: "settings" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<AdminDashboardResponse["stats"] | null>(null);
  const { user, isSuperAdmin } = useAdminUser();

  useEffect(() => {
    fetchAdminDashboard()
      .then((res) => setDashboardStats(res.stats))
      .catch(() => {});
  }, []);

  const totalTasks = dashboardStats
    ? dashboardStats.pendingTutors + dashboardStats.pendingRequests + dashboardStats.openClasses
    : 0;

  const visibleNavItems = useMemo(
    () => navItems.filter((item) => !item.superAdminOnly || isSuperAdmin),
    [isSuperAdmin],
  );

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const topbarTitle = useMemo(() => {
    if (pathname.startsWith("/dashboard")) {
      return "Bảng điều khiển";
    }
    if (pathname.startsWith("/tutors")) {
      return "Quản lý Gia sư";
    }
    if (pathname.startsWith("/classes")) {
      return "Quản lý Lớp học";
    }
    if (pathname.startsWith("/requests")) {
      return "Phân lớp cho Gia sư";
    }
    if (pathname.startsWith("/audit-logs")) {
      return "Nhật ký Hệ thống";
    }
    if (pathname.startsWith("/settings")) {
      return "Cài đặt Hệ thống";
    }

    return "Quản trị SNE";
  }, [pathname]);

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  return (
    <div className="admin-shell">
      {sidebarOpen ? (
        <button
          aria-label="Đóng menu điều hướng"
          className="admin-sidebar-backdrop"
          type="button"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside className={`admin-sidebar${sidebarOpen ? " is-open" : ""}`}>
        <div className="admin-sidebar-head">
          <div className="admin-brand-row">
            <h1 className="admin-brand-title">Quản trị SNE</h1>
            <span className="admin-brand-version">v2.0</span>
          </div>
          <p className="admin-brand-subtitle">Hệ thống quản lý trung tâm</p>
        </div>

        <nav className="admin-nav">
          {visibleNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link${isActive ? " active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <AdminIcon className="admin-nav-icon" name={item.icon} />
                <span>{item.label}</span>
                {item.superAdminOnly && (
                  <span className="admin-nav-badge-sa">SA</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-profile">
          <div className="admin-user-row">
            <div className="admin-user-avatar-circle">
              {user?.fullName?.slice(0, 2).toUpperCase() ?? "AD"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="admin-user-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.fullName ?? "Admin"}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "2px" }}>
                <p className="admin-user-role" style={{ margin: 0 }}>
                  {isSuperAdmin ? "Quản trị tối cao" : "Quản trị viên"}
                </p>
                <span className={`admin-role-badge ${isSuperAdmin ? "superadmin" : "admin"}`}>
                  {isSuperAdmin ? "SUPER" : "ADMIN"}
                </span>
              </div>
            </div>
          </div>

          <div className="admin-user-links">
            <Link href="/settings" className="admin-user-link">
              <AdminIcon name="person" />
              Hồ sơ
            </Link>
            <Link
              href="/login"
              className="admin-user-link"
              onClick={() => clearAuthTokens()}
            >
              <AdminIcon name="logout" />
              Đăng xuất
            </Link>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              aria-label="Mở menu điều hướng"
              className="admin-mobile-toggle"
              type="button"
              onClick={() => setSidebarOpen(true)}
            >
              <AdminIcon name="menu" />
            </button>

            <div>
              <h2 className="admin-topbar-title">{topbarTitle}</h2>
              <p className="admin-topbar-subtitle">{todayLabel}</p>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-search-wrap">
              <AdminIcon className="admin-search-icon" name="search" />
              <input
                aria-label="Tìm kiếm trong trang quản trị"
                className="admin-search-input"
                placeholder="Tìm kiếm..."
                type="text"
              />
            </div>

            <div style={{ position: "relative" }}>
              <button
                aria-label="Thông báo"
                className="admin-icon-btn"
                type="button"
                onClick={() => setNotificationsOpen((prev) => !prev)}
              >
                <AdminIcon name="notifications" />
                {totalTasks > 0 && <span className="admin-icon-badge">{totalTasks}</span>}
              </button>

              {notificationsOpen && (
                <>
                  <div
                    style={{ position: "fixed", inset: 0, zIndex: 90 }}
                    onClick={() => setNotificationsOpen(false)}
                    aria-label="Đóng thông báo"
                  />
                  <div
                    className="admin-notifications-dropdown"
                    style={{
                      position: "absolute",
                      top: "120%",
                      right: 0,
                      width: "300px",
                      background: "#fff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      borderRadius: "0.5rem",
                      border: "1px solid #e2e8f0",
                      zIndex: 100,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                      <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>Việc cần xử lý</h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {dashboardStats?.pendingTutors ? (
                        <Link
                          href="/tutors"
                          onClick={() => setNotificationsOpen(false)}
                          style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "#1e293b", transition: "background 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <AdminIcon name="group" style={{ color: "#b45309" }} />
                          <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                            {dashboardStats.pendingTutors} hồ sơ gia sư chờ duyệt
                          </span>
                        </Link>
                      ) : null}

                      {dashboardStats?.pendingRequests ? (
                        <Link
                          href="/requests"
                          onClick={() => setNotificationsOpen(false)}
                          style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "#1e293b", transition: "background 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <AdminIcon name="list_alt" style={{ color: "#2563eb" }} />
                          <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                            {dashboardStats.pendingRequests} yêu cầu cần xử lý
                          </span>
                        </Link>
                      ) : null}

                      {dashboardStats?.openClasses ? (
                        <Link
                          href="/classes"
                          onClick={() => setNotificationsOpen(false)}
                          style={{ padding: "0.85rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "#1e293b", transition: "background 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <AdminIcon name="school" style={{ color: "#059669" }} />
                          <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                            {dashboardStats.openClasses} lớp cần phân gia sư
                          </span>
                        </Link>
                      ) : null}

                      {totalTasks === 0 ? (
                        <div style={{ padding: "1.5rem 1rem", textAlign: "center", color: "#64748b", fontSize: "0.85rem" }}>
                          <AdminIcon name="check_circle" style={{ color: "#10b981", fontSize: "2rem", marginBottom: "0.5rem" }} />
                          <p style={{ margin: 0 }}>Hệ thống ổn định</p>
                          <p style={{ margin: 0 }}>Không có việc cần xử lý</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              aria-label="Ứng dụng"
              className="admin-icon-btn"
              type="button"
              onClick={() => router.push("/dashboard")}
            >
              <AdminIcon name="apps" />
            </button>

            <div className="admin-topbar-profile">
              <div className="admin-topbar-profile-meta">
                <p className="admin-topbar-profile-name">
                  {user?.fullName ?? "Quản trị viên"}
                </p>
                <p className="admin-topbar-profile-role">
                  {isSuperAdmin ? "Quản trị tối cao" : "Hệ thống quản trị"}
                </p>
              </div>
              <div className="admin-topbar-avatar">
                {user?.fullName?.slice(0, 2).toUpperCase() ?? "AD"}
              </div>
            </div>
          </div>
        </header>

        <section className="admin-content">{children}</section>
      </main>
    </div>
  );
}
