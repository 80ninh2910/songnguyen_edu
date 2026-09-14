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

const attendanceMeta: Record<AdminSessionFeedback["attendance"], { label: string; tone: string }> = {
  PRESENT: { label: "Có mặt", tone: "present" },
  ABSENT: { label: "Vắng", tone: "absent" },
  LATE: { label: "Đi muộn", tone: "late" },
  EXCUSED: { label: "Có phép", tone: "excused" },
};

const averageScore = (feedback: AdminSessionFeedback) => {
  const values = [feedback.attitudeScore, feedback.comprehensionScore, feedback.homeworkScore]
    .filter((score): score is number => typeof score === "number");
  return values.length ? values.reduce((sum, score) => sum + score, 0) / values.length : null;
};

const scoreTone = (value: number | null) => {
  if (value == null) return "neutral";
  if (value >= 4) return "good";
  if (value >= 3) return "average";
  return "warning";
};

export default function AdminSessionFeedbacksPage() {
  const params = useParams<{ id: string; sessionId: string }>();
  const [data, setData] = useState<AdminSessionFeedbacksResponse | null>(null);
  const [selected, setSelected] = useState<AdminSessionFeedback | null>(null);
  const [filter, setFilter] = useState<"ALL" | AdminSessionFeedback["attendance"] | "NEEDS_ATTENTION">("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFeedbacks = () => {
    if (!params?.sessionId) return;
    setLoading(true);
    listAdminSessionFeedbacks(params.sessionId)
      .then((response) => {
        setData(response);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Không thể tải nhận xét buổi học."))
      .finally(() => setLoading(false));
  };

  useEffect(loadFeedbacks, [params?.sessionId]);

  const summary = useMemo(() => {
    const feedbacks = data?.feedbacks ?? [];
    const scores = feedbacks.map(averageScore).filter((value): value is number => value != null);
    return {
      total: feedbacks.length,
      present: feedbacks.filter((item) => item.attendance === "PRESENT").length,
      absent: feedbacks.filter((item) => item.attendance === "ABSENT").length,
      late: feedbacks.filter((item) => item.attendance === "LATE").length,
      average: scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null,
      attention: feedbacks.filter((item) => {
        const score = averageScore(item);
        return score != null && score < 3;
      }).length,
    };
  }, [data]);

  const filteredFeedbacks = useMemo(() => {
    const feedbacks = data?.feedbacks ?? [];
    if (filter === "ALL") return feedbacks;
    if (filter === "NEEDS_ATTENTION") {
      return feedbacks.filter((item) => {
        const score = averageScore(item);
        return score != null && score < 3;
      });
    }
    return feedbacks.filter((item) => item.attendance === filter);
  }, [data, filter]);

  const copyFeedback = async (feedback: AdminSessionFeedback) => {
    const text = [
      `Nhận xét học viên: ${feedback.member.studentName}`,
      `Điểm danh: ${attendanceMeta[feedback.attendance].label}`,
      `Thái độ: ${feedback.attitudeScore ?? "-"} | Tiếp thu: ${feedback.comprehensionScore ?? "-"} | Bài tập: ${feedback.homeworkScore ?? "-"}`,
      `Điểm mạnh: ${feedback.strengths || "-"}`,
      `Cần cải thiện: ${feedback.weaknesses || "-"}`,
      `Khuyến nghị: ${feedback.recommendation || "-"}`,
      `Nhận xét tổng quan: ${feedback.overallComment || "-"}`,
    ].join("\n");
    await navigator.clipboard.writeText(text);
  };

  const sessionTitle = data
    ? `Buổi ${data.session.sessionNumber} · ${new Date(data.session.sessionDate).toLocaleDateString("vi-VN")}`
    : "";

  return (
    <div className="admin-page admin-feedback-page">
      <header className="admin-page-header">
        <div>
          <p className="admin-feedback-breadcrumb">Lớp học · Nhận xét buổi học</p>
          <h1 className="admin-page-title">Nhận xét học viên</h1>
          <p className="admin-page-subtitle">{sessionTitle || "..."}</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn tonal" type="button" onClick={() => window.print()}>
            <AdminIcon name="download" /> In báo cáo
          </button>
          <Link className="admin-btn tonal" href={`/classes/${params?.id ?? ""}/sessions`}>
            <AdminIcon name="chevron_left" /> Danh sách buổi học
          </Link>
        </div>
      </header>

      {error && (
        <div className="admin-feedback-alert">
          <span>{error}</span>
          <button type="button" onClick={loadFeedbacks}>Thử lại</button>
        </div>
      )}

      {loading ? (
        <div className="admin-feedback-skeleton-grid">
          {[1, 2, 3, 4].map((item) => <div key={item} />)}
        </div>
      ) : data ? (
        <>
          <section className="admin-feedback-stats">
            <article><span>Tổng nhận xét</span><strong>{summary.total}</strong></article>
            <article><span>Có mặt</span><strong>{summary.present}</strong></article>
            <article><span>Điểm trung bình</span><strong>{summary.average?.toFixed(1) ?? "-"}</strong></article>
            <article className={summary.attention > 0 ? "attention" : ""}><span>Cần chú ý</span><strong>{summary.attention}</strong></article>
          </section>

          <section className="admin-panel admin-feedback-list-panel">
            <div className="admin-feedback-toolbar">
              <div>
                <h2>Danh sách học viên</h2>
                <p>Chọn một học viên để xem đầy đủ nhận xét.</p>
              </div>
              <div className="admin-feedback-filters">
                {[
                  ["ALL", "Tất cả"], ["PRESENT", "Có mặt"], ["ABSENT", "Vắng"],
                  ["LATE", "Đi muộn"], ["NEEDS_ATTENTION", "Cần chú ý"],
                ].map(([value, label]) => (
                  <button key={value} type="button" className={filter === value ? "active" : ""} onClick={() => setFilter(value as typeof filter)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {filteredFeedbacks.length === 0 ? (
              <div className="admin-feedback-empty">Không có nhận xét phù hợp với bộ lọc.</div>
            ) : (
              <div className="admin-feedback-cards">
                {filteredFeedbacks.map((feedback) => {
                  const average = averageScore(feedback);
                  return (
                    <article className="admin-feedback-card" key={feedback.id}>
                      <div className="admin-feedback-student">
                        <span>{feedback.member.studentName.slice(0, 2).toUpperCase()}</span>
                        <div>
                          <strong>{feedback.member.studentName}</strong>
                          <small>{feedback.member.parentName || "Chưa có tên phụ huynh"} · {feedback.member.parentPhone || "Chưa có SĐT"}</small>
                        </div>
                      </div>
                      <span className={`admin-attendance-pill ${attendanceMeta[feedback.attendance].tone}`}>
                        {attendanceMeta[feedback.attendance].label}
                      </span>
                      <div className={`admin-average-score ${scoreTone(average)}`}>
                        <strong>{average?.toFixed(1) ?? "-"}</strong><span>Điểm TB</span>
                      </div>
                      <p>{feedback.overallComment || feedback.recommendation || "Chưa có nhận xét tổng quan."}</p>
                      <button className="admin-btn tonal" type="button" onClick={() => setSelected(feedback)}>Xem chi tiết</button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      ) : null}

      {selected && (
        <div className="admin-feedback-drawer-layer" role="dialog" aria-modal="true" aria-label={`Nhận xét ${selected.member.studentName}`}>
          <button className="admin-feedback-drawer-backdrop" type="button" aria-label="Đóng" onClick={() => setSelected(null)} />
          <aside className="admin-feedback-drawer">
            <header>
              <div><span>Chi tiết nhận xét</span><h2>{selected.member.studentName}</h2></div>
              <button type="button" aria-label="Đóng" onClick={() => setSelected(null)}><AdminIcon name="close" /></button>
            </header>
            <div className="admin-feedback-drawer-content">
              <div className="admin-feedback-detail-meta">
                <span className={`admin-attendance-pill ${attendanceMeta[selected.attendance].tone}`}>{attendanceMeta[selected.attendance].label}</span>
                <span>Gia sư: <strong>{selected.tutor.fullName}</strong></span>
              </div>
              <div className="admin-feedback-score-grid">
                {[["Thái độ", selected.attitudeScore], ["Tiếp thu", selected.comprehensionScore], ["Bài tập", selected.homeworkScore]].map(([label, value]) => (
                  <article key={label}><span>{label}</span><strong className={scoreTone(value as number | null)}>{value ?? "-"}</strong></article>
                ))}
              </div>
              {[["Điểm mạnh", selected.strengths], ["Cần cải thiện", selected.weaknesses], ["Khuyến nghị", selected.recommendation], ["Nhận xét tổng quan", selected.overallComment]].map(([label, value]) => (
                <section className="admin-feedback-note" key={label}><h3>{label}</h3><p>{value || "Chưa có nội dung."}</p></section>
              ))}
            </div>
            <footer>
              <button className="admin-btn tonal" type="button" onClick={() => copyFeedback(selected)}>Sao chép nhận xét</button>
              <button className="admin-btn primary" type="button" onClick={() => setSelected(null)}>Đóng</button>
            </footer>
          </aside>
        </div>
      )}
    </div>
  );
}
