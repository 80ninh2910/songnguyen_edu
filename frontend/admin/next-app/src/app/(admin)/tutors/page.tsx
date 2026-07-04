"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminIcon, type AdminIconName } from "@/components/admin/AdminIcon";
import {
  createAdminCenterTeacher,
  listAdminCenterTeachers,
  listAdminTutors,
  type AdminCenterTeacherSummary,
  type AdminCenterTeacherStatus,
  type AdminTutorStatus,
  type AdminTutorType,
  type AdminTutorSummary,
} from "@/lib/adminApi";

const PAGE_SIZE = 10;
const EXPORT_PAGE_SIZE = 100;

const STAT_CARDS: Array<{
  label: string;
  key: "approved" | "pending";
  icon: AdminIconName;
}> = [
  { label: "Đang hoạt động", key: "approved", icon: "person_check" },
  { label: "Chờ duyệt hồ sơ", key: "pending", icon: "pending_actions" },
];

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

const CENTER_TEACHER_STATUS_META: Record<
  AdminCenterTeacherStatus,
  { label: string; tone: "approved" | "rejected"; dotColor: string }
> = {
  ACTIVE: { label: "ĐANG HOẠT ĐỘNG", tone: "approved", dotColor: "#059669" },
  INACTIVE: { label: "TẠM DỪNG", tone: "rejected", dotColor: "#ba1a1a" },
};

const TUTOR_TYPE_LABELS: Record<AdminTutorType, string> = {
  GIA_SU_TU_DO: "Gia sư tự do",
  GIA_SU_DAO_TAO: "Gia sư đào tạo",
  GIAO_VIEN_TRUNG_TAM: "Giáo viên trung tâm",
  ANY: "Không giới hạn",
};

const CENTER_TEACHER_DISTRICTS = ["Quận 12", "Quận Gò Vấp"];

type CenterTeacherFormState = {
  fullName: string;
  email: string;
  phone: string;
  subjects: string;
  districts: string[];
  status: AdminCenterTeacherStatus;
};

const emptyCenterTeacherForm: CenterTeacherFormState = {
  fullName: "",
  email: "",
  phone: "",
  subjects: "",
  districts: [],
  status: "ACTIVE",
};

