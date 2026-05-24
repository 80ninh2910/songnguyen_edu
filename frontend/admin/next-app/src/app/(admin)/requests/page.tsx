"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import {
  convertAdminClassRequest,
  getAdminClassRequestById,
  listAdminClassRequests,
  rejectAdminClassRequest,
  listAdminClasses,
  listAdminClassApplicants,
  assignAdminClass,
  rejectAdminClassApplicant,
  type AdminClassRequestDetail,
  type AdminClassRequestStatus,
  type AdminClassRequestSummary,
  type AdminClassSummary,
  type AdminClassApplicant,
} from "@/lib/adminApi";

const PAGE_SIZE = 10;

const STATUS_META: Record<
  AdminClassRequestStatus,
  { label: string; tone: "pending" | "approved" | "rejected"; dotColor: string }
> = {
  PENDING: { label: "CHỜ XỬ LÝ", tone: "pending", dotColor: "#924700" },
  CONVERTED: { label: "ĐÃ TẠO LỚP", tone: "approved", dotColor: "#059669" },
  REJECTED: { label: "TỪ CHỐI", tone: "rejected", dotColor: "#ba1a1a" },
};

type ToastTone = "success" | "error";

type ToastState = {
  tone: ToastTone;
  message: string;
};

type ConvertForm = {
  title: string;
  feePerHour: string;
  scheduleDays: string[];
};

const emptyConvertForm: ConvertForm = {
  title: "",
  feePerHour: "",
  scheduleDays: [],
};

function buildConvertForm(
  detail?: AdminClassRequestDetail | null,
): ConvertForm {
  if (!detail) {
    return { ...emptyConvertForm };
  }

  return {
    title: `${detail.subject} ${detail.grade}`.trim(),
    feePerHour: detail.budgetPerHour ? String(detail.budgetPerHour) : "",
    scheduleDays: [],
  };
}

const WEEK_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function formatVnd(value: string): string {
  if (!value) return "";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return value;
  return new Intl.NumberFormat("vi-VN").format(amount);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("");
}

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
}

