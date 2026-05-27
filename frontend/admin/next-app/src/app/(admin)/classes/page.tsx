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
  listAdminClassApplicants,
  listAdminClasses,
  listAdminCenterTeachers,
  updateAdminClass,
  type AdminClassApplicant,
  type AdminClassDetail,
  type AdminClassStatus,
  type AdminClassSummary,
  type AdminClassType,
  type AdminClassMemberInput,
  type AdminCenterTeacherSummary,
  type AdminTutorType,
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

const CLASS_TYPE_LABELS: Record<AdminClassType, string> = {
  LOP_GIA_SU_TU_DO: "Lớp gia sư tự do",
  LOP_GIA_SU_DAO_TAO: "Lớp gia sư đào tạo",
  LOP_TRUNG_TAM: "Lớp trung tâm",
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
  scheduleDays: string[];
  classType: "" | AdminClassType;
  tutorType: "" | AdminTutorType;
  centerTeacherId: string;
  centerDistricts: string[];
  members: AdminClassMemberInput[];
};

const emptyClassForm: ClassFormState = {
  title: "",
  subject: "",
  grade: "",
  district: "",
  feePerHour: "",
  scheduleDays: [],
  classType: "",
  tutorType: "",
  centerTeacherId: "",
  centerDistricts: [],
  members: [],
};

const buildClassForm = (detail?: AdminClassDetail | null): ClassFormState => {
  if (!detail) {
    return { ...emptyClassForm };
  }

  const scheduleDays = detail.schedule
    ? detail.schedule
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  return {
    title: detail.title,
    subject: detail.subject,
    grade: detail.grade,
    district: detail.district,
    feePerHour: detail.feePerHour ? String(detail.feePerHour) : "",
    scheduleDays,
    classType: detail.classType,
    tutorType: detail.tutorType,
    centerTeacherId: detail.centerTeacherId ?? "",
    centerDistricts: [],
    members: [],
  };
};

const DISTRICT_OPTIONS = [
  "Quận 1",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 10",
  "Quận 11",
  "Quận 12",
  "Quận Bình Tân",
  "Quận Bình Thạnh",
  "Quận Gò Vấp",
  "Quận Phú Nhuận",
  "Quận Tân Bình",
  "Quận Tân Phú",
  "TP Thủ Đức",
];

const CENTER_DISTRICT_OPTIONS = ["Quận 12", "Quận Gò Vấp"];

const formatVndInput = (value: string): string => {
  if (!value) return "";
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return value;
  return new Intl.NumberFormat("vi-VN").format(numeric);
};

const createEmptyMember = (): AdminClassMemberInput => ({
  studentName: "",
  studentGrade: "",
  parentName: "",
  parentPhone: "",
  parentEmail: "",
  address: "",
});

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
}