function getTutorTypeBadgeStyle(type: AdminTutorType): React.CSSProperties {
  switch (type) {
    case "GIA_SU_TU_DO":
      return {
        background: "rgba(37, 99, 235, 0.12)",
        color: "#1d4ed8",
        border: "1px solid rgba(37, 99, 235, 0.28)",
      };
    case "GIA_SU_DAO_TAO":
      return {
        background: "rgba(245, 158, 11, 0.16)",
        color: "#b45309",
        border: "1px solid rgba(245, 158, 11, 0.35)",
      };
    case "GIAO_VIEN_TRUNG_TAM":
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("");
}

function formatDate(value: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
}

function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function buildTutorCsv(rows: AdminTutorSummary[]): string {
  const header = [
    "Họ tên",
    "Email",
    "Điện thoại",
    "Loại gia sư",
    "Trạng thái",
    "Môn dạy",
    "Khu vực",
    "Ngày tạo",
    "Ngày duyệt",
  ];

  const lines = rows.map((row) => {
    const statusLabel = STATUS_META[row.status].label;
    return [
      escapeCsv(row.fullName),
      escapeCsv(row.email),
      escapeCsv(row.phone ?? ""),
      escapeCsv(
        row.tutorType ? TUTOR_TYPE_LABELS[row.tutorType] : "-",
      ),
      escapeCsv(statusLabel),
      escapeCsv(row.subjects.join(", ")),
      escapeCsv(row.districts.join(", ")),
      escapeCsv(formatDate(row.createdAt)),
      escapeCsv(formatDate(row.approvedAt)),
    ].join(",");
  });

  return [header.join(","), ...lines].join("\n");
}

function parseCsv(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function TutorsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") ?? "all";
  const page = Number(searchParams.get("page") ?? "1");

  const [tutorTypeFilter, setTutorTypeFilter] = useState("all");

  const [records, setRecords] = useState<AdminTutorSummary[]>([]);
  const [centerTeachers, setCenterTeachers] = useState<AdminCenterTeacherSummary[]>([]);
  const [centerTeachersLoading, setCenterTeachersLoading] = useState(false);
  const [centerTeachersError, setCenterTeachersError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ approved: 0, pending: 0 });
  const [isCreateTeacherOpen, setIsCreateTeacherOpen] = useState(false);
  const [createTeacherLoading, setCreateTeacherLoading] = useState(false);
  const [createTeacherError, setCreateTeacherError] = useState<string | null>(null);
  const [createTeacherForm, setCreateTeacherForm] = useState<CenterTeacherFormState>(
    emptyCenterTeacherForm,
  );

  const queryFilters = useMemo(
    () => ({
      status: status === "all" ? undefined : (status as AdminTutorStatus),
      sort: undefined,
    }),
    [status],
  );

  useEffect(() => {
    let isMounted = true;

    const loadTutors = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await listAdminTutors({
          page: Number.isFinite(page) && page > 0 ? page : 1,
          limit: PAGE_SIZE,
          ...queryFilters,
        });

        if (isMounted) {
          setRecords(response.data);
          setMeta(response.meta);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Không thể tải danh sách gia sư.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadTutors();

    return () => {
      isMounted = false;
    };
  }, [page, queryFilters]);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const [approved, pending] = await Promise.all([
          listAdminTutors({ page: 1, limit: 1, status: "APPROVED" }),
          listAdminTutors({ page: 1, limit: 1, status: "PENDING" }),
        ]);

        if (isMounted) {
          setStats({
            approved: approved.meta.total,
            pending: pending.meta.total,
          });
        }
      } catch {
        if (isMounted) {
          setStats({ approved: 0, pending: 0 });
        }
      }
    };

    void loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCenterTeachers = async () => {
      setCenterTeachersLoading(true);
      setCenterTeachersError(null);

      try {
        const response = await listAdminCenterTeachers({ page: 1, limit: 50 });
        if (isMounted) {
          setCenterTeachers(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setCenterTeachersError(
            err instanceof Error
              ? err.message
              : "Không thể tải danh sách giáo viên trung tâm.",
          );
          setCenterTeachers([]);
        }
      } finally {
        if (isMounted) {
          setCenterTeachersLoading(false);
        }
      }
    };

    void loadCenterTeachers();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const sortedRecords = useMemo(() => {
    const rows = records.filter((record) => {
      if (tutorTypeFilter === "all") return true;
      return record.tutorType === tutorTypeFilter;
    });
    return rows;
  }, [records, tutorTypeFilter]);

  const updateQuery = (next: {
    status?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextStatus = next.status ?? status;
    const nextPage = next.page ?? page;

    if (nextStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", nextStatus);
    }

    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleExport = async () => {
    setExporting(true);
    setError(null);

    try {
      let currentPage = 1;
      const allRows: AdminTutorSummary[] = [];

      while (true) {
        const response = await listAdminTutors({
          page: currentPage,
          limit: EXPORT_PAGE_SIZE,
          ...queryFilters,
        });

        allRows.push(...response.data);

        if (currentPage >= response.meta.totalPages) {
          break;
        }

        currentPage += 1;
      }

      const csv = buildTutorCsv(allRows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const dateStamp = new Date().toISOString().slice(0, 10);
      link.href = URL.createObjectURL(blob);
      link.download = `bao-cao-gia-su-${dateStamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể xuất báo cáo gia sư.",
      );
    } finally {
      setExporting(false);
    }
  };

  const handleOpenCreateTeacher = () => {
    setCreateTeacherError(null);
    setCreateTeacherForm({ ...emptyCenterTeacherForm });
    setIsCreateTeacherOpen(true);
  };

  const handleCloseCreateTeacher = () => {
    if (createTeacherLoading) return;
    setIsCreateTeacherOpen(false);
  };

  const handleSubmitCreateTeacher = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (createTeacherLoading) return;

    const fullName = createTeacherForm.fullName.trim();
    const email = createTeacherForm.email.trim();
    const phone = createTeacherForm.phone.trim();
    const subjects = parseCsv(createTeacherForm.subjects);
    const districts = createTeacherForm.districts;

    if (!fullName || !email) {
      setCreateTeacherError("Vui lòng nhập họ tên và email.");
      return;
    }

    if (subjects.length === 0 || districts.length === 0) {
      setCreateTeacherError("Vui lòng nhập môn dạy và khu vực.");
      return;
    }

    setCreateTeacherLoading(true);
    setCreateTeacherError(null);

    try {
      await createAdminCenterTeacher({
        fullName,
        email,
        phone: phone || undefined,
        subjects,
        districts,
        status: createTeacherForm.status,
      });
      setIsCreateTeacherOpen(false);
    } catch (err) {
      setCreateTeacherError(
        err instanceof Error ? err.message : "Không thể tạo giáo viên trung tâm.",
      );
    } finally {
      setCreateTeacherLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý Gia sư</h1>
          <p className="admin-page-subtitle">
            Quản lý và theo dõi thông tin chi tiết của tất cả cộng tác viên gia
            sư.
          </p>
        </div>

        <div className="admin-page-actions">
          <button
            className="admin-btn ghost"
            disabled={exporting}
            onClick={handleExport}
            type="button"
          >
            <AdminIcon name="download" />
            {exporting ? "Đang xuất..." : "Xuất báo cáo"}
          </button>
          <button
            className="admin-btn tonal"
            onClick={handleOpenCreateTeacher}
            type="button"
          >
            <AdminIcon name="add" />
            Tạo giáo viên trung tâm
          </button>
          <button
            className="admin-btn primary"
            onClick={() => router.push("/tutors/new")}
            type="button"
          >
            <AdminIcon name="add" />
            Thêm gia sư mới
          </button>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: 0, color: "#ba1a1a" }}>{error}</p>
        </div>
      ) : null}

      <section className="tutors-top-grid">
        <div className="tutors-stats-grid">
          {STAT_CARDS.map((item) => (
            <article className="tutors-stat-card" key={item.label}>
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "0.7rem",
                  background: "rgba(73, 94, 138, 0.12)",
                  color: "#495e8a",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <AdminIcon name={item.icon as AdminIconName} />
              </div>

              <p className="tutors-stat-value">
                {item.key === "approved" ? stats.approved : stats.pending}
              </p>
              <p className="tutors-stat-label">{item.label}</p>
            </article>
          ))}
        </div>

        <div className="tutors-filter-card">
          <div className="tutors-select-grid">
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
                <option value="APPROVED">Đang hoạt động</option>
                <option value="PENDING">Chờ duyệt hồ sơ</option>
                <option value="REJECTED">Đã từ chối</option>
              </select>
            </label>


            <label>
              <span className="tutors-select-label">Loại gia sư</span>
              <select
                className="tutors-select"
                onChange={(event) => setTutorTypeFilter(event.target.value)}
                value={tutorTypeFilter}
              >
                <option value="all">Tất cả loại</option>
                <option value="GIA_SU_TU_DO">Gia sư tự do</option>
                <option value="GIA_SU_DAO_TAO">Gia sư đào tạo</option>
                <option value="GIAO_VIEN_TRUNG_TAM">Giáo viên trung tâm</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Họ tên và thư điện tử</th>
              <th>Loại gia sư</th>
              <th>Môn dạy</th>
              <th>Khu vực</th>
              <th>Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : null}

            {!loading && records.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Không có gia sư phù hợp.
                </td>
              </tr>
            ) : null}

            {sortedRecords.map((record) => (
              <tr
                key={record.id}
                onClick={() => router.push(`/tutors/${record.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/tutors/${record.id}`);
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
                <td>
                  <div className="table-user">
                    <div className="table-user-avatar">
                      {getInitials(record.fullName)}
                    </div>
                    <div>
                      <p className="table-user-name">{record.fullName}</p>
                      <p className="table-user-email">{record.email}</p>
                    </div>
                  </div>
                </td>

                <td>
                  {record.tutorType ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0.15rem 0.6rem",
                        borderRadius: "999px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        ...getTutorTypeBadgeStyle(record.tutorType),
                      }}
                    >
                      {TUTOR_TYPE_LABELS[record.tutorType]}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  <div className="subject-chip-list">
                    {record.subjects.map((subjectName) => (
                      <span className="subject-chip" key={subjectName}>
                        {subjectName}
                      </span>
                    ))}
                  </div>
                </td>

                <td>{record.districts.join(", ")}</td>
                <td>
                  <AdminStatusBadge
                    label={STATUS_META[record.status].label}
                    tone={STATUS_META[record.status].tone}
                    dotColor={STATUS_META[record.status].dotColor}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          Hiển thị {rangeStart} - {rangeEnd} trong tổng số {meta.total} gia sư
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

      <section className="admin-panel" style={{ marginTop: "2rem" }}>
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
              Danh sách giáo viên trung tâm
            </p>
          </div>
          <button
            className="admin-btn tonal"
            onClick={() => {
              setCenterTeachersLoading(true);
              setCenterTeachersError(null);
              void listAdminCenterTeachers({ page: 1, limit: 50 })
                .then((response) => setCenterTeachers(response.data))
                .catch((err) =>
                  setCenterTeachersError(
                    err instanceof Error
                      ? err.message
                      : "Không thể tải danh sách giáo viên trung tâm.",
                  ),
                )
                .finally(() => setCenterTeachersLoading(false));
            }}
            type="button"
          >
            <AdminIcon name="autorenew" />
            Làm mới
          </button>
        </div>

        {centerTeachersError ? (
          <p style={{ marginBottom: "1rem", color: "#ba1a1a" }}>
            {centerTeachersError}
          </p>
        ) : null}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Môn dạy</th>
                <th>Khu vực</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {centerTeachersLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "1.5rem" }}>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : centerTeachers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "1.5rem" }}>
                    Chưa có giáo viên trung tâm.
                  </td>
                </tr>
              ) : (
                centerTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td style={{ fontWeight: 600 }}>{teacher.fullName}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.phone ?? "-"}</td>
                    <td>
                      <div className="subject-chip-list">
                        {teacher.subjects.map((subjectName) => (
                          <span className="subject-chip" key={subjectName}>
                            {subjectName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{teacher.districts.join(", ")}</td>
                    <td>
                      <AdminStatusBadge
                        label={CENTER_TEACHER_STATUS_META[teacher.status].label}
                        tone={CENTER_TEACHER_STATUS_META[teacher.status].tone}
                        dotColor={CENTER_TEACHER_STATUS_META[teacher.status].dotColor}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isCreateTeacherOpen ? (
        <div className="admin-dialog-backdrop" role="dialog" aria-modal>
          <div className="admin-dialog">
            <div className="admin-dialog-header">
              <div>
                <p className="admin-dialog-eyebrow">Tạo giáo viên trung tâm</p>
                <h3 className="admin-dialog-title">Thông tin giáo viên</h3>
              </div>
              <button
                className="admin-dialog-close"
                onClick={handleCloseCreateTeacher}
                type="button"
              >
                <AdminIcon name="cancel" />
              </button>
            </div>
            <form className="admin-dialog-body" onSubmit={handleSubmitCreateTeacher}>
              <div className="admin-dialog-grid">
                <label className="admin-dialog-field">
                  Họ tên
                  <input
                    type="text"
                    value={createTeacherForm.fullName}
                    onChange={(event) =>
                      setCreateTeacherForm((prev) => ({
                        ...prev,
                        fullName: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="admin-dialog-field">
                  Email
                  <input
                    type="email"
                    value={createTeacherForm.email}
                    onChange={(event) =>
                      setCreateTeacherForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="admin-dialog-field">
                  Số điện thoại
                  <input
                    type="text"
                    value={createTeacherForm.phone}
                    onChange={(event) =>
                      setCreateTeacherForm((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="admin-dialog-field">
                  Trạng thái
                  <select
                    value={createTeacherForm.status}
                    onChange={(event) =>
                      setCreateTeacherForm((prev) => ({
                        ...prev,
                        status: event.target.value as AdminCenterTeacherStatus,
                      }))
                    }
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Tạm dừng</option>
                  </select>
                </label>
                <label className="admin-dialog-field admin-dialog-field-full">
                  Môn dạy (phân cách bằng dấu phẩy)
                  <input
                    type="text"
                    value={createTeacherForm.subjects}
                    onChange={(event) =>
                      setCreateTeacherForm((prev) => ({
                        ...prev,
                        subjects: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="admin-dialog-field admin-dialog-field-full">
                  Khu vực
                  <div
                    style={{
                      display: "grid",
                      gap: "0.5rem",
                      marginTop: "0.35rem",
                    }}
                  >
                    {CENTER_TEACHER_DISTRICTS.map((item) => {
                      const checked = createTeacherForm.districts.includes(item);
                      return (
                        <label key={item} style={{ display: "flex", gap: "0.45rem" }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(event) =>
                              setCreateTeacherForm((prev) => ({
                                ...prev,
                                districts: event.target.checked
                                  ? [...prev.districts, item]
                                  : prev.districts.filter((value) => value !== item),
                              }))
                            }
                          />
                          {item}
                        </label>
                      );
                    })}
                  </div>
                </label>
                {createTeacherError ? (
                  <p style={{ margin: 0, color: "#ba1a1a" }}>{createTeacherError}</p>
                ) : null}
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>
                  Mật khẩu mặc định: 123456. Tài khoản bắt buộc đổi mật khẩu ở lần đăng nhập đầu.
                </p>
              </div>
              <div className="admin-dialog-actions">
                <button
                  className="admin-btn ghost"
                  onClick={handleCloseCreateTeacher}
                  type="button"
                >
                  Hủy
                </button>
                <button className="admin-btn primary" type="submit">
                  {createTeacherLoading ? "Đang tạo..." : "Tạo giáo viên"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
