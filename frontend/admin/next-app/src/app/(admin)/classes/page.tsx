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

import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminIcon } from "@/components/admin/AdminIcon";
import {
  closeAdminClass,
  createAdminClass,
  getAdminClassById,
  listAdminClasses,
  updateAdminClass,
  type AdminClassDetail,
  type AdminClassStatus,
  type AdminClassSummary,
} from "@/lib/adminApi";

const PAGE_SIZE = 10;

const STATUS_META: Record<
  AdminClassStatus,
  { label: string; tone: "open" | "approved" | "processing"; dotColor: string }
> = {
  OPEN: { label: "ĐANG MỞ", tone: "open", dotColor: "#0058be" },
  ASSIGNED: { label: "ĐÃ PHÂN", tone: "approved", dotColor: "#059669" },
  CLOSED: { label: "ĐÃ ĐÓNG", tone: "processing", dotColor: "#64748b" },
};

type ToastTone = "success" | "error";

type ToastState = {
  tone: ToastTone;
  message: string;
};

type ClassFormState = {
  title: string;
  subject: string;
  grade: string;
  district: string;
  feePerHour: string;
  schedule: string;
};

const emptyClassForm: ClassFormState = {
  title: "",
  subject: "",
  grade: "",
  district: "",
  feePerHour: "",
  schedule: "",
};

const buildClassForm = (detail?: AdminClassDetail | null): ClassFormState => {
  if (!detail) {
    return { ...emptyClassForm };
  }

  return {
    title: detail.title,
    subject: detail.subject,
    grade: detail.grade,
    district: detail.district,
    feePerHour: detail.feePerHour ? String(detail.feePerHour) : "",
    schedule: detail.schedule ?? "",
  };
};

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
}

function formatCurrency(value?: number | null): string {
  if (!value) return "-";
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ/giờ`;
}

function formatClassCode(id: string): string {
  const code = id.split("-")[0] ?? id.slice(0, 6);
  return `LH-${code.toUpperCase()}`;
}

function formatRequestCode(id: string): string {
  const code = id.split("-")[0] ?? id.slice(0, 6);
  return `RQ-${code.toUpperCase()}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("");
}

