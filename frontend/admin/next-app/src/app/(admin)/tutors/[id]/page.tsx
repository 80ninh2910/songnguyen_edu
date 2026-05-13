"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { TutorForm } from "@/components/admin/TutorForm";
import {
  approveAdminTutor,
  getAdminTutorById,
  rejectAdminTutor,
  updateAdminTutor,
  type AdminTutorDetail,
  type AdminTutorStatus,
} from "@/lib/adminApi";

const STATUS_META: Record<
  AdminTutorStatus,
  {
    label: string;
    tone: "approved" | "pending" | "rejected";
    dotColor: string;
  }
> = {
  APPROVED: { label: "ĐÃ DUYỆT", tone: "approved", dotColor: "#0058be" },
  PENDING: { label: "CHỜ DUYỆT", tone: "pending", dotColor: "#924700" },
  REJECTED: { label: "TỪ CHỐI", tone: "rejected", dotColor: "#ba1a1a" },
};

function formatDate(value: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
}

export default function TutorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const tutorId = typeof params.id === "string" ? params.id : params.id?.[0];
  const isEdit = searchParams.get("mode") === "edit";

  const [detail, setDetail] = useState<AdminTutorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const formValues = useMemo(() => {
    if (!detail) return undefined;
    return {
      fullName: detail.fullName,
      email: detail.email,
      phone: detail.phone ?? "",
      subjects: detail.subjects.join(", "),
      districts: detail.districts.join(", "),
    };
  }, [detail]);

  useEffect(() => {
    if (!tutorId) {
      setError("Không tìm thấy gia sư.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAdminTutorById(tutorId);
        if (isMounted) {
          setDetail(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Không thể tải hồ sơ gia sư.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadDetail();

    return () => {
      isMounted = false;
    };
  }, [tutorId]);

  const handleApprove = async () => {
    if (!tutorId) return;
    setProcessing(true);
    setActionError(null);

    try {
      await approveAdminTutor(tutorId);
      const refreshed = await getAdminTutorById(tutorId);
      setDetail(refreshed);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Không thể duyệt gia sư.",
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!tutorId) return;
    if (rejectReason.trim().length < 3) {
      setActionError("Vui lòng nhập lý do từ chối.");
      return;
    }

    setProcessing(true);
    setActionError(null);

    try {
      await rejectAdminTutor(tutorId, rejectReason.trim());
      const refreshed = await getAdminTutorById(tutorId);
      setDetail(refreshed);
      setRejectOpen(false);
      setRejectReason("");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Không thể từ chối gia sư.",
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdate = async (payload: {
    fullName: string;
    email: string;
    phone?: string;
    subjects: string[];
    districts: string[];
  }) => {
    if (!tutorId) return;
    setProcessing(true);
    setActionError(null);

    try {
      const updated = await updateAdminTutor(tutorId, payload);
      setDetail(updated);
      router.replace(`/tutors/${tutorId}`);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Không thể cập nhật hồ sơ.",
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <p>Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="admin-page">
        <p>{error ?? "Không tìm thấy gia sư."}</p>
      </div>
    );
  }

  const statusMeta = STATUS_META[detail.status];

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.8rem" }}>
            Gia sư • Hồ sơ
          </p>
          <h1 className="admin-page-title">{detail.fullName}</h1>
          <p className="admin-page-subtitle">
            Theo dõi và xử lý hồ sơ gia sư chi tiết.
          </p>
        </div>

        <div className="admin-page-actions">
          <AdminStatusBadge
            label={statusMeta.label}
            tone={statusMeta.tone}
            dotColor={statusMeta.dotColor}
          />
          <button
            className="admin-btn tonal"
            onClick={() => router.push("/tutors")}
            type="button"
          >
            <AdminIcon name="chevron_left" />
            Quay lại
          </button>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: 0, color: "#ba1a1a" }}>{error}</p>
        </div>
      ) : null}

      {actionError ? (
        <div className="admin-panel" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: 0, color: "#ba1a1a" }}>{actionError}</p>
        </div>
      ) : null}

      <section className="settings-layout">
        <article className="settings-form-card">
          <div className="settings-card-head">
            <h2 className="settings-card-title">
              {isEdit ? "Chỉnh sửa hồ sơ" : "Thông tin gia sư"}
            </h2>
            {!isEdit ? (
              <button
                className="admin-btn tonal"
                onClick={() => router.replace(`/tutors/${detail.id}?mode=edit`)}
                type="button"
              >
                <AdminIcon name="edit" />
                Chỉnh sửa
              </button>
            ) : null}
          </div>

          <div className="settings-card-body">
            {isEdit ? (
              <TutorForm
                initialValues={formValues}
                onCancel={() => router.replace(`/tutors/${detail.id}`)}
                onSubmit={handleUpdate}
                submitLabel={processing ? "Đang lưu..." : "Lưu cập nhật"}
                disabled={processing}
              />
            ) : (
              <div style={{ display: "grid", gap: "1.2rem" }}>
                <section>
                  <h3 className="settings-group-title">Thông tin liên hệ</h3>
                  <div
                    className="settings-input-grid"
                    style={{ marginTop: "0.6rem" }}
                  >
                    <div className="settings-field">
                      <label>Họ tên</label>
                      <p style={{ margin: 0, fontWeight: 700 }}>
                        {detail.fullName}
                      </p>
                    </div>
                    <div className="settings-field">
                      <label>Email</label>
                      <p style={{ margin: 0, fontWeight: 700 }}>
                        {detail.email}
                      </p>
                    </div>
                    <div className="settings-field">
                      <label>Số điện thoại</label>
                      <p style={{ margin: 0, fontWeight: 700 }}>
                        {detail.phone ?? "-"}
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="settings-group-title">Môn dạy</h3>
                  <p style={{ margin: "0.6rem 0 0", fontWeight: 700 }}>
                    {detail.subjects.join(", ")}
                  </p>
                </section>

                <section>
                  <h3 className="settings-group-title">Khu vực</h3>
                  <p style={{ margin: "0.6rem 0 0", fontWeight: 700 }}>
                    {detail.districts.join(", ")}
                  </p>
                </section>

                <section>
                  <h3 className="settings-group-title">Thống kê</h3>
                  <div
                    className="settings-input-grid"
                    style={{ marginTop: "0.6rem" }}
                  >
                    <div className="settings-field">
                      <label>Ngày tạo</label>
                      <p style={{ margin: 0, fontWeight: 700 }}>
                        {formatDate(detail.createdAt)}
                      </p>
                    </div>
                    <div className="settings-field">
                      <label>Ngày duyệt</label>
                      <p style={{ margin: 0, fontWeight: 700 }}>
                        {formatDate(detail.approvedAt)}
                      </p>
                    </div>
                    <div className="settings-field">
                      <label>Ứng tuyển</label>
                      <p style={{ margin: 0, fontWeight: 700 }}>
                        {detail._count.applications}
                      </p>
                    </div>
                    <div className="settings-field">
                      <label>Đã phân lớp</label>
                      <p style={{ margin: 0, fontWeight: 700 }}>
                        {detail._count.assignments}
                      </p>
                    </div>
                    <div className="settings-field">
                      <label>Thanh toán</label>
                      <p style={{ margin: 0, fontWeight: 700 }}>
                        {detail._count.payments}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </article>

        <div style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <article className="admin-panel">
            <h3 className="admin-panel-title" style={{ margin: 0 }}>
              Xử lý hồ sơ
            </h3>

            {detail.status === "PENDING" ? (
              <div
                className="payments-action-stack"
                style={{ marginTop: "1rem" }}
              >
                <button
                  className="admin-btn success"
                  disabled={processing}
                  onClick={handleApprove}
                  style={{ width: "100%" }}
                  type="button"
                >
                  <AdminIcon name="check_circle" />
                  Duyệt gia sư
                </button>
                <button
                  className="admin-btn danger"
                  disabled={processing}
                  onClick={() => setRejectOpen(true)}
                  style={{ width: "100%" }}
                  type="button"
                >
                  <AdminIcon name="cancel" />
                  Từ chối
                </button>
              </div>
            ) : (
              <p style={{ margin: "0.9rem 0 0", color: "#64748b" }}>
                Hồ sơ đã được xử lý.
              </p>
            )}
          </article>

          <article className="admin-panel">
            <h3 className="admin-panel-title" style={{ margin: 0 }}>
              Trạng thái & ghi chú
            </h3>
            <div
              style={{ marginTop: "0.8rem", display: "grid", gap: "0.6rem" }}
            >
              <div>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.78rem" }}>
                  Người duyệt
                </p>
                <p style={{ margin: "0.2rem 0 0", fontWeight: 700 }}>
                  {detail.approvedBy?.fullName ?? "-"}
                </p>
              </div>
              <div>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.78rem" }}>
                  Lý do từ chối
                </p>
                <p style={{ margin: "0.2rem 0 0", fontWeight: 700 }}>
                  {detail.rejectReason ?? "-"}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {rejectOpen ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            display: "grid",
            placeItems: "center",
            padding: "1rem",
            zIndex: 50,
          }}
          onClick={() => setRejectOpen(false)}
        >
          <div
            className="admin-panel"
            onClick={(event) => event.stopPropagation()}
            style={{ width: "min(28rem, 100%)" }}
          >
            <h3 className="admin-panel-title" style={{ margin: 0 }}>
              Lý do từ chối
            </h3>
            <textarea
              className="settings-input"
              onChange={(event) => setRejectReason(event.target.value)}
              placeholder="Nhập lý do từ chối hồ sơ..."
              rows={4}
              style={{ marginTop: "0.8rem", width: "100%" }}
              value={rejectReason}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.6rem",
                marginTop: "0.9rem",
              }}
            >
              <button
                className="admin-btn tonal"
                onClick={() => setRejectOpen(false)}
                type="button"
              >
                Hủy
              </button>
              <button
                className="admin-btn danger"
                disabled={processing}
                onClick={handleReject}
                type="button"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
