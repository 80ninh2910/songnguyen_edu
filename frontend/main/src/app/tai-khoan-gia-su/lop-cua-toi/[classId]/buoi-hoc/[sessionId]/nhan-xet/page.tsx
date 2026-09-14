'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { apiRequestWithAuth, getStoredAccessToken } from '@/lib/api';

type Attendance = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

type SessionDetail = {
  id: string;
  sessionNumber: number;
  sessionDate: string;
  topic: string | null;
  class: {
    title: string;
    members: Array<{ id: string; studentName: string }>;
  };
};

type FeedbackDraft = {
  memberId: string;
  attendance: Attendance;
  attitudeScore: number | null;
  comprehensionScore: number | null;
  homeworkScore: number | null;
  strengths: string;
  weaknesses: string;
  recommendation: string;
  overallComment: string;
};

const attendanceOptions: Array<{ value: Attendance; label: string }> = [
  { value: 'PRESENT', label: 'Có mặt' },
  { value: 'ABSENT', label: 'Vắng' },
  { value: 'LATE', label: 'Đi muộn' },
  { value: 'EXCUSED', label: 'Có phép' },
];

const scoreGroups = [
  { field: 'attitudeScore' as const, label: 'Thái độ' },
  { field: 'comprehensionScore' as const, label: 'Tiếp thu' },
  { field: 'homeworkScore' as const, label: 'Bài tập' },
];

const scoreHints: Record<number, string> = {
  1: 'Cần hỗ trợ',
  2: 'Chưa đạt',
  3: 'Đạt',
  4: 'Tốt',
  5: 'Rất tốt',
};

const createDraft = (memberId: string): FeedbackDraft => ({
  memberId,
  attendance: 'PRESENT',
  attitudeScore: null,
  comprehensionScore: null,
  homeworkScore: null,
  strengths: '',
  weaknesses: '',
  recommendation: '',
  overallComment: '',
});

const isDraftComplete = (draft: FeedbackDraft) =>
  draft.attendance === 'ABSENT' ||
  scoreGroups.every(({ field }) => typeof draft[field] === 'number');

