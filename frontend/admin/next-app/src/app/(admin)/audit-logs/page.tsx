"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import {
  type AdminAuditLog,
  fetchAdminAuditLogs,
} from "@/lib/adminApi";

// ─── label maps ────────────────────────────────────────────────────────────────
const ACTION_LABELS: Record<string, string> = {
  CREATE_TUTOR: "Tạo gia sư",
  UPDATE_TUTOR: "Cập nhật gia sư",
  APPROVE_TUTOR: "Duyệt gia sư",
  REJECT_TUTOR: "Từ chối gia sư",
  CREATE_CENTER_TEACHER: "Tạo giáo viên TT",
  UPDATE_CENTER_TEACHER: "Cập nhật giáo viên TT",
  CREATE_CLASS: "Tạo lớp học",
  UPDATE_CLASS: "Cập nhật lớp học",
  CLOSE_CLASS: "Đóng lớp học",
  ASSIGN_CLASS: "Phân lớp cho gia sư",
  REJECT_APPLICANT: "Từ chối ứng viên",
  CONVERT_REQUEST: "Chuyển yêu cầu → lớp",
  REJECT_REQUEST: "Từ chối yêu cầu",
  CREATE_SESSION: "Tạo buổi học",
  CONFIRM_PAYMENT: "Xác nhận thanh toán",
  REJECT_PAYMENT: "Từ chối thanh toán",
  RESET_TUTOR_PASSWORD: "Đặt lại mật khẩu gia sư",
};

const TARGET_LABELS: Record<string, string> = {
  TUTOR: "Gia sư",
  CENTER_TEACHER: "Giáo viên TT",
  CLASS: "Lớp học",
  CLASS_REQUEST: "Yêu cầu mở lớp",
  SESSION: "Buổi học",
  PAYMENT: "Thanh toán",
};

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s trước`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h trước`;
  return `${Math.floor(h / 24)}d trước`;
}

function getActionTone(action: string): "approved" | "rejected" | "pending" | "processing" {
  if (action.startsWith("APPROVE") || action.startsWith("CONFIRM") || action.startsWith("CREATE")) return "approved";
  if (action.startsWith("REJECT")) return "rejected";
  if (action.startsWith("UPDATE") || action.startsWith("ASSIGN") || action.startsWith("CONVERT")) return "processing";
  return "pending";
}

// ─── payload viewer ────────────────────────────────────────────────────────────

const FIELD_LABELS: Record<string, string> = {
  email: "Email",
  fullName: "Họ tên",
  role: "Quyền hạn",
  phone: "Số điện thoại",
  status: "Trạng thái",
  subjects: "Môn học",
  districts: "Khu vực",
  title: "Tên lớp",
  subject: "Môn học",
  grade: "Khối lớp",
  district: "Khu vực",
  feePerHour: "Học phí/giờ",
  schedule: "Lịch học",
  classType: "Loại lớp",
  tutorType: "Loại gia sư",
  classId: "Mã lớp học",
  tutorId: "Mã gia sư",
  requestId: "Mã yêu cầu",
  note: "Ghi chú",
  amount: "Số tiền",
  migratedMembers: "Học viên chuyển",
  requestType: "Loại yêu cầu",
  adminIds: "Tài khoản admin",
  tutorIds: "Gia sư",
  centerTeacherIds: "Giáo viên trung tâm",
  before: "Trước",
  after: "Sau",
};

