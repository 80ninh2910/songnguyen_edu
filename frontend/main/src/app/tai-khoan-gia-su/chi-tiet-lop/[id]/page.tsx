'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiRequest, apiRequestWithAuth, getStoredAccessToken } from '@/lib/api';

export default function ClassDetail() {
  const params = useParams<{ id: string }>();
  type PublicClass = {
    id: string;
    title: string;
    subject: string;
    grade: string;
    district: string;
    feePerHour: number;
    schedule: string | null;
    status: string;
  };

  const [course, setCourse] = useState<PublicClass | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyMessage, setApplyMessage] = useState('');

  useEffect(() => {
    if (!params?.id) return;

    apiRequest<PublicClass>(`/public/classes/${params.id}`)
      .then((data) => {
        setCourse(data);
        setError('');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Khong the tai chi tiet lop.');
      })
      .finally(() => setIsLoading(false));
  }, [params?.id]);

  const handleApply = async () => {
    const token = getStoredAccessToken();
    if (!token) {
      setApplyMessage('Vui long dang nhap lai.');
      return;
    }

    if (!course) return;

    try {
      await apiRequestWithAuth(`/tutor/classes/${course.id}/apply`, { method: 'POST' });
      setApplyMessage('Da gui yeu cau tham gia lop.');
    } catch (err) {
      setApplyMessage(err instanceof Error ? err.message : 'Khong the gui yeu cau.');
    }
  };

  return (
    <>
      <nav className="top-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span className="nav-brand">SONG NGUYEN EDU</span>
          <div className="nav-links">
            <Link href="/tai-khoan-gia-su" className="active">Bảng Điều Khiển</Link>
            <Link href="/tai-khoan-gia-su/danh-sach-lop">Danh Sách Lớp</Link>
            <Link href="/tai-khoan-gia-su/lop-cua-toi">Lớp Của Tôi</Link>
          </div>
        </div>
        <div className="nav-right">
          <div className="nav-icon"><i className="fas fa-bell"></i></div>
          <div className="nav-icon"><i className="fas fa-cog"></i></div>
          <div className="nav-avatar">N</div>
        </div>
      </nav>

      <div className="page-container">
        {isLoading && <p>Dang tai...</p>}
        {!isLoading && error && <p style={{ color: '#ef4444' }}>{error}</p>}
        {!isLoading && !error && course && (
          <>
            <div className="course-badges">
              <span className="badge-approved">{course.status === 'OPEN' ? 'Dang tuyen' : course.status}</span>
              <span className="course-id">MA LOP: {course.id}</span>
            </div>
            <h1 className="course-title">{course.title}</h1>
            <p className="course-desc">Lop {course.subject} - {course.grade} tai {course.district}.</p>
          </>
        )}

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
                    <div className="avail-number">{course ? 0 : 0}</div>
                    <div className="avail-total">/ {course ? 0 : 0}</div>
                  </div>
                </div>
                <p className="avail-sub">Thong tin suc chua se cap nhat sau.</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-chip">
                <div className="info-chip-icon avatar-icon"><i className="fas fa-user"></i></div>
                <div>
                  <div className="chip-label">Giảng Viên</div>
                  <div className="chip-value">Chua co gia su</div>
                  <div className="chip-sub">Dang tuyen gia su cho lop nay</div>
                </div>
              </div>
              <div className="info-chip">
                <div className="info-chip-icon resource-icon"><i className="fas fa-file-alt"></i></div>
                <div>
                  <div className="chip-label">Tài Liệu</div>
                  <div className="chip-value">Giao trinh</div>
                  <div className="chip-sub">Se cap nhat khi nhan lop</div>
                </div>
              </div>
              <div className="info-chip">
                <div className="info-chip-icon campus-icon"><i className="fas fa-map-marker-alt"></i></div>
                <div>
                  <div className="chip-label">Cơ Sở</div>
                  <div className="chip-value">{course?.district || 'Chua cap nhat'}</div>
                  <div className="chip-sub">Dia chi lop</div>
                </div>
              </div>
            </div>

            <div className="req-section">
              <div className="req-block">
                <h3>Yêu Cầu Phụ Huynh</h3>
                <div className="req-list">
                  {[
                    'Co kinh nghiem giang day tu 6 thang tro len.',
                    'Phu hop voi yeu cau mon hoc va cap do.',
                  ].map((req, idx) => (
                    <div className="req-item" key={idx}><div className="req-dot"></div> {req}</div>
                  ))}
                </div>
              </div>
              <div className="req-block">
                <h3>Yêu Cầu Gia Sư</h3>
                <div className="req-list">
                  {[
                    'Cam ket day dung lich da dang ky.',
                    'Tuân thu noi quy trung tam.',
                  ].map((req, idx) => (
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
              <div className="enroll-price">
                {course ? `${Math.round(course.feePerHour / 1000)}.000đ` : '---'} <span>/ gio</span>
              </div>
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
              <button className="btn-register" onClick={handleApply}>
                Dang ky lop <i className="fas fa-chevron-right"></i>
              </button>
              {applyMessage && <p style={{ marginTop: '12px', color: '#2563EB' }}>{applyMessage}</p>}
              <button className="btn-download">Tai giao trinh</button>
            </div>

            <div className="protocol-card">
              <h3><i className="fas fa-shield-alt"></i> Quy Trình Xét Duyệt</h3>
              <div className="protocol-item">
                <div className="protocol-label">Điều Kiện Tiên Quyết</div>
                <div className="protocol-value">Dam bao thoi gian hop le.</div>
              </div>
              <div className="protocol-item">
                <div className="protocol-label">Chứng Nhận An Toàn</div>
                <div className="protocol-value">Trai qua bai test cua trung tam.</div>
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
