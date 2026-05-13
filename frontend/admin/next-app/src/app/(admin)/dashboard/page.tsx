"use client";

import type { CSSProperties } from "react";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminPanel } from "@/components/admin/AdminPanel";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { dashboardKpis, dashboardTasks } from "@/features/admin/mockData";
import {
  fetchAdminDashboard,
  type AdminDashboardResponse,
} from "@/lib/adminApi";
import { getAccessToken } from "@/lib/adminAuth";

const TASK_STORAGE_KEY = "sne_admin_dashboard_tasks";

const KPI_ROUTE_MAP: Record<string, string> = {
  "Gia sư chờ duyệt": "/tutors",
  "Lớp đang mở": "/classes",
  "Yêu cầu mới": "/requests",
  "Thanh toán chờ": "/payments",
};

function formatRelativeTime(value: string): string {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Hôm qua";
  return `${diffDays} ngày trước`;
}

function formatAuditDetail(entry: AdminDashboardResponse["recentAudit"][0]) {
  const action = entry.action.replace(/_/g, " ").toLowerCase();
  const targetType = entry.targetType.replace(/_/g, " ").toLowerCase();
  return `${entry.actorName} ${action} ${targetType} ${entry.targetId}`;
}

function getActivityColor(action: string): string {
  const normalized = action.toUpperCase();
  if (normalized.includes("REJECT")) return "#ba1a1a";
  if (normalized.includes("APPROVE") || normalized.includes("CONFIRM")) {
    return "#059669";
  }
  if (normalized.includes("CREATE") || normalized.includes("NEW")) {
    return "#0058be";
  }
  return "#495e8a";
}