export default function ClassesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") ?? "all";
  const subjectQuery = searchParams.get("subject") ?? "";
  const districtQuery = searchParams.get("district") ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const [subjectInput, setSubjectInput] = useState(subjectQuery);
  const [districtInput, setDistrictInput] = useState(districtQuery);
  const [records, setRecords] = useState<AdminClassSummary[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ open: 0, assigned: 0, closed: 0 });

  const [selectedClassId, setSelectedClassId] = useState("");
  const [detail, setDetail] = useState<AdminClassDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formState, setFormState] = useState<ClassFormState>(emptyClassForm);
  const [formLoading, setFormLoading] = useState(false);
  const [isCloseOpen, setIsCloseOpen] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);

  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const statusFilter = useMemo(() => {
    return status === "all" ? undefined : (status as AdminClassStatus);
  }, [status]);

  const subjectFilter = subjectQuery.trim() ? subjectQuery.trim() : undefined;
  const districtFilter = districtQuery.trim()
    ? districtQuery.trim()
    : undefined;

  const showToast = useCallback((tone: ToastTone, message: string) => {
    setToast({ tone, message });

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2600);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setSubjectInput(subjectQuery);
  }, [subjectQuery]);

  useEffect(() => {
    setDistrictInput(districtQuery);
  }, [districtQuery]);

  const updateQuery = (next: {
    status?: string;
    subject?: string;
    district?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextStatus = next.status ?? status;
    const nextSubject = next.subject ?? subjectQuery;
    const nextDistrict = next.district ?? districtQuery;
    const nextPage = next.page ?? page;

    if (nextStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", nextStatus);
    }

    if (!nextSubject) {
      params.delete("subject");
    } else {
      params.set("subject", nextSubject);
    }

    if (!nextDistrict) {
      params.delete("district");
    } else {
      params.set("district", nextDistrict);
    }

    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const loadClasses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await listAdminClasses({
        page: Number.isFinite(page) && page > 0 ? page : 1,
        limit: PAGE_SIZE,
        status: statusFilter,
        subject: subjectFilter,
        district: districtFilter,
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
  }, [districtFilter, page, statusFilter, subjectFilter]);

  const loadStats = useCallback(async () => {
    try {
      const [open, assigned, closed] = await Promise.all([
        listAdminClasses({ page: 1, limit: 1, status: "OPEN" }),
        listAdminClasses({ page: 1, limit: 1, status: "ASSIGNED" }),
        listAdminClasses({ page: 1, limit: 1, status: "CLOSED" }),
      ]);

      setStats({
        open: open.meta.total,
        assigned: assigned.meta.total,
        closed: closed.meta.total,
      });
    } catch {
      setStats({ open: 0, assigned: 0, closed: 0 });
    }
  }, []);

  const loadDetail = useCallback(async (classId: string) => {
    setDetailLoading(true);
    setDetailError(null);

    try {
      const response = await getAdminClassById(classId);
      setDetail(response);
    } catch (err) {
      setDetailError(
        err instanceof Error ? err.message : "Không thể tải chi tiết lớp học.",
      );
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (!records.length) {
      setSelectedClassId("");
      return;
    }

    if (
      !selectedClassId ||
      !records.some((item) => item.id === selectedClassId)
    ) {
      setSelectedClassId(records[0].id);
    }
  }, [records, selectedClassId]);

  useEffect(() => {
    if (!selectedClassId) {
      setDetail(null);
      return;
    }

    void loadDetail(selectedClassId);
  }, [loadDetail, selectedClassId]);

  const pagination = useMemo(() => {
    const totalPages = Math.max(meta.totalPages, 1);
    const currentPage = Math.min(Math.max(meta.page, 1), totalPages);
    const pages: Array<number | "ellipsis"> = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i);
      }
      return { pages, currentPage, totalPages };
    }

    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);

    return { pages, currentPage, totalPages };
  }, [meta.page, meta.totalPages]);

  const rangeStart = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const rangeEnd = Math.min(meta.page * meta.limit, meta.total);

  const handleOpenCreate = useCallback(() => {
    setFormMode("create");
    setFormState({ ...emptyClassForm });
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback(() => {
    if (!detail) {
      return;
    }

    setFormMode("edit");
    setFormState(buildClassForm(detail));
    setIsFormOpen(true);
  }, [detail]);

  const handleCloseForm = useCallback(() => {
    if (formLoading) {
      return;
    }
    setIsFormOpen(false);
  }, [formLoading]);

  const handleCloseCloseModal = useCallback(() => {
    if (closeLoading) {
      return;
    }
    setIsCloseOpen(false);
  }, [closeLoading]);

  useEffect(() => {
    if (!isFormOpen && !isCloseOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseForm();
        handleCloseCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCloseCloseModal, handleCloseForm, isCloseOpen, isFormOpen]);

  const handleSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formLoading) {
      return;
    }

    const title = formState.title.trim();
    const subject = formState.subject.trim();
    const grade = formState.grade.trim();
    const district = formState.district.trim();
    const schedule = formState.schedule.trim();
    const feeValue = Number(formState.feePerHour);

    if (!title) {
      showToast("error", "Vui lòng nhập tiêu đề lớp.");
      return;
    }

    if (!Number.isFinite(feeValue) || feeValue <= 0) {
      showToast("error", "Học phí/giờ không hợp lệ.");
      return;
    }

    if (formMode === "create") {
      if (!subject || !grade || !district) {
        showToast("error", "Vui lòng nhập đầy đủ môn, lớp và khu vực.");
        return;
      }
    }

    setFormLoading(true);

    try {
      if (formMode === "create") {
        await createAdminClass({
          title,
          subject,
          grade,
          district,
          feePerHour: Math.round(feeValue),
          schedule: schedule || undefined,
        });
        showToast("success", "Đã tạo lớp học mới.");
      } else if (detail) {
        const payload: {
          title?: string;
          feePerHour?: number;
          schedule?: string;
        } = {
          title,
          feePerHour: Math.round(feeValue),
        };
        if (schedule) {
          payload.schedule = schedule;
        }

        const updated = await updateAdminClass(detail.id, payload);
        setDetail(updated);
        showToast("success", "Đã cập nhật lớp học.");
      }

      setIsFormOpen(false);
      await Promise.all([loadClasses(), loadStats()]);
      if (detail) {
        await loadDetail(detail.id);
      }
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Không thể lưu thông tin lớp.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmClose = async () => {
    if (!detail || closeLoading) {
      return;
    }

    setCloseLoading(true);

    try {
      await closeAdminClass(detail.id);
      showToast("success", "Đã đóng lớp học.");
      setIsCloseOpen(false);
      await Promise.all([loadClasses(), loadStats(), loadDetail(detail.id)]);
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Không thể đóng lớp học.",
      );
    } finally {
      setCloseLoading(false);
    }
  };

  const selectedMeta = detail ? STATUS_META[detail.status] : null;
  const canEdit = detail?.status === "OPEN";

  return (
    <div className="admin-page">
      {toast ? (
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
      ) : null}

      <header className="admin-page-header">
        <div>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.8rem" }}>
            Lớp học • Danh sách lớp
          </p>
          <h1 className="admin-page-title">Danh sách lớp</h1>
          <p className="admin-page-subtitle">
            Lớp chính thức đang hoạt động. Đang mở sẽ hiển thị trên website
            public.
          </p>
        </div>

        <div className="admin-page-actions">
          <button
            className="admin-btn ghost"
            onClick={handleOpenCreate}
            type="button"
          >
            <AdminIcon name="add" />
            Tạo lớp mới
          </button>
          <button
            className="admin-btn tonal"
            onClick={() => void loadClasses()}
            type="button"
          >
            <AdminIcon name="autorenew" />
            Làm mới
          </button>
          <button
            className="admin-btn tonal"
            onClick={() => router.push("/classes/statistics")}
            type="button"
          >
            <AdminIcon name="analytics" />
            Thống kê
          </button>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: 0, color: "#ba1a1a" }}>{error}</p>
        </div>
      ) : null}

      <section className="pairing-summary-strip">
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Đang mở</p>
          <p className="pairing-summary-value">{stats.open}</p>
        </article>
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Đã phân</p>
          <p className="pairing-summary-value">{stats.assigned}</p>
        </article>
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Đã đóng</p>
          <p className="pairing-summary-value">{stats.closed}</p>
        </article>
        <article className="pairing-summary-card">
          <p className="pairing-summary-label">Tổng lớp</p>
          <p className="pairing-summary-value">{meta.total}</p>
        </article>
      </section>

      <section className="admin-panel">
        <form
          className="audit-filter-row"
          onSubmit={(event) => {
            event.preventDefault();
            updateQuery({
              subject: subjectInput.trim(),
              district: districtInput.trim(),
              page: 1,
            });
          }}
        >
          <label>
            <span className="tutors-select-label">Trạng thái</span>
            <select
              className="tutors-select"
              onChange={(event) =>
                updateQuery({ status: event.target.value, page: 1 })
              }
              value={status}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="OPEN">Đang mở</option>
              <option value="ASSIGNED">Đã phân</option>
              <option value="CLOSED">Đã đóng</option>
            </select>
          </label>

          <label>
            <span className="tutors-select-label">Môn học</span>
            <input
              className="tutors-select"
              onChange={(event) => setSubjectInput(event.target.value)}
              placeholder="Toán, Anh văn..."
              type="text"
              value={subjectInput}
            />
          </label>

          <label>
            <span className="tutors-select-label">Khu vực</span>
            <input
              className="tutors-select"
              onChange={(event) => setDistrictInput(event.target.value)}
              placeholder="Quận, huyện..."
              type="text"
              value={districtInput}
            />
          </label>

          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="admin-btn tonal" type="submit">
              <AdminIcon name="search" />
              Lọc
            </button>
          </div>
        </form>
      </section>

      <section className="audit-grid">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tiêu đề</th>
                <th>Môn - Lớp</th>
                <th>Khu vực</th>
                <th>Học phí</th>
                <th>Ứng viên</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    Chưa có lớp nào.
                  </td>
                </tr>
              ) : (
                records.map((record) => {
                  const metaInfo = STATUS_META[record.status];
                  const isSelected = record.id === selectedClassId;

                  return (
                    <tr
                      key={record.id}
                      onClick={() => setSelectedClassId(record.id)}
                      style={
                        isSelected
                          ? { background: "rgba(219, 234, 254, 0.35)" }
                          : undefined
                      }
                    >
                      <td style={{ fontWeight: 700 }}>
                        {formatClassCode(record.id)}
                      </td>
                      <td style={{ fontWeight: 700 }}>{record.title}</td>
                      <td>
                        {record.subject} - {record.grade}
                      </td>
                      <td>{record.district}</td>
                      <td>{formatCurrency(record.feePerHour)}</td>
                      <td>{record._count.applications}</td>
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
                            aria-label={`Xem lớp ${record.title}`}
                            className="table-action-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedClassId(record.id);
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

        <aside className="admin-panel">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div>
              <h3 className="admin-panel-title" style={{ margin: 0 }}>
                Chi tiết lớp học
              </h3>
              <p className="admin-panel-subtitle">
                {detail ? formatClassCode(detail.id) : "Chưa chọn lớp"}
              </p>
            </div>
            {selectedMeta ? (
              <AdminStatusBadge
                label={selectedMeta.label}
                tone={selectedMeta.tone}
                dotColor={selectedMeta.dotColor}
              />
            ) : null}
          </div>

          {detailLoading ? (
            <p style={{ marginTop: "1rem", color: "#64748b" }}>
              Đang tải chi tiết...
            </p>
          ) : detailError ? (
            <p style={{ marginTop: "1rem", color: "#ba1a1a" }}>{detailError}</p>
          ) : detail ? (
            <div style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
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
                  Thông tin lớp
                </p>
                <div className="payments-info-grid">
                  <div>
                    <p className="payments-info-label">Tiêu đề</p>
                    <p className="payments-info-value">{detail.title}</p>
                  </div>
                  <div>
                    <p className="payments-info-label">Môn - Lớp</p>
                    <p className="payments-info-value">
                      {detail.subject} - {detail.grade}
                    </p>
                  </div>
                  <div>
                    <p className="payments-info-label">Khu vực</p>
                    <p className="payments-info-value">{detail.district}</p>
                  </div>
                  <div>
                    <p className="payments-info-label">Học phí</p>
                    <p className="payments-info-value">
                      {formatCurrency(detail.feePerHour)}
                    </p>
                  </div>
                  <div>
                    <p className="payments-info-label">Lịch học</p>
                    <p className="payments-info-value">
                      {detail.schedule ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p className="payments-info-label">Ngày tạo</p>
                    <p className="payments-info-value">
                      {formatDate(detail.createdAt)}
                    </p>
                  </div>
                </div>
              </section>

              {detail.sourceRequest ? (
                <section className="admin-panel soft">
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
                    Nguồn yêu cầu
                  </p>
                  <div className="payments-info-grid">
                    <div>
                      <p className="payments-info-label">Yêu cầu</p>
                      <p className="payments-info-value">
                        {formatRequestCode(detail.sourceRequest.id)}
                      </p>
                    </div>
                    <div>
                      <p className="payments-info-label">Phụ huynh</p>
                      <p className="payments-info-value">
                        {detail.sourceRequest.parentName}
                      </p>
                    </div>
                    <div>
                      <p className="payments-info-label">SĐT</p>
                      <p className="payments-info-value">
                        {detail.sourceRequest.parentPhone}
                      </p>
                    </div>
                    <div>
                      <p className="payments-info-label">Học phí dự kiến</p>
                      <p className="payments-info-value">
                        {formatCurrency(detail.sourceRequest.budgetPerHour)}
                      </p>
                    </div>
                  </div>
                </section>
              ) : null}

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
                  Học viên
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
                        <div style={{ textAlign: "right" }}>
                          <p className="pairing-user-name">
                            {member.parentName}
                          </p>
                          <p className="pairing-user-sub">
                            {member.parentPhone}
                          </p>
                        </div>
                      </div>
                    ))}
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
                  Phân lớp
                </p>
                {detail.assignment ? (
                  <div className="pairing-user-item">
                    <div className="pairing-user-left">
                      <div className="pairing-user-avatar">
                        {getInitials(detail.assignment.tutor.fullName)}
                      </div>
                      <div>
                        <p className="pairing-user-name">
                          {detail.assignment.tutor.fullName}
                        </p>
                        <p className="pairing-user-sub">
                          {detail.assignment.tutor.email}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p className="pairing-user-name">
                        {detail.assignment.assignedBy.fullName}
                      </p>
                      <p className="pairing-user-sub">
                        {formatDate(detail.assignment.createdAt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: 0, color: "#64748b" }}>
                    Chưa phân lớp cho gia sư.
                  </p>
                )}
              </section>
            </div>
          ) : (
            <p style={{ marginTop: "1rem", color: "#64748b" }}>
              Chọn một lớp để xem chi tiết.
            </p>
          )}

          {detail ? (
            <div
              className="payments-action-stack"
              style={{ marginTop: "1.1rem" }}
            >
              <button
                className="admin-btn primary"
                disabled={!canEdit}
                onClick={handleOpenEdit}
                type="button"
              >
                <AdminIcon name="edit" />
                Chỉnh sửa lớp
              </button>
              <button
                className="admin-btn danger"
                onClick={() => setIsCloseOpen(true)}
                type="button"
              >
                <AdminIcon name="cancel" />
                Đóng lớp
              </button>
            </div>
          ) : null}
        </aside>
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

      {isFormOpen ? (
        <div className="admin-dialog-backdrop" role="dialog" aria-modal>
          <div className="admin-dialog">
            <div className="admin-dialog-header">
              <div>
                <p className="admin-dialog-eyebrow">
                  {formMode === "create" ? "Tạo lớp mới" : "Cập nhật lớp"}
                </p>
                <h3 className="admin-dialog-title">
                  {formMode === "create" ? "Tạo lớp thủ công" : formState.title}
                </h3>
              </div>
              <button
                className="admin-dialog-close"
                onClick={handleCloseForm}
                type="button"
              >
                <AdminIcon name="cancel" />
              </button>
            </div>

            <form className="admin-dialog-body" onSubmit={handleSubmitForm}>
              <div className="admin-dialog-grid">
                <label className="admin-dialog-field">
                  Tiêu đề lớp
                  <input
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                    type="text"
                    value={formState.title}
                  />
                </label>

                <label className="admin-dialog-field">
                  Môn học
                  <input
                    disabled={formMode === "edit"}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        subject: event.target.value,
                      }))
                    }
                    type="text"
                    value={formState.subject}
                  />
                </label>

                <label className="admin-dialog-field">
                  Lớp
                  <input
                    disabled={formMode === "edit"}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        grade: event.target.value,
                      }))
                    }
                    type="text"
                    value={formState.grade}
                  />
                </label>

                <label className="admin-dialog-field">
                  Khu vực
                  <input
                    disabled={formMode === "edit"}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        district: event.target.value,
                      }))
                    }
                    type="text"
                    value={formState.district}
                  />
                </label>

                <label className="admin-dialog-field">
                  Học phí/giờ
                  <input
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        feePerHour: event.target.value,
                      }))
                    }
                    type="number"
                    min={0}
                    value={formState.feePerHour}
                  />
                </label>

                <label className="admin-dialog-field admin-dialog-field-full">
                  Lịch học (tuỳ chọn)
                  <input
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        schedule: event.target.value,
                      }))
                    }
                    type="text"
                    value={formState.schedule}
                  />
                </label>
              </div>

              <div className="admin-dialog-actions">
                <button
                  className="admin-btn ghost"
                  onClick={handleCloseForm}
                  type="button"
                >
                  Hủy
                </button>
                <button className="admin-btn primary" type="submit">
                  {formLoading
                    ? "Đang lưu..."
                    : formMode === "create"
                      ? "Tạo lớp"
                      : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isCloseOpen && detail ? (
        <div className="admin-dialog-backdrop" role="dialog" aria-modal>
          <div className="admin-dialog">
            <div className="admin-dialog-header">
              <div>
                <p className="admin-dialog-eyebrow">Đóng lớp</p>
                <h3 className="admin-dialog-title">{detail.title}</h3>
              </div>
              <button
                className="admin-dialog-close"
                onClick={handleCloseCloseModal}
                type="button"
              >
                <AdminIcon name="cancel" />
              </button>
            </div>

            <div className="admin-dialog-body">
              <p style={{ margin: 0, color: "#64748b" }}>
                {detail.status === "ASSIGNED"
                  ? "Lớp đã có gia sư. Bạn chắc chắn muốn đóng lớp này?"
                  : "Đóng lớp sẽ khiến lớp không hiển thị trên website."}
              </p>
              <div className="admin-dialog-actions">
                <button
                  className="admin-btn ghost"
                  onClick={handleCloseCloseModal}
                  type="button"
                >
                  Hủy
                </button>
                <button
                  className="admin-btn danger"
                  onClick={handleConfirmClose}
                  type="button"
                >
                  {closeLoading ? "Đang đóng..." : "Xác nhận đóng"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
