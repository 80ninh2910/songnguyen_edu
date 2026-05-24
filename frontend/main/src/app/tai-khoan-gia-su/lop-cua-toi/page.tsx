
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiRequestWithAuth, getStoredAccessToken } from '@/lib/api';

export default function MyClasses() {
  const [classes, setClasses] = useState<Array<{
    id: string;
    status: string;
    class: {
      id: string;
      title: string;
      grade: string;
      subject: string;
      district: string;
      feePerHour: number;
      schedule: string | null;
    };
    createdAt: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setError('Vui long dang nhap lai.');
      setIsLoading(false);
      return;
    }

    apiRequestWithAuth<typeof classes>("/tutor/applications")
      .then((data) => {
        setClasses(data);
        setError('');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Khong the tai lop cua toi.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const mapStatus = (status: string) => {
    if (status === 'ACCEPTED') {
      return { label: 'Đã duyệt', css: 'approved', action: 'join', actionLabel: 'Xem Lịch Dạy' };
    }
    if (status === 'REJECTED') {
      return { label: 'Từ chối', css: 'rejected', action: 'reschedule', actionLabel: 'Đăng Ký Lớp Khác' };
    }
    return { label: 'Chờ duyệt', css: 'pending', action: 'review', actionLabel: 'Đang Chờ Xét Duyệt' };
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Lớp Của Tôi</h1>
          <p className="page-subtitle">Quản lý và theo dõi các buổi học đã đăng ký.</p>
        </div>
        <div className="tabs">
          <button className="tab active">Tất Cả</button>
          <button className="tab">Chờ Duyệt</button>
          <button className="tab">Đã Duyệt</button>
          <button className="tab">Từ Chối</button>
        </div>
      </div>

      <div className="class-list">
        {isLoading && (
          <div style={{ padding: '24px', color: '#64748B' }}>Dang tai danh sach lop...</div>
        )}
        {!isLoading && error && (
          <div style={{ padding: '24px', color: '#ef4444' }}>{error}</div>
        )}
        {!isLoading && !error && classes.length === 0 && (
          <div style={{ padding: '24px', color: '#64748B' }}>Chua co lop nao.</div>
        )}
        {!isLoading && !error && classes.map((cls, idx) => {
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
      </div>

      <div className="load-more">
        <button>Tải thêm buổi học</button>
      </div>
    </>
  );
}