export default function SessionFeedbackPage() {
  const params = useParams<{ classId: string; sessionId: string }>();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [drafts, setDrafts] = useState<Record<string, FeedbackDraft>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [invalidMembers, setInvalidMembers] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const storageKey = params?.sessionId ? `sne-feedback-draft:${params.sessionId}` : '';

  useEffect(() => {
    if (!getStoredAccessToken()) {
      setError('Vui lòng đăng nhập lại.');
      setIsLoading(false);
      return;
    }
    if (!params?.sessionId) return;

    apiRequestWithAuth<SessionDetail>(`/tutor/sessions/${params.sessionId}`)
      .then((result) => {
        const saved = window.localStorage.getItem(`sne-feedback-draft:${result.id}`);
        const savedDrafts = saved ? (JSON.parse(saved) as Record<string, FeedbackDraft>) : {};
        const initialDrafts = Object.fromEntries(
          result.class.members.map((member) => [
            member.id,
            savedDrafts[member.id] ?? createDraft(member.id),
          ]),
        );
        setSession(result);
        setDrafts(initialDrafts);
        setExpanded(Object.fromEntries(result.class.members.map((member, index) => [member.id, index === 0])));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải thông tin buổi học.'))
      .finally(() => setIsLoading(false));
  }, [params?.sessionId]);

  useEffect(() => {
    if (!storageKey || isLoading || Object.keys(drafts).length === 0) return;
    window.localStorage.setItem(storageKey, JSON.stringify(drafts));
  }, [drafts, isLoading, storageKey]);

  const completedCount = useMemo(
    () => Object.values(drafts).filter(isDraftComplete).length,
    [drafts],
  );
  const totalCount = Object.keys(drafts).length;

  const updateDraft = <K extends keyof FeedbackDraft>(
    memberId: string,
    field: K,
    value: FeedbackDraft[K],
  ) => {
    setDrafts((current) => ({
      ...current,
      [memberId]: {
        ...current[memberId],
        [field]: value,
        ...(field === 'attendance' && value === 'ABSENT'
          ? { attitudeScore: null, comprehensionScore: null, homeworkScore: null }
          : {}),
      },
    }));
    setInvalidMembers((current) => ({ ...current, [memberId]: false }));
    setSuccessMessage('');
  };

  const handleSubmit = async () => {
    setError('');
    setSuccessMessage('');
    const incomplete = Object.values(drafts).filter((draft) => !isDraftComplete(draft));
    if (incomplete.length > 0) {
      const invalid = Object.fromEntries(incomplete.map((draft) => [draft.memberId, true]));
      setInvalidMembers(invalid);
      setExpanded((current) => ({ ...current, ...invalid }));
      document.getElementById(`feedback-${incomplete[0].memberId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setError(`Còn ${incomplete.length} học viên chưa được chấm đủ điểm.`);
      return;
    }
    if (!params?.sessionId) return;

    setIsSubmitting(true);
    try {
      await apiRequestWithAuth(`/tutor/sessions/${params.sessionId}/feedbacks`, {
        method: 'POST',
        body: { feedbacks: Object.values(drafts) },
      });
      if (storageKey) window.localStorage.removeItem(storageKey);
      setSuccessMessage('Đã lưu nhận xét thành công.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lưu nhận xét.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sessionTitle = session
    ? `Buổi ${session.sessionNumber} · ${new Date(session.sessionDate).toLocaleDateString('vi-VN')}`
    : '';

  return (
    <div className="page-content feedback-page">
      <header className="session-feedback-header">
        <div>
          <Link href={`/tai-khoan-gia-su/lop-cua-toi/${params?.classId ?? ''}`} className="feedback-back-link">
            ← Danh sách buổi học
          </Link>
          <h1 className="page-title">Nhận xét buổi học</h1>
          <p className="page-subtitle">
            {sessionTitle || '...'} {session?.topic ? `· ${session.topic}` : ''}
          </p>
        </div>
        {session && (
          <div className="feedback-progress-card">
            <strong>{completedCount}/{totalCount}</strong>
            <span>học viên hoàn thành</span>
            <div><i style={{ width: `${totalCount ? (completedCount / totalCount) * 100 : 0}%` }} /></div>
          </div>
        )}
      </header>

      {isLoading && <div className="session-empty">Đang tải nhận xét...</div>}
      {error && <div className="feedback-alert error">{error}</div>}
      {successMessage && (
        <div className="feedback-alert success">
          <span>{successMessage}</span>
          <Link href={`/tai-khoan-gia-su/lop-cua-toi/${params?.classId ?? ''}`}>Quay lại danh sách</Link>
        </div>
      )}

      {!isLoading && session && (
        <div className="feedback-list">
          {session.class.members.map((member, index) => {
            const draft = drafts[member.id];
            if (!draft) return null;
            const open = expanded[member.id];
            return (
              <section id={`feedback-${member.id}`} className={`feedback-card${invalidMembers[member.id] ? ' invalid' : ''}`} key={member.id}>
                <button
                  type="button"
                  className="feedback-card-toggle"
                  onClick={() => setExpanded((current) => ({ ...current, [member.id]: !open }))}
                  aria-expanded={open}
                >
                  <span className="student-index">{index + 1}</span>
                  <span className="student-summary">
                    <strong>{member.studentName}</strong>
                    <small>{session.class.title}</small>
                  </span>
                  <span className={`completion-badge${isDraftComplete(draft) ? ' done' : ''}`}>
                    {isDraftComplete(draft) ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                  </span>
                  <span className="toggle-chevron">⌄</span>
                </button>

                {open && (
                  <div className="feedback-card-body">
                    <div className="feedback-section-label">Điểm danh</div>
                    <div className="feedback-attendance" role="radiogroup" aria-label={`Điểm danh ${member.studentName}`}>
                      {attendanceOptions.map((option) => (
                        <button
                          type="button"
                          key={option.value}
                          className={draft.attendance === option.value ? `active attendance-${option.value.toLowerCase()}` : ''}
                          onClick={() => updateDraft(member.id, 'attendance', option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    {draft.attendance !== 'ABSENT' && (
                      <>
                        <div className="feedback-section-label">Đánh giá học tập</div>
                        <div className="feedback-scores">
                          {scoreGroups.map(({ field, label }) => (
                            <div className="score-group" key={field}>
                              <div className="score-group-heading">
                                <strong>{label}</strong>
                                <span>{draft[field] ? scoreHints[draft[field] as number] : 'Chưa chấm'}</span>
                              </div>
                              <div className="feedback-score-row">
                                {[1, 2, 3, 4, 5].map((score) => (
                                  <button
                                    type="button"
                                    key={score}
                                    className={draft[field] === score ? 'score-pill active' : 'score-pill'}
                                    onClick={() => updateDraft(member.id, field, score)}
                                    aria-label={`${label}: ${score} - ${scoreHints[score]}`}
                                  >
                                    {score}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {invalidMembers[member.id] && (
                          <p className="feedback-inline-error">Vui lòng chấm đủ ba tiêu chí cho học viên này.</p>
                        )}

                        <div className="feedback-section-label">Nhận xét chi tiết</div>
                        <div className="feedback-fields">
                          {[
                            ['strengths', 'Điểm mạnh', 'Ví dụ: Tích cực phát biểu, làm bài đầy đủ...'],
                            ['weaknesses', 'Cần cải thiện', 'Ví dụ: Cần luyện thêm phần bài tập khó...'],
                            ['recommendation', 'Khuyến nghị', 'Ví dụ: Luyện tập thêm dạng bài phương trình...'],
                            ['overallComment', 'Nhận xét tổng quan', 'Tóm tắt quá trình học trong buổi...'],
                          ].map(([field, label, placeholder]) => (
                            <label key={field}>
                              <span>{label}</span>
                              <textarea
                                rows={3}
                                maxLength={500}
                                value={draft[field as keyof FeedbackDraft] as string}
                                onChange={(event) => updateDraft(member.id, field as keyof FeedbackDraft, event.target.value)}
                                placeholder={placeholder}
                              />
                              <small>{(draft[field as keyof FeedbackDraft] as string).length}/500</small>
                            </label>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {!isLoading && session && (
        <div className="feedback-sticky-actions">
          <div>
            <strong>{completedCount}/{totalCount} học viên</strong>
            <span>Bản nháp được lưu tự động trên thiết bị này</span>
          </div>
          <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu nhận xét'}
          </button>
        </div>
      )}
    </div>
  );
}
