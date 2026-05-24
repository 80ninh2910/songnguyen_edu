'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiRequestWithAuth, getStoredAccessToken } from '@/lib/api';

type SessionItem = {
  id: string;
  sessionNumber: number;
  sessionDate: string;
  startTime: string | null;
  endTime: string | null;
  topic: string | null;
  notes: string | null;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  feedbackCount: number;
  totalMembers: number;
};

type SessionListResponse = {
  class: {
    id: string;
    title: string;
    subject: string;
    grade: string;
    district: string;
    members?: Array<{ id: string; studentName: string }>;
  };
  memberCount: number;
  sessions: SessionItem[];
};

export default function ClassSessionListPage() {
  const params = useParams<{ classId: string }>();
  const [data, setData] = useState<SessionListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setError('Vui long dang nhap lai.');
      setIsLoading(false);
      return;
    }

    if (!params?.classId) return;

    apiRequestWithAuth<SessionListResponse>(`/tutor/classes/${params.classId}/sessions`)
      .then((result) => {
        setData(result);
        setError('');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Khong the tai danh sach buoi hoc.');
      })
      .finally(() => setIsLoading(false));
  }, [params?.classId]);

  const stats = useMemo(() => {
    const sessions = data?.sessions ?? [];
    const total = sessions.length;
    const completed = sessions.filter((item) => item.status === 'COMPLETED').length;
    const cancelled = sessions.filter((item) => item.status === 'CANCELLED').length;
    const upcoming = total - completed - cancelled;

    return { total, completed, cancelled, upcoming };
  }, [data?.sessions]);

  const statusLabel = (status: SessionItem['status']) => {
    if (status === 'COMPLETED') return { label: 'Đã hoàn thành', css: 'approved' };
    if (status === 'CANCELLED') return { label: 'Đã hủy', css: 'rejected' };
    return { label: 'Đã lên lịch', css: 'pending' };
  };

  return (
    <div className="page-content">
      <div className="session-header">
        <div>
          <div className="session-breadcrumb">
            <Link href="/tai-khoan-gia-su/lop-cua-toi" className="btn-text" style={{ textDecoration: 'none' }}>
              ← Quay lại lớp của tôi
            </Link>
          </div>
          <h1 className="page-title">Danh sách buổi học</h1>
          <p className="page-subtitle">Theo dõi tiến độ buổi học và nhận xét cho lớp được phân công.</p>
        </div>
        <Link
          href={`/tai-khoan-gia-su/lop-cua-toi/${params?.classId ?? ''}/buoi-hoc/tao-moi`}
          className="btn-primary"
          style={{ textDecoration: 'none' }}
        >
          + Tạo buổi học mới
        </Link>
        {data?.class?.members?.length ? (
          <div className="session-member-links">
            {data.class.members.map((member) => (
              <Link
                key={member.id}
                href={`/tai-khoan-gia-su/lop-cua-toi/${data.class.id}/hoc-sinh/${member.id}`}
                className="btn-text"
                style={{ textDecoration: 'none' }}
              >
                Tien do: {member.studentName}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      <div className="session-summary">
        <div className="session-summary-card">
          <div className="label-upper">Lớp học</div>
          <div className="session-summary-title">{data?.class.title ?? '...'}</div>
          <div className="session-summary-meta">
            {data?.class.subject} • {data?.class.grade} • {data?.class.district}
          </div>
        </div>
        <div className="session-summary-card">
          <div className="label-upper">Tổng buổi</div>
          <div className="session-summary-value">{stats.total}</div>
        </div>
        <div className="session-summary-card">
          <div className="label-upper">Đã hoàn thành</div>
          <div className="session-summary-value">{stats.completed}</div>
        </div>
        <div className="session-summary-card">
          <div className="label-upper">Sắp tới</div>
          <div className="session-summary-value">{stats.upcoming}</div>
        </div>
      </div>

      {isLoading && <div className="session-empty">Dang tai danh sach buoi hoc...</div>}
      {!isLoading && error && <div className="session-empty error">{error}</div>}

      {!isLoading && !error && data && data.sessions.length === 0 && (
        <div className="session-empty">Chua co buoi hoc nao. Hay tao buoi moi.</div>
      )}

      {!isLoading && !error && data && data.sessions.length > 0 && (
        <div className="session-list">
          {data.sessions.map((session) => {
            const statusInfo = statusLabel(session.status);
            const feedbackLabel = `${session.feedbackCount}/${session.totalMembers} da nhan xet`;
            return (
              <div className="session-card" key={session.id}>
                <div className="session-card-left">
                  <div className="session-number">Buổi {session.sessionNumber}</div>
                  <div className="session-topic">{session.topic || 'Chua cap nhat chu de'}</div>
                  <div className="session-meta">
                    <span><i className="far fa-calendar"></i> {new Date(session.sessionDate).toLocaleDateString('vi-VN')}</span>
                    {session.startTime && session.endTime && (
                      <span><i className="far fa-clock"></i> {session.startTime} - {session.endTime}</span>
                    )}
                  </div>
                </div>
                <div className="session-card-right">
                  <span className={`status-badge ${statusInfo.css}`}>{statusInfo.label}</span>
                  <div className="session-feedback">{feedbackLabel}</div>
                  <div className="session-actions">
                    <Link
                      href={`/tai-khoan-gia-su/lop-cua-toi/${data.class.id}/buoi-hoc/${session.id}`}
                      className="btn-outline"
                      style={{ textDecoration: 'none' }}
                    >
                      Xem chi tiet
                    </Link>
                    <Link
                      href={`/tai-khoan-gia-su/lop-cua-toi/${data.class.id}/buoi-hoc/${session.id}/nhan-xet`}
                      className="btn-primary"
                      style={{ textDecoration: 'none' }}
                    >
                      Viet nhan xet
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
