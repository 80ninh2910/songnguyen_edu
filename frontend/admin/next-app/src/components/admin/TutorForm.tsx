"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import type { AdminTutorCreatePayload } from "@/lib/adminApi";

const EMPTY_VALUES = {
  fullName: "",
  email: "",
  phone: "",
  subjects: "",
  districts: "",
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

  useEffect(() => {
    setValues({
      ...EMPTY_VALUES,
      ...initialValues,
    });
  }, [initialValues]);

  const handleChange =
    (field: keyof TutorFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!values.fullName.trim() || !values.email.trim()) {
      setError("Vui lòng nhập đầy đủ họ tên và email.");
      return;
    }

    const subjects = parseList(values.subjects);
    const districts = parseList(values.districts);

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
    });
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
          <label htmlFor="tutor-subjects">Môn dạy</label>
          <input
            className="settings-input"
            id="tutor-subjects"
            onChange={handleChange("subjects")}
            placeholder="VD: Toán học, Vật lý"
            required
            type="text"
            value={values.subjects}
          />
          <span style={{ color: "#94a3b8", fontSize: "0.72rem" }}>
            Ngăn cách bởi dấu phẩy.
          </span>
        </div>
        <div className="settings-field">
          <label htmlFor="tutor-districts">Khu vực</label>
          <input
            className="settings-input"
            id="tutor-districts"
            onChange={handleChange("districts")}
            placeholder="VD: Hà Nội, TP. Hồ Chí Minh"
            required
            type="text"
            value={values.districts}
          />
          <span style={{ color: "#94a3b8", fontSize: "0.72rem" }}>
            Ngăn cách bởi dấu phẩy.
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
