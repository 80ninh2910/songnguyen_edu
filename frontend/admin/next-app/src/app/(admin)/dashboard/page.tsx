"use client";

import type { CSSProperties } from "react";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminPanel } from "@/components/admin/AdminPanel";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { fetchAdminDashboard, type AdminDashboardResponse } from "@/lib/adminApi";
import { getAccessToken } from "@/lib/adminAuth";

const REFRESH_INTERVAL = 30; // seconds

function formatRelativeTime(value: string): string {
  const diffMs = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "Hôm qua" : `${days} ngày trước`;
}

const ACTION_LABEL_MAP: Record<string, string> = {
  APPROVE_TUTOR: "Duyệt gia sư",
  REJECT_TUTOR: "Từ chối gia sư",
  CREATE_CLASS: "Tạo lớp học",
  CLOSE_CLASS: "Đóng lớp học",
  ASSIGN_CLASS: "Phân lớp",
  CONVERT_REQUEST: "Chuyển yêu cầu",
  REJECT_REQUEST: "Từ chối yêu cầu",
  CONFIRM_PAYMENT: "Xác nhận thanh toán",
  REJECT_PAYMENT: "Từ chối thanh toán",
  CREATE_TUTOR: "Tạo gia sư",
  UPDATE_TUTOR: "Cập nhật gia sư",
  CREATE_ADMIN: "Tạo tài khoản admin",
  UPDATE_ADMIN: "Cập nhật tài khoản admin",
  DELETE_ADMIN: "Xoá tài khoản admin",
  SEED_INITIALIZED: "Khởi tạo dữ liệu hệ thống",
};

function formatAuditDetail(entry: AdminDashboardResponse["recentAudit"][0]) {
  const label = ACTION_LABEL_MAP[entry.action] ?? entry.action.replace(/_/g, " ").toLowerCase();
  return `${entry.actorName} • ${label}`;
}

function getActivityColor(action: string): string {
  const a = action.toUpperCase();
  if (a.includes("REJECT") || a.includes("DELETE")) return "#ba1a1a";
  if (a.includes("APPROVE") || a.includes("CONFIRM")) return "#059669";
  if (a.includes("CREATE") || a.includes("CONVERT")) return "#0058be";
  return "#495e8a";
}

