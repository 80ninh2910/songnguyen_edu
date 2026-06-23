"use client";

import { useCallback, useEffect, useState } from "react";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import {
  type AdminAccount,
  createAdminAccount,
  deleteAdminAccount,
  fetchAdminAccounts,
  updateAdminAccount,
} from "@/lib/adminApi";
import { useAdminUser } from "@/lib/useAdminUser";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

type FormState = {
  email: string;
  fullName: string;
  role: "ADMIN" | "SUPERADMIN";
  password: string;
};

const EMPTY_FORM: FormState = { email: "", fullName: "", role: "ADMIN", password: "" };

export default function AdminAccountsPage() {
  const { user: currentUser, isSuperAdmin } = useAdminUser();

  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | "ADMIN" | "SUPERADMIN">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // modal state
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<AdminAccount | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // delete confirm
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(async (pg: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAdminAccounts({
        page: pg, limit: 15,
        search: search || undefined,
        role: roleFilter || undefined,
      });
      setAccounts(result.data);
      setMeta({ page: result.meta.page, totalPages: result.meta.totalPages, total: result.meta.total });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => { setPage(1); }, [search, roleFilter]);
  useEffect(() => { void load(page); }, [page, load]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalMode("create");
  };

  const openEdit = (acc: AdminAccount) => {
    setEditTarget(acc);
    setForm({ email: acc.email, fullName: acc.fullName, role: acc.role, password: "" });
    setFormError(null);
    setModalMode("edit");
  };

  const closeModal = () => { setModalMode(null); setEditTarget(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);
    try {
      if (modalMode === "create") {
        if (!form.password) { setFormError("Mật khẩu là bắt buộc khi tạo tài khoản mới."); setFormLoading(false); return; }
        await createAdminAccount(form);
      } else if (modalMode === "edit" && editTarget) {
        const body: Partial<FormState> = {};
        if (form.fullName !== editTarget.fullName) body.fullName = form.fullName;
        if (form.email !== editTarget.email) body.email = form.email;
        if (form.role !== editTarget.role) body.role = form.role;
        if (form.password) body.password = form.password;
        await updateAdminAccount(editTarget.id, body);
      }
      closeModal();
      void load(page);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteAdminAccount(deleteTarget.id);
      setDeleteTarget(null);
      void load(page);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Không thể xoá tài khoản.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="admin-page">
        <div className="accounts-forbidden">
          <AdminIcon name="lock" style={{ width: "2.5rem", height: "2.5rem", color: "#7c3aed" }} />
          <h2>Không có quyền truy cập</h2>
          <p>Chức năng này chỉ dành cho <strong>Quản trị tối cao (SUPERADMIN)</strong>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* header */}
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tài khoản Admin</h1>
          <p className="admin-page-subtitle">
            {meta.total} tài khoản • Chỉ SUPERADMIN mới có quyền quản lý
          </p>
        </div>
        <div className="admin-page-actions">
          <span className="admin-role-badge superadmin">SUPERADMIN ONLY</span>
          <button className="admin-btn primary" type="button" onClick={openCreate}>
            <AdminIcon name="add" />
            Thêm tài khoản
          </button>
        </div>
      </header>

      {/* filters */}
      <section className="admin-panel">
        <div className="audit-filter-row">
          <div style={{ position: "relative", flex: 1 }}>
            <AdminIcon name="search" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", width: "1rem", color: "#94a3b8" }} />
            <input
              className="settings-input"
              placeholder="Tìm theo tên hoặc email..."
              style={{ paddingLeft: "2.25rem", width: "100%" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <label>
            <span className="tutors-select-label">Role</span>
            <select className="tutors-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as "" | "ADMIN" | "SUPERADMIN")}>
              <option value="">Tất cả</option>
              <option value="SUPERADMIN">SUPERADMIN</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
        </div>
      </section>

      {/* table */}
      <div className="admin-table-wrap">
        {error && (
          <div className="audit-error-banner">
            <AdminIcon name="warning" /><span>{error}</span>
            <button type="button" onClick={() => void load(page)}>Thử lại</button>
          </div>
        )}
        {loading ? (
          <div className="audit-loading"><div className="audit-spinner" /><span>Đang tải...</span></div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Role</th>
                <th>Ngày tạo</th>
                <th>Cập nhật</th>
                <th style={{ textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>Không có tài khoản nào.</td></tr>
              ) : accounts.map((acc) => {
                const isSelf = acc.id === currentUser?.id;
                return (
                  <tr key={acc.id}>
                    <td>
                      <div className="table-user">
                        <div className="table-user-avatar" style={{ background: acc.role === "SUPERADMIN" ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff" }}>
                          {acc.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="table-user-name">
                            {acc.fullName}
                            {isSelf && <span className="accounts-self-tag">Bạn</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>{acc.email}</td>
                    <td>
                      <span className={`admin-role-badge ${acc.role === "SUPERADMIN" ? "superadmin" : "admin"}`}>
                        {acc.role === "SUPERADMIN" ? "SUPER" : "ADMIN"}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "#64748b" }}>{formatDate(acc.createdAt)}</td>
                    <td style={{ fontSize: "0.8rem", color: "#64748b" }}>{formatDate(acc.updatedAt)}</td>
                    <td>
                      <div className="table-action-group">
                        <button className="table-action-btn" title="Chỉnh sửa" type="button" onClick={() => openEdit(acc)}>
                          <AdminIcon name="edit" />
                        </button>
                        <button
                          className="table-action-btn"
                          title={isSelf ? "Không thể xoá tài khoản của bạn" : "Xoá"}
                          type="button"
                          disabled={isSelf}
                          style={{ color: isSelf ? "#cbd5e1" : "#ef4444" }}
                          onClick={() => !isSelf && setDeleteTarget(acc)}
                        >
                          <AdminIcon name="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {meta.totalPages > 1 && (
          <div className="audit-pagination">
            <button className="admin-btn ghost" type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <AdminIcon name="chevron_left" />
            </button>
            <span className="audit-page-info">Trang {meta.page} / {meta.totalPages}</span>
            <button className="admin-btn ghost" type="button" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>
              <AdminIcon name="chevron_right" />
            </button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalMode && (
        <div className="accounts-modal-overlay" onClick={closeModal}>
          <div className="accounts-modal" onClick={(e) => e.stopPropagation()}>
            <div className="accounts-modal-head">
              <h2 className="admin-panel-title">
                {modalMode === "create" ? "Thêm tài khoản Admin" : "Chỉnh sửa tài khoản"}
              </h2>
              <button className="admin-icon-btn" type="button" onClick={closeModal}>
                <AdminIcon name="close" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="accounts-modal-body">
              <div className="settings-field">
                <label htmlFor="acc-fullname">Họ và tên *</label>
                <input id="acc-fullname" className="settings-input" required value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
              </div>

              <div className="settings-field">
                <label htmlFor="acc-email">Email *</label>
                <input id="acc-email" className="settings-input" type="email" required value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </div>

              <div className="settings-field">
                <label htmlFor="acc-role">Quyền hạn *</label>
                <select id="acc-role" className="tutors-select" style={{ width: "100%" }} value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "ADMIN" | "SUPERADMIN" }))}>
                  <option value="ADMIN">ADMIN — Quản trị viên</option>
                  <option value="SUPERADMIN">SUPERADMIN — Quản trị tối cao</option>
                </select>
              </div>

              <div className="settings-field">
                <label htmlFor="acc-password">
                  {modalMode === "create" ? "Mật khẩu *" : "Mật khẩu mới (để trống nếu không đổi)"}
                </label>
                <input id="acc-password" className="settings-input" type="password"
                  required={modalMode === "create"} value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
              </div>

              {formError && (
                <div className="audit-error-banner" style={{ marginTop: 0 }}>
                  <AdminIcon name="warning" /><span>{formError}</span>
                </div>
              )}

              <div className="accounts-modal-actions">
                <button className="admin-btn tonal" type="button" onClick={closeModal} disabled={formLoading}>
                  Hủy
                </button>
                <button className="admin-btn primary" type="submit" disabled={formLoading}>
                  {formLoading ? "Đang lưu..." : modalMode === "create" ? "Tạo tài khoản" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="accounts-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="accounts-modal" style={{ maxWidth: "420px" }} onClick={(e) => e.stopPropagation()}>
            <div className="accounts-modal-head">
              <h2 className="admin-panel-title">Xác nhận xoá</h2>
            </div>
            <div className="accounts-modal-body">
              <p style={{ margin: "0 0 0.5rem", color: "#64748b" }}>
                Bạn sắp xoá vĩnh viễn tài khoản:
              </p>
              <p style={{ margin: "0 0 1rem", fontWeight: 700, fontSize: "1rem" }}>
                {deleteTarget.fullName} ({deleteTarget.email})
              </p>
              <div className="audit-error-banner" style={{ marginBottom: "1rem" }}>
                <AdminIcon name="warning" />
                <span>Hành động này <strong>không thể hoàn tác</strong>.</span>
              </div>
              <div className="accounts-modal-actions">
                <button className="admin-btn tonal" type="button" onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>
                  Hủy
                </button>
                <button className="admin-btn danger" type="button" onClick={handleDelete} disabled={deleteLoading}
                  style={{ background: "#ef4444", color: "#fff", border: "none" }}>
                  {deleteLoading ? "Đang xoá..." : "Xoá tài khoản"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .accounts-forbidden {
          display: flex; flex-direction: column; align-items: center;
          gap: 1rem; padding: 4rem 2rem; text-align: center;
          background: #fff; border-radius: 1rem;
          box-shadow: var(--ambient-shadow);
        }
        .accounts-forbidden h2 { margin: 0; font-size: 1.5rem; }
        .accounts-forbidden p { margin: 0; color: #64748b; }
        .accounts-self-tag {
          display: inline-flex; margin-left: 0.5rem;
          padding: 1px 7px; border-radius: 999px;
          font-size: 0.62rem; font-weight: 800;
          background: #d1fae5; color: #065f46;
        }
        .accounts-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.5); backdrop-filter: blur(4px);
          z-index: 200; display: flex; align-items: center; justify-content: center;
          padding: 1rem;
        }
        .accounts-modal {
          background: #fff; border-radius: 1.25rem;
          width: 100%; max-width: 520px;
          box-shadow: 0 24px 60px rgba(15,23,42,0.2);
          animation: modal-in 0.18s ease;
        }
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: none; }
        }
        .accounts-modal-head {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }
        .accounts-modal-body {
          padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;
        }
        .accounts-modal-actions {
          display: flex; gap: 0.75rem; justify-content: flex-end;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
