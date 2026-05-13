"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminIcon, type AdminIconName } from "@/components/admin/AdminIcon";
import {
  listAdminTutors,
  type AdminTutorStatus,
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
      escapeCsv(statusLabel),
      escapeCsv(row.subjects.join(", ")),
      escapeCsv(row.districts.join(", ")),
      escapeCsv(formatDate(row.createdAt)),
      escapeCsv(formatDate(row.approvedAt)),
    ].join(",");
  });

  return [header.join(","), ...lines].join("\n");
}

export default function TutorsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") ?? "all";
  const subject = searchParams.get("subject") ?? "all";
  const district = searchParams.get("district") ?? "all";
  const sort = searchParams.get("sort") ?? "newest";
  const page = Number(searchParams.get("page") ?? "1");

  const [records, setRecords] = useState<AdminTutorSummary[]>([]);
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

  const queryFilters = useMemo(
    () => ({
      status: status === "all" ? undefined : (status as AdminTutorStatus),
      subject: subject === "all" ? undefined : subject,
      district: district === "all" ? undefined : district,
      sort: sort === "newest" ? undefined : (sort as "active-most" | "rating"),
    }),
    [status, subject, district, sort],
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

  const updateQuery = (next: {
    status?: string;
    subject?: string;
    district?: string;
    sort?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextStatus = next.status ?? status;
    const nextSubject = next.subject ?? subject;
    const nextDistrict = next.district ?? district;
    const nextSort = next.sort ?? sort;
    const nextPage = next.page ?? page;

    if (nextStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", nextStatus);
    }

    if (nextSubject === "all") {
      params.delete("subject");
    } else {
      params.set("subject", nextSubject);
    }

    if (nextDistrict === "all") {
      params.delete("district");
    } else {
      params.set("district", nextDistrict);
    }

    if (nextSort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", nextSort);
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
              <span className="tutors-select-label">Môn dạy</span>
              <select
                className="tutors-select"
                onChange={(event) =>
                  updateQuery({ subject: event.target.value, page: 1 })
                }
                value={subject}
              >
                <option value="all">Tất cả các môn</option>
                <option value="Toán học">Toán học</option>
                <option value="Vật lý">Vật lý</option>
                <option value="Ngoại ngữ">Ngoại ngữ</option>
              </select>
            </label>

            <label>
              <span className="tutors-select-label">Khu vực</span>
              <select
                className="tutors-select"
                onChange={(event) =>
                  updateQuery({ district: event.target.value, page: 1 })
                }
                value={district}
              >
                <option value="all">Tất cả khu vực</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
              </select>
            </label>

            <label>
              <span className="tutors-select-label">Sắp xếp</span>
              <select
                className="tutors-select"
                onChange={(event) =>
                  updateQuery({ sort: event.target.value, page: 1 })
                }
                value={sort}
              >
                <option value="newest">Mới nhất</option>
                <option value="active-most">Hoạt động nhiều nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
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
              <th>Môn dạy</th>
              <th>Khu vực</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: "right" }}>Thao tác</th>
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

            {records.map((record) => (
              <tr key={record.id}>
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

                <td>
                  <div className="table-action-group">
                    <button
                      aria-label={`Xem chi tiết ${record.fullName}`}
                      className="table-action-btn"
                      onClick={() => router.push(`/tutors/${record.id}`)}
                      type="button"
                    >
                      <AdminIcon name="visibility" />
                    </button>
                    <button
                      aria-label={`Chỉnh sửa ${record.fullName}`}
                      className="table-action-btn"
                      onClick={() =>
                        router.push(`/tutors/${record.id}?mode=edit`)
                      }
                      type="button"
                    >
                      <AdminIcon name="edit" />
                    </button>
                  </div>
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
    </div>
  );
}