// Donut SVG circle
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function DonutChart({ percent }: { percent: number }) {
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
  return (
    <svg viewBox="0 0 120 120" width="140" height="140">
      <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth="12" />
      <circle
        cx="60"
        cy="60"
        r={RADIUS}
        fill="none"
        stroke="url(#donutGrad)"
        strokeWidth="12"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <defs>
        <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <text x="60" y="60" textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="800" fill="#0f172a">
        {percent}%
      </text>
    </svg>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [flash, setFlash] = useState(false);
  const prevAuditId = useRef<string | null>(null);

  const load = useCallback(async (isAuto = false) => {
    if (!isAuto) setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminDashboard();
      setDashboard((prev) => {
        const firstId = data.recentAudit?.[0]?.id ?? null;
        if (prev && firstId && firstId !== prevAuditId.current) setFlash(true);
        prevAuditId.current = firstId;
        return data;
      });
    } catch (err) {
      const token = getAccessToken();
      if (!token) { router.replace("/login"); return; }
      setError(err instanceof Error ? err.message : "Không thể tải dữ liệu.");
    } finally {
      if (!isAuto) setLoading(false);
    }
  }, [router]);

  // initial load
  useEffect(() => { void load(); }, [load]);

  // flash reset
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), 1500);
    return () => clearTimeout(t);
  }, [flash]);

  // auto-refresh countdown + reload
  useEffect(() => {
    setCountdown(REFRESH_INTERVAL);
    const tick = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { void load(true); return REFRESH_INTERVAL; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [load]);

  const stats = dashboard?.stats;

  const kpiCards = useMemo(() => [
    {
      label: "Gia sư chờ duyệt",
      value: stats?.pendingTutors ?? 0,
      badge: "CHỜ DUYỆT",
      tone: "pending" as const,
      accent: "#924700",
      href: "/tutors",
      icon: "group" as const,
    },
    {
      label: "Lớp đang mở",
      value: stats?.openClasses ?? 0,
      badge: "ĐANG MỞ",
      tone: "open" as const,
      accent: "#0058be",
      href: "/classes",
      icon: "school" as const,
    },
    {
      label: "Yêu cầu chờ xử lý",
      value: stats?.pendingRequests ?? 0,
      badge: "CHỜ XỬ LÝ",
      tone: "processing" as const,
      accent: "#495e8a",
      href: "/requests",
      icon: "list_alt" as const,
    },
  ], [stats]);

  // Dynamic quick tasks from real stats
  const quickTasks = useMemo(() => {
    const tasks: Array<{ title: string; desc: string; href: string; urgency: "high" | "medium" | "low" }> = [];
    if ((stats?.pendingTutors ?? 0) > 0)
      tasks.push({ title: `Duyệt ${stats!.pendingTutors} hồ sơ gia sư`, desc: "Chờ phê duyệt", href: "/tutors", urgency: "high" });
    if ((stats?.pendingRequests ?? 0) > 0)
      tasks.push({ title: `Xử lý ${stats!.pendingRequests} yêu cầu lớp học`, desc: "Yêu cầu mới", href: "/requests", urgency: "medium" });
    if ((stats?.openClasses ?? 0) > 0)
      tasks.push({ title: `${stats!.openClasses} lớp cần phân gia sư`, desc: "Đang mở", href: "/classes", urgency: "medium" });
    if (tasks.length === 0)
      tasks.push({ title: "Hệ thống ổn định", desc: "Không có việc cần xử lý", href: "/dashboard", urgency: "low" });
    return tasks;
  }, [stats]);

  const urgencyConfig = {
    high:   { color: "#ba1a1a", label: "Cao",  bg: "#fef2f2" },
    medium: { color: "#924700", label: "TB",   bg: "#fffbeb" },
    low:    { color: "#059669", label: "Ổn",   bg: "#f0fdf4" },
  };

  const activities = useMemo(() => (dashboard?.recentAudit ?? []).map((a) => ({
    id: a.id,
    time: formatRelativeTime(a.createdAt),
    detail: formatAuditDetail(a),
    color: getActivityColor(a.action),
  })), [dashboard?.recentAudit]);

  const matchRate = dashboard?.matchingRate ?? { success: 0, rejected: 0, pending: 0, total: 0, percent: 0 };
  const topTutors = dashboard?.topTutors ?? [];
  const systemHealth = dashboard?.systemHealth ?? [];

  const progressRing = (360 * countdown) / REFRESH_INTERVAL;

  return (
    <div className="admin-page admin-dashboard">
      {/* header strip */}
      <header className="admin-page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="admin-page-title">Bảng điều khiển</h1>
          <p className="admin-page-subtitle">
            {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="admin-page-actions">
          {error && <span style={{ fontSize: "0.8rem", color: "#ba1a1a" }}>{error}</span>}
          {/* countdown ring */}
          <div className="dashboard-refresh-wrap" title={`Tự động cập nhật sau ${countdown}s`}>
            <svg viewBox="0 0 36 36" width="36" height="36" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke="#3b82f6" strokeWidth="3"
                strokeDasharray="94.2 94.2"
                strokeDashoffset={94.2 - (progressRing / 360) * 94.2}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <span className="dashboard-refresh-num">{countdown}</span>
          </div>
          <button
            className="admin-btn ghost"
            style={{ padding: "0.5rem 0.8rem", fontSize: "0.82rem" }}
            type="button"
            onClick={() => { void load(); setCountdown(REFRESH_INTERVAL); }}
          >
            <AdminIcon name="autorenew" />
            Làm mới
          </button>
        </div>
      </header>

      {/* KPI row */}
      <section className="dashboard-kpi-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {kpiCards.map((kpi) => (
          <Link className="dashboard-kpi-card" href={kpi.href} key={kpi.label}
            style={loading ? { opacity: 0.6, pointerEvents: "none" } : undefined}>
            <span className="dashboard-kpi-accent" style={{ background: kpi.accent }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.6rem" }}>
              <p className="dashboard-kpi-label">{kpi.label}</p>
              <AdminStatusBadge label={kpi.badge} tone={kpi.tone} />
            </div>
            <div>
              <p className="dashboard-kpi-value" style={{ fontSize: "2.4rem" }}>
                {loading ? "—" : kpi.value}
              </p>
              <p className="dashboard-kpi-meta" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <AdminIcon name={kpi.icon} style={{ width: "0.9rem" }} />
                Nhấn để xem chi tiết
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* Main 2-col */}
      <div className="dashboard-columns">
        {/* Quick tasks — dynamic from real stats */}
        <AdminPanel
          id="pending-tasks"
          title="Việc cần xử lý"
          actions={
            <AdminStatusBadge
              label={`${quickTasks.filter((t) => t.urgency !== "low").length} việc`}
              tone="pending"
            />
          }
        >
          <div className="dashboard-task-list">
            {quickTasks.map((task) => {
              const cfg = urgencyConfig[task.urgency];
              return (
                <Link className="dashboard-task-item" href={task.href} key={task.title}
                  style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="dashboard-task-main">
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      padding: "2px 7px", borderRadius: "999px",
                      background: cfg.bg, color: cfg.color,
                      fontSize: "0.65rem", fontWeight: 800,
                      flexShrink: 0,
                    }}>
                      {cfg.label}
                    </span>
                    <div>
                      <p className="dashboard-task-label">{task.title}</p>
                      <p className="dashboard-task-sub">{task.desc}</p>
                    </div>
                  </div>
                  <AdminIcon className="dashboard-task-arrow" name="arrow_forward_ios" />
                </Link>
              );
            })}
          </div>
        </AdminPanel>

        {/* Activity feed */}
        <AdminPanel title="Hoạt động gần đây">
          <div className={`dashboard-timeline${flash ? " dashboard-flash" : ""}`}>
            {activities.length > 0 ? activities.map((a) => (
              <article className="dashboard-timeline-item" key={a.id} style={{ color: a.color }}>
                <span className="dashboard-timeline-dot" style={{ background: a.color }} />
                <div>
                  <p className="dashboard-timeline-time">{a.time}</p>
                  <p className="dashboard-timeline-text" style={{ color: "#191c1d" }}>{a.detail}</p>
                </div>
              </article>
            )) : (
              <p style={{ margin: 0, color: "#64748b" }}>
                {loading ? "Đang tải..." : "Chưa có hoạt động gần đây."}
              </p>
            )}
          </div>
        </AdminPanel>
      </div>

      {/* Bottom 3-col */}
      <div className="dashboard-bottom-grid">
        {/* Donut */}
        <AdminPanel title="Tỷ lệ ghép lớp">
          <div className="dashboard-donut-wrap">
            <DonutChart percent={matchRate.percent} />
          </div>
          <div className="dashboard-legend">
            {[
              { label: "Thành công", color: "#2563eb", value: matchRate.success },
              { label: "Thất bại", color: "#ba1a1a", value: matchRate.rejected },
              { label: "Đang xử lý", color: "#924700", value: matchRate.pending },
            ].map((item) => (
              <div className="dashboard-legend-item" key={item.label}>
                <span className="dashboard-legend-label">
                  <span className="dashboard-legend-dot" style={{ background: item.color }} />
                  {item.label}
                </span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </AdminPanel>

        {/* Top tutors */}
        <AdminPanel title="Top Gia sư">
          <div className="dashboard-tutor-list">
            {topTutors.length > 0 ? topTutors.map((tutor, i) => {
              const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
              return (
                <div className="dashboard-tutor-item" key={tutor.id}>
                  <div className="dashboard-tutor-left">
                    <div className="dashboard-rank" style={{ background: rankColors[i] ?? "#94a3b8", color: "#fff" }}>
                      {i + 1}
                    </div>
                    <div className="dashboard-avatar">
                      {tutor.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "0.84rem", fontWeight: 700 }}>{tutor.fullName}</p>
                      <p className="dashboard-caption">{tutor.subjects.join(", ")}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p className="dashboard-metric">{tutor.lessonCount}</p>
                    <p className="dashboard-caption">Buổi</p>
                  </div>
                </div>
              );
            }) : (
              <p style={{ margin: 0, color: "#64748b" }}>{loading ? "Đang tải..." : "Chưa có dữ liệu."}</p>
            )}
          </div>
        </AdminPanel>

        {/* System health */}
        <AdminPanel title="Trạng thái Hệ thống">
          <div className="dashboard-health-list">
            {systemHealth.length > 0 ? systemHealth.map((svc) => {
              const isOk = svc.status.toLowerCase().includes("ổn") || svc.status.toLowerCase().includes("bình thường");
              return (
                <div className="dashboard-health-item" key={svc.service}>
                  <div className="dashboard-health-left">
                    <div style={{
                      width: "0.6rem", height: "0.6rem", borderRadius: "50%",
                      background: isOk ? "#10b981" : "#ba1a1a",
                      flexShrink: 0,
                    }} />
                    <div>
                      <p style={{ margin: 0, fontSize: "0.84rem", fontWeight: 700 }}>{svc.service}</p>
                      <p className="dashboard-caption">{svc.status}</p>
                    </div>
                  </div>
                  <p className="dashboard-caption" style={{ margin: 0, fontWeight: 700, color: isOk ? "#10b981" : "#ba1a1a" }}>
                    {svc.ratio}
                  </p>
                </div>
              );
            }) : (
              <p style={{ margin: 0, color: "#64748b" }}>{loading ? "Đang tải..." : "Chưa có dữ liệu."}</p>
            )}
          </div>
        </AdminPanel>
      </div>

      <style>{`
        .dashboard-refresh-wrap {
          position: relative;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
        }
        .dashboard-refresh-num {
          position: absolute;
          font-size: 0.62rem;
          font-weight: 800;
          color: #3b82f6;
          line-height: 1;
        }
        .dashboard-flash {
          animation: dashFlash 0.6s ease;
        }
        @keyframes dashFlash {
          0%   { background: rgba(59,130,246,0.12); }
          100% { background: transparent; }
        }
        .dashboard-timeline-dot {
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }
        .dashboard-timeline-item {
          display: flex;
          gap: 0.65rem;
          align-items: flex-start;
        }
      `}</style>
    </div>
  );
}