const VALUE_LABELS: Record<string, string> = {
  // roles
  ADMIN: "Quản trị viên",
  SUPERADMIN: "Quản trị tối cao",
  // class type
  LOP_GIA_SU_TU_DO: "Lớp gia sư tự do",
  LOP_GIA_SU_DAO_TAO: "Lớp gia sư đào tạo",
  LOP_TRUNG_TAM: "Lớp trung tâm",
  // tutor type
  GIA_SU_TU_DO: "Gia sư tự do",
  GIA_SU_DAO_TAO: "Gia sư đào tạo",
  GIAO_VIEN_TRUNG_TAM: "Giáo viên trung tâm",
  // request type
  TRUNG_TAM: "Từ trung tâm",
  // status
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  OPEN: "Đang mở",
  ASSIGNED: "Đã phân",
  CLOSED: "Đã đóng",
  CONVERTED: "Đã chuyển",
  ACTIVE: "Hoạt động",
  INACTIVE: "Không hoạt động",
};

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "boolean") return val ? "Có" : "Không";
  if (typeof val === "number") {
    // likely money if > 1000
    if (val >= 1000) return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
    return String(val);
  }
  if (typeof val === "string") {
    if (VALUE_LABELS[val]) return VALUE_LABELS[val];
    // UUID — shorten
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(val)) return `${val.slice(0, 8)}…`;
    return val;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return "(trống)";
    // array of UUIDs → show count
    if (typeof val[0] === "string" && /^[0-9a-f]{8}-/i.test(val[0]))
      return `${val.length} mục`;
    return val.map((v) => (typeof v === "string" ? VALUE_LABELS[v] ?? v : String(v))).join(", ");
  }
  return JSON.stringify(val);
}

// Render a simple key-value row
function KVRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="apl-row">
      <span className="apl-key">{label}</span>
      <span className="apl-val">{value}</span>
    </div>
  );
}

