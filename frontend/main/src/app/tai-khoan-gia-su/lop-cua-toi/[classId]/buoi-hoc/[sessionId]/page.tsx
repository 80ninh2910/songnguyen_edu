'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiRequestWithAuth, getStoredAccessToken } from '@/lib/api';

type SessionDetail = {
  id: string;
  classId: string;
  tutorId: string;
  sessionNumber: number;
  sessionDate: string;
  startTime: string | null;
  endTime: string | null;
  topic: string | null;
  notes: string | null;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  class: {
    id: string;
    title: string;
    subject: string;
    grade: string;
    district: string;
  };
};

type FeedbackItem = {
  id: string;
  memberId: string;
  attendance: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  attitudeScore: number | null;
  comprehensionScore: number | null;
  homeworkScore: number | null;
  strengths: string | null;
  weaknesses: string | null;
  recommendation: string | null;
  overallComment: string | null;
  createdAt: string;
  updatedAt: string;
  member: {
    studentName: string;
  };
};

const attendanceLabel = (value: FeedbackItem['attendance']) => {
  if (value === 'PRESENT') return 'Co mat';
  if (value === 'ABSENT') return 'Vang';
  if (value === 'LATE') return 'Di muon';
  return 'Co phep';
};

export default function SessionDetailPage() {
  const params = useParams<{ classId: string; sessionId: string }>();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setError('Vui long dang nhap lai.');
      setIsLoading(false);
      return;
    }

    if (!params?.sessionId) return;

    setIsLoading(true);
    Promise.all([
      apiRequestWithAuth<SessionDetail>(`/tutor/sessions/${params.sessionId}`),
      apiRequestWithAuth<FeedbackItem[]>(`/tutor/sessions/${params.sessionId}/feedbacks`),
    ])
      .then(([sessionData, feedbackData]) => {
        setSession(sessionData);
        setFeedbacks(feedbackData);
        setError('');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Khong the tai thong tin buoi hoc.');
      })
      .finally(() => setIsLoading(false));
  }, [params?.sessionId]);

  const statusInfo = useMemo(() => {
    if (!session) return { label: '...', css: 'pending' } as const;
    if (session.status === 'COMPLETED') return { label: 'Da hoan thanh', css: 'approved' } as const;
    if (session.status === 'CANCELLED') return { label: 'Da huy', css: 'rejected' } as const;
    return { label: 'Da len lich', css: 'pending' } as const;
  }, [session]);

  const sessionTitle = session
    ? `Buoi ${session.sessionNumber} • ${new Date(session.sessionDate).toLocaleDateString('vi-VN')}`
    : '';

  return (
    <div className="page-content">
      <div className="session-feedback-header">
        <div>
          <Link
            href={`/tai-khoan-gia-su/lop-cua-toi/${params?.classId ?? ''}`}
            className="btn-text"
            style={{ textDecoration: 'none' }}
          >
            ← Quay lai danh sach buoi hoc
          </Link>
          <h1 className="page-title">Chi tiet buoi hoc</h1>
          <p className="page-subtitle">{sessionTitle || '...'}</p>
        </div>
      </div>

      {isLoading && <div className="session-empty">Dang tai thong tin buoi hoc...</div>}
      {!isLoading && error && <div className="session-empty error">{error}</div>}

      {!isLoading && !error && session && (
        <>
          <div className="session-summary">
            <div className="session-summary-card">
              <div className="label-upper">Lop hoc</div>
              <div className="session-summary-title">{session.class.title}</div>
              <div className="session-summary-meta">
                {session.class.subject} • {session.class.grade} • {session.class.district}
              </div>
            </div>
            <div className="session-summary-card">
              <div className="label-upper">Trang thai</div>
              <div className="session-summary-value">{statusInfo.label}</div>
            </div>
            <div className="session-summary-card">
              <div className="label-upper">Thoi gian</div>
              <div className="session-summary-title">
                {session.startTime && session.endTime ? `${session.startTime} - ${session.endTime}` : 'Chua cap nhat'}
              </div>
              <div className="session-summary-meta">
                {new Date(session.sessionDate).toLocaleDateString('vi-VN')}
              </div>
            </div>
            <div className="session-summary-card">
              <div className="label-upper">Nhan xet</div>
              <div className="session-summary-value">{feedbacks.length}</div>
            </div>
          </div>

          {session.notes ? (
            <div className="session-empty" style={{ marginBottom: '16px' }}>
              Ghi chu: {session.notes}
            </div>
          ) : null}

          {feedbacks.length === 0 ? (
            <div className="session-empty">Chua co nhan xet nao cho buoi hoc nay.</div>
          ) : (
            <div className="feedback-list">
              {feedbacks.map((feedback) => (
                <div className="feedback-card" key={feedback.id}>
                  <div className="feedback-card-header">
                    <div>
                      <h3>{feedback.member.studentName}</h3>
                      <span>Trang thai: {attendanceLabel(feedback.attendance)}</span>
                    </div>
                  </div>

                  <div className="feedback-scores">
                    <div>
                      <p>Thai do</p>
                      <div className="session-summary-meta">
                        {feedback.attitudeScore ?? 'Chua nhap'}
                      </div>
                    </div>
                    <div>
                      <p>Nang luc</p>
                      <div className="session-summary-meta">
                        {feedback.comprehensionScore ?? 'Chua nhap'}
                      </div>
                    </div>
                    <div>
                      <p>Bai tap</p>
                      <div className="session-summary-meta">
                        {feedback.homeworkScore ?? 'Chua nhap'}
                      </div>
                    </div>
                  </div>

                  <div className="feedback-fields">
                    <div>
                      <label>Diem manh</label>
                      <div className="session-summary-meta">{feedback.strengths || 'Chua nhap'}</div>
                    </div>
                    <div>
                      <label>Han che</label>
                      <div className="session-summary-meta">{feedback.weaknesses || 'Chua nhap'}</div>
                    </div>
                    <div>
                      <label>Khuyen nghi</label>
                      <div className="session-summary-meta">{feedback.recommendation || 'Chua nhap'}</div>
                    </div>
                    <div>
                      <label>Nhan xet chu</label>
                      <div className="session-summary-meta">{feedback.overallComment || 'Chua nhap'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
