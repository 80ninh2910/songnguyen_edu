"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { TutorForm } from "@/components/admin/TutorForm";
import { createAdminTutor } from "@/lib/adminApi";

export default function TutorCreatePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (payload: {
    fullName: string;
    email: string;
    phone?: string;
    subjects: string[];
    districts: string[];
  }) => {
    setSaving(true);
    setError(null);

    try {
      const result = await createAdminTutor(payload);
      router.push(`/tutors/${result.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể tạo gia sư mới.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.8rem" }}>
            Gia sư • Tạo mới
          </p>
          <h1 className="admin-page-title">Thêm gia sư mới</h1>
          <p className="admin-page-subtitle">
            Tạo tài khoản gia sư và gửi mật khẩu tạm qua email.
          </p>
        </div>

        <div className="admin-page-actions">
          <button
            className="admin-btn tonal"
            onClick={() => router.push("/tutors")}
            type="button"
          >
            <AdminIcon name="chevron_left" />
            Quay lại danh sách
          </button>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: 0, color: "#ba1a1a" }}>{error}</p>
        </div>
      ) : null}

      <section className="settings-form-card">
        <div className="settings-card-head">
          <h2 className="settings-card-title">Thông tin gia sư</h2>
        </div>
        <div className="settings-card-body">
          <TutorForm
            helperText="Gia sư sẽ được tạo ở trạng thái đã duyệt và gửi mật khẩu tạm qua email."
            onCancel={() => router.push("/tutors")}
            onSubmit={handleSubmit}
            submitLabel={saving ? "Đang lưu..." : "Tạo gia sư"}
            disabled={saving}
          />
        </div>
      </section>
    </div>
  );
}
