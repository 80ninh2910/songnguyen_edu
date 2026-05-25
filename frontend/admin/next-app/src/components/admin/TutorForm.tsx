"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import type { AdminTutorCreatePayload } from "@/lib/adminApi";

const EMPTY_VALUES = {
  fullName: "",
  email: "",
  phone: "",
  subject: "Toan",
  level: "Cap 3",
  tutorType: "GIA_SU_TU_DO",
};

type TutorFormValues = typeof EMPTY_VALUES;

type TutorFormProps = {
  initialValues?: Partial<TutorFormValues>;
  submitLabel: string;
  onSubmit: (payload: AdminTutorCreatePayload) => Promise<void> | void;
  onCancel?: () => void;
  disabled?: boolean;
  helperText?: string;
};

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function TutorForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
  disabled,
  helperText,
}: TutorFormProps) {
  const [values, setValues] = useState<TutorFormValues>(EMPTY_VALUES);
  const [error, setError] = useState<string | null>(null);
  const [activeDistricts, setActiveDistricts] = useState<string[]>([]);
  const [showDistricts, setShowDistricts] = useState(false);

  const districtOptions = [
    "Quận 1",
    "Quận 2",
    "Quận 3",
    "Quận 4",
    "Quận 5",
    "Quận 6",
    "Quận 7",
    "Quận 8",
    "Quận 9",
    "Quận 10",
    "Quận 11",
    "Quận 12",
    "TP. Thủ Đức",
    "Bình Thạnh",
    "Gò Vấp",
    "Phú Nhuận",
    "Tân Bình",
    "Tân Phú",
    "Bình Tân",
    "Bình Chánh",
    "Củ Chi",
    "Hóc Môn",
    "Nhà Bè",
    "Cần Giờ",
  ];

  useEffect(() => {
    setValues({
      ...EMPTY_VALUES,
      ...initialValues,
    });
    setActiveDistricts(parseList(initialValues?.districts ?? ""));
  }, [initialValues]);

  const handleChange =
    (field: keyof TutorFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!values.fullName.trim() || !values.email.trim()) {
      setError("Vui lòng nhập đầy đủ họ tên và email.");
      return;
    }

    const subjects = parseList(`${values.subject} ${values.level}`);
    const districts = activeDistricts;

    if (subjects.length === 0 || districts.length === 0) {
      setError("Vui lòng nhập ít nhất một môn dạy và một khu vực.");
      return;
    }

    await onSubmit({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || undefined,
      subjects,
      districts,
      tutorType: values.tutorType,
    });
  };

  const toggleDistrict = (district: string) => {
    setActiveDistricts((prev) =>
      prev.includes(district) ? prev.filter((item) => item !== district) : [...prev, district]
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {error ? (
        <div className="admin-panel" style={{ marginBottom: "0.8rem" }}>
          <p style={{ margin: 0, color: "#ba1a1a" }}>{error}</p>
        </div>
      ) : null}

      {helperText ? (
        <p style={{ margin: "0 0 0.8rem", color: "#64748b" }}>{helperText}</p>
      ) : null}

      <div className="settings-input-grid">
        <div className="settings-field">
          <label htmlFor="tutor-fullName">Họ tên</label>
          <input
            className="settings-input"
            id="tutor-fullName"
            onChange={handleChange("fullName")}
            required
            type="text"
            value={values.fullName}
          />
        </div>
        <div className="settings-field">
          <label htmlFor="tutor-email">Email</label>
          <input
            className="settings-input"
            id="tutor-email"
            onChange={handleChange("email")}
            required
            type="email"
            value={values.email}
          />
        </div>
        <div className="settings-field">
          <label htmlFor="tutor-phone">Số điện thoại</label>
          <input
            className="settings-input"
            id="tutor-phone"
            onChange={handleChange("phone")}
            placeholder="VD: 0901 234 567"
            type="tel"
            value={values.phone}
          />
        </div>
        <div className="settings-field">
          <label htmlFor="tutor-type">Loại gia sư</label>
          <select
            className="settings-input"
            id="tutor-type"
            onChange={handleChange("tutorType")}
            value={values.tutorType}
          >
            <option value="GIA_SU_TU_DO">Gia sư tự do</option>
            <option value="GIA_SU_DAO_TAO">Gia sư đào tạo</option>
          </select>
        </div>
        <div className="settings-field">
          <label htmlFor="tutor-subject">Môn học</label>
          <select
            className="settings-input"
            id="tutor-subject"
            onChange={handleChange("subject")}
            value={values.subject}
          >
            <option value="Toan">Toán</option>
            <option value="Ly">Vật lý</option>
            <option value="Hoa">Hóa</option>
            <option value="Anh">Tiếng Anh</option>
            <option value="Van">Ngữ văn</option>
            <option value="Su">Lịch sử</option>
            <option value="Dia">Địa lý</option>
          </select>
        </div>
        <div className="settings-field">
          <label htmlFor="tutor-level">Cấp học</label>
          <select
            className="settings-input"
            id="tutor-level"
            onChange={handleChange("level")}
            value={values.level}
          >
            <option value="Cap 1">Cấp 1</option>
            <option value="Cap 2">Cấp 2</option>
            <option value="Cap 3">Cấp 3</option>
          </select>
        </div>
        <div className="settings-field">
          <label htmlFor="tutor-districts">Khu vực</label>
          <div className="settings-input" id="tutor-districts" style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowDistricts((prev) => !prev)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                background: "transparent",
                border: 0,
                padding: 0,
                color: activeDistricts.length > 0 ? "#0f172a" : "#94a3b8",
                cursor: "pointer",
              }}
            >
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {activeDistricts.length > 0
                  ? `Đã chọn: ${activeDistricts.join(", ")}`
                  : "Chọn quận TP.HCM"}
              </span>
              <span style={{ fontSize: "0.75rem" }}>▼</span>
            </button>
            {showDistricts ? (
              <div
                style={{
                  position: "absolute",
                  zIndex: 10,
                  left: 0,
                  right: 0,
                  top: "calc(100% + 6px)",
                  maxHeight: "240px",
                  overflowY: "auto",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  padding: "0.5rem",
                  boxShadow: "0 12px 24px rgba(15, 23, 42, 0.12)",
                }}
              >
                {districtOptions.map((district) => (
                  <label
                    key={district}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.35rem 0.5rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={activeDistricts.includes(district)}
                      onChange={() => toggleDistrict(district)}
                    />
                    <span style={{ fontSize: "0.85rem" }}>{district}</span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
          <span style={{ color: "#94a3b8", fontSize: "0.72rem" }}>
            Có thể chọn nhiều quận.
          </span>
        </div>
      </div>

      <div
        className="settings-card-head"
        style={{ justifyContent: "flex-end", marginTop: "1rem" }}
      >
        {onCancel ? (
          <button className="admin-btn tonal" onClick={onCancel} type="button">
            Hủy
          </button>
        ) : null}
        <button className="admin-btn primary" disabled={disabled} type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
