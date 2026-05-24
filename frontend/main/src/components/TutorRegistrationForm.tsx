"use client";

import { Be_Vietnam_Pro } from "next/font/google";
import { useEffect, useRef, useState, type RefObject } from "react";

import { apiRequest } from "@/lib/api";

type TutorTrack = "free" | "trained";

type TutorRegistrationFormProps = {
  onOpenProcessModal?: () => void;
  track?: TutorTrack;
};

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function TutorRegistrationForm({
  onOpenProcessModal,
  track = "free",
}: TutorRegistrationFormProps) {
  const [personalForm, setPersonalForm] = useState({
    fullName: "",
    phone: "",
    role: "",
    email: "",
    gender: "",
    address: "",
    note: "",
  });
  const [tutorForm, setTutorForm] = useState({
    teachingLevel: "",
    subject: "",
    school: "",
    area: "",
  });
  const [activeWeekdays, setActiveWeekdays] = useState<string[]>([]);
  const [activeClasses, setActiveClasses] = useState<string[]>([]);
  const [otherClassStr, setOtherClassStr] = useState("");
  const [showClasses, setShowClasses] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fullNameRef = useRef<HTMLInputElement | null>(null);
  const tutorPhoneRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const genderRef = useRef<HTMLSelectElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const classDropdownRef = useRef<HTMLDivElement | null>(null);
  const otherClassRef = useRef<HTMLInputElement | null>(null);
  const schoolRef = useRef<HTMLInputElement | null>(null);
  const areaRef = useRef<HTMLInputElement | null>(null);
  const tutorWeekdaysRef = useRef<HTMLDivElement | null>(null);

  const classGroups = [
    {
      title: "Tiểu học",
      options: [
        { label: "Tiếng Việt", value: "Tiếng Việt (Cấp 1)" },
        { label: "Toán", value: "Toán (Cấp 1)" },
        { label: "Đạo đức", value: "Đạo đức (Cấp 1)" },
        { label: "Tự nhiên & Xã hội", value: "Tự nhiên & Xã hội (Cấp 1)" },
        { label: "Khoa học", value: "Khoa học (Cấp 1)" },
        { label: "Lịch sử", value: "Lịch sử (Cấp 1)" },
        { label: "Địa lí", value: "Địa lí (Cấp 1)" },
        { label: "Tin học & Công nghệ", value: "Tin học & Công nghệ (Cấp 1)" },
        { label: "Ngoại ngữ (Tiếng Anh)", value: "Ngoại ngữ (Cấp 1)" },
        { label: "Nghệ thuật / Năng khiếu", value: "Nghệ thuật (Cấp 1)" },
      ],
    },
    {
      title: "THCS",
      options: [
        { label: "Ngữ văn", value: "Ngữ văn (Cấp 2)" },
        { label: "Toán", value: "Toán (Cấp 2)" },
        { label: "Ngoại ngữ (Tiếng Anh)", value: "Ngoại ngữ (Cấp 2)" },
        { label: "Giáo dục công dân", value: "Giáo dục công dân (Cấp 2)" },
        { label: "Lịch sử", value: "Lịch sử (Cấp 2)" },
        { label: "Địa lí", value: "Địa lí (Cấp 2)" },
        { label: "Vật lí", value: "Vật lí (Cấp 2)" },
        { label: "Hóa học", value: "Hóa học (Cấp 2)" },
        { label: "Sinh học", value: "Sinh học (Cấp 2)" },
        { label: "Công nghệ", value: "Công nghệ (Cấp 2)" },
        { label: "Tin học", value: "Tin học (Cấp 2)" },
        { label: "Nghệ thuật / Năng khiếu", value: "Nghệ thuật (Cấp 2)" },
      ],
    },
    {
      title: "THPT",
      options: [
        { label: "Ngữ văn", value: "Ngữ văn (Cấp 3)" },
        { label: "Toán", value: "Toán (Cấp 3)" },
        { label: "Ngoại ngữ (Tiếng Anh)", value: "Ngoại ngữ (Cấp 3)" },
        { label: "Vật lí", value: "Vật lí (Cấp 3)" },
        { label: "Hóa học", value: "Hóa học (Cấp 3)" },
        { label: "Sinh học", value: "Sinh học (Cấp 3)" },
        { label: "Lịch sử", value: "Lịch sử (Cấp 3)" },
        { label: "Địa lí", value: "Địa lí (Cấp 3)" },
        { label: "GD kinh tế & pháp luật", value: "GD kinh tế & pháp luật (Cấp 3)" },
        { label: "Tin học", value: "Tin học (Cấp 3)" },
        { label: "Công nghệ", value: "Công nghệ (Cấp 3)" },
        { label: "Nghệ thuật / Năng khiếu", value: "Nghệ thuật (Cấp 3)" },
      ],
    },
    {
      title: "Khác",
      options: [
        { label: "Luyện thi IELTS", value: "Luyện thi IELTS" },
        { label: "Luyện thi TOEIC", value: "Luyện thi TOEIC" },
        { label: "Khác", value: "Khác" },
      ],
    },
  ];

  const toggleClass = (c: string) => {
    setActiveClasses((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const weekDays = [
    { key: "su", label: "Su", full: "Chủ nhật" },
    { key: "mo", label: "Mo", full: "Thứ 2" },
    { key: "tu", label: "Tu", full: "Thứ 3" },
    { key: "we", label: "We", full: "Thứ 4" },
    { key: "th", label: "Th", full: "Thứ 5" },
    { key: "fr", label: "Fr", full: "Thứ 6" },
    { key: "sa", label: "Sa", full: "Thứ 7" },
  ];

  const fixedRole = track === "free" ? "Gia sư tự do" : "Gia sư đào tạo";

  useEffect(() => {
    setPersonalForm((prev) => ({ ...prev, role: fixedRole }));
  }, [fixedRole]);

  const requiredFields = [
    personalForm.fullName,
    personalForm.phone,
    personalForm.role,
    personalForm.email,
    personalForm.gender,
    personalForm.address,
    tutorForm.school,
    tutorForm.area,
  ];

  const completionRate = Math.round(
    ((requiredFields.filter((value) => value.trim().length > 0).length +
      (activeWeekdays.length > 0 ? 1 : 0) +
      (activeClasses.length > 0 ? 1 : 0)) /
      (requiredFields.length + 2)) *
      100
  );

  const inputBaseClass =
    "h-12 w-full rounded-xl border border-[#d5dff1] bg-white/95 px-4 text-[15px] font-medium text-[#243b72] outline-none transition-all duration-300 placeholder:text-[#6b7aa0] focus:border-[#4f86ff] focus:ring-4 focus:ring-[#8ab4ff]/25";
  const errorInputClass = (hasError: boolean) =>
    `${inputBaseClass} ${hasError ? "border-[#e44b4b] focus:border-[#e44b4b] focus:ring-[#f3a1a1]/40" : ""}`;

  const toggleWeekday = (key: string) => {
    setActiveWeekdays((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const focusFirstTutorError = (nextErrors: Record<string, string>) => {
    const focusOrder: Array<keyof typeof nextErrors> = [
      "fullName",
      "phone",
      "email",
      "gender",
      "address",
      "classes",
      "otherClassStr",
      "school",
      "area",
      "weekdays",
    ];
    const refMap: Record<string, RefObject<HTMLElement>> = {
      fullName: fullNameRef as RefObject<HTMLElement>,
      phone: tutorPhoneRef as RefObject<HTMLElement>,
      email: emailRef as RefObject<HTMLElement>,
      gender: genderRef as RefObject<HTMLElement>,
      address: addressRef as RefObject<HTMLElement>,
      classes: classDropdownRef as RefObject<HTMLElement>,
      otherClassStr: otherClassRef as RefObject<HTMLElement>,
      school: schoolRef as RefObject<HTMLElement>,
      area: areaRef as RefObject<HTMLElement>,
      weekdays: tutorWeekdaysRef as RefObject<HTMLElement>,
    };

    const firstKey = focusOrder.find((key) => nextErrors[key]);
    if (!firstKey) return;
    const target = refMap[firstKey]?.current;
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!/^(0|\+84)\d{9,10}$/.test(personalForm.phone.replace(/\s+/g, ""))) {
      nextErrors.phone = "Số điện thoại không hợp lệ.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalForm.email.trim())) {
      nextErrors.email = "Email không hợp lệ.";
    }
    if (!personalForm.fullName.trim()) nextErrors.fullName = "Vui long nhap ho ten.";
    if (!personalForm.role) nextErrors.role = "Vui lòng chọn vai trò hiện tại.";
    if (!personalForm.gender) nextErrors.gender = "Vui lòng chọn giới tính.";
    if (!personalForm.address.trim()) nextErrors.address = "Vui lòng nhập địa chỉ.";
    if (activeClasses.length === 0) nextErrors.classes = "Vui lòng chọn môn/lớp dạy.";
    if (activeClasses.includes("Khác") && !otherClassStr.trim()) {
      nextErrors.otherClassStr = "Vui lòng nhập môn/lớp dạy khác.";
    }
    if (!tutorForm.school.trim()) nextErrors.school = "Vui lòng nhập trường đã/đang học.";
    if (!tutorForm.area.trim()) nextErrors.area = "Vui lòng nhập khu vực dạy.";
    if (activeWeekdays.length === 0) nextErrors.weekdays = "Vui lòng chọn các buổi có thể dạy.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitMessage("Thông tin chưa đầy đủ. Vui lòng kiểm tra các trường bắt buộc.");
      focusFirstTutorError(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    const subjects = activeClasses.includes("Khác")
      ? [...activeClasses.filter((c) => c !== "Khác"), otherClassStr.trim()].filter(Boolean)
      : activeClasses;
    const districts = tutorForm.area
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      const registerResult = await apiRequest<{ tutorId: string; uploadToken: string }>(
        "/public/tutors/register",
        {
          method: "POST",
          body: {
            fullName: personalForm.fullName,
            email: personalForm.email,
            phone: personalForm.phone,
            subjects: subjects.length > 0 ? subjects : undefined,
            districts: districts.length > 0 ? districts : undefined,
          },
        }
      );

      localStorage.setItem("sne_tutor_register", JSON.stringify(registerResult));
      setSubmitMessage("Dang ky thanh cong. Hoc vu se lien he xac minh ho so gia su.");
    } catch (err) {
      setSubmitMessage(err instanceof Error ? err.message : "Dang ky that bai. Vui long thu lai.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full ${beVietnamPro.className}`}>
      <div className="rounded-[26px] border border-[#d5dff3] bg-[#f5f7fb] p-4 shadow-[0_20px_45px_rgba(17,45,112,0.12)] md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black text-[#17367b] md:text-3xl">
              {track === "free" ? "Gia sư tự do đăng ký" : "Gia sư đào tạo đăng ký"}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[#4b5f88] md:text-base">
              {track === "free"
                ? "Phù hợp cho gia sư tự do, sinh viên muốn nhận lớp linh hoạt."
                : "Chương trình đào tạo bài bản, ưu tiên ghép lớp chất lượng."}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenProcessModal}
            className="text-xs font-semibold text-[#21408c] underline decoration-[#6f88c0] underline-offset-4 hover:text-[#17367b]"
          >
            Xem quy trình đăng ký nhận lớp
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-full border border-[#d3dff5] bg-white/80">
          <div
            className="h-2 rounded-full bg-[linear-gradient(90deg,#0d3ea8_0%,#51a5ff_55%,#8fe3ff_100%)] transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-[#2a4b8c] md:text-sm">
          Tiến độ hoàn thiện hồ sơ: {completionRate}%
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="rounded-[22px] border border-white/70 bg-[#eef0f5] p-4">
            <h4 className="text-lg font-bold text-[#1d3979] md:text-xl">Thông tin cá nhân</h4>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                ref={fullNameRef}
                value={personalForm.fullName}
                onChange={(e) => setPersonalForm((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="Họ và tên"
                className={errorInputClass(!!errors.fullName)}
              />
              <input
                ref={tutorPhoneRef}
                value={personalForm.phone}
                onChange={(e) => setPersonalForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Số điện thoại"
                className={errorInputClass(!!errors.phone)}
              />
              <select
                value={fixedRole}
                disabled
                className={`${inputBaseClass} cursor-not-allowed bg-[#eef2ff] text-[#243b72]/80`}
              >
                <option value={fixedRole}>{fixedRole}</option>
              </select>
              <input
                ref={emailRef}
                value={personalForm.email}
                onChange={(e) => setPersonalForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                className={errorInputClass(!!errors.email)}
              />
              <select
                ref={genderRef}
                value={personalForm.gender}
                onChange={(e) => setPersonalForm((prev) => ({ ...prev, gender: e.target.value }))}
                className={errorInputClass(!!errors.gender)}
              >
                <option value="">Giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              <input
                ref={addressRef}
                value={personalForm.address}
                onChange={(e) => setPersonalForm((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Địa chỉ"
                className={errorInputClass(!!errors.address)}
              />

              <input
                value={personalForm.note}
                onChange={(e) => setPersonalForm((prev) => ({ ...prev, note: e.target.value }))}
                placeholder="Ghi chú thêm"
                className={inputBaseClass}
              />
            </div>
            {(errors.phone || errors.email || errors.role || errors.gender || errors.address || errors.fullName) && (
              <p className="mt-3 text-sm font-semibold text-[#cc1f1f]">Vui lòng kiểm tra lại thông tin cá nhân.</p>
            )}
          </div>

          <div className="rounded-[22px] border border-white/70 bg-[#eef0f5] p-4">
            <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <h4 className="text-lg font-bold text-[#1d3979] md:text-xl">Thông tin gia sư</h4>
                <div className="mt-4 space-y-3">
                  <div className="relative">
                    <div
                      ref={classDropdownRef}
                      tabIndex={0}
                      className={`${errorInputClass(!!errors.classes)} flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8ab4ff]/60`}
                      onClick={() => setShowClasses(!showClasses)}
                    >
                      <span
                        className={`truncate pr-2 ${
                          activeClasses.length > 0 ? "text-[#243b72]" : "text-[#6b7aa0]"
                        }`}
                      >
                        {activeClasses.length > 0
                          ? `Đã chọn: ${activeClasses.join(", ")}`
                          : "Môn/Lớp dạy (Toán 1, Anh 2...)"}
                      </span>
                      <span className="text-xs">▼</span>
                    </div>
                    {showClasses && (
                      <div className="absolute z-50 mt-1 w-full max-h-[350px] overflow-y-auto rounded-xl border border-[#d5dff1] bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
                        <div className="flex flex-col gap-5">
                          {classGroups.map((group) => (
                            <div key={group.title}>
                              <div className="mb-2 text-[13px] font-bold text-[#1d3979] border-b border-[#e5edff] pb-1 uppercase tracking-wide">
                                {group.title}
                              </div>
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1 sm:grid-cols-3">
                                {group.options.map((opt) => (
                                  <label
                                    key={opt.value}
                                    className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-[#f3f7ff]"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={activeClasses.includes(opt.value)}
                                      onChange={() => toggleClass(opt.value)}
                                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#b1c3e3] text-[#1b4fb6] focus:ring-[#1b4fb6]"
                                    />
                                    <span className="text-[13px] font-medium leading-tight text-[#243b72]">
                                      {opt.label}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {activeClasses.includes("Khác") && (
                      <div>
                        <input
                          type="text"
                          ref={otherClassRef}
                          value={otherClassStr}
                          onChange={(e) => setOtherClassStr(e.target.value)}
                          placeholder="Nhập môn/lớp dạy khác..."
                          className={`${errorInputClass(!!errors.otherClassStr)} mt-3`}
                        />
                        {errors.otherClassStr && (
                          <p className="mt-1 text-xs text-[#cc1f1f]">{errors.otherClassStr}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <input
                    ref={schoolRef}
                    value={tutorForm.school}
                    onChange={(e) => setTutorForm((prev) => ({ ...prev, school: e.target.value }))}
                    placeholder="Trường đã/đang học"
                    className={errorInputClass(!!errors.school)}
                  />
                  <input
                    ref={areaRef}
                    value={tutorForm.area}
                    onChange={(e) => setTutorForm((prev) => ({ ...prev, area: e.target.value }))}
                    placeholder="Khu vực dạy"
                    className={errorInputClass(!!errors.area)}
                  />
                </div>

                {(errors.classes || errors.school || errors.area) && (
                  <p className="mt-3 text-sm font-semibold text-[#cc1f1f]">
                    Vui lòng điền đầy đủ thông tin gia sư.
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-[#2a4b8c] md:text-base">
                  Các buổi trong tuần có thể dạy
                </p>
                <div
                  ref={tutorWeekdaysRef}
                  tabIndex={-1}
                  className={`mt-3 rounded-2xl border border-white/70 bg-white/75 p-4 focus:outline-none focus:ring-2 focus:ring-[#8ab4ff]/60 ${
                    errors.weekdays ? "border-[#e44b4b]" : ""
                  }`}
                >
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                    {weekDays.map((day) => {
                      const isActive = activeWeekdays.includes(day.key);
                      return (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => toggleWeekday(day.key)}
                          className={`rounded-xl px-2 py-3 text-center text-sm font-bold transition-all duration-300 max-[360px]:text-xs md:text-base ${
                            isActive
                              ? "bg-[#0f3b9c] text-white shadow-[0_10px_20px_rgba(15,59,156,0.28)]"
                              : "bg-[#f3f7ff] text-[#4c6aa8] hover:-translate-y-0.5 hover:bg-[#e8f0ff]"
                          }`}
                          title={day.full}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 rounded-xl border border-[#d7e3f8] bg-[#f6f9ff] px-3 py-2 text-sm font-medium text-[#2a4b8c]">
                    Đã chọn: {activeWeekdays.length} ngày có thể dạy
                  </div>
                  {errors.weekdays && (
                    <p className="mt-2 text-sm font-semibold text-[#cc1f1f]">{errors.weekdays}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[linear-gradient(180deg,#1b4fb6_0%,#0f3b9c_100%)] px-6 py-3 text-center text-lg font-black text-white shadow-[0_16px_34px_rgba(15,59,156,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 md:px-7 md:text-xl lg:text-[22px]"
              >
                {isSubmitting ? "Đang gửi..." : "ĐĂNG KÝ LÀM GIA SƯ NGAY"}
              </button>
            </div>

            {submitMessage && (
              <p
                className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold md:text-base ${
                  Object.keys(errors).length > 0
                    ? "border-[#ffb2b2] bg-[#fff1f1] text-[#b32525]"
                    : "border-[#b6e9c5] bg-[#eafbf0] text-[#1a7b3f]"
                }`}
              >
                {submitMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
