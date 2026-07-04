'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequestWithAuth } from '@/lib/api';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới không khớp.');
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequestWithAuth<{ updated: boolean }>('/tutor/password', {
        method: 'POST',
        body: { currentPassword, newPassword },
      });

      const rawUser = localStorage.getItem('sne_user');
      if (rawUser) {
        try {
          const user = JSON.parse(rawUser) as { mustChangePassword?: boolean };
          user.mustChangePassword = false;
          localStorage.setItem('sne_user', JSON.stringify(user));
        } catch {
          // Ignore malformed session state.
        }
      }

      setSuccess('Đổi mật khẩu thành công.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        router.push('/tai-khoan-gia-su');
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đổi mật khẩu thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-card">
        <h1>Đổi mật khẩu</h1>
        <p>Vui lòng đặt mật khẩu mới để tiếp tục.</p>

        {error ? <div className="change-password-alert error">{error}</div> : null}
        {success ? <div className="change-password-alert success">{success}</div> : null}

        <form onSubmit={handleSubmit} className="change-password-form">
          <label>
            Mật khẩu hiện tại
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>

          <label>
            Mật khẩu mới
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
            />
          </label>

          <label>
            Xac nhan mat khau moi
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}