function formatCurrency(value?: number | null): string {
  if (!value) return "-";
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ/buổi`;
}

function formatRequestCode(id: string): string {
  const code = id.split("-")[0] ?? id.slice(0, 6);
  return `RQ-${code.toUpperCase()}`;
}

function formatClassCode(id: string): string {
  const code = id.split("-")[0] ?? id.slice(0, 6);
  return `LH-${code.toUpperCase()}`;
}

// -------------------------------------------------------------
// PARENT REQUESTS TAB
// -------------------------------------------------------------
function ParentRequestsTab({
  showToast,
}: {
  showToast: (tone: ToastTone, msg: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") ?? "PENDING";
  const page = Number(searchParams.get("page") ?? "1");

  const [records, setRecords] = useState<AdminClassRequestSummary[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    pending: 0,
    converted: 0,
    rejected: 0,
  });

  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [detail, setDetail] = useState<AdminClassRequestDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [convertForm, setConvertForm] = useState<ConvertForm>(emptyConvertForm);
  const [rejectReason, setRejectReason] = useState("");
  const [convertLoading, setConvertLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const statusFilter = useMemo(() => {
    return status === "all" ? undefined : (status as AdminClassRequestStatus);
  }, [status]);

  const updateQuery = (next: { status?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextStatus = next.status ?? status;
    const nextPage = next.page ?? page;

    if (nextStatus === "PENDING") params.delete("status");
    else if (nextStatus === "all") params.set("status", "all");
    else params.set("status", nextStatus);

    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listAdminClassRequests({
        page: Number.isFinite(page) && page > 0 ? page : 1,
        limit: PAGE_SIZE,
        status: statusFilter,
      });
      setRecords(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tải danh sách yêu cầu mở lớp.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  const loadStats = useCallback(async () => {
    try {
      const [pending, converted, rejected] = await Promise.all([
        listAdminClassRequests({ page: 1, limit: 1, status: "PENDING" }),
        listAdminClassRequests({ page: 1, limit: 1, status: "CONVERTED" }),
        listAdminClassRequests({ page: 1, limit: 1, status: "REJECTED" }),
      ]);

      setStats({
        pending: pending.meta.total,
        converted: converted.meta.total,
        rejected: rejected.meta.total,
      });
    } catch {
      setStats({ pending: 0, converted: 0, rejected: 0 });
    }
  }, []);

  const loadDetail = useCallback(async (requestId: string) => {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const response = await getAdminClassRequestById(requestId);
      setDetail(response);
    } catch (err) {
      setDetailError(
        err instanceof Error ? err.message : "Không thể tải chi tiết yêu cầu.",
      );
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (!records.length) {
      setSelectedRequestId("");
      return;
    }
    if (
      !selectedRequestId ||
      !records.some((item) => item.id === selectedRequestId)
    ) {
      setSelectedRequestId(records[0].id);
    }
  }, [records, selectedRequestId]);

  useEffect(() => {
    if (!selectedRequestId) {
      setDetail(null);
      return;
    }
    void loadDetail(selectedRequestId);
  }, [loadDetail, selectedRequestId]);

  const pagination = useMemo(() => {
    const totalPages = Math.max(meta.totalPages, 1);
    const currentPage = Math.min(Math.max(meta.page, 1), totalPages);
    const pages: Array<number | "ellipsis"> = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
      return { pages, currentPage, totalPages };
    }

    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i += 1) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);

    return { pages, currentPage, totalPages };
  }, [meta.page, meta.totalPages]);

  const rangeStart = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const rangeEnd = Math.min(meta.page * meta.limit, meta.total);

  const handleSubmitConvert = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!detail || convertLoading) return;
    setConvertLoading(true);

    try {
      const payload: {
        title?: string;
        feePerHour?: number;
        schedule?: string;
      } = {};
      const trimmedTitle = convertForm.title.trim();
      const feeValue = Number(convertForm.feePerHour);

      if (trimmedTitle) payload.title = trimmedTitle;
      if (Number.isFinite(feeValue) && feeValue > 0) {
        payload.feePerHour = Math.round(feeValue);
      }
      if (convertForm.scheduleDays.length > 0) {
        payload.schedule = WEEK_DAYS.filter((day) => convertForm.scheduleDays.includes(day)).join(", ");
      }

      await convertAdminClassRequest(detail.id, payload);
      showToast("success", "Đã tạo lớp từ yêu cầu này.");
      setIsConvertOpen(false);
      await Promise.all([loadRequests(), loadStats(), loadDetail(detail.id)]);
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Không thể tạo lớp từ yêu cầu.",
      );
    } finally {
      setConvertLoading(false);
    }
  };

  const handleSubmitReject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!detail || rejectLoading) return;

    const reason = rejectReason.trim();
    if (!reason) {
      showToast("error", "Vui lòng nhập lý do từ chối.");
      return;
    }

    setRejectLoading(true);
    try {
      await rejectAdminClassRequest(detail.id, reason);
      showToast("success", "Đã từ chối yêu cầu mở lớp.");
      setIsRejectOpen(false);
      setRejectReason("");
      await Promise.all([loadRequests(), loadStats(), loadDetail(detail.id)]);
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Không thể từ chối yêu cầu.",
      );
    } finally {
      setRejectLoading(false);
    }
  };

  const selectedMeta = detail ? STATUS_META[detail.status] : null;
  const handleCloseDetailModal = () => {
    setIsDetailOpen(false);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div>
          <p className="admin-page-subtitle" style={{ margin: 0 }}>
            Duyệt và tạo lớp từ yêu cầu của phụ huynh.
          </p>
        </div>
        <button
          className="admin-btn tonal"
          onClick={() => void loadRequests()}
          type="button"
        >
          <AdminIcon name="autorenew" />
          Làm mới
        </button>
      </div>

      {error && (
        <div className="admin-panel" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: 0, color: "#ba1a1a" }}>{error}</p>
        </div>
      )}

      <section className="pairing-summary-strip">
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Yêu cầu chờ xử lý</p>
          <p className="pairing-summary-value">{stats.pending}</p>
        </article>
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Đã tạo lớp</p>
          <p className="pairing-summary-value">{stats.converted}</p>
        </article>
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Đã từ chối</p>
          <p className="pairing-summary-value">{stats.rejected}</p>
        </article>
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Tổng yêu cầu</p>
          <p className="pairing-summary-value">{meta.total}</p>
        </article>
      </section>

      <section className="admin-panel">
        <div className="audit-filter-row">
          <label>
            <span className="tutors-select-label">Trạng thái</span>
            <select
              className="tutors-select"
              onChange={(e) => updateQuery({ status: e.target.value, page: 1 })}
              value={status}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="CONVERTED">Đã tạo lớp</option>
              <option value="REJECTED">Đã từ chối</option>
            </select>
          </label>
        </div>
      </section>

      <section className="audit-grid audit-grid-full">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Phụ huynh</th>
                <th>Môn - Lớp</th>
                <th>Khu vực</th>
                <th>Học phí/buổi</th>
                <th>Ngày gửi</th>
                <th>Trạng thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    Chưa có yêu cầu mở lớp.
                  </td>
                </tr>
              ) : (
                records.map((record) => {
                  const metaInfo = STATUS_META[record.status];
                  const isSelected = record.id === selectedRequestId;
                  return (
                    <tr
                      key={record.id}
                      onClick={() => {
                        setSelectedRequestId(record.id);
                        setIsDetailOpen(true);
                      }}
                      style={
                        isSelected
                          ? { background: "rgba(219, 234, 254, 0.35)" }
                          : undefined
                      }
                    >
                      <td style={{ fontWeight: 700 }}>
                        {formatRequestCode(record.id)}
                      </td>
                      <td>
                        <div className="table-user">
                          <div className="table-user-avatar">
                            {getInitials(record.parentName)}
                          </div>
                          <div>
                            <p className="table-user-name">
                              {record.parentName}
                            </p>
                            <p className="table-user-email">
                              {record.parentPhone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {record.subject} - {record.grade}
                      </td>
                      <td>{record.district}</td>
                      <td>{formatCurrency(record.budgetPerHour)}</td>
                      <td>{formatDate(record.createdAt)}</td>
                      <td>
                        <AdminStatusBadge
                          label={metaInfo.label}
                          tone={metaInfo.tone}
                          dotColor={metaInfo.dotColor}
                        />
                      </td>
                      <td>
                        <div className="table-action-group">
                          <button
                            className="table-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRequestId(record.id);
                              setIsDetailOpen(true);
                            }}
                            type="button"
                          >
                            <AdminIcon name="visibility" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </section>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#64748b",
          fontSize: "0.8rem",
        }}
      >
        <span>
          Hiển thị {rangeStart} - {rangeEnd} trong tổng số {meta.total} yêu cầu
        </span>
        <div
          style={{
            display: "inline-flex",
            gap: "0.35rem",
            alignItems: "center",
          }}
        >
          <button
            className="admin-btn tonal"
            disabled={pagination.currentPage <= 1}
            onClick={() =>
              updateQuery({ page: Math.max(1, pagination.currentPage - 1) })
            }
            type="button"
          >
            <AdminIcon name="chevron_left" style={{ width: "1rem" }} />
          </button>
          {pagination.pages.map((item, index) =>
            item === "ellipsis" ? (
              <button
                className="admin-btn tonal"
                key={`ellipsis-${index}`}
                type="button"
              >
                ...
              </button>
            ) : (
              <button
                className={
                  item === pagination.currentPage
                    ? "admin-btn primary"
                    : "admin-btn tonal"
                }
                key={item}
                onClick={() => updateQuery({ page: item })}
                type="button"
              >
                {item}
              </button>
            ),
          )}
          <button
            className="admin-btn tonal"
            disabled={pagination.currentPage >= pagination.totalPages}
            onClick={() =>
              updateQuery({
                page: Math.min(
                  pagination.totalPages,
                  pagination.currentPage + 1,
                ),
              })
            }
            type="button"
          >
            <AdminIcon name="chevron_right" style={{ width: "1rem" }} />
          </button>
        </div>
      </div>

      {/* Convert Dialog */}
      {isConvertOpen && detail && (
        <div className="admin-dialog-backdrop" role="dialog" aria-modal>
          <div className="admin-dialog">
            <div className="admin-dialog-header">
              <div>
                <p className="admin-dialog-eyebrow">Tạo lớp từ yêu cầu</p>
                <h3 className="admin-dialog-title">
                  {detail.subject} {detail.grade}
                </h3>
              </div>
              <button
                className="admin-dialog-close"
                onClick={() => setIsConvertOpen(false)}
                type="button"
              >
                <AdminIcon name="cancel" />
              </button>
            </div>
            <form className="admin-dialog-body" onSubmit={handleSubmitConvert}>
              <div className="admin-dialog-grid">
                <label className="admin-dialog-field">
                  Tiêu đề lớp
                  <input
                    type="text"
                    value={convertForm.title}
                    onChange={(e) =>
                      setConvertForm({ ...convertForm, title: e.target.value })
                    }
                  />
                </label>
                <label className="admin-dialog-field">
                  Học phí/buổi
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatVnd(convertForm.feePerHour)}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setConvertForm({ ...convertForm, feePerHour: digits });
                    }}
                  />
                </label>
                <label className="admin-dialog-field admin-dialog-field-full">
                  Lịch học (tuỳ chọn)
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {WEEK_DAYS.map((day) => {
                      const selectedDays = convertForm.scheduleDays ?? [];
                      const checked = selectedDays.includes(day);
                      return (
                        <label
                          key={day}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            fontWeight: 600,
                            color: "#0f172a",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setConvertForm({
                                  ...convertForm,
                                  scheduleDays: [...selectedDays, day],
                                });
                              } else {
                                setConvertForm({
                                  ...convertForm,
                                  scheduleDays: selectedDays.filter(
                                    (item) => item !== day,
                                  ),
                                });
                              }
                            }}
                          />
                          {day}
                        </label>
                      );
                    })}
                  </div>
                </label>
              </div>
              <div className="admin-dialog-actions">
                <button
                  className="admin-btn ghost"
                  onClick={() => setIsConvertOpen(false)}
                  type="button"
                >
                  Hủy
                </button>
                <button className="admin-btn primary" type="submit">
                  {convertLoading ? "Đang tạo..." : "Xác nhận tạo lớp"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {isRejectOpen && detail && (
        <div className="admin-dialog-backdrop" role="dialog" aria-modal>
          <div className="admin-dialog">
            <div className="admin-dialog-header">
              <div>
                <p className="admin-dialog-eyebrow">Từ chối yêu cầu</p>
                <h3 className="admin-dialog-title">{detail.parentName}</h3>
              </div>
              <button
                className="admin-dialog-close"
                onClick={() => setIsRejectOpen(false)}
                type="button"
              >
                <AdminIcon name="cancel" />
              </button>
            </div>
            <form className="admin-dialog-body" onSubmit={handleSubmitReject}>
              <label className="admin-dialog-field admin-dialog-field-full">
                Lý do từ chối (bắt buộc)
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </label>
              <div className="admin-dialog-actions">
                <button
                  className="admin-btn ghost"
                  onClick={() => setIsRejectOpen(false)}
                  type="button"
                >
                  Hủy
                </button>
                <button className="admin-btn danger" type="submit">
                  {rejectLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailOpen ? (
        <div className="admin-dialog-backdrop" role="dialog" aria-modal>
          <div className="admin-dialog" style={{ maxWidth: "70rem" }}>
            <div className="admin-dialog-header">
              <div>
                <p className="admin-dialog-eyebrow">Chi tiết yêu cầu</p>
                <h3 className="admin-dialog-title">
                  {detail ? formatRequestCode(detail.id) : "Đang tải..."}
                </h3>
              </div>
              <button
                className="admin-dialog-close"
                onClick={handleCloseDetailModal}
                type="button"
              >
                <AdminIcon name="cancel" />
              </button>
            </div>

            <div className="admin-dialog-body" style={{ paddingTop: 0 }}>
              {selectedMeta && (
                <div style={{ marginBottom: "1rem" }}>
                  <AdminStatusBadge
                    label={selectedMeta.label}
                    tone={selectedMeta.tone}
                    dotColor={selectedMeta.dotColor}
                  />
                </div>
              )}

              {detailLoading ? (
                <p style={{ marginTop: "1rem", color: "#64748b" }}>
                  Đang tải chi tiết...
                </p>
              ) : detailError ? (
                <p style={{ marginTop: "1rem", color: "#ba1a1a" }}>
                  {detailError}
                </p>
              ) : detail ? (
                <div style={{ display: "grid", gap: "1rem" }}>
                  <section>
                    <p
                      style={{
                        margin: "0 0 0.45rem",
                        fontSize: "0.72rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontWeight: 800,
                        color: "#64748b",
                      }}
                    >
                      Thông tin phụ huynh
                    </p>
                    <div className="payments-info-grid">
                      <div>
                        <p className="payments-info-label">Họ tên</p>
                        <p className="payments-info-value">
                          {detail.parentName}
                        </p>
                      </div>
                      <div>
                        <p className="payments-info-label">Số điện thoại</p>
                        <p className="payments-info-value">
                          {detail.parentPhone}
                        </p>
                      </div>
                      <div>
                        <p className="payments-info-label">Email</p>
                        <p className="payments-info-value">
                          {detail.parentEmail ?? "-"}
                        </p>
                      </div>
                      <div>
                        <p className="payments-info-label">Ngày gửi</p>
                        <p className="payments-info-value">
                          {formatDate(detail.createdAt)}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <p
                      style={{
                        margin: "0 0 0.45rem",
                        fontSize: "0.72rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontWeight: 800,
                        color: "#64748b",
                      }}
                    >
                      Yêu cầu của phụ huynh
                    </p>
                    <div className="payments-info-grid">
                      <div>
                        <p className="payments-info-label">Môn học</p>
                        <p className="payments-info-value">{detail.subject}</p>
                      </div>
                      <div>
                        <p className="payments-info-label">Lớp</p>
                        <p className="payments-info-value">{detail.grade}</p>
                      </div>
                      <div>
                        <p className="payments-info-label">Khu vực</p>
                        <p className="payments-info-value">{detail.district}</p>
                      </div>
                      <div>
                        <p className="payments-info-label">Học phí/buổi</p>
                        <p className="payments-info-value">
                          {formatCurrency(detail.budgetPerHour)}
                        </p>
                      </div>
                    </div>
                    {detail.note && (
                      <div style={{ marginTop: "0.6rem" }}>
                        <p className="payments-info-label">Ghi chú</p>
                        <p className="payments-info-value">{detail.note}</p>
                      </div>
                    )}
                  </section>

                  <section>
                    <p
                      style={{
                        margin: "0 0 0.45rem",
                        fontSize: "0.72rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontWeight: 800,
                        color: "#64748b",
                      }}
                    >
                      Học viên trong yêu cầu
                    </p>
                    {detail.members.length === 0 ? (
                      <p style={{ margin: 0, color: "#64748b" }}>
                        Chưa có thông tin học viên.
                      </p>
                    ) : (
                      <div className="pairing-user-list">
                        {detail.members.map((member) => (
                          <div className="pairing-user-item" key={member.id}>
                            <div className="pairing-user-left">
                              <div className="pairing-user-avatar">
                                {getInitials(member.studentName)}
                              </div>
                              <div>
                                <p className="pairing-user-name">
                                  {member.studentName}
                                </p>
                                <p className="pairing-user-sub">
                                  {member.studentGrade ?? "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {detail.classes.length > 0 && (
                    <section>
                      <p
                        style={{
                          margin: "0 0 0.45rem",
                          fontSize: "0.72rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          fontWeight: 800,
                          color: "#64748b",
                        }}
                      >
                        Lớp đã tạo
                      </p>
                      <div className="pairing-user-list">
                        {detail.classes.map((item) => (
                          <div className="pairing-user-item" key={item.id}>
                            <div className="pairing-user-left">
                              <div className="pairing-user-avatar">
                                {item.title.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="pairing-user-name">
                                  {item.title}
                                </p>
                                <p className="pairing-user-sub">
                                  {formatDate(item.createdAt)}
                                </p>
                              </div>
                            </div>
                            <AdminStatusBadge
                              label={item.status}
                              tone={
                                item.status === "OPEN" ? "open" : "processing"
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {detail.status === "PENDING" && (
                    <div
                      className="payments-action-stack"
                      style={{ marginTop: "0.6rem" }}
                    >
                      <button
                        className="admin-btn primary"
                        onClick={() => setIsConvertOpen(true)}
                        type="button"
                      >
                        <AdminIcon name="verified" /> Tạo lớp từ yêu cầu
                      </button>
                      <button
                        className="admin-btn danger"
                        onClick={() => setIsRejectOpen(true)}
                        type="button"
                      >
                        <AdminIcon name="cancel" /> Từ chối yêu cầu
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ marginTop: "1rem", color: "#64748b" }}>
                  Chọn một yêu cầu để xem chi tiết.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

// -------------------------------------------------------------
// TUTOR REQUESTS TAB (Class Applications)
// -------------------------------------------------------------
function TutorRequestsTab({
  showToast,
}: {
  showToast: (tone: ToastTone, msg: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // For this tab, we mostly list OPEN classes
  const page = Number(searchParams.get("page") ?? "1");

  const [records, setRecords] = useState<AdminClassSummary[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [expandedClassIds, setExpandedClassIds] = useState<string[]>([]);
  const [applicantsByClass, setApplicantsByClass] = useState<Record<string, AdminClassApplicant[]>>({});
  const [applicantsLoading, setApplicantsLoading] = useState<Record<string, boolean>>({});
  const [applicantsError, setApplicantsError] = useState<Record<string, string | null>>({});
  const [assignLoading, setAssignLoading] = useState(false);
  const [rejectLoadingId, setRejectLoadingId] = useState<string | null>(null);

  const updateQuery = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const loadClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Only fetch OPEN classes that have potential applicants
      const response = await listAdminClasses({
        page: Number.isFinite(page) && page > 0 ? page : 1,
        limit: PAGE_SIZE,
        status: "OPEN",
      });
      setRecords(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể tải danh sách lớp học.",
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  const loadApplicants = useCallback(async (classId: string) => {
    setApplicantsLoading((prev) => ({ ...prev, [classId]: true }));
    setApplicantsError((prev) => ({ ...prev, [classId]: null }));
    try {
      const classApplicants = await listAdminClassApplicants(classId);
      setApplicantsByClass((prev) => ({ ...prev, [classId]: classApplicants }));
    } catch (err) {
      setApplicantsError((prev) => ({
        ...prev,
        [classId]: err instanceof Error ? err.message : "Không thể tải danh sách ứng viên.",
      }));
    } finally {
      setApplicantsLoading((prev) => ({ ...prev, [classId]: false }));
    }
  }, []);

  useEffect(() => {
    void loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    setExpandedClassIds((prev) =>
      prev.filter((id) => records.some((item) => item.id === id)),
    );
  }, [records]);

  const handleAssign = async (classId: string, tutorId: string) => {
    if (assignLoading) return;
    if (!window.confirm("Bạn có chắc muốn phân lớp cho gia sư này?")) return;

    setAssignLoading(true);
    try {
      await assignAdminClass(classId, tutorId, "Phân lớp từ trang yêu cầu");
      showToast("success", "Đã phân lớp cho gia sư thành công!");
      await loadClasses();
      setExpandedClassIds((prev) => prev.filter((id) => id !== classId));
      setApplicantsByClass((prev) => {
        const next = { ...prev };
        delete next[classId];
        return next;
      });
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Lỗi khi phân lớp.",
      );
    } finally {
      setAssignLoading(false);
    }
  };

  const handleReject = async (classId: string, tutorId: string) => {
    if (rejectLoadingId) return;

    if (!window.confirm("Bạn có chắc muốn từ chối ứng viên này?")) return;

    const note = window.prompt("Ghi chú từ chối (tùy chọn):", "") ?? undefined;

    setRejectLoadingId(tutorId);
    try {
      await rejectAdminClassApplicant(classId, tutorId, note?.trim() || undefined);
      showToast("success", "Đã từ chối ứng viên.");
      await loadApplicants(classId);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Lỗi khi từ chối ứng viên.");
    } finally {
      setRejectLoadingId(null);
    }
  };

  const toggleApplicants = (classId: string) => {
    setExpandedClassIds((prev) => {
      const isExpanded = prev.includes(classId);
      return isExpanded ? prev.filter((id) => id !== classId) : [...prev, classId];
    });

    if (!applicantsByClass[classId] && !applicantsLoading[classId]) {
      void loadApplicants(classId);
    }
  };

  const getApplicantStatusLabel = (status: string) => {
    if (status === "ACCEPTED") return "Đã nhận";
    if (status === "REJECTED") return "Từ chối";
    return "Chờ duyệt";
  };

  const pagination = useMemo(() => {
    const totalPages = Math.max(meta.totalPages, 1);
    const currentPage = Math.min(Math.max(meta.page, 1), totalPages);
    const pages: Array<number | "ellipsis"> = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
      return { pages, currentPage, totalPages };
    }

    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i += 1) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);

    return { pages, currentPage, totalPages };
  }, [meta.page, meta.totalPages]);

  const rangeStart = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const rangeEnd = Math.min(meta.page * meta.limit, meta.total);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div>
          <p className="admin-page-subtitle" style={{ margin: 0 }}>
            Duyệt gia sư nhận lớp từ danh sách các lớp đang mở.
          </p>
        </div>
        <button
          className="admin-btn tonal"
          onClick={() => void loadClasses()}
          type="button"
        >
          <AdminIcon name="autorenew" />
          Làm mới
        </button>
      </div>

      {error && (
        <div className="admin-panel" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: 0, color: "#ba1a1a" }}>{error}</p>
        </div>
      )}

      <section style={{ display: "grid", gap: "1rem" }}>
        {loading ? (
          <div className="admin-panel" style={{ textAlign: "center" }}>
            Đang tải dữ liệu...
          </div>
        ) : records.length === 0 ? (
          <div className="admin-panel" style={{ textAlign: "center" }}>
            Không có lớp học nào đang mở.
          </div>
        ) : (
          records.map((record) => {
            const isExpanded = expandedClassIds.includes(record.id);
            const applicants = applicantsByClass[record.id] ?? [];
            const isLoadingApplicants = applicantsLoading[record.id];
            const applicantsErr = applicantsError[record.id];

            return (
              <div className="admin-panel" key={record.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>
                      {formatClassCode(record.id)}
                    </p>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem" }}>
                      {record.title}
                    </p>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>
                      {record.subject} - {record.grade} • {record.district}
                    </p>
                    <p
                      style={{
                        margin: "0.35rem 0 0",
                        color: "#0f172a",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      }}
                    >
                      {formatCurrency(record.feePerHour)} • {record._count.applications} ứng viên
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <AdminStatusBadge label="ĐANG MỞ" tone="open" dotColor="#0058be" />
                    <button
                      className="admin-btn tonal"
                      onClick={() => toggleApplicants(record.id)}
                      type="button"
                    >
                      {isExpanded ? "Ẩn ứng viên" : "Xem ứng viên"}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
                    {isLoadingApplicants ? (
                      <p style={{ margin: 0, color: "#64748b" }}>Đang tải danh sách...</p>
                    ) : applicantsErr ? (
                      <p style={{ margin: 0, color: "#ba1a1a" }}>{applicantsErr}</p>
                    ) : applicants.length === 0 ? (
                      <p style={{ margin: 0, color: "#64748b" }}>
                        Hiện chưa có gia sư nào đăng ký nhận lớp này.
                      </p>
                    ) : (
                      <div className="pairing-user-list">
                        {applicants.map((item) => (
                          <div
                            className="pairing-user-item"
                            key={item.id}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                          >
                            <div className="pairing-user-left">
                              <div className="pairing-user-avatar">
                                {getInitials(item.tutor.fullName)}
                              </div>
                              <div>
                                <p className="pairing-user-name">{item.tutor.fullName}</p>
                                <p className="pairing-user-sub">
                                  {item.tutor.email} • {item.tutor.phone ?? "Chưa có SĐT"}
                                </p>
                                <p
                                  className="pairing-user-sub"
                                  style={{ marginTop: "0.25rem", fontSize: "0.75rem", fontWeight: 600 }}
                                >
                                  {getApplicantStatusLabel(item.status)}
                                </p>
                                <p className="pairing-user-sub" style={{ marginTop: "0.25rem", fontSize: "0.75rem" }}>
                                  {item.tutor.subjects.join(", ")} | {item.tutor.districts.join(", ")}
                                </p>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                              <button
                                className="admin-btn primary"
                                onClick={() => handleAssign(record.id, item.tutor.id)}
                                disabled={assignLoading || item.status !== "PENDING"}
                                style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                              >
                                Phân lớp
                              </button>
                              <button
                                className="admin-btn danger"
                                onClick={() => handleReject(record.id, item.tutor.id)}
                                disabled={rejectLoadingId === item.tutor.id || item.status !== "PENDING"}
                                style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                              >
                                Từ chối
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#64748b",
          fontSize: "0.8rem",
          marginTop: "1rem",
        }}
      >
        <span>
          Hiển thị {rangeStart} - {rangeEnd} trong tổng số {meta.total} lớp
        </span>
        <div
          style={{
            display: "inline-flex",
            gap: "0.35rem",
            alignItems: "center",
          }}
        >
          <button
            className="admin-btn tonal"
            disabled={pagination.currentPage <= 1}
            onClick={() => updateQuery(Math.max(1, pagination.currentPage - 1))}
            type="button"
          >
            <AdminIcon name="chevron_left" style={{ width: "1rem" }} />
          </button>
          {pagination.pages.map((item, index) =>
            item === "ellipsis" ? (
              <button
                className="admin-btn tonal"
                key={`ellipsis-${index}`}
                type="button"
              >
                ...
              </button>
            ) : (
              <button
                className={
                  item === pagination.currentPage
                    ? "admin-btn primary"
                    : "admin-btn tonal"
                }
                key={item}
                onClick={() => updateQuery(item as number)}
                type="button"
              >
                {item}
              </button>
            ),
          )}
          <button
            className="admin-btn tonal"
            disabled={pagination.currentPage >= pagination.totalPages}
            onClick={() =>
              updateQuery(
                Math.min(pagination.totalPages, pagination.currentPage + 1),
              )
            }
            type="button"
          >
            <AdminIcon name="chevron_right" style={{ width: "1rem" }} />
          </button>
        </div>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// MAIN PAGE COMPONENT
// -------------------------------------------------------------
export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<"parent" | "tutor">("parent");
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((tone: ToastTone, message: string) => {
    setToast({ tone, message });
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  return (
    <div className="admin-page">
      {toast && (
        <div className="admin-toast-stack" aria-live="polite">
          <div className={`admin-toast ${toast.tone}`}>
            <span className="admin-toast-icon">
              <AdminIcon
                name={toast.tone === "success" ? "check_circle" : "warning"}
              />
            </span>
            <span>{toast.message}</span>
            <button
              className="admin-toast-close"
              onClick={() => setToast(null)}
              type="button"
            >
              <AdminIcon name="cancel" />
            </button>
          </div>
        </div>
      )}

      <header className="admin-page-header" style={{ paddingBottom: 0 }}>
        <div>
          <h1 className="admin-page-title">Quản lý Yêu cầu</h1>
        </div>
      </header>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          marginTop: "1rem",
          marginBottom: "1.5rem",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <button
          onClick={() => setActiveTab("parent")}
          style={{
            padding: "0.75rem 0.5rem",
            background: "none",
            border: "none",
            borderBottom:
              activeTab === "parent"
                ? "3px solid #0f3b9c"
                : "3px solid transparent",
            color: activeTab === "parent" ? "#0f3b9c" : "#64748b",
            fontWeight: activeTab === "parent" ? 700 : 500,
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Duyệt yêu cầu phụ huynh
        </button>
        <button
          onClick={() => setActiveTab("tutor")}
          style={{
            padding: "0.75rem 0.5rem",
            background: "none",
            border: "none",
            borderBottom:
              activeTab === "tutor"
                ? "3px solid #0f3b9c"
                : "3px solid transparent",
            color: activeTab === "tutor" ? "#0f3b9c" : "#64748b",
            fontWeight: activeTab === "tutor" ? 700 : 500,
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Duyệt gia sư nhận lớp
        </button>
      </div>

      {activeTab === "parent" ? (
        <ParentRequestsTab showToast={showToast} />
      ) : (
        <TutorRequestsTab showToast={showToast} />
      )}
    </div>
  );
}
