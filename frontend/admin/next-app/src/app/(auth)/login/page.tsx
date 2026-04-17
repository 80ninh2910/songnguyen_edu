import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="login-shell">
      <section className="login-card">
        <h1>Admin Login</h1>
        <p>Phase 0 shell for admin auth flow.</p>
        <Link href="/dashboard">
          <button type="button">Go to dashboard shell</button>
        </Link>
      </section>
    </main>
  );
}
