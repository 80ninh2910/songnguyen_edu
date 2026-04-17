"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: Array<{ href: string; label: string; phase: "P0" | "P1" }> = [
  { href: "/dashboard", label: "Dashboard", phase: "P0" },
  { href: "/tutors", label: "Tutors", phase: "P0" },
  { href: "/requests", label: "Requests", phase: "P0" },
  { href: "/classes", label: "Classes", phase: "P0" },
  { href: "/payments", label: "Payments", phase: "P1" },
  { href: "/audit-logs", label: "Audit Logs", phase: "P1" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h1>SNE Admin</h1>
          <p>Operations Console</p>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link${isActive ? " active" : ""}`}
              >
                <span>{item.label}</span>
                <span
                  className={`phase-badge ${item.phase === "P0" ? "p0" : "p1"}`}
                >
                  {item.phase}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footnote">
          Branch-safe phase shell for Admin FE.
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <strong>Song Nguyen Education</strong>
            <p>Admin + Backend focused workspace</p>
          </div>
          <Link href="/login" className="admin-logout-link">
            Logout
          </Link>
        </header>

        <section className="admin-content">{children}</section>
      </main>
    </div>
  );
}
