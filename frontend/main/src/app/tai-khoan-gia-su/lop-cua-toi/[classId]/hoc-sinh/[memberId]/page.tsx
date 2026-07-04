'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { apiRequestWithAuth, getStoredAccessToken } from '@/lib/api';

type MemberReport = {
  member: {
    id: string;
    studentName: string;
    parentName: string;
    parentPhone: string;
    classId: string;
    class: {
      id: string;
      title: string;
      subject: string;
      grade: string;
    };
  };
  attendance: {
    totalSessions: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
  };
  averages: {
    attitude: number | null;
    comprehension: number | null;
    homework: number | null;
  };
  feedbacks: Array<{
    id: string;
    attendance: string;
    attitudeScore: number | null;
    comprehensionScore: number | null;
    homeworkScore: number | null;
    overallComment: string | null;
    createdAt: string;
    session: {
      id: string;
      sessionNumber: number;
      sessionDate: string;
    };
    tutor: {
      id: string;
      fullName: string;
    };
  }>;
};

export default function StudentProgressPage() {
  const params = useParams<{ classId: string; memberId: string }>();
  const [data, setData] = useState<MemberReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setError('Vui lòng đăng nhập lại.');
      setIsLoading(false);
      return;
    }

    if (!params?.classId || !params?.memberId) return;

    apiRequestWithAuth<MemberReport>(
      `/tutor/classes/${params.classId}/members/${params.memberId}/progress`,
    )
      .then((result) => {
        setData(result);
        setError('');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Không thể tải tiến độ học sinh.');
      })
      .finally(() => setIsLoading(false));
  }, [params?.classId, params?.memberId]);

  const stats = useMemo(() => {
    if (!data) return null;
    const attendance = data.attendance;
    return {
      total: attendance.totalSessions,
      present: attendance.present,
      absent: attendance.absent,
      late: attendance.late,
      excused: attendance.excused,
    };
  }, [data]);

  return (
    <div className="page-content">
      <div className="student-progress-header">
        <div>
          <Link
            href={`/tai-khoan-gia-su/lop-cua-toi/${params?.classId ?? ''}`}
            className="btn-text"
            style={{ textDecoration: 'none' }}
          >
            ← Quay lại buổi học
          </Link>
          <h1 className="page-title">Tiến độ học sinh</h1>
          <p className="page-subtitle">Theo dõi mức độ tiến bộ qua từng buổi học.</p>
        </div>
      </div>

      {isLoading && <div className="session-empty">Đang tải tiến độ học sinh...</div>}
      {!isLoading && error && <div className="session-empty error">{error}</div>}

      {!isLoading && !error && data && stats && (
        <>
          <div className="student-summary">
            <div className="student-summary-card">
              <div className="student-summary-name">{data.member.studentName}</div>
              <div className="student-summary-meta">
                {data.member.class.title} • {data.member.class.subject} • {data.member.class.grade}
              </div>
              <div className="student-summary-parent">
                Phụ huynh: {data.member.parentName} ({data.member.parentPhone})
              </div>
            </div>
            <div className="student-summary-card">
              <div className="label-upper">Tổng buổi</div>
              <div className="student-summary-value">{stats.total}</div>
            </div>
            <div className="student-summary-card">
              <div className="label-upper">Có mặt</div>
              <div className="student-summary-value">{stats.present}</div>
            </div>
            <div className="student-summary-card">
              <div className="label-upper">Vắng</div>
              <div className="student-summary-value">{stats.absent}</div>
            </div>
          </div>

          <div className="student-score-grid">
            <div className="student-score-card">
              <div className="label-upper">TB Thái độ</div>
              <div className="student-score-value">{data.averages.attitude ?? '-'}</div>
            </div>
            <div className="student-score-card">
              <div className="label-upper">TB Tiếp thu</div>
              <div className="student-score-value">{data.averages.comprehension ?? '-'}</div>
            </div>
            <div className="student-score-card">
              <div className="label-upper">TB Bài tập</div>
              <div className="student-score-value">{data.averages.homework ?? '-'}</div>
            </div>
            <div className="student-score-card">
              <div className="label-upper">Có phép</div>
              <div className="student-score-value">{stats.excused}</div>
            </div>
            <div className="student-score-card">
              <div className="label-upper">Đi muộn</div>
              <div className="student-score-value">{stats.late}</div>
            </div>
          </div>

          <div className="student-feedback-history">
            <h2>Lịch sử nhận xét</h2>
            <div className="student-feedback-list">
              {data.feedbacks.length === 0 && (
                <div className="session-empty">Chưa có nhận xét nào.</div>
              )}
              {data.feedbacks.map((feedback) => (
                <div className="student-feedback-card" key={feedback.id}>
                  <div>
                    <div className="student-feedback-title">
                      Buổi {feedback.session.sessionNumber} • {new Date(feedback.session.sessionDate).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="student-feedback-meta">
                      Gia sư: {feedback.tutor.fullName}
                    </div>
                    {feedback.overallComment && (
                      <p className="student-feedback-comment">{feedback.overallComment}</p>
                    )}
                  </div>
                  <div className="student-feedback-scores">
                    <span>Thai do: {feedback.attitudeScore ?? '-'}</span>
                    <span>Tiep thu: {feedback.comprehensionScore ?? '-'}</span>
                    <span>Bai tap: {feedback.homeworkScore ?? '-'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
