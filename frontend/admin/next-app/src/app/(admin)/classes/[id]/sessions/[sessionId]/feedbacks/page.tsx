"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
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

const attendancePillStyle = (
  value: AdminSessionFeedback["attendance"],
): CSSProperties => {
  if (value === "PRESENT") {
    return { background: "#e8f7ee", color: "#15803d", borderColor: "#86efac" };
  }
  if (value === "ABSENT") {
    return { background: "#fee2e2", color: "#b91c1c", borderColor: "#fecaca" };
  }
  if (value === "LATE") {
    return { background: "#fff7ed", color: "#c2410c", borderColor: "#fed7aa" };
  }
  return { background: "#e0f2fe", color: "#0369a1", borderColor: "#bae6fd" };
};

const scorePillStyle = (value: number): CSSProperties => {
  if (value >= 5) {
    return { background: "#dcfce7", color: "#166534", borderColor: "#86efac" };
  }
  if (value === 4) {
    return { background: "#e0f2fe", color: "#0369a1", borderColor: "#bae6fd" };
  }
  if (value === 3) {
    return { background: "#fef3c7", color: "#b45309", borderColor: "#fde68a" };
  }
  return { background: "#fee2e2", color: "#b91c1c", borderColor: "#fecaca" };
};

const pillBaseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "2.1rem",
  padding: "0.2rem 0.6rem",
  borderRadius: "999px",
  border: "1px solid transparent",
  fontWeight: 700,
  fontSize: "0.78rem",
  textAlign: "center",
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
                  <th>Điểm mạnh</th>
                  <th>Hạn chế</th>
                  <th>Nhận xét chữ</th>
                  <th>Gia sư</th>
                </tr>
              </thead>
              <tbody>
                {data.feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center" }}>
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
                      <td>
                        <span
                          style={{
                            ...pillBaseStyle,
                            ...attendancePillStyle(feedback.attendance),
                          }}
                        >
                          {attendanceLabel(feedback.attendance)}
                        </span>
                      </td>
                      <td>
                        {feedback.attitudeScore == null ? (
                          "-"
                        ) : (
                          <span style={{ ...pillBaseStyle, ...scorePillStyle(feedback.attitudeScore) }}>
                            {feedback.attitudeScore}
                          </span>
                        )}
                      </td>
                      <td>
                        {feedback.comprehensionScore == null ? (
                          "-"
                        ) : (
                          <span style={{ ...pillBaseStyle, ...scorePillStyle(feedback.comprehensionScore) }}>
                            {feedback.comprehensionScore}
                          </span>
                        )}
                      </td>
                      <td>
                        {feedback.homeworkScore == null ? (
                          "-"
                        ) : (
                          <span style={{ ...pillBaseStyle, ...scorePillStyle(feedback.homeworkScore) }}>
                            {feedback.homeworkScore}
                          </span>
                        )}
                      </td>
                      <td>{feedback.strengths || "-"}</td>
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