// Before → After diff block
function DiffBlock({ before, after }: { before: Record<string, unknown>; after: Record<string, unknown> }) {
  const allKeys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));
  const changed = allKeys.filter((k) => JSON.stringify(before[k]) !== JSON.stringify(after[k]));

  if (changed.length === 0) {
    return <p className="apl-empty">Không có thay đổi nào được ghi nhận.</p>;
  }

  return (
    <div className="apl-diff">
      {changed.map((key) => (
        <div key={key} className="apl-diff-row">
          <span className="apl-key">{FIELD_LABELS[key] ?? key}</span>
          <div className="apl-diff-values">
            <span className="apl-diff-before">
              <span className="apl-diff-label">Cũ</span>
              {formatValue(before[key])}
            </span>
            <span className="apl-diff-arrow">→</span>
            <span className="apl-diff-after">
              <span className="apl-diff-label">Mới</span>
              {formatValue(after[key])}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PayloadViewer({ payload, action }: { payload: unknown; action?: string }) {
  if (!payload || typeof payload !== "object") {
    return <p className="apl-empty">Không có dữ liệu thay đổi.</p>;
  }

  const data = payload as Record<string, unknown>;

  // UPDATE action with before/after → diff view
  if (
    data.before && data.after &&
    typeof data.before === "object" && typeof data.after === "object"
  ) {
    return (
      <div className="apl-wrap">
        <div className="apl-summary-chip">
          <span>📝</span>
          <span>Các trường đã thay đổi được hiển thị bên dưới</span>
        </div>
        <DiffBlock
          before={data.before as Record<string, unknown>}
          after={data.after as Record<string, unknown>}
        />
      </div>
    );
  }

  // SEED_INITIALIZED → friendly summary
  if (action === "SEED_INITIALIZED") {
    return (
      <div className="apl-wrap">
        <div className="apl-summary-chip">
          <span>🌱</span>
          <span>Hệ thống được khởi tạo dữ liệu mẫu</span>
        </div>
        {Object.entries(data).map(([key, val]) => (
          <KVRow key={key} label={FIELD_LABELS[key] ?? key} value={formatValue(val)} />
        ))}
      </div>
    );
  }

  // General: render key-value in Vietnamese
  const entries = Object.entries(data).filter(([key]) => key !== "before" && key !== "after");

  if (entries.length === 0) {
    return <p className="apl-empty">Không có thông tin bổ sung.</p>;
  }

  // Try to build a summary sentence
  const summaryParts: string[] = [];
  if (data.email) summaryParts.push(`Email: ${data.email}`);
  if (data.fullName) summaryParts.push(`Họ tên: ${data.fullName}`);
  if (data.role) summaryParts.push(`Quyền: ${formatValue(data.role)}`);
  if (data.status) summaryParts.push(`Trạng thái: ${formatValue(data.status)}`);
  if (data.amount) summaryParts.push(`Số tiền: ${formatValue(data.amount)}`);

  return (
    <div className="apl-wrap">
      {summaryParts.length > 0 && (
        <div className="apl-summary-chip">
          <span>ℹ️</span>
          <span>{summaryParts.join(" • ")}</span>
        </div>
      )}
      {entries.map(([key, val]) => (
        <KVRow key={key} label={FIELD_LABELS[key] ?? key} value={formatValue(val)} />
      ))}
    </div>
  );
}


// ─── main ──────────────────────────────────────────────────────────────────────
const REFRESH_INTERVAL = 30_000; // 30s
const PAGE_SIZE = 20;

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [targetTypeFilter, setTargetTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminAuditLog | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const prevIdsRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async (pg: number, silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const result = await fetchAdminAuditLogs({
        page: pg,
        limit: PAGE_SIZE,
        action: actionFilter || undefined,
        targetType: targetTypeFilter || undefined,
      });

      // detect new entries
      if (silent) {
        const fresh = new Set<string>();
        result.data.forEach((log) => {
          if (!prevIdsRef.current.has(log.id)) fresh.add(log.id);
        });
        if (fresh.size > 0) setNewIds(fresh);
        setTimeout(() => setNewIds(new Set()), 3000);
      }

      prevIdsRef.current = new Set(result.data.map((l) => l.id));
      setLogs(result.data);
      setMeta({ page: result.meta.page, totalPages: result.meta.totalPages, total: result.meta.total });
      setLastUpdated(new Date());

      if (!selected && result.data.length > 0) {
        setSelected(result.data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }, [actionFilter, targetTypeFilter, selected]);

  // initial + filter change
  useEffect(() => {
    setPage(1);
    setSelected(null);
    void load(1, false);
  }, [actionFilter, targetTypeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // page change
  useEffect(() => {
    void load(page, false);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  // auto-refresh
  useEffect(() => {
    timerRef.current = setInterval(() => {
      void load(page, true);
      setCountdown(REFRESH_INTERVAL / 1000);
    }, REFRESH_INTERVAL);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL / 1000 : prev - 1));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [page, load]);

  const handleManualRefresh = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(REFRESH_INTERVAL / 1000);
    void load(page, false);

    timerRef.current = setInterval(() => {
      void load(page, true);
      setCountdown(REFRESH_INTERVAL / 1000);
    }, REFRESH_INTERVAL);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL / 1000 : prev - 1));
    }, 1000);
  };

  const handleDownload = () => {
    if (logs.length === 0) return;
    const headers = ["Thời gian", "Người thao tác", "Hành động", "Loại đối tượng", "ID đối tượng"];
    const rows = logs.map((l) => [
      formatTime(l.createdAt),
      l.actorName,
      ACTION_LABELS[l.action] ?? l.action,
      TARGET_LABELS[l.targetType] ?? l.targetType,
      l.targetId,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "audit-logs.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-page">
      {/* ── header ── */}
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nhật ký hệ thống</h1>
          <p className="admin-page-subtitle">
            {meta.total} bản ghi •{" "}
            {lastUpdated
              ? `Cập nhật lúc ${lastUpdated.toLocaleTimeString("vi-VN")}`
              : "Đang tải..."}
          </p>
        </div>

        <div className="admin-page-actions">
          <div className="audit-countdown" title="Tự động làm mới">
            <span className="audit-countdown-ring">
              <svg viewBox="0 0 36 36" className="audit-countdown-svg">
                <circle cx="18" cy="18" r="15" className="audit-countdown-bg" />
                <circle
                  cx="18" cy="18" r="15"
                  className="audit-countdown-arc"
                  strokeDasharray={`${(countdown / (REFRESH_INTERVAL / 1000)) * 94.2} 94.2`}
                  strokeDashoffset="23.55"
                />
              </svg>
              <span className="audit-countdown-num">{countdown}</span>
            </span>
          </div>

          <button className="admin-btn ghost" type="button" onClick={handleDownload} disabled={logs.length === 0}>
            <AdminIcon name="download" />Xuất CSV
          </button>

          <button className="admin-btn tonal" type="button" onClick={handleManualRefresh}>
            <AdminIcon name="autorenew" />Làm mới
          </button>
        </div>
      </header>

      {/* ── filters ── */}
      <section className="admin-panel">
        <div className="audit-filter-row">
          <label>
            <span className="tutors-select-label">Hành động</span>
            <select className="tutors-select" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
              <option value="">Tất cả hành động</option>
              {Object.entries(ACTION_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="tutors-select-label">Loại đối tượng</span>
            <select className="tutors-select" value={targetTypeFilter} onChange={(e) => setTargetTypeFilter(e.target.value)}>
              <option value="">Tất cả đối tượng</option>
              {Object.entries(TARGET_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </label>

          {(actionFilter || targetTypeFilter) && (
            <button
              className="admin-btn ghost"
              type="button"
              style={{ alignSelf: "flex-end" }}
              onClick={() => { setActionFilter(""); setTargetTypeFilter(""); }}
            >
              Xoá bộ lọc
            </button>
          )}
        </div>
      </section>

      {/* ── body ── */}
      <div className={`audit-shell${selected ? " has-detail" : ""}`}>
        {/* LIST COLUMN */}
        <section className="audit-list-col">
          <div className="admin-table-wrap">
            {error && (
              <div className="audit-error-banner">
                <AdminIcon name="warning" />
                <span>{error}</span>
                <button type="button" onClick={() => void load(page, false)}>Thử lại</button>
              </div>
            )}

            {loading && !error ? (
              <div className="audit-loading">
                <div className="audit-spinner" />
                <span>Đang tải nhật ký...</span>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Người thao tác</th>
                    <th>Hành động</th>
                    <th>Đối tượng</th>
                    <th>ID đối tượng</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                        Không có bản ghi nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => {
                      const isSelected = selected?.id === log.id;
                      const isNew = newIds.has(log.id);
                      return (
                        <tr
                          key={log.id}
                          className={`audit-row${isSelected ? " is-selected" : ""}${isNew ? " is-new" : ""}`}
                          onClick={() => setSelected(log)}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(log); } }}
                          role="button"
                          tabIndex={0}
                        >
                          <td className="audit-td-time">
                            <span className="audit-time-main">{formatTime(log.createdAt)}</span>
                            <span className="audit-time-ago">{timeAgo(log.createdAt)}</span>
                          </td>
                          <td>
                            <span className="audit-actor">{log.actorName}</span>
                          </td>
                          <td>
                            <AdminStatusBadge
                              label={ACTION_LABELS[log.action] ?? log.action}
                              tone={getActionTone(log.action)}
                            />
                          </td>
                          <td>{TARGET_LABELS[log.targetType] ?? log.targetType}</td>
                          <td className="audit-td-id">
                            <code className="audit-code">{log.targetId.slice(0, 8)}…</code>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}

            {/* pagination */}
            {meta.totalPages > 1 && (
              <div className="audit-pagination">
                <button
                  className="admin-btn ghost"
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <AdminIcon name="chevron_left" />
                </button>
                <span className="audit-page-info">
                  Trang {meta.page} / {meta.totalPages}
                </span>
                <button
                  className="admin-btn ghost"
                  type="button"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <AdminIcon name="chevron_right" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* DETAIL PANEL — full height */}
        {selected && (
          <aside className="audit-detail-panel">
            {/* sticky header */}
            <div className="audit-dp-head">
              <div>
                <h3 className="audit-dp-title">Chi tiết sự kiện</h3>
                <span className="audit-time-ago" style={{ marginTop: 2 }}>
                  {timeAgo(selected.createdAt)}
                </span>
              </div>
              <button
                className="admin-icon-btn"
                type="button"
                title="Đóng"
                onClick={() => setSelected(null)}
              >
                <AdminIcon name="close" />
              </button>
            </div>

            {/* scrollable body */}
            <div className="audit-dp-body">
              {/* action badge */}
              <div className="audit-dp-section">
                <AdminStatusBadge
                  label={ACTION_LABELS[selected.action] ?? selected.action}
                  tone={getActionTone(selected.action)}
                />
              </div>

              {/* info grid */}
              <div className="audit-detail-grid">
                {[
                  { label: "Mã sự kiện", value: selected.id, mono: true },
                  { label: "Người thao tác", value: selected.actorName },
                  { label: "Actor ID", value: selected.actorId, mono: true },
                  { label: "Thời gian", value: formatTime(selected.createdAt) },
                  { label: "Hành động", value: selected.action, mono: true },
                  { label: "Loại đối tượng", value: TARGET_LABELS[selected.targetType] ?? selected.targetType },
                  { label: "ID đối tượng", value: selected.targetId, mono: true },
                ].map((item) => (
                  <div className="audit-detail-card" key={item.label}>
                    <span className="audit-detail-label">{item.label}</span>
                    <span
                      className="audit-detail-value"
                      style={{
                        wordBreak: "break-all",
                        fontSize: item.mono ? "0.76rem" : "0.88rem",
                        fontFamily: item.mono ? "monospace" : "inherit",
                        fontWeight: item.mono ? 400 : 600,
                      }}
                    >
                      {item.value || "—"}
                    </span>
                  </div>
                ))}
              </div>

              {/* payload */}
              <div className="audit-dp-section" style={{ marginTop: "1rem" }}>
                <p className="audit-detail-section-title">Thông tin thay đổi</p>
                <div className="audit-payload-box">
                  <PayloadViewer payload={selected.payload} action={selected.action} />
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      <style>{`
        .audit-shell {
          display: flex;
          gap: 0;
          align-items: flex-start;
          position: relative;
        }
        .audit-list-col {
          flex: 1;
          min-width: 0;
          transition: all 0.25s ease;
        }
        /* Full-height detail panel */
        .audit-detail-panel {
          position: sticky;
          top: calc(var(--admin-header-height) + 2rem);
          width: 0;
          overflow: hidden;
          opacity: 0;
          transition: width 0.25s ease, opacity 0.2s ease;
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 1rem;
          box-shadow: var(--ambient-shadow);
          border: 1px solid rgba(194,198,214,0.4);
          /* fill remaining viewport height below sticky top */
          height: calc(100vh - var(--admin-header-height) - 4rem);
          padding: 0;
        }
        .has-detail .audit-detail-panel {
          width: 380px;
          min-width: 380px;
          max-width: 380px;
          opacity: 1;
          margin-left: 1.25rem;
        }
        /* sticky panel head */
        .audit-dp-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1.25rem 1.25rem 1rem;
          border-bottom: 1px solid rgba(194,198,214,0.4);
          flex-shrink: 0;
        }
        .audit-dp-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 800;
        }
        /* scrollable body */
        .audit-dp-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .audit-dp-body::-webkit-scrollbar { width: 5px; }
        .audit-dp-body::-webkit-scrollbar-thumb {
          background: rgba(15,23,42,0.14);
          border-radius: 999px;
        }
        .audit-dp-section { margin-bottom: 1rem; }
        /* payload box: no max-height limit inside the scrollable panel */
        .audit-dp-body .audit-payload-box {
          max-height: none;
        }
        /* detail info cards */
        .audit-detail-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .audit-detail-card {
          background: var(--surface-container-low);
          border-radius: 0.65rem;
          padding: 0.6rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.18rem;
        }
        .audit-detail-label {
          font-size: 0.68rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.06em;
          color: #64748b;
        }
        .audit-detail-value {
          word-break: break-all;
        }

        /* countdown */
        .audit-countdown {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.78rem; color: var(--admin-text-3);
        }
        .audit-countdown-ring { position: relative; width: 36px; height: 36px; }
        .audit-countdown-svg { width: 36px; height: 36px; transform: rotate(-90deg); }
        .audit-countdown-bg { fill: none; stroke: var(--admin-border); stroke-width: 3; }
        .audit-countdown-arc {
          fill: none; stroke: var(--admin-accent); stroke-width: 3;
          stroke-linecap: round; transition: stroke-dasharray 1s linear;
        }
        .audit-countdown-num {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem; font-weight: 700; color: var(--admin-accent);
        }
        .audit-loading {
          display: flex; flex-direction: column; align-items: center;
          gap: 0.75rem; padding: 3rem; color: var(--admin-text-3);
        }
        .audit-spinner {
          width: 32px; height: 32px; border: 3px solid var(--admin-border);
          border-top-color: var(--admin-accent); border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .audit-error-banner {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.75rem 1rem; margin-bottom: 0.75rem;
          background: #fee2e2; color: #991b1b; border-radius: 8px;
          font-size: 0.85rem;
        }
        .audit-error-banner button {
          margin-left: auto; padding: 0.25rem 0.75rem;
          background: #991b1b; color: #fff; border: none;
          border-radius: 6px; cursor: pointer; font-size: 0.8rem;
        }
        .audit-row { cursor: pointer; transition: background 0.15s; }
        .audit-row.is-selected td { background: rgba(59,130,246,0.07); }
        .audit-row.is-new { animation: flash-new 3s ease-out forwards; }
        @keyframes flash-new {
          0% { background: rgba(59,130,246,0.15); }
          100% { background: transparent; }
        }
        .audit-td-time { min-width: 140px; }
        .audit-time-main { display: block; font-size: 0.8rem; font-weight: 600; }
        .audit-time-ago { display: block; font-size: 0.72rem; color: #64748b; margin-top: 2px; }
        .audit-actor { font-weight: 600; font-size: 0.85rem; }
        .audit-td-id { font-size: 0.8rem; }
        .audit-code {
          font-family: monospace; font-size: 0.76rem;
          background: #f1f5f9; padding: 2px 6px; border-radius: 4px;
        }
        .audit-pagination {
          display: flex; align-items: center; justify-content: center;
          gap: 0.75rem; padding: 1rem;
          border-top: 1px solid rgba(194,198,214,0.4);
        }
        .audit-page-info { font-size: 0.82rem; color: #64748b; }
        .audit-payload-box {
          background: #f8fafc;
          border: 1px solid rgba(194,198,214,0.5);
          border-radius: 8px; padding: 0.75rem;
          overflow-y: auto;
        }
        .audit-payload-grid { display: flex; flex-direction: column; gap: 0.6rem; }
        .audit-payload-row { display: flex; flex-direction: column; gap: 2px; }
        .audit-payload-key {
          font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.05em; color: #64748b;
        }
        .audit-payload-val {
          font-size: 0.8rem; color: #191c1d;
          word-break: break-all; white-space: pre-wrap;
          font-family: monospace;
        }
        .audit-payload-empty { font-size: 0.8rem; color: #64748b; }
        .audit-detail-section-title {
          font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.06em; color: #64748b;
          margin: 0 0 0.6rem;
        }

        /* ── Smart Payload Viewer ── */
        .apl-wrap { display: flex; flex-direction: column; gap: 0.5rem; }
        .apl-empty { font-size: 0.82rem; color: #94a3b8; margin: 0; font-style: italic; }
        .apl-summary-chip {
          display: flex; align-items: flex-start; gap: 0.5rem;
          padding: 0.6rem 0.75rem;
          background: linear-gradient(135deg, #eff6ff, #f0f9ff);
          border: 1px solid #bfdbfe;
          border-radius: 0.6rem;
          font-size: 0.82rem; color: #1e40af; line-height: 1.45;
          margin-bottom: 0.25rem;
        }
        .apl-summary-chip span:first-child { flex-shrink: 0; font-size: 0.9rem; }
        .apl-row {
          display: flex; flex-direction: column; gap: 2px;
          padding: 0.55rem 0.75rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          border-left: 3px solid #e2e8f0;
        }
        .apl-key {
          font-size: 0.66rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.07em;
          color: #64748b;
        }
        .apl-val {
          font-size: 0.86rem; font-weight: 600; color: #0f172a;
          word-break: break-word;
        }
        /* diff block */
        .apl-diff { display: flex; flex-direction: column; gap: 0.6rem; }
        .apl-diff-row {
          display: flex; flex-direction: column; gap: 0.3rem;
          padding: 0.6rem 0.75rem;
          background: #f8fafc; border-radius: 0.5rem;
        }
        .apl-diff-values {
          display: flex; align-items: baseline;
          gap: 0.5rem; flex-wrap: wrap;
        }
        .apl-diff-arrow {
          font-size: 0.9rem; color: #94a3b8; flex-shrink: 0;
        }
        .apl-diff-before, .apl-diff-after {
          display: inline-flex; flex-direction: column;
          padding: 0.25rem 0.6rem;
          border-radius: 0.4rem;
          font-size: 0.83rem; font-weight: 600;
          gap: 1px;
        }
        .apl-diff-before {
          background: #fef2f2; color: #991b1b;
          border: 1px solid #fecaca;
          text-decoration: line-through;
          opacity: 0.85;
        }
        .apl-diff-after {
          background: #f0fdf4; color: #15803d;
          border: 1px solid #bbf7d0;
        }
        .apl-diff-label {
          font-size: 0.6rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.06em;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}
