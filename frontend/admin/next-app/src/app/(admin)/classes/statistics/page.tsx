import { AdminIcon } from "@/components/admin/AdminIcon";
import { classCards } from "@/features/admin/mockData";

const totalClasses = classCards.length;
const totalApplicants = classCards.reduce(
  (sum, card) => sum + card.applicants.length,
  0,
);
const totalStudents = classCards.reduce(
  (sum, card) => sum + card.students.filter((student) => student.name).length,
  0,
);
const averageMatch = Math.round(
  classCards.reduce((sum, card) => {
    const bestScore = card.applicants.reduce(
      (best, candidate) => Math.max(best, candidate.matchScore),
      0,
    );
    return sum + bestScore;
  }, 0) / Math.max(totalClasses, 1),
);

export default function ClassesStatisticsPage() {
  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.8rem" }}>
            Quản lý lớp học • Thống kê
          </p>
          <h1 className="admin-page-title">Thống kê Lớp học</h1>
          <p className="admin-page-subtitle">
            Tổng quan tình trạng ghép lớp và phân bổ gia sư.
          </p>
        </div>
      </header>

      <section className="pairing-summary-strip">
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Lớp đang mở</p>
          <p className="pairing-summary-value">{totalClasses}</p>
        </article>
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Ứng viên khả dụng</p>
          <p className="pairing-summary-value">{totalApplicants}</p>
        </article>
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Học viên đang học</p>
          <p className="pairing-summary-value">{totalStudents}</p>
        </article>
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Match trung bình</p>
          <p className="pairing-summary-value">{averageMatch}%</p>
        </article>
      </section>

      <section className="admin-panel" style={{ marginTop: "1rem" }}>
        <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
          <div
            style={{
              width: "2.6rem",
              height: "2.6rem",
              borderRadius: "0.8rem",
              background: "rgba(0, 88, 190, 0.12)",
              color: "#0058be",
              display: "grid",
              placeItems: "center",
            }}
          >
            <AdminIcon name="analytics" />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>Bảng thống kê chi tiết</h3>
            <p style={{ margin: "0.3rem 0 0", color: "#64748b" }}>
              Tính năng đang phát triển. Dữ liệu sẽ được đồng bộ từ hệ thống báo
              cáo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
