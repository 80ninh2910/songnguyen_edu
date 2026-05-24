"use client";

import { useEffect, useMemo, useState } from "react";

import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { auditPayload, auditRecords } from "@/features/admin/mockData";

export default function AuditLogsPage() {
  type AuditRecord = (typeof auditRecords)[number];
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(
    auditRecords[0] ?? null,
  );
  const [actorFilter, setActorFilter] = useState("all-actors");
  const [actionFilter, setActionFilter] = useState("all-actions");
  const [targetFilter, setTargetFilter] = useState("all-targets");
  const [rangeFilter, setRangeFilter] = useState("today");
  const actorLabelMap: Record<string, string> = {
    "Admin User": "Quản trị viên",
    "Support Agent": "Nhân sự hỗ trợ",
    System: "Hệ thống",
  };

  const actionLabelMap: Record<string, string> = {
    PAYMENT_CONFIRMED: "Xác nhận thanh toán",
    TUTOR_APPROVED: "Duyệt hồ sơ gia sư",
    REQUEST_REJECTED: "Từ chối yêu cầu",
    SYNC_WEBHOOK_RETRY: "Đồng bộ lại dữ liệu",
  };

  const targetLabelMap: Record<string, string> = {
    "payment:LH-2041": "Thanh toán lớp LH-2041",
    "tutor:TUT-2041": "Hồ sơ gia sư TUT-2041",
    "request:REQ-981": "Yêu cầu REQ-981",
    "integration:payment_gateway": "Cổng thanh toán",
  };

  const statusLabelMap: Record<string, string> = {
    SUCCESS: "Thành công",
    WARN: "Cảnh báo",
    INFO: "Thông tin",
  };

  const parseRecordDate = (time: string) => {
    const [datePart, timePart] = time.split(" ");
    if (!datePart || !timePart) {
      return new Date();
    }
    return new Date(`${datePart}T${timePart}:00`);
  };

  const latestRecordDate = useMemo(() => {
    if (auditRecords.length === 0) {
      return new Date();
    }
    return auditRecords.reduce((latest, record) => {
      const recordDate = parseRecordDate(record.time);
      return recordDate > latest ? recordDate : latest;
    }, parseRecordDate(auditRecords[0].time));
  }, []);

  const filteredRecords = useMemo(() => {
    const rangeDays =
      rangeFilter === "7days" ? 7 : rangeFilter === "30days" ? 30 : 0;

    return auditRecords.filter((record) => {
      if (actorFilter === "admin-user" && record.actor !== "Admin User") {
        return false;
      }
      if (actorFilter === "support-agent" && record.actor !== "Support Agent") {
        return false;
      }
      if (actorFilter === "system" && record.actor !== "System") {
        return false;
      }

      if (
        actionFilter === "payment-confirmed" &&
        record.action !== "PAYMENT_CONFIRMED"
      ) {
        return false;
      }
      if (
        actionFilter === "tutor-approved" &&
        record.action !== "TUTOR_APPROVED"
      ) {
        return false;
      }
      if (
        actionFilter === "request-rejected" &&
        record.action !== "REQUEST_REJECTED"
      ) {
        return false;
      }
      if (
        actionFilter === "sync-webhook-retry" &&
        record.action !== "SYNC_WEBHOOK_RETRY"
      ) {
        return false;
      }

      if (
        targetFilter === "payments" &&
        !record.target.startsWith("payment:")
      ) {
        return false;
      }
      if (targetFilter === "tutors" && !record.target.startsWith("tutor:")) {
        return false;
      }
      if (
        targetFilter === "requests" &&
        !record.target.startsWith("request:")
      ) {
        return false;
      }
      if (
        targetFilter === "integrations" &&
        !record.target.startsWith("integration:")
      ) {
        return false;
      }

      if (rangeFilter === "today") {
        return (
          parseRecordDate(record.time).toDateString() ===
          latestRecordDate.toDateString()
        );
      }

      if (rangeDays > 0) {
        const diffMs =
          latestRecordDate.getTime() - parseRecordDate(record.time).getTime();
        return diffMs >= 0 && diffMs <= rangeDays * 24 * 60 * 60 * 1000;
      }

      return true;
    });
  }, [actionFilter, actorFilter, rangeFilter, targetFilter, latestRecordDate]);

  useEffect(() => {
    if (filteredRecords.length === 0) {
      setSelectedRecord(null);
      return;
    }
    const hasSelection = filteredRecords.some(
      (record) =>
        selectedRecord?.time === record.time &&
        selectedRecord?.action === record.action,
    );
    if (!hasSelection) {
      setSelectedRecord(filteredRecords[0]);
    }
  }, [filteredRecords, selectedRecord]);

  const handleDownload = () => {
    if (filteredRecords.length === 0) {
      return;
    }
    const headers = [
      "Thời gian",
      "Người thao tác",
      "Hành động",
      "Đối tượng",
      "Trạng thái",
    ];
    const csvRows = filteredRecords.map((record) => [
      record.time,
      actorLabelMap[record.actor] ?? record.actor,
      actionLabelMap[record.action] ?? record.action,
      targetLabelMap[record.target] ?? record.target,
      statusLabelMap[record.status] ?? record.status,
    ]);
    const toCsvValue = (value: string) => {
      const escaped = value.replace(/"/g, '""');
      return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
    };
    const csvContent = [headers, ...csvRows]
      .map((row) => row.map(toCsvValue).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "audit-logs.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setActorFilter("all-actors");
    setActionFilter("all-actions");
    setTargetFilter("all-targets");
    setRangeFilter("today");
    setSelectedRecord(auditRecords[0] ?? null);
  };

  const activeRecord = selectedRecord ?? filteredRecords[0] ?? null;
  const selectedTarget = activeRecord?.target.split(":") ?? [];
  const selectedTargetType = selectedTarget[0] ?? auditPayload.targetType;
  const selectedTargetId = selectedTarget[1] ?? auditPayload.targetId;
  const detailPayload = activeRecord
    ? {
        ...auditPayload,
        action: activeRecord.action,
        targetType: selectedTargetType,
        targetId: selectedTargetId,
      }
    : auditPayload;

  const detailSummary = activeRecord
    ? [
        { label: "Mã sự kiện", value: detailPayload.id },
        {
          label: "Hành động",
          value: actionLabelMap[activeRecord.action] ?? activeRecord.action,
        },
        {
          label: "Đối tượng",
          value: targetLabelMap[activeRecord.target] ?? detailPayload.targetId,
        },
        { label: "Thời gian", value: activeRecord.time },
        {
          label: "Người thao tác",
          value: actorLabelMap[activeRecord.actor] ?? activeRecord.actor,
        },
        { label: "Mã người thao tác", value: detailPayload.actorId },
        { label: "Vai trò", value: detailPayload.actorRole },
        { label: "IP", value: detailPayload.ip },
        { label: "User agent", value: detailPayload.userAgent },
      ]
    : [];

  const beforeState = [
    { label: "Trạng thái", value: detailPayload.before.status },
    {
      label: "Duyệt bởi",
      value: detailPayload.before.reviewedBy ?? "-",
    },
  ];

  const afterState = [
    { label: "Trạng thái", value: detailPayload.after.status },
    {
      label: "Duyệt bởi",
      value: detailPayload.after.reviewedBy ?? "-",
    },
    {
      label: "Thời gian duyệt",
      value: detailPayload.after.reviewedAt ?? "-",
    },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nhật ký hệ thống</h1>
        </div>

        <div className="admin-page-actions">
          <button
            className="admin-btn ghost"
            type="button"
            onClick={handleDownload}
            disabled={filteredRecords.length === 0}
          >
            <AdminIcon name="download" />
            Tải dữ liệu
          </button>
          <button
            className="admin-btn tonal"
            type="button"
            onClick={handleRefresh}
          >
            <AdminIcon name="autorenew" />
            Tự làm mới
          </button>
        </div>
      </header>

      <section className="admin-panel">
        <div className="audit-filter-row">
          <label>
            <span className="tutors-select-label">Người thao tác</span>
            <select
              className="tutors-select"
              value={actorFilter}
              onChange={(event) => setActorFilter(event.target.value)}
            >
              <option value="all-actors">Tất cả người thao tác</option>
              <option value="admin-user">Quản trị viên</option>
              <option value="support-agent">Nhân sự hỗ trợ</option>
              <option value="system">Hệ thống</option>
            </select>
          </label>

          <label>
            <span className="tutors-select-label">Hành động</span>
            <select
              className="tutors-select"
              value={actionFilter}
              onChange={(event) => setActionFilter(event.target.value)}
            >
              <option value="all-actions">Tất cả hành động</option>
              <option value="payment-confirmed">Xác nhận thanh toán</option>
              <option value="tutor-approved">Duyệt hồ sơ gia sư</option>
              <option value="request-rejected">Từ chối yêu cầu</option>
              <option value="sync-webhook-retry">Đồng bộ lại dữ liệu</option>
            </select>
          </label>

          <label>
            <span className="tutors-select-label">Đối tượng</span>
            <select
              className="tutors-select"
              value={targetFilter}
              onChange={(event) => setTargetFilter(event.target.value)}
            >
              <option value="all-targets">Tất cả đối tượng</option>
              <option value="payments">Thanh toán</option>
              <option value="tutors">Gia sư</option>
              <option value="requests">Yêu cầu</option>
              <option value="integrations">Tích hợp hệ thống</option>
            </select>
          </label>

          <label>
            <span className="tutors-select-label">Khoảng thời gian</span>
            <select
              className="tutors-select"
              value={rangeFilter}
              onChange={(event) => setRangeFilter(event.target.value)}
            >
              <option value="today">Hôm nay</option>
              <option value="7days">7 ngày gần nhất</option>
              <option value="30days">30 ngày gần nhất</option>
            </select>
          </label>
        </div>
      </section>

      <section className="audit-grid">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Người thao tác</th>
                <th>Hành động</th>
                <th>Đối tượng</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => {
                const isSelected =
                  record.time === selectedRecord?.time &&
                  record.action === selectedRecord?.action;

                return (
                  <tr
                    key={`${record.time}-${record.action}`}
                    className={`audit-row${isSelected ? " is-selected" : ""}`}
                    onClick={() => setSelectedRecord(record)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedRecord(record);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <td>{record.time}</td>
                    <td>{actorLabelMap[record.actor] ?? record.actor}</td>
                    <td style={{ fontWeight: 700 }}>
                      {actionLabelMap[record.action] ?? record.action}
                    </td>
                    <td>{targetLabelMap[record.target] ?? record.target}</td>
                    <td>
                      <AdminStatusBadge
                        label={statusLabelMap[record.status] ?? record.status}
                        tone={
                          record.status === "SUCCESS"
                            ? "approved"
                            : record.status === "WARN"
                              ? "pending"
                              : "processing"
                        }
                      />
                    </td>
                  </tr>
                );
              })}
              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    Không có dữ liệu phù hợp bộ lọc.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <aside className="admin-panel">
          <h3 className="admin-panel-title" style={{ margin: 0 }}>
            Dữ liệu chi tiết
          </h3>
          <p className="admin-panel-subtitle">
            Sự kiện đang chọn:{" "}
            <strong>
              {activeRecord
                ? (actionLabelMap[activeRecord.action] ?? activeRecord.action)
                : "Chưa có dữ liệu"}
            </strong>
          </p>

          {activeRecord ? (
            <div className="audit-detail">
              <div className="audit-detail-grid">
                {detailSummary.map((item) => (
                  <div className="audit-detail-card" key={item.label}>
                    <span className="audit-detail-label">{item.label}</span>
                    <span className="audit-detail-value">
                      {item.value || "-"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="audit-detail-compare">
                <div className="audit-detail-section">
                  <p className="audit-detail-section-title">
                    Trước khi cập nhật
                  </p>
                  <div className="audit-detail-list">
                    {beforeState.map((item) => (
                      <div className="audit-detail-item" key={item.label}>
                        <span className="audit-detail-item-label">
                          {item.label}
                        </span>
                        <span className="audit-detail-item-value">
                          {item.value || "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="audit-detail-section">
                  <p className="audit-detail-section-title">Sau khi cập nhật</p>
                  <div className="audit-detail-list">
                    {afterState.map((item) => (
                      <div className="audit-detail-item" key={item.label}>
                        <span className="audit-detail-item-label">
                          {item.label}
                        </span>
                        <span className="audit-detail-item-value">
                          {item.value || "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="admin-panel-subtitle">Chưa có dữ liệu để hiển thị.</p>
          )}
        </aside>
      </section>
    </div>
  );
}
