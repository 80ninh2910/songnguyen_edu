"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { loginAdmin } from "@/lib/adminApi";
import { setAdminUser, setTokens } from "@/lib/adminAuth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const session = await loginAdmin(email.trim(), password);
      setTokens(session.accessToken, session.refreshToken);
      setAdminUser(session.user);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Đăng nhập thất bại. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-card">
        <h1>Đăng nhập quản trị</h1>
        <p>Giao diện mẫu cho luồng đăng nhập quản trị viên.</p>
        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}
        >
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span>Email</span>
            <input
              autoComplete="username"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@email.com"
              required
              type="email"
              value={email}
            />
          </label>

          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span>Mật khẩu</span>
            <input
              autoComplete="current-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              type="password"
              value={password}
            />
          </label>

          {error ? (
            <p style={{ color: "#ba1a1a", fontSize: "0.85rem" }}>{error}</p>
          ) : null}

          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Đang đăng nhập..." : "Vào trang quản trị"}
          </button>
        </form>
      </section>
    </main>
  );
}
