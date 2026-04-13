import Link from 'next/link';

export default function Dashboard() {
  const userName = 'Nguyễn';
  const greeting = 'Chào mừng bạn đến với Trung tâm Song Nguyên!';
  const profileStatus = 'Gia Sư Chính Thức';
  const matchingClasses = 8;
  const updates = [
    {
      icon: 'chalkboard-teacher',
      iconClass: 'match',
      title: 'Lớp mới cần gia sư',
      desc: 'Toán Lớp 12 – Ca chiều Thứ 2/4/6. Hiện đang thiếu gia sư, bạn có thể đăng ký nhận lớp.',
      time: '2 phút trước',
    },
    {
      icon: 'wallet',
      iconClass: 'payment',
      title: 'Cập nhật thanh toán',
      desc: 'Lương tháng 3 cho buổi "Vật lý Lớp 10" đã được chuyển vào tài khoản.',
      time: '4 giờ trước',
    },
    {
      icon: 'bullhorn',
      iconClass: 'system',
      title: 'Thông báo từ Trung tâm',
      desc: 'Họp gia sư định kỳ vào Thứ 7 tuần này lúc 9:00 sáng tại phòng họp Trung tâm.',
      time: 'Hôm qua',
    },
  ];

  return (
    <>
      <link rel="stylesheet" href="/tutor/css/dashboard.css" />
      
      <div className="welcome-section">
        <h1>Xin chào, {userName}</h1>
        <p>{greeting}</p>
      </div>

      <div className="status-cards">
        <div className="status-card">
          <div className="card-header">
            <div className="card-icon green"><i className="fas fa-check-circle"></i></div>
            <span className="status-badge approved">Đã Duyệt</span>
          </div>
          <div className="card-label">Trạng Thái Hồ Sơ</div>
          <div className="card-value">{profileStatus}</div>
        </div>
        <div className="status-card dark">
          <div className="card-header">
            <div className="card-icon white"><i className="fas fa-puzzle-piece"></i></div>
            <span className="status-badge priority">Ưu Tiên</span>
          </div>
          <div className="card-label">Lớp Phù Hợp</div>
          <div className="card-big-number">{matchingClasses}</div>
          <div className="card-sub">Hiện có sẵn</div>
        </div>
        <div className="status-card activity-card">
          <div className="activity-label">Hoạt Động: Cao</div>
          <div className="activity-chart">
            <div className="activity-bar" style={{ height: '30%', background: '#e5e7eb' }}></div>
            <div className="activity-bar" style={{ height: '40%', background: '#93C5FD' }}></div>
            <div className="activity-bar" style={{ height: '70%', background: '#3B82F6' }}></div>
            <div className="activity-bar" style={{ height: '50%', background: '#60A5FA' }}></div>
            <div className="activity-bar" style={{ height: '80%', background: '#2563EB' }}></div>
            <div className="activity-bar" style={{ height: '60%', background: '#5870D5' }}></div>
            <div className="activity-bar" style={{ height: '100%', background: '#1D4ED8' }}></div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <Link href="/class-list" className="quick-action">
          <div className="quick-action-icon"><i className="fas fa-search"></i></div>
          <div className="quick-action-text">
            <h3>Tìm Lớp Phù Hợp</h3>
            <p>Duyệt cơ hội phù hợp với kỹ năng của bạn</p>
          </div>
          <div className="quick-action-arrow"><i className="fas fa-chevron-right"></i></div>
        </Link>
        <Link href="/profile" className="quick-action">
          <div className="quick-action-icon"><i className="fas fa-edit"></i></div>
          <div className="quick-action-text">
            <h3>Cập Nhật Hồ Sơ</h3>
            <p>Luôn cập nhật chuyên môn và lịch trình</p>
          </div>
          <div className="quick-action-arrow"><i className="fas fa-chevron-right"></i></div>
        </Link>
      </div>

      <div className="section-header">
        <h2>Cập Nhật Gần Đây</h2>
        <Link href="#">Đánh dấu đã đọc</Link>
      </div>
      
      <div className="update-list">
        {updates.map((update, idx) => (
          <div className="update-item" key={idx}>
            <div className={`update-icon ${update.iconClass}`}><i className={`fas fa-${update.icon}`}></i></div>
            <div className="update-text">
              <h4>{update.title}</h4>
              <p>{update.desc}</p>
            </div>
            <span className="update-time">{update.time}</span>
          </div>
        ))}
      </div>

      <div className="article-banner">
        <div className="label">Tạp Chí SONG NGUYEN EDU</div>
        <h2>Làm Chủ Phương Pháp Giảng Dạy Số 2024</h2>
        <p>Khám phá hướng dẫn mới nhất về thu hút học sinh thông qua mô hình học tập kết hợp và kỹ thuật bảng trắng nâng cao.</p>
        <button className="btn-read-article">Đọc Bài Viết <i className="fas fa-arrow-right"></i></button>
      </div>
    </>
  );
}