function formatCurrency(value?: number | null, classType?: AdminClassType): string {
  if (!value) return "-";
  const suffix = classType === "LOP_TRUNG_TAM" ? "/tháng" : "/buổi";
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ${suffix}`;
}

function formatVnd(value: string): string {
  if (!value) return "";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return value;
  return new Intl.NumberFormat("vi-VN").format(amount);
}

function formatClassCode(id: string): string {
  const code = id.split("-")[0] ?? id.slice(0, 6);
  return `LH-${code.toUpperCase()}`;
}

function getClassTypeBadgeStyle(type: AdminClassType): React.CSSProperties {
  switch (type) {
    case "LOP_GIA_SU_TU_DO":
      return {
        background: "rgba(37, 99, 235, 0.12)",
        color: "#1d4ed8",
        border: "1px solid rgba(37, 99, 235, 0.28)",
      };
    case "LOP_GIA_SU_DAO_TAO":
      return {
        background: "rgba(245, 158, 11, 0.16)",
        color: "#b45309",
        border: "1px solid rgba(245, 158, 11, 0.35)",
      };
    case "LOP_TRUNG_TAM":
      return {
        background: "rgba(16, 185, 129, 0.16)",
        color: "#047857",
        border: "1px solid rgba(16, 185, 129, 0.35)",
      };
    default:
      return {
        background: "rgba(148, 163, 184, 0.2)",
        color: "#475569",
        border: "1px solid rgba(148, 163, 184, 0.4)",
      };
  }
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

const WEEK_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function ClassesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") ?? "all";
  const subjectQuery = searchParams.get("subject") ?? "";
  const districtQuery = searchParams.get("district") ?? "";
  const classTypeQuery = searchParams.get("classType") ?? "all";
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
  const [applicants, setApplicants] = useState<AdminClassApplicant[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantsError, setApplicantsError] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formState, setFormState] = useState<ClassFormState>(emptyClassForm);
  const [formLoading, setFormLoading] = useState(false);
  const [isCloseOpen, setIsCloseOpen] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);
  const [centerTeachers, setCenterTeachers] = useState<AdminCenterTeacherSummary[]>([]);
  const [centerTeachersLoading, setCenterTeachersLoading] = useState(false);
  const [centerTeachersError, setCenterTeachersError] = useState<string | null>(null);

  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const statusFilter = useMemo(() => {
    return status === "all" ? undefined : (status as AdminClassStatus);
  }, [status]);

  const classTypeFilter = useMemo(() => {
    return classTypeQuery === "all"
      ? undefined
      : (classTypeQuery as AdminClassType);
  }, [classTypeQuery]);

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

  const loadCenterTeachers = useCallback(async () => {
    setCenterTeachersLoading(true);
    setCenterTeachersError(null);
    try {
      const response = await listAdminCenterTeachers({ page: 1, limit: 100 });
      setCenterTeachers(response.data);
    } catch (err) {
      setCenterTeachersError(
        err instanceof Error
          ? err.message
          : "Không thể tải danh sách giáo viên trung tâm.",
      );
      setCenterTeachers([]);
    } finally {
      setCenterTeachersLoading(false);
    }
  }, []);

  const updateQuery = (next: {
    status?: string;
    subject?: string;
    district?: string;
    classType?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextStatus = next.status ?? status;
    const nextSubject = next.subject ?? subjectQuery;
    const nextDistrict = next.district ?? districtQuery;
    const nextClassType = next.classType ?? classTypeQuery;
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

    if (nextClassType === "all") {
      params.delete("classType");
    } else {
      params.set("classType", nextClassType);
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
        classType: classTypeFilter,
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
  }, [classTypeFilter, districtFilter, page, statusFilter, subjectFilter]);

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
    setApplicantsLoading(true);
    setApplicantsError(null);

    try {
      const [response, applicantsData] = await Promise.all([
        getAdminClassById(classId),
        listAdminClassApplicants(classId),
      ]);
      setDetail(response);
      setApplicants(applicantsData);
    } catch (err) {
      setDetailError(
        err instanceof Error ? err.message : "Không thể tải chi tiết lớp học.",
      );
      setDetail(null);
      setApplicants([]);
      setApplicantsError(
        err instanceof Error
          ? err.message
          : "Không thể tải danh sách ứng viên.",
      );
    } finally {
      setDetailLoading(false);
      setApplicantsLoading(false);
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

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailOpen(false);
  }, []);

  const handleCloseCloseModal = useCallback(() => {
    if (closeLoading) {
      return;
    }
    setIsCloseOpen(false);
  }, [closeLoading]);

  useEffect(() => {
    if (!isFormOpen && !isCloseOpen && !isDetailOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseForm();
        handleCloseCloseModal();
        handleCloseDetailModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleCloseCloseModal,
    handleCloseDetailModal,
    handleCloseForm,
    isCloseOpen,
    isDetailOpen,
    isFormOpen,
  ]);

  useEffect(() => {
    if (!isFormOpen || formState.classType !== "LOP_TRUNG_TAM") {
      return;
    }
    void loadCenterTeachers();
  }, [formState.classType, isFormOpen, loadCenterTeachers]);


  const handleSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formLoading) {
      return;
    }

    const title = formState.title.trim();
    const subject = formState.subject.trim();
    const grade = formState.grade.trim();
    const district =
      formState.classType === "LOP_TRUNG_TAM"
        ? formState.centerDistricts.join(", ")
        : formState.district.trim();
    const feeValue = Number(formState.feePerHour);
    const classType = formState.classType;
    const centerTeacherId = formState.centerTeacherId;
    const derivedTutorType: AdminTutorType | null = (() => {
      if (classType === "LOP_GIA_SU_TU_DO") return "GIA_SU_TU_DO";
      if (classType === "LOP_GIA_SU_DAO_TAO") return "GIA_SU_DAO_TAO";
      if (classType === "LOP_TRUNG_TAM") return "GIAO_VIEN_TRUNG_TAM";
      return null;
    })();

    if (!title) {
      showToast("error", "Vui lòng nhập tiêu đề lớp.");
      return;
    }

    if (!Number.isFinite(feeValue) || feeValue <= 0) {
      showToast("error", "Học phí/buổi không hợp lệ.");
      return;
    }

    if (!classType) {
      showToast("error", "Vui lòng chọn loại lớp.");
      return;
    }

    if (!derivedTutorType) {
      showToast("error", "Vui lòng chọn loại lớp.");
      return;
    }

    if (classType === "LOP_TRUNG_TAM" && !centerTeacherId) {
      showToast("error", "Vui lòng chọn giáo viên trung tâm.");
      return;
    }

    if (classType === "LOP_TRUNG_TAM" && formMode === "create") {
      if (!formState.members.length) {
        showToast("error", "Vui lòng tạo ít nhất 1 học viên.");
        return;
      }

      const invalidMember = formState.members.some((member) => {
        const studentName = member.studentName.trim();
        const parentName = member.parentName.trim();
        const parentPhone = member.parentPhone.trim();
        return !studentName || !parentName || !parentPhone;
      });

      if (invalidMember) {
        showToast("error", "Vui lòng nhập đầy đủ tên học viên, phụ huynh và SĐT.");
        return;
      }
    }

    if (formMode === "create") {
      if (!subject || !grade || !district) {
        showToast("error", "Vui lòng nhập đầy đủ môn, lớp và khu vực.");
        return;
      }
    }

    setFormLoading(true);

    try {
      let createdId = "";
      if (formMode === "create") {
        const result = await createAdminClass({
          title,
          subject,
          grade,
          district,
          feePerHour: Math.round(feeValue),
          schedule:
            formState.scheduleDays.length > 0
              ? formState.scheduleDays.join(", ")
              : undefined,
          classType,
          tutorType: derivedTutorType,
          centerTeacherId: classType === "LOP_TRUNG_TAM" ? centerTeacherId : null,
          members:
            classType === "LOP_TRUNG_TAM"
              ? formState.members.map((member) => ({
                  studentName: member.studentName.trim(),
                  studentGrade: member.studentGrade?.trim() || undefined,
                  parentName: member.parentName.trim(),
                  parentPhone: member.parentPhone.trim(),
                  parentEmail: member.parentEmail?.trim() || undefined,
                  address: member.address?.trim() || undefined,
                }))
              : undefined,
        });
        createdId = result.id;
        showToast("success", "Đã tạo lớp học mới.");
      } else if (detail) {
        const payload: {
          title?: string;
          feePerHour?: number;
          schedule?: string;
          classType?: AdminClassType;
          tutorType?: AdminTutorType;
          centerTeacherId?: string | null;
        } = {
          title,
          feePerHour: Math.round(feeValue),
          classType,
          tutorType: derivedTutorType,
          centerTeacherId: classType === "LOP_TRUNG_TAM" ? centerTeacherId : null,
        };
        payload.schedule =
          formState.scheduleDays.length > 0
            ? formState.scheduleDays.join(", ")
            : undefined;

        const updated = await updateAdminClass(detail.id, payload);
        setDetail(updated);
        showToast("success", "Đã cập nhật lớp học.");
      }

      setIsFormOpen(false);
      await Promise.all([loadClasses(), loadStats()]);

      if (createdId) {
        setSelectedClassId(createdId);
      } else if (detail) {
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
            <span className="tutors-select-label">Loại lớp</span>
            <select
              className="tutors-select"
              onChange={(event) =>
                updateQuery({ classType: event.target.value, page: 1 })
              }
              value={classTypeQuery}
            >
              <option value="all">Tất cả loại</option>
              <option value="LOP_GIA_SU_TU_DO">Gia sư tự do</option>
              <option value="LOP_GIA_SU_DAO_TAO">Gia sư đào tạo</option>
              <option value="LOP_TRUNG_TAM">Trung tâm</option>
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

      <section className="audit-grid audit-grid-full">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tiêu đề</th>
                <th>Môn - Lớp</th>
                <th>Khu vực</th>
                <th>Học phí</th>
                <th>Loại lớp</th>
                <th>Ứng viên</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
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

                  return (
                    <tr
                      key={record.id}
                      onClick={() => {
                        setSelectedClassId(record.id);
                        setIsDetailOpen(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedClassId(record.id);
                          setIsDetailOpen(true);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      style={{ cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(59,130,246,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "";
                      }}
                    >
                      <td style={{ fontWeight: 700 }}>
                        {formatClassCode(record.id)}
                      </td>
                      <td style={{ fontWeight: 700 }}>{record.title}</td>
                      <td>
                        {record.subject} - {record.grade}
                      </td>
                      <td>{record.district}</td>
                      <td>{formatCurrency(record.feePerHour, record.classType)}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "0.15rem 0.6rem",
                            borderRadius: "999px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            ...getClassTypeBadgeStyle(record.classType),
                          }}
                        >
                          {CLASS_TYPE_LABELS[record.classType]}
                        </span>
                      </td>
                      <td>{record._count.applications}</td>
                      <td>{formatDate(record.createdAt)}</td>
                      <td>
                        <AdminStatusBadge
                          label={metaInfo.label}
                          tone={metaInfo.tone}
                          dotColor={metaInfo.dotColor}
                        />
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
                  Loại lớp
                  <select
                    onChange={(event) => {
                      const nextType = event.target.value as
                        | ""
                        | AdminClassType;
                      setFormState((prev) => {
                        const isCenter = nextType === "LOP_TRUNG_TAM";
                        const nextTutorType = isCenter
                          ? "GIAO_VIEN_TRUNG_TAM"
                          : nextType === "LOP_GIA_SU_TU_DO"
                            ? "GIA_SU_TU_DO"
                            : nextType === "LOP_GIA_SU_DAO_TAO"
                              ? "GIA_SU_DAO_TAO"
                              : "";

                        return {
                          ...prev,
                          classType: nextType,
                          tutorType: nextTutorType,
                          centerTeacherId: isCenter
                            ? prev.centerTeacherId
                            : "",
                        };
                      });
                    }}
                    value={formState.classType}
                  >
                    <option value="">Chọn loại lớp</option>
                    <option value="LOP_GIA_SU_TU_DO">Gia sư tự do</option>
                    <option value="LOP_GIA_SU_DAO_TAO">Gia sư đào tạo</option>
                    <option value="LOP_TRUNG_TAM">Trung tâm</option>
                  </select>
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
                  {formState.classType === "LOP_TRUNG_TAM" ? (
                    <div
                      style={{
                        display: "grid",
                        gap: "0.5rem",
                        marginTop: "0.35rem",
                      }}
                    >
                      {CENTER_DISTRICT_OPTIONS.map((item) => {
                        const checked = formState.centerDistricts.includes(item);
                        return (
                          <label key={item} style={{ display: "flex", gap: "0.45rem" }}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(event) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  centerDistricts: event.target.checked
                                    ? [...prev.centerDistricts, item]
                                    : prev.centerDistricts.filter(
                                        (value) => value !== item,
                                      ),
                                }))
                              }
                            />
                            {item}
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <select
                      disabled={formMode === "edit"}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          district: event.target.value,
                        }))
                      }
                      value={formState.district}
                    >
                      <option value="">Chọn quận</option>
                      {DISTRICT_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  )}
                </label>

                <label className="admin-dialog-field">
                  {formState.classType === "LOP_TRUNG_TAM"
                    ? "Học phí/tháng"
                    : "Học phí/buổi"}
                  <input
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        feePerHour: event.target.value.replace(/\D/g, ""),
                      }))
                    }
                    inputMode="numeric"
                    type="text"
                    value={formState.feePerHour}
                  />
                  {formState.feePerHour ? (
                    <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                      {formatVndInput(formState.feePerHour)} VND
                    </span>
                  ) : null}
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
                      const selectedDays = Array.isArray(formState.scheduleDays)
                        ? formState.scheduleDays
                        : [];
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
                            onChange={(event) => {
                              if (event.target.checked) {
                                setFormState((prev) => {
                                  const prevDays = Array.isArray(
                                    prev.scheduleDays,
                                  )
                                    ? prev.scheduleDays
                                    : [];
                                  return {
                                    ...prev,
                                    scheduleDays: [...prevDays, day],
                                  };
                                });
                              } else {
                                setFormState((prev) => {
                                  const prevDays = Array.isArray(
                                    prev.scheduleDays,
                                  )
                                    ? prev.scheduleDays
                                    : [];
                                  return {
                                    ...prev,
                                    scheduleDays: prevDays.filter(
                                      (item) => item !== day,
                                    ),
                                  };
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

                {formState.classType === "LOP_TRUNG_TAM" ? (
                  <label className="admin-dialog-field admin-dialog-field-full">
                    Giáo viên trung tâm
                    <select
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          centerTeacherId: event.target.value,
                        }))
                      }
                      value={formState.centerTeacherId}
                    >
                      <option value="">Chọn giáo viên trung tâm</option>
                      {centerTeachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.fullName} ({teacher.email})
                        </option>
                      ))}
                    </select>
                    {centerTeachersLoading ? (
                      <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                        Đang tải danh sách giáo viên...
                      </span>
                    ) : null}
                    {centerTeachersError ? (
                      <span style={{ fontSize: "0.8rem", color: "#ba1a1a" }}>
                        {centerTeachersError}
                      </span>
                    ) : null}
                  </label>
                ) : null}

                {formMode === "create" && formState.classType === "LOP_TRUNG_TAM" ? (
                  <div className="admin-dialog-field admin-dialog-field-full">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, fontWeight: 700 }}>Danh sách học viên</p>
                        <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>
                          Thêm học viên trước khi tạo lớp trung tâm.
                        </p>
                      </div>
                      <button
                        className="admin-btn tonal"
                        type="button"
                        onClick={() =>
                          setFormState((prev) => ({
                            ...prev,
                            members: [...prev.members, createEmptyMember()],
                          }))
                        }
                      >
                        + Thêm học viên
                      </button>
                    </div>

                    {formState.members.length === 0 ? (
                      <div className="admin-panel soft" style={{ padding: "0.9rem" }}>
                        <p style={{ margin: 0, color: "#64748b" }}>
                          Chưa có học viên. Vui lòng thêm ít nhất 1 học viên.
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: "grid", gap: "0.75rem" }}>
                        {formState.members.map((member, index) => (
                          <div
                            key={`member-${index}`}
                            className="admin-panel soft"
                            style={{ padding: "1rem" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "0.75rem",
                              }}
                            >
                              <p style={{ margin: 0, fontWeight: 700 }}>
                                Hoc vien {index + 1}
                              </p>
                              <button
                                className="admin-btn ghost"
                                type="button"
                                onClick={() =>
                                  setFormState((prev) => ({
                                    ...prev,
                                    members: prev.members.filter((_, idx) => idx !== index),
                                  }))
                                }
                              >
                                Xoa
                              </button>
                            </div>

                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                                gap: "0.75rem",
                              }}
                            >
                              <label className="admin-dialog-field">
                                Ten hoc vien
                                <input
                                  type="text"
                                  value={member.studentName}
                                  onChange={(event) =>
                                    setFormState((prev) => ({
                                      ...prev,
                                      members: prev.members.map((item, idx) =>
                                        idx === index
                                          ? { ...item, studentName: event.target.value }
                                          : item,
                                      ),
                                    }))
                                  }
                                />
                              </label>
                              <label className="admin-dialog-field">
                                Lop hoc
                                <input
                                  type="text"
                                  value={member.studentGrade ?? ""}
                                  onChange={(event) =>
                                    setFormState((prev) => ({
                                      ...prev,
                                      members: prev.members.map((item, idx) =>
                                        idx === index
                                          ? { ...item, studentGrade: event.target.value }
                                          : item,
                                      ),
                                    }))
                                  }
                                />
                              </label>
                              <label className="admin-dialog-field">
                                Ten phu huynh
                                <input
                                  type="text"
                                  value={member.parentName}
                                  onChange={(event) =>
                                    setFormState((prev) => ({
                                      ...prev,
                                      members: prev.members.map((item, idx) =>
                                        idx === index
                                          ? { ...item, parentName: event.target.value }
                                          : item,
                                      ),
                                    }))
                                  }
                                />
                              </label>
                              <label className="admin-dialog-field">
                                So dien thoai
                                <input
                                  type="text"
                                  value={member.parentPhone}
                                  onChange={(event) =>
                                    setFormState((prev) => ({
                                      ...prev,
                                      members: prev.members.map((item, idx) =>
                                        idx === index
                                          ? { ...item, parentPhone: event.target.value }
                                          : item,
                                      ),
                                    }))
                                  }
                                />
                              </label>
                              <label className="admin-dialog-field">
                                Email phu huynh (tuy chon)
                                <input
                                  type="email"
                                  value={member.parentEmail ?? ""}
                                  onChange={(event) =>
                                    setFormState((prev) => ({
                                      ...prev,
                                      members: prev.members.map((item, idx) =>
                                        idx === index
                                          ? { ...item, parentEmail: event.target.value }
                                          : item,
                                      ),
                                    }))
                                  }
                                />
                              </label>
                              <label className="admin-dialog-field">
                                Dia chi (tuy chon)
                                <input
                                  type="text"
                                  value={member.address ?? ""}
                                  onChange={(event) =>
                                    setFormState((prev) => ({
                                      ...prev,
                                      members: prev.members.map((item, idx) =>
                                        idx === index
                                          ? { ...item, address: event.target.value }
                                          : item,
                                      ),
                                    }))
                                  }
                                />
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
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


      {isDetailOpen ? (
        <div className="admin-dialog-backdrop" role="dialog" aria-modal>
          <div className="admin-dialog" style={{ maxWidth: "72rem" }}>
            <div className="admin-dialog-header">
              <div>
                <p className="admin-dialog-eyebrow">Chi tiết lớp học</p>
                <h3 className="admin-dialog-title">
                  {detail ? formatClassCode(detail.id) : "Đang tải..."}
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
              {detail?.classType === "LOP_TRUNG_TAM" ? (
                <div style={{ marginBottom: "1rem" }}>
                  <button
                    className="admin-btn tonal"
                    type="button"
                    onClick={() => router.push(`/classes/${detail.id}/sessions`)}
                  >
                    <AdminIcon name="calendar_month" />
                    Xem danh sách buổi học
                  </button>
                </div>
              ) : null}
              {selectedMeta ? (
                <div style={{ marginBottom: "1rem" }}>
                  <AdminStatusBadge
                    label={selectedMeta.label}
                    tone={selectedMeta.tone}
                    dotColor={selectedMeta.dotColor}
                  />
                </div>
              ) : null}

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
                        <p className="payments-info-label">Loại lớp</p>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "0.2rem 0.75rem",
                            borderRadius: "999px",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            ...getClassTypeBadgeStyle(detail.classType),
                          }}
                        >
                          {CLASS_TYPE_LABELS[detail.classType]}
                        </span>
                      </div>
                      <div>
                        <p className="payments-info-label">Học phí</p>
                        <p className="payments-info-value">
                          {formatCurrency(detail.feePerHour, detail.classType)}
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
                      Ung vien
                    </p>
                    {applicantsLoading ? (
                      <p style={{ margin: 0, color: "#64748b" }}>
                        Dang tai ung vien...
                      </p>
                    ) : applicantsError ? (
                      <p style={{ margin: 0, color: "#ba1a1a" }}>
                        {applicantsError}
                      </p>
                    ) : applicants.length === 0 ? (
                      <p style={{ margin: 0, color: "#64748b" }}>
                        Chua co ung vien.
                      </p>
                    ) : (
                      <div className="pairing-user-list">
                        {applicants.map((item) => (
                          <div className="pairing-user-item" key={item.id}>
                            <div className="pairing-user-left">
                              <div className="pairing-user-avatar">
                                {getInitials(item.tutor.fullName)}
                              </div>
                              <div>
                                <p className="pairing-user-name">
                                  {item.tutor.fullName}
                                </p>
                                <p className="pairing-user-sub">
                                  {item.tutor.email}
                                </p>
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <p className="pairing-user-name">
                                {item.tutor.subjects.join(", ") || "-"}
                              </p>
                              <p className="pairing-user-sub">
                                {item.tutor.districts.join(", ") || "-"}
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

                  <div
                    className="payments-action-stack"
                    style={{ marginTop: "0.5rem" }}
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
                </div>
              ) : (
                <p style={{ marginTop: "1rem", color: "#64748b" }}>
                  Chọn một lớp để xem chi tiết.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