function loadTaskState(): Record<string, boolean> {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(TASK_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [taskState, setTaskState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = loadTaskState();
    const nextState = { ...stored };

    dashboardTasks.forEach((task) => {
      if (nextState[task.title] === undefined) {
        nextState[task.title] = false;
      }
    });

    setTaskState(nextState);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(taskState));
  }, [taskState]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setError(null);

      try {
        const data = await fetchAdminDashboard();
        if (isMounted) {
          setDashboard(data);
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        const token = getAccessToken();
        if (!token) {
          router.replace("/login");
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải dữ liệu dashboard.",
        );
      }
    };

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const stats = dashboard?.stats;
  const kpiValues = useMemo(
    () => ({
      "Gia sư chờ duyệt": stats?.pendingTutors ?? 0,
      "Lớp đang mở": stats?.openClasses ?? 0,
      "Yêu cầu mới": stats?.pendingRequests ?? 0,
      "Thanh toán chờ": stats?.pendingPayments ?? 0,
    }),
    [stats],
  );

  const kpis = useMemo(
    () =>
      dashboardKpis.map((kpi) => ({
        ...kpi,
        value:
          kpi.label in kpiValues
            ? String(kpiValues[kpi.label as keyof typeof kpiValues])
            : kpi.value,
      })),
    [kpiValues],
  );

  const matchRate = dashboard?.matchingRate ?? {
    success: 0,
    rejected: 0,
    pending: 0,
    total: 0,
    percent: 0,
  };

  const donutStyle = {
    "--progress": `${matchRate.percent}%`,
  } as CSSProperties;

  const activities = useMemo(
    () =>
      (dashboard?.recentAudit ?? []).map((activity) => ({
        id: activity.id,
        time: formatRelativeTime(activity.createdAt),
        detail: formatAuditDetail(activity),
        color: getActivityColor(activity.action),
      })),
    [dashboard?.recentAudit],
  );

  const topTutors = dashboard?.topTutors ?? [];
  const systemHealth = dashboard?.systemHealth ?? [];
  const remainingTasks = useMemo(
    () => dashboardTasks.filter((task) => !taskState[task.title]).length,
    [taskState],
  );

  return (
    <div className="admin-page admin-dashboard">
      {error ? (
        <div className="admin-panel" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: 0, color: "#ba1a1a" }}>{error}</p>
        </div>
      ) : null}
      <section className="dashboard-kpi-grid">
        {kpis.map((kpi) => (
          <Link
            className="dashboard-kpi-card"
            href={KPI_ROUTE_MAP[kpi.label] ?? "/dashboard"}
            key={kpi.label}
          >
            <span
              className="dashboard-kpi-accent"
              style={{ background: kpi.accent }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "0.6rem",
              }}
            >
              <p className="dashboard-kpi-label">{kpi.label}</p>
              <AdminStatusBadge label={kpi.badge} tone={kpi.tone} />
            </div>

            <div>
              <p className="dashboard-kpi-value">{kpi.value}</p>
              <p className="dashboard-kpi-meta">{kpi.meta}</p>
            </div>
          </Link>
        ))}
      </section>

      <div className="dashboard-columns">
        <AdminPanel
          title="Việc cần làm hôm nay"
          actions={
            <AdminStatusBadge
              label={`${remainingTasks} việc còn lại`}
              tone="pending"
            />
          }
        >
          <div className="dashboard-task-list">
            {dashboardTasks.map((task) => {
              const isDone = Boolean(taskState[task.title]);

              return (
                <div
                  className="dashboard-task-item"
                  key={task.title}
                  style={isDone ? { opacity: 0.56 } : undefined}
                >
                  <div className="dashboard-task-main">
                    <input
                      aria-label={`Đánh dấu ${task.title}`}
                      type="checkbox"
                      checked={isDone}
                      onChange={() =>
                        setTaskState((prev) => ({
                          ...prev,
                          [task.title]: !prev[task.title],
                        }))
                      }
                    />
                    <div>
                      <p
                        className="dashboard-task-label"
                        style={
                          isDone
                            ? {
                                textDecoration: "line-through",
                                color: "#64748b",
                              }
                            : undefined
                        }
                      >
                        {task.title}
                      </p>
                      <p className="dashboard-task-sub">
                        <span style={{ color: task.tone, fontWeight: 700 }}>
                          {task.priority}
                        </span>{" "}
                        • {task.status}
                      </p>
                    </div>
                  </div>

                  <AdminIcon
                    className="dashboard-task-arrow"
                    name="arrow_forward_ios"
                  />
                </div>
              );
            })}
          </div>
        </AdminPanel>

        <AdminPanel title="Hoạt động gần đây">
          <div className="dashboard-timeline">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <article
                  className="dashboard-timeline-item"
                  key={activity.id}
                  style={{ color: activity.color }}
                >
                  <span className="dashboard-timeline-dot" />
                  <p className="dashboard-timeline-time">{activity.time}</p>
                  <p
                    className="dashboard-timeline-text"
                    style={{ color: "#191c1d" }}
                  >
                    {activity.detail}
                  </p>
                </article>
              ))
            ) : (
              <p style={{ margin: 0, color: "#64748b" }}>
                Chưa có hoạt động gần đây.
              </p>
            )}
          </div>
        </AdminPanel>
      </div>

      <div className="dashboard-bottom-grid">
        <AdminPanel title="Tỷ lệ ghép lớp">
          <div className="dashboard-donut-wrap">
            <div
              className="dashboard-donut"
              data-value={`${matchRate.percent}%`}
              style={donutStyle}
            />
          </div>

          <div className="dashboard-legend">
            <div className="dashboard-legend-item">
              <span className="dashboard-legend-label">
                <span
                  className="dashboard-legend-dot"
                  style={{ background: "#0058be" }}
                />
                Thành công
              </span>
              <strong>{matchRate.success}</strong>
            </div>

            <div className="dashboard-legend-item">
              <span className="dashboard-legend-label">
                <span
                  className="dashboard-legend-dot"
                  style={{ background: "#ba1a1a" }}
                />
                Thất bại
              </span>
              <strong>{matchRate.rejected}</strong>
            </div>

            <div className="dashboard-legend-item">
              <span className="dashboard-legend-label">
                <span
                  className="dashboard-legend-dot"
                  style={{ background: "#924700" }}
                />
                Đang xử lý
              </span>
              <strong>{matchRate.pending}</strong>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel title="Top Gia sư">
          <div className="dashboard-tutor-list">
            {topTutors.length > 0 ? (
              topTutors.map((tutor, index) => {
                const rank = index + 1;
                const rankColor =
                  rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : "#CD7F32";

                return (
                  <div className="dashboard-tutor-item" key={tutor.id}>
                    <div className="dashboard-tutor-left">
                      <div
                        className="dashboard-rank"
                        style={{ background: rankColor, color: "#fff" }}
                      >
                        {rank}
                      </div>
                      <div className="dashboard-avatar">
                        {tutor.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.84rem",
                            fontWeight: 700,
                          }}
                        >
                          {tutor.fullName}
                        </p>
                        <p className="dashboard-caption">
                          {tutor.subjects.join(", ")}
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <p className="dashboard-metric">{tutor.lessonCount}</p>
                      <p className="dashboard-caption">Buổi</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ margin: 0, color: "#64748b" }}>Chưa có dữ liệu.</p>
            )}
          </div>
        </AdminPanel>

        <AdminPanel title="Trạng thái Hệ thống">
          <div className="dashboard-health-list">
            {systemHealth.length > 0 ? (
              systemHealth.map((service) => (
                <div className="dashboard-health-item" key={service.service}>
                  <div className="dashboard-health-left">
                    <AdminIcon name="hub" style={{ color: "#64748b" }} />
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.84rem",
                          fontWeight: 700,
                        }}
                      >
                        {service.service}
                      </p>
                      <p className="dashboard-caption">{service.status}</p>
                    </div>
                  </div>

                  <p className="dashboard-caption" style={{ margin: 0 }}>
                    {service.ratio}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ margin: 0, color: "#64748b" }}>Chưa có dữ liệu.</p>
            )}
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
