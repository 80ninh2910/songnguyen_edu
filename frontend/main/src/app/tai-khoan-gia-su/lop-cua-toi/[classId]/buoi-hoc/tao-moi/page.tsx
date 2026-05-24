'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiRequestWithAuth, getStoredAccessToken } from '@/lib/api';

type CreateSessionPayload = {
  sessionDate: string;
  startTime?: string;
  endTime?: string;
  topic?: string;
  notes?: string;
};

export default function CreateSessionPage() {
  const params = useParams<{ classId: string }>();
  const router = useRouter();
  const [form, setForm] = useState<CreateSessionPayload>({
    sessionDate: '',
    startTime: '',
    endTime: '',
    topic: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const updateField = (key: keyof CreateSessionPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    const token = getStoredAccessToken();
    if (!token) {
      setError('Vui long dang nhap lai.');
      return;
    }

    if (!params?.classId) {
      setError('Khong tim thay lop hoc.');
      return;
    }

    if (!form.sessionDate) {
      setError('Vui long chon ngay day.');
      return;
    }

    const payload: CreateSessionPayload = {
      sessionDate: form.sessionDate,
      startTime: form.startTime || undefined,
      endTime: form.endTime || undefined,
      topic: form.topic || undefined,
      notes: form.notes || undefined,
    };

    setIsSubmitting(true);
    try {
      await apiRequestWithAuth(`/tutor/classes/${params.classId}/sessions`, {
        method: 'POST',
        body: payload,
      });
      setSuccessMessage('Tao buoi hoc thanh cong.');
      setTimeout(() => {
        router.push(`/tai-khoan-gia-su/lop-cua-toi/${params.classId}`);
      }, 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Khong the tao buoi hoc.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      <div className="session-form-header">
        <div>
          <Link
            href={`/tai-khoan-gia-su/lop-cua-toi/${params?.classId ?? ''}`}
            className="btn-text"
            style={{ textDecoration: 'none' }}
          >
            ← Quay lại danh sách buổi học
          </Link>
          <h1 className="page-title">Tạo buổi học mới</h1>
          <p className="page-subtitle">Lên lịch buổi học để bắt đầu nhận xét học sinh.</p>
        </div>
      </div>

      <form className="session-form" onSubmit={handleSubmit}>
        <div className="session-form-grid">
          <div className="session-form-field">
            <label>Ngày dạy</label>
            <input
              type="date"
              value={form.sessionDate}
              onChange={(event) => updateField('sessionDate', event.target.value)}
              required
            />
          </div>
          <div className="session-form-field">
            <label>Giờ bắt đầu</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(event) => updateField('startTime', event.target.value)}
            />
          </div>
          <div className="session-form-field">
            <label>Giờ kết thúc</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(event) => updateField('endTime', event.target.value)}
            />
          </div>
          <div className="session-form-field session-form-field--full">
            <label>Chủ đề buổi học</label>
            <input
              type="text"
              value={form.topic}
              onChange={(event) => updateField('topic', event.target.value)}
              placeholder="Vi du: Chuong 3 - Phuong trinh bac 2"
            />
          </div>
          <div className="session-form-field session-form-field--full">
            <label>Ghi chú chung</label>
            <textarea
              value={form.notes}
              onChange={(event) => updateField('notes', event.target.value)}
              placeholder="Ghi chu nhanh ve muc tieu buoi hoc..."
              rows={4}
            />
          </div>
        </div>

        {error && <div className="session-form-message error">{error}</div>}
        {successMessage && <div className="session-form-message success">{successMessage}</div>}

        <div className="session-form-actions">
          <Link
            href={`/tai-khoan-gia-su/lop-cua-toi/${params?.classId ?? ''}`}
            className="btn-outline"
            style={{ textDecoration: 'none' }}
          >
            Huy
          </Link>
          <button className="btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Dang tao...' : 'Tao buoi hoc'}
          </button>
        </div>
      </form>
    </div>
  );
}
