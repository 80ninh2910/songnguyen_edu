"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { AdminIcon } from "@/components/admin/AdminIcon";
import {
  listAdminSessionFeedbacks,
  type AdminSessionFeedback,
  type AdminSessionFeedbacksResponse,
} from "@/lib/adminApi";

const attendanceLabel = (value: AdminSessionFeedback["attendance"]) => {
  if (value === "PRESENT") return "Có mặt";
  if (value === "ABSENT") return "Vắng";
  if (value === "LATE") return "Đi muộn";
  return "Có phép";
};

export default function AdminSessionFeedbacksPage() {
  const params = useParams<{ id: string; sessionId: string }>();
  const [data, setData] = useState<AdminSessionFeedbacksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params?.sessionId) return;

    setLoading(true);
    listAdminSessionFeedbacks(params.sessionId)
      .then((response) => {
        setData(response);
        setError("");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Khong the tai nhan xet buoi hoc.");
      })
      .finally(() => setLoading(false));
  }, [params?.sessionId]);

  const sessionTitle = useMemo(() => {
    if (!data) return "";
    return `Buoi ${data.session.sessionNumber} • ${new Date(data.session.sessionDate).toLocaleDateString("vi-VN")}`;
  }, [data]);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.8rem" }}>
            Lớp học • Nhận xét buổi học
          </p>
          <h1 className="admin-page-title">Danh sách nhận xét</h1>
          <p className="admin-page-subtitle">{sessionTitle || "..."}</p>
        </div>
        <div className="admin-page-actions">
          <Link
            className="admin-btn tonal"
            href={`/classes/${params?.id ?? ""}/sessions`}
            style={{ textDecoration: "none" }}
          >
            <AdminIcon name="arrow_back" />
            Quay lại danh sách buổi học
          </Link>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: 0, color: "#ba1a1a" }}>{error}</p>
        </div>
      ) : null}

      {loading ? (
        <section className="admin-panel">
          <p style={{ margin: 0, color: "#64748b" }}>Đang tải nhận xét...</p>
        </section>
      ) : null}

      {!loading && data ? (
        <section className="admin-panel">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Học viên</th>
                  <th>Điểm danh</th>
                  <th>Thái độ</th>
                  <th>Năng lực</th>
                  <th>Bài tập</th>
                  <th>Hạn chế</th>
                  <th>Nhận xét chữ</th>
                  <th>Gia sư</th>
                </tr>
              </thead>
              <tbody>
                {data.feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      Chưa có nhận xét nào.
                    </td>
                  </tr>
                ) : (
                  data.feedbacks.map((feedback) => (
                    <tr key={feedback.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{feedback.member.studentName}</div>
                        <div style={{ color: "#64748b", fontSize: "0.78rem" }}>
                          {feedback.member.parentName ?? "-"} • {feedback.member.parentPhone ?? "-"}
                        </div>
                      </td>
                      <td>{attendanceLabel(feedback.attendance)}</td>
                      <td>{feedback.attitudeScore ?? "-"}</td>
                      <td>{feedback.comprehensionScore ?? "-"}</td>
                      <td>{feedback.homeworkScore ?? "-"}</td>
                      <td>{feedback.weaknesses || "-"}</td>
                      <td>{feedback.overallComment || "-"}</td>
                      <td>{feedback.tutor.fullName}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
