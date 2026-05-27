'use client';
import "./login.css";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      setIsLoading(false);
      return;
    }

    try {
      const session = await apiRequest<{
        accessToken: string;
        refreshToken: string;
        user: {
          id: string;
          role: string;
          email: string;
          fullName: string;
          mustChangePassword?: boolean;
        };
      }>("/auth/tutor/login", {
        method: "POST",
        body: { email, password },
      });

      localStorage.setItem('sne_access_token', session.accessToken);
      localStorage.setItem('sne_refresh_token', session.refreshToken);
      localStorage.setItem('sne_user', JSON.stringify(session.user));

      if (session.user.mustChangePassword) {
        router.push('/tai-khoan-gia-su/doi-mat-khau');
      } else {
        router.push('/tai-khoan-gia-su');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dang nhap khong thanh cong.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <h1>Đăng nhập dành cho Gia sư</h1>
            <p>Chào mừng bạn quay trở lại với Song Nguyen Edu</p>
          </div>

          {/* Error */}
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email hoặc Số điện thoại</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                />
                <i className="fas fa-user input-icon"></i>
              </div>
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <i className="fas fa-lock input-icon"></i>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" name="remember" />
                Ghi nhớ đăng nhập
              </label>
              <Link href="#" className="forgot-password">Quên mật khẩu?</Link>
            </div>

            <button type="submit" className={`btn-login ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Đang xử lý...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>

            <div className="signup-link">
              Chưa có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = '/?scrollTo=tutor-register-section'; }}>Đăng ký làm gia sư</a>
            </div>
          </form>
        </div>
      </div>
  );
}
