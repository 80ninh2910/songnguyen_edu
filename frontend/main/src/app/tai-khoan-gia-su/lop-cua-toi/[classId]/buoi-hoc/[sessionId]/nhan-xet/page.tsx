'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
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
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  class: {
    id: string;
    title: string;
    subject: string;
    grade: string;
    district: string;
    members: Array<{ id: string; studentName: string }>;
  };
};

type FeedbackDraft = {
  memberId: string;
  attendance: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  attitudeScore: number | null;
  comprehensionScore: number | null;
  homeworkScore: number | null;
  strengths: string;
  weaknesses: string;
  recommendation: string;
  overallComment: string;
};

const attendanceOptions: Array<{ value: FeedbackDraft['attendance']; label: string }> = [
  { value: 'PRESENT', label: 'Có mặt' },
  { value: 'ABSENT', label: 'Vắng' },
  { value: 'LATE', label: 'Đi muộn' },
  { value: 'EXCUSED', label: 'Có phép' },
];

const scoreOptions = [1, 2, 3, 4, 5];

export default function SessionFeedbackPage() {
  const params = useParams<{ classId: string; sessionId: string }>();
  const router = useRouter();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [drafts, setDrafts] = useState<Record<string, FeedbackDraft>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setError('Vui long dang nhap lai.');
      setIsLoading(false);
      return;
    }

    if (!params?.sessionId) return;

    apiRequestWithAuth<SessionDetail>(`/tutor/sessions/${params.sessionId}`)
      .then((result) => {
        setSession(result);
        const initialDrafts: Record<string, FeedbackDraft> = {};
        result.class.members.forEach((member) => {
          initialDrafts[member.id] = {
            memberId: member.id,
            attendance: 'PRESENT',
            attitudeScore: null,
            comprehensionScore: null,
            homeworkScore: null,
            strengths: '',
            weaknesses: '',
            recommendation: '',
            overallComment: '',
          };
        });
        setDrafts(initialDrafts);
        setError('');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Khong the tai thong tin buoi hoc.');
      })
      .finally(() => setIsLoading(false));
  }, [params?.sessionId]);

  const handleDraftChange = (memberId: string, key: keyof FeedbackDraft, value: string | number) => {
    setDrafts((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [key]: value,
      },
    }));
  };

  const submitPayload = useMemo(() => Object.values(drafts), [drafts]);

  const handleSubmit = async () => {
    setError('');
    setSuccessMessage('');

    if (!params?.sessionId) return;

    if (submitPayload.length === 0) {
      setError('Khong co hoc sinh de nhan xet.');
      return;
    }

    const invalidScore = submitPayload.some((item) => {
      const scores = [item.attitudeScore, item.comprehensionScore, item.homeworkScore];
      return scores.some((score) => score !== null && (score < 1 || score > 5));
    });

    if (invalidScore) {
      setError('Diem danh gia phai nam trong khoang 1-5.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequestWithAuth(`/tutor/sessions/${params.sessionId}/feedbacks`, {
        method: 'POST',
        body: { feedbacks: submitPayload },
      });
      setSuccessMessage('Da luu nhan xet thanh cong.');
      setTimeout(() => {
        router.push(`/tai-khoan-gia-su/lop-cua-toi/${params.classId}`);
      }, 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Khong the gui nhan xet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sessionTitle = session ? `Buổi ${session.sessionNumber} • ${new Date(session.sessionDate).toLocaleDateString('vi-VN')}` : '';

  return (
    <div className="page-content">
      <div className="session-feedback-header">
        <div>
          <Link
            href={`/tai-khoan-gia-su/lop-cua-toi/${params?.classId ?? ''}`}
            className="btn-text"
            style={{ textDecoration: 'none' }}
          >
            ← Quay lại danh sách buổi học
          </Link>
          <h1 className="page-title">Nhận xét buổi học</h1>
          <p className="page-subtitle">{sessionTitle || '...'} {session?.topic ? `• ${session.topic}` : ''}</p>
        </div>
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={isSubmitting || isLoading || !session}
        >
          {isSubmitting ? 'Dang luu...' : 'Luu nhan xet'}
        </button>
      </div>

      {isLoading && <div className="session-empty">Dang tai nhan xet...</div>}
      {!isLoading && error && <div className="session-empty error">{error}</div>}
      {successMessage && <div className="session-empty success">{successMessage}</div>}

      {!isLoading && !error && session && (
        <div className="feedback-list">
          {session.class.members.map((member) => {
            const draft = drafts[member.id];
            if (!draft) return null;
            return (
              <div className="feedback-card" key={member.id}>
                <div className="feedback-card-header">
                  <div>
                    <h3>{member.studentName}</h3>
                    <span>{session.class.title}</span>
                  </div>
                  <div className="feedback-attendance">
                    {attendanceOptions.map((option) => (
                      <label key={option.value}>
                        <input
                          type="radio"
                          name={`attendance-${member.id}`}
                          checked={draft.attendance === option.value}
                          onChange={() => handleDraftChange(member.id, 'attendance', option.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="feedback-scores">
                  <div>
                    <p>Thai do</p>
                    <div className="feedback-score-row">
                      {scoreOptions.map((score) => (
                        <button
                          type="button"
                          key={`attitude-${member.id}-${score}`}
                          className={draft.attitudeScore === score ? 'score-pill active' : 'score-pill'}
                          onClick={() => handleDraftChange(member.id, 'attitudeScore', score)}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p>Tiep thu</p>
                    <div className="feedback-score-row">
                      {scoreOptions.map((score) => (
                        <button
                          type="button"
                          key={`comprehension-${member.id}-${score}`}
                          className={draft.comprehensionScore === score ? 'score-pill active' : 'score-pill'}
                          onClick={() => handleDraftChange(member.id, 'comprehensionScore', score)}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p>Bai tap</p>
                    <div className="feedback-score-row">
                      {scoreOptions.map((score) => (
                        <button
                          type="button"
                          key={`homework-${member.id}-${score}`}
                          className={draft.homeworkScore === score ? 'score-pill active' : 'score-pill'}
                          onClick={() => handleDraftChange(member.id, 'homeworkScore', score)}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="feedback-fields">
                  <div>
                    <label>Diem manh</label>
                    <textarea
                      rows={2}
                      value={draft.strengths}
                      onChange={(event) => handleDraftChange(member.id, 'strengths', event.target.value)}
                      placeholder="Vi du: Tich cuc phat bieu, lam bai day du..."
                    />
                  </div>
                  <div>
                    <label>Can cai thien</label>
                    <textarea
                      rows={2}
                      value={draft.weaknesses}
                      onChange={(event) => handleDraftChange(member.id, 'weaknesses', event.target.value)}
                      placeholder="Vi du: Can luyen them phan bai tap kho..."
                    />
                  </div>
                  <div>
                    <label>Khuyen nghi</label>
                    <textarea
                      rows={2}
                      value={draft.recommendation}
                      onChange={(event) => handleDraftChange(member.id, 'recommendation', event.target.value)}
                      placeholder="Vi du: Luyen tap them dang bai ..."
                    />
                  </div>
                  <div>
                    <label>Nhan xet tong</label>
                    <textarea
                      rows={2}
                      value={draft.overallComment}
                      onChange={(event) => handleDraftChange(member.id, 'overallComment', event.target.value)}
                      placeholder="Nhan xet tong quan ve buoi hoc..."
                    />
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
