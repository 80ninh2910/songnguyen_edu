import Link from 'next/link';

export default function ClassDetail() {
  const course = {
    id: 'SN-2024-012',
    status: 'Đang Tuyển',
    name: 'Toán Lớp 12: Luyện Thi Đại Học Quốc Gia',
    description: 'Chương trình luyện thi chuyên sâu tập trung vào giải tích, đại số và hình học không gian. Giải đề thi thực tế, rèn kỹ năng làm bài nhanh và chính xác.',
    price: '500.000đ',
    period: '/ tháng (8 buổi)',
    enrolled: 8,
    total: 12,
    spotsLeft: 4,
    instructor: {
      name: 'Chưa có gia sư',
      title: 'Đang tuyển gia sư cho lớp này',
    },
    resource: {
      name: 'Giáo Trình',
      detail: 'Sách bài tập Toán 12 Nâng cao',
    },
    campus: {
      name: 'Cơ Sở Chính',
      detail: 'Tầng 2 - Trung tâm Song Nguyên',
    },
    parentRequirements: [
      'Có bằng Cử nhân trở lên ngành Toán hoặc Sư phạm Toán.',
      'Kinh nghiệm giảng dạy ít nhất 1 năm, ưu tiên có kinh nghiệm luyện thi ĐH.',
    ],
    tutorRequirements: [
      'Cam kết dạy đủ buổi theo lịch đã đăng ký.',
      'Tuân thủ nội quy và phương pháp giảng dạy của Trung tâm.',
    ],
    prerequisite: 'Đảm bảo thời gian hợp lệ',
    safetyCert: 'Trải qua bài test của trung tâm',
  };

  return (
    <>
      <link rel="stylesheet" href="/css/class-detail.css" />

      <nav className="top-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span className="nav-brand">SONG NGUYEN EDU</span>
          <div className="nav-links">
            <Link href="/" className="active">Bảng Điều Khiển</Link>
            <Link href="/tutor/class-list">Danh Sách Lớp</Link>
            <Link href="/tutor/my-classes">Lớp Của Tôi</Link>
          </div>
        </div>
        <div className="nav-right">
          <div className="nav-icon"><i className="fas fa-bell"></i></div>
          <div className="nav-icon"><i className="fas fa-cog"></i></div>
          <div className="nav-avatar">N</div>
        </div>
      </nav>

      <div className="page-container">
        <div className="course-badges">
          <span className="badge-approved">{course.status}</span>
          <span className="course-id">MÃ LỚP: {course.id}</span>
        </div>
        <h1 className="course-title">{course.name}</h1>
        <p className="course-desc">{course.description}</p>

        <div className="detail-grid">
          <div className="left-col">
            <div className="schedule-row">
              <div className="card schedule-card">
                <h3>Lịch Biểu</h3>
                <div className="subtitle">Mật độ lớp & Khung giờ</div>
                <div className="calendar-icon"><i className="far fa-calendar"></i></div>
                <div className="schedule-chart">
                  <div className="chart-group">
                    <div className="bar" style={{ height: '30px' }}></div>
                    <div className="bar active" style={{ height: '70px' }}></div>
                    <div className="bar active" style={{ height: '50px' }}></div>
                  </div>
                  <div className="chart-group">
                    <div className="bar" style={{ height: '20px' }}></div>
                    <div className="bar active" style={{ height: '80px' }}></div>
                    <div className="bar active" style={{ height: '60px' }}></div>
                  </div>
                </div>
              </div>
              <div className="card" style={{ position: 'relative' }}>
                <span className="avail-badge">Chỗ trống</span>
                <div className="avail-circle">
                  <div className="avail-inner">
                    <div className="avail-number">{course.enrolled}</div>
                    <div className="avail-total">/ {course.total}</div>
                  </div>
                </div>
                <p className="avail-sub">Còn {course.spotsLeft} chỗ trống cho học kỳ này.</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-chip">
                <div className="info-chip-icon avatar-icon"><i className="fas fa-user"></i></div>
                <div>
                  <div className="chip-label">Giảng Viên</div>
                  <div className="chip-value">{course.instructor.name}</div>
                  <div className="chip-sub">{course.instructor.title}</div>
                </div>
              </div>
              <div className="info-chip">
                <div className="info-chip-icon resource-icon"><i className="fas fa-file-alt"></i></div>
                <div>
                  <div className="chip-label">Tài Liệu</div>
                  <div className="chip-value">{course.resource.name}</div>
                  <div className="chip-sub">{course.resource.detail}</div>
                </div>
              </div>
              <div className="info-chip">
                <div className="info-chip-icon campus-icon"><i className="fas fa-map-marker-alt"></i></div>
                <div>
                  <div className="chip-label">Cơ Sở</div>
                  <div className="chip-value">{course.campus.name}</div>
                  <div className="chip-sub">{course.campus.detail}</div>
                </div>
              </div>
            </div>

            <div className="req-section">
              <div className="req-block">
                <h3>Yêu Cầu Phụ Huynh</h3>
                <div className="req-list">
                  {course.parentRequirements.map((req, idx) => (
                    <div className="req-item" key={idx}><div className="req-dot"></div> {req}</div>
                  ))}
                </div>
              </div>
              <div className="req-block">
                <h3>Yêu Cầu Gia Sư</h3>
                <div className="req-list">
                  {course.tutorRequirements.map((req, idx) => (
                    <div className="req-item" key={idx}><div className="req-dot"></div> {req}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="clarification">
              <div className="clar-icon"><i className="fas fa-headset"></i></div>
              <div className="clar-text">
                <h4>Cần Giải Đáp?</h4>
                <p>Liên hệ Tư vấn viên Học thuật</p>
              </div>
            </div>
          </div>

          <div className="right-col">
            <div className="enroll-card">
              <div className="enroll-label">Đăng Ký Lớp Học</div>
              <div className="enroll-price">{course.price} <span>{course.period}</span></div>
              <div className="enroll-status">
                <div className="enroll-status-label"><i className="fas fa-clipboard-check"></i> Trạng thái</div>
                <span className="enroll-status-value">Chưa Đăng Ký</span>
              </div>
              <div className="status-preview">
                <div className="status-preview-label">Xem trước các trạng thái</div>
                <div className="status-badges">
                  <span className="mini-badge pending">Chờ duyệt</span>
                  <span className="mini-badge approved">Đã duyệt</span>
                  <span className="mini-badge rejected">Từ chối</span>
                </div>
              </div>
              <button className="btn-register">Đăng Ký Lớp <i className="fas fa-chevron-right"></i></button>
              <button className="btn-download">Tải Giáo Trình</button>
            </div>

            <div className="protocol-card">
              <h3><i className="fas fa-shield-alt"></i> Quy Trình Xét Duyệt</h3>
              <div className="protocol-item">
                <div className="protocol-label">Điều Kiện Tiên Quyết</div>
                <div className="protocol-value">{course.prerequisite}</div>
              </div>
              <div className="protocol-item">
                <div className="protocol-label">Chứng Nhận An Toàn</div>
                <div className="protocol-value">{course.safetyCert}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-left">© 2024 SONG NGUYEN EDU. Cổng Gia Sư Cao Cấp.</div>
        <div className="footer-links">
          <Link href="#">Quyền Riêng Tư</Link>
          <Link href="#">Quy Trình An Toàn</Link>
          <Link href="#">Tiêu Chuẩn Học Thuật</Link>
        </div>
      </footer>
    </>
  );
}
