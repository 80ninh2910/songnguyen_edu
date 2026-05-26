'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiRequestWithAuth, getStoredAccessToken } from '@/lib/api';
import { useProfile } from '@/context/ProfileContext';

// Kiểu dữ liệu cho ứng tuyển viên (GIA_SU_CO_DO, GIA_SU_SINH_VIEN, ...)
type ApplicationItem = {
  id: string;
  status: string;
  createdAt: string;
  class: {
    id: string;
    title: string;
    grade: string;
    subject: string;
    district: string;
    feePerHour: number;
    schedule: string | null;
  };
};

// Kiểu dữ liệu cho giáo viên trung tâm (GIAO_VIEN_TRUNG_TAM)
type AssignedClassItem = {
  id: string;
  title: string;
  grade: string;
  subject: string;
  district: string;
  feePerHour: number;
  schedule: string | null;
  status: string;
  classType: string;
  assignedAt: string;
  note: string | null;
};

export default function MyClasses() {
  const { profile, isLoading: isProfileLoading } = useProfile();
  const isCenterTeacher = profile.tutorType === 'GIAO_VIEN_TRUNG_TAM';

  // State cho ứng tuyển viên
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  // State cho giáo viên trung tâm
  const [assignedClasses, setAssignedClasses] = useState<AssignedClassItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Đợi profile load xong mới fetch
    if (isProfileLoading) return;

    const token = getStoredAccessToken();
    if (!token) {
      setError('Vui lòng đăng nhập lại.');
      setIsLoading(false);
      return;
    }

    if (isCenterTeacher) {
      // Giáo viên trung tâm: lấy lớp được phân công
      apiRequestWithAuth<AssignedClassItem[]>('/tutor/my-assigned-classes')
        .then((data) => {
          setAssignedClasses(Array.isArray(data) ? data : []);
          setError('');
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Không thể tải danh sách lớp.');
        })
        .finally(() => setIsLoading(false));
    } else {
      // Gia sư thông thường: lấy lịch sử ứng tuyển
      apiRequestWithAuth<ApplicationItem[]>('/tutor/applications')
        .then((data) => {
          setApplications(Array.isArray(data) ? data : []);
          setError('');
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Không thể tải lớp của tôi.');
        })
        .finally(() => setIsLoading(false));
    }
  }, [isCenterTeacher, isProfileLoading]);

  const mapStatus = (status: string) => {
    if (status === 'ACCEPTED') {
      return { label: 'Đã duyệt', css: 'approved', action: 'join', actionLabel: 'Xem Lịch Dạy' };
    }
    if (status === 'REJECTED') {
      return { label: 'Từ chối', css: 'rejected', action: 'reschedule', actionLabel: 'Đăng Ký Lớp Khác' };
    }
    return { label: 'Chờ duyệt', css: 'pending', action: 'review', actionLabel: 'Đang Chờ Xét Duyệt' };
  };

  // Hiển thị loading cho đến khi cả profile và data đều ready
  if (isProfileLoading) {
    return (
      <div style={{ padding: '24px', color: '#64748B' }}>Đang tải thông tin...</div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Lớp Của Tôi</h1>
          <p className="page-subtitle">
            {isCenterTeacher
              ? 'Danh sách lớp được trung tâm phân công cho bạn.'
              : 'Quản lý và theo dõi các buổi học đã đăng ký.'}
          </p>
        </div>
        {/* Ẩn tabs trạng thái với giáo viên trung tâm vì họ chỉ có 1 trạng thái ASSIGNED */}
        {!isCenterTeacher && (
          <div className="tabs">
            <button className="tab active">Tất Cả</button>
            <button className="tab">Chờ Duyệt</button>
            <button className="tab">Đã Duyệt</button>
            <button className="tab">Từ Chối</button>
          </div>
        )}
      </div>

      <div className="class-list">
        {isLoading && (
          <div style={{ padding: '24px', color: '#64748B' }}>Đang tải danh sách lớp...</div>
        )}
        {!isLoading && error && (
          <div style={{ padding: '24px', color: '#ef4444' }}>{error}</div>
        )}

        {/* ===== UI cho GIAO_VIEN_TRUNG_TAM ===== */}
        {!isLoading && !error && isCenterTeacher && (
          <>
            {assignedClasses.length === 0 && (
              <div style={{ padding: '24px', color: '#64748B' }}>
                Chưa có lớp nào được phân công. Vui lòng liên hệ quản trị viên trung tâm.
              </div>
            )}
            {assignedClasses.map((cls) => (
              <div className="class-item" key={cls.id}>
                <div className="class-thumb">
                  <i className="fas fa-chalkboard-teacher"></i>
                </div>
                <div className="class-info">
                  <div className="class-name">
                    {cls.title}
                    <span className="status-badge approved" style={{ background: '#0ea5e9', color: '#fff' }}>
                      ASSIGNED
                    </span>
                  </div>
                  <div className="class-meta">
                    <span><i className="fas fa-book"></i> {cls.subject}</span>
                    <span><i className="fas fa-layer-group"></i> {cls.grade}</span>
                    <span><i className="fas fa-map-marker-alt"></i> {cls.district}</span>
                    {cls.schedule && <span><i className="far fa-clock"></i> {cls.schedule}</span>}
                    <span><i className="far fa-calendar"></i> Phân công: {new Date(cls.assignedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  {cls.note && (
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                      <i className="fas fa-sticky-note"></i> Ghi chú: {cls.note}
                    </div>
                  )}
                </div>
                <div className="class-actions">
                  <Link
                    href={`/tai-khoan-gia-su/lop-cua-toi/${cls.id}`}
                    className="btn-action join"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}
                  >
                    Xem Lịch Dạy
                  </Link>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ===== UI cho ứng tuyển viên thông thường ===== */}
        {!isLoading && !error && !isCenterTeacher && (
          <>
            {applications.length === 0 && (
              <div style={{ padding: '24px', color: '#64748B' }}>Chưa có lớp nào.</div>
            )}
            {applications.map((cls, idx) => {
              const statusInfo = mapStatus(cls.status);
              return (
                <div className="class-item" key={idx}>
                  <div className="class-thumb">
                    <i className="fas fa-chalkboard"></i>
                  </div>
                  <div className="class-info">
                    <div className="class-name">
                      {cls.class.title}
                      <span className={`status-badge ${statusInfo.css}`}>{statusInfo.label}</span>
                    </div>
                    <div className="class-meta">
                      <span><i className="fas fa-user"></i> {cls.class.subject}</span>
                      <span><i className="far fa-calendar"></i> {new Date(cls.createdAt).toLocaleDateString('vi-VN')}</span>
                      {cls.class.schedule && <span><i className="far fa-clock"></i> {cls.class.schedule}</span>}
                    </div>
                  </div>
                  <div className="class-actions">
                    <Link href={`/tai-khoan-gia-su/chi-tiet-lop/${cls.class.id}`} className="btn-text" style={{ textDecoration: 'none' }}>Xem Chi Tiết</Link>
                    {statusInfo.actionLabel === 'Xem Lịch Dạy' ? (
                      <Link
                        href={`/tai-khoan-gia-su/lop-cua-toi/${cls.class.id}`}
                        className={`btn-action ${statusInfo.action}`}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}
                      >
                        {statusInfo.actionLabel}
                      </Link>
                    ) : (
                      <button className={`btn-action ${statusInfo.action}`}>{statusInfo.actionLabel}</button>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className="load-more">
        <button>Tải thêm buổi học</button>
      </div>
    </>
  );
}
