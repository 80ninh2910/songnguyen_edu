"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import {
  listAdminClassSessions,
  type AdminClassSession,
  type AdminClassSessionsResponse,
} from "@/lib/adminApi";

const statusLabel = (status: AdminClassSession["status"]) => {
  if (status === "COMPLETED") {
    return { label: "Đã hoàn thành", tone: "approved", dotColor: "#059669" } as const;
  }
  if (status === "CANCELLED") {
    return { label: "Đã hủy", tone: "processing", dotColor: "#64748b" } as const;
  }
  return { label: "Đã lên lịch", tone: "open", dotColor: "#0058be" } as const;
};

export default function AdminClassSessionsPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<AdminClassSessionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params?.id) return;

    setLoading(true);
    listAdminClassSessions(params.id)
      .then((response) => {
        setData(response);
        setError("");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Khong the tai danh sach buoi hoc.");
      })
      .finally(() => setLoading(false));
  }, [params?.id]);

  const stats = useMemo(() => {
    const sessions = data?.sessions ?? [];
    const total = sessions.length;
    const completed = sessions.filter((item) => item.status === "COMPLETED").length;
    const cancelled = sessions.filter((item) => item.status === "CANCELLED").length;
    const upcoming = total - completed - cancelled;

    return { total, completed, cancelled, upcoming };
  }, [data?.sessions]);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.8rem" }}>
            Lớp học • Buổi học
          </p>
          <h1 className="admin-page-title">Danh sách buổi học</h1>
          <p className="admin-page-subtitle">
            Theo dõi tiến độ buổi học và nhận xét cho lớp trung tâm.
          </p>
        </div>
        <div className="admin-page-actions">
          <Link className="admin-btn tonal" href="/classes" style={{ textDecoration: "none" }}>
            <AdminIcon name="arrow_back" />
            Quay lại danh sách lớp
          </Link>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: 0, color: "#ba1a1a" }}>{error}</p>
        </div>
      ) : null}

      <section className="pairing-summary-strip">
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Tổng buổi</p>
          <p className="pairing-summary-value">{stats.total}</p>
        </article>
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Đã hoàn thành</p>
          <p className="pairing-summary-value">{stats.completed}</p>
        </article>
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Đã hủy</p>
          <p className="pairing-summary-value">{stats.cancelled}</p>
        </article>
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Sắp tới</p>
          <p className="pairing-summary-value">{stats.upcoming}</p>
        </article>
      </section>

      {loading ? (
        <section className="admin-panel">
          <p style={{ margin: 0, color: "#64748b" }}>Đang tải danh sách buổi học...</p>
        </section>
      ) : null}

      {!loading && data ? (
        <section className="admin-panel">
          <div style={{ marginBottom: "0.75rem" }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{data.class.title}</p>
            <p style={{ margin: 0, color: "#64748b" }}>
              {data.class.subject} • {data.class.grade} • {data.class.district}
            </p>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Buổi</th>
                  <th>Ngày dạy</th>
                  <th>Khung giờ</th>
                  <th>Chủ đề</th>
                  <th>Trạng thái</th>
                  <th>Nhận xét</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.sessions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      Chưa có buổi học nào.
                    </td>
                  </tr>
                ) : (
                  data.sessions.map((session) => {
                    const meta = statusLabel(session.status);
                    return (
                      <tr key={session.id}>
                        <td>Buổi {session.sessionNumber}</td>
                        <td>{new Date(session.sessionDate).toLocaleDateString("vi-VN")}</td>
                        <td>
                          {session.startTime && session.endTime
                            ? `${session.startTime} - ${session.endTime}`
                            : "-"}
                        </td>
                        <td>{session.topic ?? "-"}</td>
                        <td>
                          <AdminStatusBadge
                            label={meta.label}
                            tone={meta.tone}
                            dotColor={meta.dotColor}
                          />
                        </td>
                        <td>
                          {session.feedbackCount}/{session.totalMembers}
                        </td>
                        <td>
                          <Link
                            className="admin-btn ghost"
                            href={`/classes/${params.id}/sessions/${session.id}/feedbacks`}
                            style={{ textDecoration: "none" }}
                          >
                            Xem nhận xét
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
