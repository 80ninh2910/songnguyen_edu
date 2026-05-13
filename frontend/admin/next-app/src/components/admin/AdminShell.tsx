"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AdminIcon, type AdminIconName } from "@/components/admin/AdminIcon";
import { clearAuthTokens } from "@/lib/adminAuth";

type AdminNavItem = {
  href: string;
  label: string;
  icon: AdminIconName;
};

const navItems: AdminNavItem[] = [
  { href: "/dashboard", label: "Tổng quan", icon: "dashboard" },
  { href: "/tutors", label: "Gia sư", icon: "group" },
  { href: "/classes", label: "Lớp học", icon: "school" },
  { href: "/requests", label: "Yêu cầu", icon: "list_alt" },
  { href: "/payments", label: "Thanh toán", icon: "payments" },
  { href: "/audit-logs", label: "Nhật ký hệ thống", icon: "history" },
  { href: "/settings", label: "Cài đặt", icon: "settings" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    if (pathname.startsWith("/payments")) {
      return "Xác nhận Thanh toán";
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
          {navItems.map((item) => {
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
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-cta-wrap">
          <button className="admin-sidebar-cta" type="button">
            <AdminIcon name="add" />
            Thêm lớp học mới
          </button>
        </div>

        <div className="admin-sidebar-profile">
          <div className="admin-user-row">
            <div className="admin-user-avatar-circle">AD</div>
            <div>
              <p className="admin-user-name">Admin</p>
              <p className="admin-user-role">Quản trị viên</p>
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

            <button
              aria-label="Thông báo"
              className="admin-icon-btn"
              type="button"
            >
              <AdminIcon name="notifications" />
              <span className="admin-icon-badge">3</span>
            </button>

            <button
              aria-label="Ứng dụng"
              className="admin-icon-btn"
              type="button"
            >
              <AdminIcon name="apps" />
            </button>

            <div className="admin-topbar-profile">
              <div className="admin-topbar-profile-meta">
                <p className="admin-topbar-profile-name">Quản trị SNE</p>
                <p className="admin-topbar-profile-role">Hệ thống quản trị</p>
              </div>
              <div className="admin-topbar-avatar">AS</div>
            </div>
          </div>
        </header>

        <section className="admin-content">{children}</section>
      </main>
    </div>
  );
}
