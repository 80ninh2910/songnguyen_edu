"use client";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import Image from "next/image";
import { Be_Vietnam_Pro, Bricolage_Grotesque } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import heroImage from "@/components/assets/image.png";
import logoImage from "@/components/assets/logo.png";
import background19 from "@/components/assets/19.png";
import statsMainImage from "@/components/assets/21.jpg";
import statsSubImage from "@/components/assets/20.jpg";
import tutorImage1 from "@/components/assets/ninh.png";
import tutorImage2 from "@/components/assets/vinh1.jpg";
import tutorImage3 from "@/components/assets/viet.png";
import tutorImage4 from "@/components/assets/thanh.png";
import tutorImage5 from "@/components/assets/ninh.png";
import tutorImage6 from "@/components/assets/vinh1.jpg";
import tutorImage7 from "@/components/assets/viet.png";
import { BackgroundLines } from "@/components/ui/background-lines";
import HeroParallaxDemo from "@/components/hero-parallax-demo";
import DomeGallery from "@/components/DomeGallery";
import TutorRegistrationForm from "@/components/TutorRegistrationForm";
import { apiRequest } from "@/lib/api";
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin", "vietnamese"],
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const heroCampuses = [
  {
    label: "Cơ sở 1",
    address: "Số 3 TA 15, Phường Thới An, TP.HCM",
  },
  {
    label: "Cơ sở 2",
    address: "27/31 Đường số 9, Phường An Hội Đông, TP.HCM",
  },
] as const;

type ProcessType = "parent" | "tutor";
type SignupType = "parent" | "center" | "tutor-free" | "tutor-trained";

export default function NavbarDemo() {
  const [activeProcessModal, setActiveProcessModal] = useState<ProcessType | null>(null);
  const [activeSignupModal, setActiveSignupModal] = useState<SignupType | null>(null);

  useEffect(() => {
    // Handle cross-page navigation to tutor registration
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('scrollTo') === 'tutor-register-section' || window.location.hash === '#tutor-register-section') {
      setTimeout(() => {
        setActiveSignupModal("tutor-free");
        window.history.replaceState({}, document.title, '/');
      }, 200);
    }
  }, []);

  return (
    <div className="relative w-full">
      <BackgroundLinesDemo />
      <TemplateContentSection
        onOpenTutorTrained={() => setActiveSignupModal("tutor-trained")}
      />
      <AboutAndProcessSection
        onOpenSignup={(type) => setActiveSignupModal(type)}
      />
      {/* ĐÃ XÓA: Hệ Thống Gia Sư & Giáo Viên section theo yêu cầu */}
      {/* Đã xóa div.relative.z-20... (phần học viên xuất sắc) theo yêu cầu */}
      {/* <DomeGallerySection /> đã bị xóa theo yêu cầu */}
      <TutorClassSection />
      <HeroParallaxDemo />
      <CountingSection />
      <ProjectFooter />
      <ProcessPopupModal
        type={activeProcessModal}
        onClose={() => setActiveProcessModal(null)}
      />
      <RegistrationModal
        activeType={activeSignupModal}
        onClose={() => setActiveSignupModal(null)}
        onOpenProcessModal={(type) => setActiveProcessModal(type)}
        onSwitchType={(type) => setActiveSignupModal(type)}
      />

      {/* Navbar */}
    </div>
  );

};
function BackgroundLinesDemo() {
  return (
    <BackgroundLines
      className="flex w-full flex-col items-center justify-center px-4"
      bottomBackgroundImage={background19.src}
    >
      <div className="px-2 pb-8 md:pb-36">
        <h2 className="text-center text-2xl font-sans py-2 font-bold tracking-tight relative z-20 max-[360px]:text-[20px] md:py-10 md:text-4xl lg:text-7xl">
          <span className="text-blue-600">SONG NGUYEN</span>
          <br />
          <span className="text-red-600">EDUCATION</span>
        </h2>
        <Image
          src={logoImage}
          alt="line1"
          width={180}
          height={180}
          className="mx-auto -mt-2 block h-28 w-28 rounded-full object-cover shadow-md max-[360px]:h-24 max-[360px]:w-24 md:-mt-3 md:h-36 md:w-36"
        />
        <br />
        <p className="mx-auto max-w-xl text-center text-sm text-neutral-700 dark:text-neutral-400 max-[360px]:text-xs md:text-lg">
          Tầm nhìn trở thành hệ thống gia sư và giáo dục uy tín, nơi chất lượng giảng dạy luôn được đặt lên hàng đầu.

        </p>
      </div>

      <div className={`${beVietnamPro.className} static z-30 mt-5 w-full md:absolute md:inset-x-4 md:bottom-1 md:mt-0 md:w-auto`}>
        <address className="mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/[0.92] text-[#17233b] not-italic shadow-[0_10px_30px_rgba(15,47,119,0.14)] backdrop-blur-md sm:max-w-xl md:max-w-4xl md:flex-row">
          {heroCampuses.map((campus, index) => (
            <div
              key={campus.label}
              className={`grid flex-1 grid-cols-[2rem_minmax(0,1fr)] items-start gap-2.5 px-3.5 py-3.5 sm:gap-3 sm:px-4 md:flex md:items-start ${
                index > 0 ? "border-t border-[#d6e2f5] md:border-l md:border-t-0" : ""
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e9f0ff] text-[#1e4fbf] ring-1 ring-[#d8e5ff]">
                <MapPin className="h-4 w-4" aria-hidden="true" strokeWidth={2.4} />
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#1e4fbf] sm:text-[11px]">
                  {campus.label}
                </span>
                <span className="mt-0.5 block text-[13px] font-semibold leading-5 tracking-[-0.01em] text-[#25344f] [text-wrap:pretty] max-[360px]:text-xs sm:text-sm sm:leading-6 md:text-base">
                  {campus.address}
                </span>
              </span>
            </div>
          ))}
        </address>
      </div>
    </BackgroundLines>
  );
}

function TemplateContentSection({
  onOpenTutorTrained,
}: {
  onOpenTutorTrained: () => void;
}) {
  return (
    <>
      <section className={`bg-[#d8dee8] px-6 py-14 md:px-12 md:py-16 ${beVietnamPro.className}`}>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 text-center sm:grid-cols-2 lg:grid-cols-4">
          <article className="flex flex-col items-center">
            <svg viewBox="0 0 64 64" className="h-16 w-16 text-[#0c3f88]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 22l22-10 22 10-22 10-22-10z" />
              <path d="M16 29v10c0 8 32 8 32 0V29" />
              <path d="M54 22v14" />
              <circle cx="54" cy="38" r="2.2" fill="currentColor" stroke="none" />
            </svg>
            <h3 className="mt-4 text-xl font-extrabold uppercase tracking-[0.02em] text-[#133a75]">Gia sư chất lượng</h3>
            <p className="mt-2 max-w-[24ch] text-sm font-medium leading-7 text-[#2f4f86]">Chúng tôi tự tin với đội ngũ gia sư được đào tạo phù hợp cho từng lớp học</p>
          </article>

          <article className="flex flex-col items-center">
            <svg viewBox="0 0 64 64" className="h-16 w-16 text-[#0c3f88]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="32" cy="30" r="11" />
              <rect x="14" y="24" width="8" height="14" rx="4" />
              <rect x="42" y="24" width="8" height="14" rx="4" />
              <path d="M24 41c2.2 3.2 5 5 8 5s5.8-1.8 8-5" />
              <circle cx="28" cy="30" r="1.8" fill="currentColor" stroke="none" />
              <circle cx="36" cy="30" r="1.8" fill="currentColor" stroke="none" />
            </svg>
            <h3 className="mt-4 text-xl font-extrabold uppercase tracking-[0.02em] text-[#133a75]">Tư vấn tận tâm</h3>
            <p className="mt-2 max-w-[24ch] text-sm font-medium leading-7 text-[#2f4f86]">Đội ngũ tư vấn hỗ trợ nhanh chóng, giải quyết mọi thắc mắc</p>
          </article>

          <article className="flex flex-col items-center">
            <svg viewBox="0 0 64 64" className="h-16 w-16 text-[#0c3f88]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M32 10l20 7v15c0 13-10 20-20 24-10-4-20-11-20-24V17l20-7z" />
              <rect x="24" y="27" width="16" height="12" rx="2" />
              <path d="M28 27v-3a4 4 0 018 0v3" />
              <path d="M29 33l2 2 4-4" />
            </svg>
            <h3 className="mt-4 text-xl font-extrabold uppercase tracking-[0.02em] text-[#133a75]">Chính sách an toàn</h3>
            <p className="mt-2 max-w-[24ch] text-sm font-medium leading-7 text-[#2f4f86]">Bảo mật thông tin gia sư và phụ huynh an toàn</p>
          </article>

          <article className="flex flex-col items-center">
            <svg viewBox="0 0 64 64" className="h-16 w-16 text-[#0c3f88]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="24" cy="26" r="8" />
              <circle cx="40" cy="38" r="8" />
              <path d="M31 31l2 2" />
              <path d="M21 26h6" />
              <path d="M40 34v8" />
              <path d="M36 38h8" />
              <path d="M19 45h26" />
            </svg>
            <h3 className="mt-4 text-xl font-extrabold uppercase tracking-[0.02em] text-[#133a75]">Học phí minh bạch</h3>
            <p className="mt-2 max-w-[24ch] text-sm font-medium leading-7 text-[#2f4f86]">Bảo mật thông tin gia sư và phụ huynh an toàn</p>
          </article>
        </div>
      </section>

      <section className={`relative overflow-hidden bg-[#f2f6fb] py-20 ${beVietnamPro.className}`}>
        <div className="mx-auto max-w-screen-2xl px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-[#0053cc] md:text-5xl">Hệ thống gia sư và giáo viên</h2>
            <p className="mt-4 text-base leading-8 text-[#5a6475]">Chúng tôi kết nối những nhà giáo dục tận tâm nhất để đồng hành cùng sự phát triển của học sinh.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="rounded-[28px] border border-white bg-white/85 p-8 shadow-[0_16px_40px_rgba(0,41,108,0.08)]">
              <div className="mb-5 flex items-end gap-2">
                <span className="text-5xl font-black text-[#d9e7ff]">01</span>
                <h3 className="text-2xl font-bold text-[#273449]">Gia sư tự do</h3>
              </div>
              <ul className="space-y-3 text-sm leading-7 text-[#5a6475]">
                <li>Sinh viên từ các trường đại học hàng đầu</li>
                <li>Năng động, phương pháp dạy gần gũi</li>
                <li>Chi phí tối ưu cho gia đình</li>
              </ul>
              <button className="mt-8 w-full rounded-xl border-2 border-[#0053cc] py-3 text-sm font-bold text-[#0053cc] transition-all hover:bg-[#0053cc] hover:text-white">Tìm hiểu thêm</button>
            </div>

            <div className="rounded-[28px] border-2 border-[#bdd3ff] bg-white p-8 shadow-[0_20px_48px_rgba(0,41,108,0.12)] lg:-translate-y-4">
              <div className="mb-5 inline-flex rounded-full bg-[#0053cc] px-4 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white">Phổ biến nhất</div>
              <div className="mb-5 flex items-end gap-2">
                <span className="text-5xl font-black text-[#d9e7ff]">02</span>
                <h3 className="text-2xl font-bold text-[#0053cc]">Gia sư đào tạo</h3>
              </div>
              <ul className="space-y-3 text-sm font-semibold leading-7 text-[#33415c]">
                <li>Vượt qua kỳ kiểm tra nghiệp vụ khắt khe</li>
                <li>Chứng chỉ đào tạo Song Nguyen</li>
                <li>Kỹ năng sư phạm chuyên nghiệp</li>
              </ul>
              <button
                type="button"
                onClick={onOpenTutorTrained}
                className="mt-8 w-full rounded-xl bg-[linear-gradient(135deg,#0053cc_0%,#779dff_100%)] py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(0,83,204,0.28)]"
              >
                Đăng ký ngay
              </button>
            </div>

            <div className="rounded-[28px] border border-white bg-white/85 p-8 shadow-[0_16px_40px_rgba(0,41,108,0.08)]">
              <div className="mb-5 flex items-end gap-2">
                <span className="text-5xl font-black text-[#ffdedd]">03</span>
                <h3 className="text-2xl font-bold text-[#bb0100]">Giáo viên</h3>
              </div>
              <ul className="space-y-3 text-sm leading-7 text-[#5a6475]">
                <li>Đang giảng dạy tại các trường chính quy</li>
                <li>Nhiều năm kinh nghiệm ôn luyện thi</li>
                <li>Chuyên gia trong từng lĩnh vực môn học</li>
              </ul>
              <button className="mt-8 w-full rounded-xl border-2 border-[#bb0100] py-3 text-sm font-bold text-[#bb0100] transition-all hover:bg-[#bb0100] hover:text-white">Xem danh sách</button>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

// HeroSection đã bị xóa theo yêu cầu


function RegistrationModal({
  activeType,
  onClose,
  onOpenProcessModal,
  onSwitchType,
}: {
  activeType: SignupType | null;
  onClose: () => void;
  onOpenProcessModal: (type: ProcessType) => void;
  onSwitchType: (type: SignupType) => void;
}) {
  const handleOpenProcess = (type: ProcessType) => {
    onOpenProcessModal(type);
  };
  useEffect(() => {
    if (!activeType) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [activeType, onClose]);

  if (!activeType) return null;

  const headerMap: Record<SignupType, { title: string; desc: string; badge: string }> = {
    parent: {
      title: "Đăng ký tìm gia sư",
      desc: "Gửi yêu cầu học tập nhanh chóng để được tư vấn trong 24h.",
      badge: "Đăng ký gia sư",
    },
    center: {
      title: "Đăng ký học tại trung tâm",
      desc: "Đăng ký học trực tiếp tại các cơ sở của trung tâm Song Nguyên.",
      badge: "Học tại trung tâm",
    },
    "tutor-free": {
      title: "Gia sư tự do đăng ký nhận lớp",
      desc: "Phù hợp cho sinh viên hoặc gia sư tự do muốn nhận lớp linh hoạt.",
      badge: "Gia sư tự do",
    },
    "tutor-trained": {
      title: "Gia sư đào tạo đăng ký ứng tuyển",
      desc: "Chương trình đào tạo bài bản, ưu tiên ghép lớp chất lượng.",
      badge: "Gia sư đào tạo",
    },
  };

  const header = headerMap[activeType];

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center bg-[#071737]/60 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className={`relative flex w-full max-w-4xl max-h-[90vh] flex-col overflow-hidden rounded-[28px] border border-[#d6e1fb] bg-white shadow-[0_30px_90px_rgba(4,16,50,0.4)] ${beVietnamPro.className} animate-[fadeInModal_.3s_ease-out]`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={header.title}
      >
        <div className="z-10 flex shrink-0 flex-col gap-6 border-b border-[#e5edff] bg-[linear-gradient(120deg,#f7f9ff_0%,#ffffff_55%,#f6f9ff_100%)] px-5 py-5 md:px-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-[#103a9c] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white">
                {header.badge}
              </span>
              <h3 className="mt-3 text-2xl font-black text-[#122a5c] md:text-3xl">
                {header.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#4e6186] md:text-base">
                {header.desc}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#1d4aa8] shadow-sm transition-all duration-200 hover:bg-[#eaf1ff]"
              aria-label="Đóng popup"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(
              [
                { key: "parent" as const, label: "Đăng ký gia sư" },
                { key: "center" as const, label: "Học trung tâm" },
                { key: "tutor-free" as const, label: "Gia sư tự do" },
                { key: "tutor-trained" as const, label: "Gia sư đào tạo" },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onSwitchType(item.key)}
                className={`rounded-2xl border px-4 py-3 text-sm font-bold transition-all duration-300 md:text-base ${
                  activeType === item.key
                    ? "border-[#1b4fb6] bg-[#1b4fb6] text-white shadow-[0_12px_28px_rgba(27,79,182,0.3)]"
                    : "border-[#d8e3fb] bg-white text-[#243b72] hover:border-[#8fb1ff]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6 md:px-7">
          {activeType === "parent" || activeType === "center" ? (
            <ParentRegistrationForm
              mode={activeType}
              title={activeType === "center" ? "Đăng ký học tại trung tâm" : "Phụ huynh đăng ký tìm gia sư"}
              onOpenProcessModal={() => handleOpenProcess("parent")}
            />
          ) : (
            <TutorRegistrationForm
              track={activeType === "tutor-free" ? "free" : "trained"}
              onOpenProcessModal={() => handleOpenProcess("tutor")}
            />
          )}
        </div>

        <style jsx>{`
          @keyframes fadeInModal {
            from {
              opacity: 0;
              transform: translateY(16px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

function ParentRegistrationForm({
  onOpenProcessModal,
  title = "Phụ huynh đăng ký lớp",
  mode = "parent",
}: {
  onOpenProcessModal: () => void;
  title?: string;
  mode?: "parent" | "center";
}) {
  const [studentForm, setStudentForm] = useState({
    studentName: "",
    parentName: "",
    phone: "",
    subject: "",
    gender: "",
    location: "",
    level: "",
    studentCount: "",
    sessionsPerWeek: "",
    monthlyBudget: "",
  });
  const [tutorForm, setTutorForm] = useState({
    gender: "",
    detail: "",
    level: "",
  });
  const [activeWeekdays, setActiveWeekdays] = useState<string[]>([]);
  const [activeTimeSlots, setActiveTimeSlots] = useState<string[]>([]);
  const [centerLocations, setCenterLocations] = useState<string[]>([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const studentNameRef = useRef<HTMLInputElement | null>(null);
  const parentNameRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const monthlyBudgetRef = useRef<HTMLInputElement | null>(null);
  const subjectRef = useRef<HTMLSelectElement | null>(null);
  const genderRef = useRef<HTMLSelectElement | null>(null);
  const locationRef = useRef<any | null>(null);
  const levelRef = useRef<HTMLSelectElement | null>(null);
  const studentCountRef = useRef<HTMLSelectElement | null>(null);
  const sessionsPerWeekRef = useRef<HTMLSelectElement | null>(null);
  const tutorLevelRef = useRef<HTMLSelectElement | null>(null);
  const weekdaysRef = useRef<HTMLDivElement | null>(null);
  const timeSlotsRef = useRef<HTMLDivElement | null>(null);

  const weekDays = [
    { key: "su", label: "Su", full: "Chủ nhật" },
    { key: "mo", label: "Mo", full: "Thứ 2" },
    { key: "tu", label: "Tu", full: "Thứ 3" },
    { key: "we", label: "We", full: "Thứ 4" },
    { key: "th", label: "Th", full: "Thứ 5" },
    { key: "fr", label: "Fr", full: "Thứ 6" },
    { key: "sa", label: "Sa", full: "Thứ 7" },
  ];

  const timeSlots = ["Sáng", "Chiều", "Tối"];

  const centerLocationOptions = ["Quận 12", "Quận Gò Vấp"];
  const locationOptions = [
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

  const subjectBasePrice: Record<string, number> = {
    "Tiếng Anh": 280000,
    "Toán": 250000,
    "Văn": 240000,
    "Lý - Hóa - Sinh": 270000,
    IELTS: 320000,
    SAT: 380000,
  };

  const levelMultiplier: Record<string, number> = {
    "Tiểu học": 1,
    "THCS": 1.1,
    "THPT": 1.2,
    IELTS: 1.35,
    SAT: 1.5,
  };

  const inputBaseClass =
    "h-12 w-full rounded-xl border border-[#d5dff1] bg-white/95 px-4 text-[15px] font-medium text-[#243b72] outline-none transition-all duration-300 placeholder:text-[#6b7aa0] focus:border-[#4f86ff] focus:ring-4 focus:ring-[#8ab4ff]/25";
  const errorInputClass = (hasError: boolean) =>
    `${inputBaseClass} ${hasError ? "border-[#e44b4b] focus:border-[#e44b4b] focus:ring-[#f3a1a1]/40" : ""}`;
  const parentSubmitClass =
    "rounded-xl bg-[linear-gradient(180deg,#f00b0b_0%,#d80404_100%)] px-4 py-4 text-center text-[22px] font-black leading-tight text-white shadow-[0_16px_34px_rgba(216,4,4,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 md:text-[26px] lg:text-[30px]";

  const locationValue = mode === "center" ? centerLocations.join(", ") : studentForm.location;
  const requiredFields = [
    studentForm.studentName,
    studentForm.parentName,
    studentForm.phone,
    studentForm.subject,
    locationValue,
    studentForm.level,
    studentForm.studentCount,
    studentForm.sessionsPerWeek,
    studentForm.monthlyBudget,
    ...(mode === "parent" ? [tutorForm.level] : []),
  ];

  const completedFields = requiredFields.filter((value) => value.trim().length > 0).length;
  const scheduleDone = activeWeekdays.length > 0 && activeTimeSlots.length > 0;
  const completionRate = Math.round(((completedFields + (scheduleDone ? 2 : 0)) / (requiredFields.length + 2)) * 100);

  const estimatedFee = (() => {
    const students = Math.max(Number(studentForm.studentCount) || 1, 1);
    const base = subjectBasePrice[studentForm.subject] ?? 250000;
    const levelScale = levelMultiplier[studentForm.level] ?? 1;
    const groupDiscount = students >= 3 ? 0.86 : students === 2 ? 0.93 : 1;
    const value = Math.round(base * levelScale * groupDiscount);
    return value > 0 ? value : 250000;
  })();

  const formatVnd = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value: string) => {
    if (!value) return "";
    const numeric = Number(value);
    return Number.isFinite(numeric) ? new Intl.NumberFormat("vi-VN").format(numeric) : "";
  };

  const focusFirstParentError = (nextErrors: Record<string, string>) => {
    const focusOrder: Array<keyof typeof nextErrors> = [
      "studentName",
      "parentName",
      "phone",
      "monthlyBudget",
      "subject",
      "gender",
      "location",
      "level",
      "studentCount",
      "sessionsPerWeek",
      "tutorLevel",
      "weekdays",
      "timeSlots",
    ];
    const refMap: Record<string, React.RefObject<HTMLElement | null>> = {
      studentName: studentNameRef,
      parentName: parentNameRef,
      phone: phoneRef,
      monthlyBudget: monthlyBudgetRef,
      subject: subjectRef,
      gender: genderRef,
      location: locationRef,
      level: levelRef,
      studentCount: studentCountRef,
      sessionsPerWeek: sessionsPerWeekRef,
      tutorLevel: tutorLevelRef,
      weekdays: weekdaysRef,
      timeSlots: timeSlotsRef,
    };

    const firstKey = focusOrder.find((key) => nextErrors[key]);
    if (!firstKey) return;
    const target = refMap[firstKey]?.current;
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const toggleWeekday = (key: string) => {
    setActiveWeekdays((prev) => {
      if (prev.includes(key)) {
        return prev.filter((item) => item !== key);
      }
      const maxDays = studentForm.sessionsPerWeek
        ? (studentForm.sessionsPerWeek === "5" ? 7 : Number(studentForm.sessionsPerWeek))
        : 7;
      if (prev.length >= maxDays) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return prev;
      }
      return [...prev, key];
    });
  };

  const toggleTimeSlot = (slot: string) => {
    setActiveTimeSlots((prev) =>
      prev.includes(slot) ? prev.filter((item) => item !== slot) : [...prev, slot]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!studentForm.studentName.trim()) nextErrors.studentName = "Vui lòng nhập họ tên học viên.";
    if (!studentForm.parentName.trim()) nextErrors.parentName = "Vui lòng nhập họ tên phụ huynh.";
    if (!/^(0|\+84)\d{9,10}$/.test(studentForm.phone.replace(/\s+/g, ""))) {
      nextErrors.phone = "Số điện thoại không hợp lệ.";
    }
    if (!studentForm.subject) nextErrors.subject = "Vui lòng chọn môn học.";
    if (!locationValue.trim()) nextErrors.location = "Vui lòng chọn khu vực dạy.";
    if (!studentForm.level) nextErrors.level = "Vui lòng chọn cấp độ.";
    if (!studentForm.sessionsPerWeek) nextErrors.sessionsPerWeek = "Vui lòng chọn số buổi.";
    if (!studentForm.studentCount) nextErrors.studentCount = "Vui lòng chọn số học viên.";
    if (!studentForm.monthlyBudget.trim()) nextErrors.monthlyBudget = "Vui lòng nhập học phí mong muốn.";
    if (mode === "parent" && !tutorForm.level) {
      nextErrors.tutorLevel = "Vui lòng chọn trình độ gia sư.";
    }
    if (activeWeekdays.length === 0) nextErrors.weekdays = "Hãy chọn ít nhất 1 ngày học.";
    if (activeTimeSlots.length === 0) nextErrors.timeSlots = "Hãy chọn ít nhất 1 khung giờ.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitMessage("Thông tin chưa đầy đủ. Vui lòng kiểm tra các trường bắt buộc.");
      focusFirstParentError(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    const sessionFeeValue = Number(studentForm.monthlyBudget) || 0;
    const baseSessionFee = sessionFeeValue > 0 ? sessionFeeValue : estimatedFee;
    const budgetPerHour = baseSessionFee > 0 ? Math.round(baseSessionFee) : undefined;
    const tutorType =
      tutorForm.level === "Gia sư đào tạo" ? "GIA_SU_DAO_TAO" : "GIA_SU_TU_DO";
    const feeLabel = mode === "center" ? "Hoc phi mong muon/thang" : "Hoc phi mong muon/buoi";
    const noteParts = [
      studentForm.gender ? `Gioi tinh hoc vien: ${studentForm.gender}` : null,
      `So hoc vien: ${studentForm.studentCount}`,
      `So buoi/tuan: ${studentForm.sessionsPerWeek}`,
      sessionFeeValue > 0 ? `${feeLabel}: ${formatVnd(sessionFeeValue)}` : null,
      `Lich hoc: ${activeWeekdays.join(", ") || "Chua chon"} | ${activeTimeSlots.join(", ") || "Chua chon"}`,
      mode === "parent" ? `Loai gia su: ${tutorForm.level || "Chua chon"}` : null,
      tutorForm.gender ? `Gioi tinh gia su: ${tutorForm.gender}` : null,
      tutorForm.level ? `Trinh do gia su: ${tutorForm.level}` : null,
      tutorForm.detail ? `Yeu cau chi tiet: ${tutorForm.detail}` : null,
    ].filter(Boolean);

    try {
      await apiRequest("/public/class-requests", {
        method: "POST",
        body: {
          studentName: studentForm.studentName,
          parentName: studentForm.parentName,
          parentPhone: studentForm.phone,
          subject: studentForm.subject,
          grade: studentForm.level,
          district: locationValue,
          budgetPerHour,
          formType: mode === "center" ? "TRUNG_TAM" : "GIA_SU",
          tutorType: mode === "center" ? undefined : tutorType,
          note: noteParts.join("; "),
        },
      });

      setSubmitMessage("Yeu cau da duoc gui. Hoc vu se lien he trong 24h.");
    } catch (err) {
      setSubmitMessage(err instanceof Error ? err.message : "Gui yeu cau that bai. Vui long thu lai.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full ${beVietnamPro.className}`}>
      <div className="rounded-[26px] border border-[#d5dff3] bg-[#f5f7fb] p-4 shadow-[0_20px_45px_rgba(17,45,112,0.12)] md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black text-[#17367b] md:text-3xl">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-[#4b5f88] md:text-base">
              Điền nhanh thông tin học viên để nhận tư vấn lộ trình và học phí.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenProcessModal}
            className="text-xs font-semibold text-[#21408c] underline decoration-[#6f88c0] underline-offset-4 hover:text-[#17367b]"
          >
            Xem quy trình đăng ký lớp
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-full border border-[#d3dff5] bg-white/80">
          <div
            className="h-2 rounded-full bg-[linear-gradient(90deg,#0d3ea8_0%,#51a5ff_55%,#8fe3ff_100%)] transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-[#2a4b8c] md:text-sm">Tiến độ hoàn thiện yêu cầu: {completionRate}%</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="rounded-[22px] border border-white/70 bg-[#eef0f5] p-4">
            <h4 className="text-lg font-bold text-[#1d3979] md:text-xl">Thông tin học viên</h4>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <input
                  ref={studentNameRef}
                  value={studentForm.studentName}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, studentName: e.target.value }))}
                  placeholder="Họ và tên học viên"
                  className={errorInputClass(!!errors.studentName)}
                />
                <input
                  ref={parentNameRef}
                  value={studentForm.parentName}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, parentName: e.target.value }))}
                  placeholder="Họ và tên phụ huynh"
                  className={errorInputClass(!!errors.parentName)}
                />
                <input
                  ref={phoneRef}
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Số điện thoại"
                  className={errorInputClass(!!errors.phone)}
                />
                <select
                  ref={subjectRef}
                  value={studentForm.subject}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, subject: e.target.value }))}
                  className={errorInputClass(!!errors.subject)}
                >
                  <option value="">Môn học</option>
                  {Object.keys(subjectBasePrice).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <select
                  ref={genderRef}
                  value={studentForm.gender}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, gender: e.target.value }))}
                  className={inputBaseClass}
                >
                  <option value="">Giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
                {mode === "center" ? (
                  <div
                    ref={locationRef}
                    tabIndex={-1}
                    className={`rounded-xl border border-[#d5dff1] bg-white/95 p-3 text-sm font-semibold text-[#243b72] focus:outline-none focus:ring-4 focus:ring-[#8ab4ff]/25 ${
                      errors.location ? "border-[#e44b4b]" : ""
                    }`}
                  >
                    <p className="mb-2 text-xs font-bold uppercase text-[#4b5f88]">Khu vực dạy</p>
                    <div className="flex flex-wrap gap-3">
                      {centerLocationOptions.map((item) => {
                        const checked = centerLocations.includes(item);
                        return (
                          <label key={item} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(event) => {
                                setCenterLocations((prev) =>
                                  event.target.checked
                                    ? [...prev, item]
                                    : prev.filter((value) => value !== item),
                                );
                              }}
                            />
                            <span>{item}</span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="mt-2 text-xs text-[#6b7aa0]">
                      Da chon: {centerLocations.length ? centerLocations.join(", ") : "Chua chon"}
                    </div>
                  </div>
                ) : (
                  <select
                    ref={locationRef}
                    value={studentForm.location}
                    onChange={(e) => setStudentForm((prev) => ({ ...prev, location: e.target.value }))}
                    className={errorInputClass(!!errors.location)}
                  >
                    <option value="">Khu vực dạy</option>
                    {locationOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                )}
                <select
                  ref={levelRef}
                  value={studentForm.level}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, level: e.target.value }))}
                  className={errorInputClass(!!errors.level)}
                >
                  <option value="">Lớp / Cấp độ</option>
                  {Object.keys(levelMultiplier).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <select
                  ref={studentCountRef}
                  value={studentForm.studentCount}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, studentCount: e.target.value }))}
                  className={errorInputClass(!!errors.studentCount)}
                >
                  <option value="">Số học viên</option>
                  <option value="1">1 học viên</option>
                  <option value="2">2 học viên</option>
                  <option value="3">3 học viên</option>
                  <option value="4">4+ học viên</option>
                </select>
                <select
                  ref={sessionsPerWeekRef}
                  value={studentForm.sessionsPerWeek}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStudentForm((prev) => ({ ...prev, sessionsPerWeek: val }));
                    const maxDays = val ? (val === "5" ? 7 : Number(val)) : 7;
                    setActiveWeekdays((prev) => prev.slice(0, maxDays));
                  }}
                  className={`${errorInputClass(!!errors.sessionsPerWeek)} lg:col-span-1`}
                >
                  <option value="">Số buổi / tuần</option>
                  <option value="1">1 buổi</option>
                  <option value="2">2 buổi</option>
                  <option value="3">3 buổi</option>
                  <option value="4">4 buổi</option>
                  <option value="5">5+ buổi</option>
                </select>
              </div>
              {(errors.phone || errors.subject || errors.location || errors.level || errors.studentCount || errors.sessionsPerWeek || errors.studentName || errors.parentName || errors.monthlyBudget) && (
                <p className="mt-3 text-sm font-semibold text-[#cc1f1f]">Vui lòng điền đầy đủ thông tin học viên.</p>
              )}
            </div>

            <div className="rounded-[22px] border border-white/70 bg-[#eef0f5] p-4">
              <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <h4 className="text-lg font-bold text-[#1d3979] md:text-xl">Yêu cầu gia sư</h4>
                  <div className="mt-4 space-y-3">
                    <select
                      value={tutorForm.gender}
                      onChange={(e) => setTutorForm((prev) => ({ ...prev, gender: e.target.value }))}
                      className={inputBaseClass}
                    >
                      <option value="">Giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Không yêu cầu">Không yêu cầu</option>
                    </select>
                    <textarea
                      value={tutorForm.detail}
                      onChange={(e) => setTutorForm((prev) => ({ ...prev, detail: e.target.value }))}
                      placeholder="Yêu cầu chi tiết"
                      className="min-h-[70px] w-full rounded-xl border border-[#d5dff1] bg-white/95 px-4 py-3 text-[15px] font-medium text-[#243b72] outline-none transition-all duration-300 placeholder:text-[#6b7aa0] focus:border-[#4f86ff] focus:ring-4 focus:ring-[#8ab4ff]/25"
                    />
                    {mode === "parent" && (
                      <select
                        ref={tutorLevelRef}
                        value={tutorForm.level}
                        onChange={(e) => setTutorForm((prev) => ({ ...prev, level: e.target.value }))}
                        className={errorInputClass(!!errors.tutorLevel)}
                      >
                        <option value="">Loại gia sư</option>
                        <option value="Gia sư tự do">Gia sư tự do</option>
                        <option value="Gia sư đào tạo">Gia sư đào tạo</option>
                      </select>
                    )}
                  </div>
                  <a
                    href="#"
                    className="mt-2 inline-block text-xs italic text-[#2d4f96] underline decoration-[#6f88c0] underline-offset-4 hover:text-[#17367b]"
                  >
                    * Tìm hiểu về các cấp độ gia sư tại đây
                  </a>
                  {mode === "parent" && errors.tutorLevel && (
                    <p className="mt-2 text-sm font-semibold text-[#cc1f1f]">{errors.tutorLevel}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#2a4b8c] md:text-base">
                    Các buổi trong tuần học viên có thể học
                  </p>
                  <div className="mt-3 rounded-2xl border border-white/70 bg-white/75 p-4">
                    <div
                      ref={weekdaysRef}
                      tabIndex={-1}
                      className={`grid grid-cols-4 gap-2 sm:grid-cols-7 focus:outline-none focus:ring-2 focus:ring-[#8ab4ff]/60 ${
                        errors.weekdays ? "rounded-xl border border-[#e44b4b] p-1" : ""
                      }`}
                    >
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

                    <div
                      ref={timeSlotsRef}
                      tabIndex={-1}
                      className={`mt-3 grid grid-cols-3 gap-2 focus:outline-none focus:ring-2 focus:ring-[#8ab4ff]/60 ${
                        errors.timeSlots ? "rounded-xl border border-[#e44b4b] p-1" : ""
                      }`}
                    >
                      {timeSlots.map((slot) => {
                        const active = activeTimeSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => toggleTimeSlot(slot)}
                            className={`rounded-xl px-3 py-2 text-sm font-bold transition-all duration-300 max-[360px]:text-xs ${
                              active
                                ? "bg-[#1848b5] text-white shadow-[0_8px_18px_rgba(24,72,181,0.3)]"
                                : "bg-[#edf3ff] text-[#365ca5] hover:bg-[#dfe9ff]"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 rounded-xl border border-[#d7e3f8] bg-[#f6f9ff] px-3 py-2 text-sm font-medium text-[#2a4b8c]">
                      Đã chọn: {activeWeekdays.length} ngày, {activeTimeSlots.length} khung giờ
                    </div>
                    {(errors.weekdays || errors.timeSlots) && (
                      <p className="mt-2 text-sm font-semibold text-[#cc1f1f]">Hãy chọn lịch học đầy đủ.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border-2 border-[#6ea0ff] bg-[#eef4ff] p-4 shadow-[0_12px_28px_rgba(82,139,255,0.2)]">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#21408c]">
                  {mode === "center" ? "Học phí mong muốn/tháng" : "Học phí mong muốn/buổi"}
                </p>
                <div className="mt-2 relative">
                  <input
                    ref={monthlyBudgetRef}
                    value={studentForm.monthlyBudget}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      setStudentForm((prev) => ({ ...prev, monthlyBudget: rawValue }));
                    }}
                    placeholder={mode === "center" ? "Nhap hoc phi / thang" : "Nhap hoc phi / buoi"}
                    inputMode="numeric"
                    className={`${errorInputClass(!!errors.monthlyBudget)} h-14 text-lg font-bold pr-14`}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#4f6db6]">
                    VND
                  </span>
                </div>
                {errors.monthlyBudget && (
                  <p className="mt-2 text-sm font-semibold text-[#cc1f1f]">{errors.monthlyBudget}</p>
                )}
                {!errors.monthlyBudget && studentForm.monthlyBudget && (
                  <p className="mt-2 text-sm font-semibold text-[#21408c]">
                    Số tiền (VND): {formatVnd(Number(studentForm.monthlyBudget))}
                  </p>
                )}
              </div>

              <h4 className="mt-5 text-2xl font-extrabold text-[#17367b] md:text-3xl">
                {mode === "center" ? "Học phí tham khảo/tháng" : "Học phí tham khảo/buổi"}
              </h4>

              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr]">
                <div className="relative overflow-hidden rounded-xl bg-[#528bff] px-4 py-4 text-center text-[24px] font-black leading-tight text-white shadow-[0_14px_34px_rgba(82,139,255,0.35)] md:text-[28px] lg:text-[30px]">
                  {formatVnd(estimatedFee)}
                  <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0)_42%,rgba(255,255,255,0.18)_100%)]" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[linear-gradient(180deg,#1b4fb6_0%,#0f3b9c_100%)] px-4 py-4 text-center text-[22px] font-black leading-tight text-white shadow-[0_16px_34px_rgba(15,59,156,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 md:text-[26px] lg:text-[30px]"
                >
                  {isSubmitting ? "Đang gửi..." : "Tìm gia sư ngay"}
                </button>
              </div>

              <div className="mt-4 grid gap-3 rounded-2xl border border-[#d4e1f8] bg-white/80 p-4 md:grid-cols-3">
                <div className="rounded-xl bg-[#f1f6ff] p-3 text-sm font-semibold text-[#234187]">
                  Môn học: <span className="font-extrabold">{studentForm.subject || "Chưa chọn"}</span>
                </div>
                <div className="rounded-xl bg-[#f1f6ff] p-3 text-sm font-semibold text-[#234187]">
                  Cấp độ: <span className="font-extrabold">{studentForm.level || "Chưa chọn"}</span>
                </div>
                <div className="rounded-xl bg-[#f1f6ff] p-3 text-sm font-semibold text-[#234187]">
                  Lịch học: <span className="font-extrabold">{activeWeekdays.length > 0 ? `${activeWeekdays.length} ngày/tuần` : "Chưa chọn"}</span>
                </div>
              </div>

              {submitMessage && (
                <p
                  className={`mt-3 rounded-xl border px-4 py-3 text-sm font-semibold md:text-base ${
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

function ProcessPopupModal({
  type,
  onClose,
}: {
  type: ProcessType | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!type) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [type, onClose]);

  if (!type) return null;

  const config =
    type === "parent"
      ? {
          title: "Quy trình phụ huynh đăng ký lớp",
          subtitle: "4 bước ngắn gọn để ghép đúng gia sư cho học viên.",
          steps: [
            "Gửi yêu cầu học tập: môn học, cấp độ, lịch phù hợp.",
            "Học vụ tư vấn và xác nhận hồ sơ trong vòng 30 phút.",
            "Ghép gia sư phù hợp theo mục tiêu và phong cách học.",
            "Sắp lịch học thử, đánh giá và chốt lộ trình chính thức.",
          ],
          badge: "PHỤ HUYNH",
        }
      : {
          title: "Quy trình gia sư đăng ký nhận lớp",
          subtitle: "Luồng xét duyệt rõ ràng, minh bạch cho gia sư mới.",
          steps: [
            "Điền hồ sơ cá nhân, chuyên môn và khu vực có thể dạy.",
            "Học vụ kiểm tra thông tin và gọi xác minh hồ sơ.",
            "Ghép lớp thử theo môn phù hợp và lịch dạy khả dụng.",
            "Kích hoạt hồ sơ gia sư chính thức trên hệ thống.",
          ],
          badge: "GIA SƯ",
        };

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center bg-[#061534]/50 px-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`w-full max-w-xl overflow-hidden rounded-[28px] border border-[#cdd9f6] bg-white p-5 shadow-[0_28px_80px_rgba(6,22,60,0.35)] ${beVietnamPro.className} animate-[fadeInModal_.3s_ease-out] md:p-7`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={config.title}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-[#0f3b9c] px-3 py-1 text-xs font-extrabold tracking-[0.1em] text-white">
              {config.badge}
            </span>
            <h3 className="mt-3 text-2xl font-black text-[#15377e] md:text-3xl">{config.title}</h3>
            <p className="mt-2 text-sm leading-7 text-[#445781] md:text-base">{config.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#edf3ff] text-2xl font-bold text-[#1d4aa8] transition-all duration-200 hover:bg-[#dce9ff]"
            aria-label="Đóng popup"
          >
            ×
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {config.steps.map((step, idx) => (
            <article
              key={step}
              className="rounded-2xl border border-[#dae5fb] bg-[#f5f8ff] px-4 py-3"
            >
              <p className="text-sm font-bold text-[#1d3e86] md:text-base">Bước {idx + 1}</p>
              <p className="mt-1 text-sm leading-7 text-[#4b5f88] md:text-base">{step}</p>
            </article>
          ))}
        </div>

        <style jsx>{`
          @keyframes fadeInModal {
            from {
              opacity: 0;
              transform: translateY(16px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

// Đã xóa DomeGallerySection (div.h-screen.w-full.bg-white) theo yêu cầu

function TutorClassSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const momentumFrameRef = useRef<number | null>(null);

  const tutors = [
    {
      id: 1,
      name: "Nguyễn Bá Thọ",
      role: "Giáo viên Academic tại Song Nguyen Education",
      score: "8.5 IELTS Overall",
      qualification: "Cử nhân Sư phạm Tiếng Anh",
      certificates: ["TESOL Quốc tế", "Nghiệp vụ Sư phạm"],
      image: tutorImage1,
    },
    {
      id: 2,
      name: "Từ Kim Loan",
      role: "IELTS Academic Director tại Song Nguyen Education",
      score: "8.5 IELTS Overall",
      qualification: "Thạc sĩ Ngôn ngữ Anh",
      certificates: ["CELTA", "IELTS Train The Trainer"],
      image: tutorImage2,
    },
    {
      id: 3,
      name: "Võ Đình Phúc",
      role: "Academic Manager tại Song Nguyen Education",
      score: "8.5 IELTS Overall",
      qualification: "Cử nhân Ngôn ngữ Anh",
      certificates: ["TESOL Quốc tế", "Academic Writing Specialist"],
      image: tutorImage3,
    },
    {
      id: 4,
      name: "Dương Hoàng Anh Nhật",
      role: "IELTS Academic Manager tại Song Nguyen Education",
      score: "8.0 IELTS Writing",
      qualification: "Thạc sĩ Giảng dạy Tiếng Anh",
      certificates: ["TESOL", "Chứng chỉ Đánh giá Năng lực IELTS"],
      image: tutorImage4,
    },
    {
      id: 5,
      name: "Đặng Lê Phương Uyên",
      role: "Acting IELTS Academic Manager tại Song Nguyen Education",
      score: "8.5 IELTS Overall",
      qualification: "Cử nhân Sư phạm Anh",
      certificates: ["TESOL", "Classroom Management Certification"],
      image: tutorImage5,
    },
    {
      id: 6,
      name: "Trần Gia Minh",
      role: "Giáo viên IELTS tại Song Nguyen Education",
      score: "8.0 IELTS Speaking",
      qualification: "Cử nhân Ngôn ngữ Anh",
      certificates: ["TESOL Quốc tế", "Phát âm nâng cao"],
      image: tutorImage6,
    },
    {
      id: 7,
      name: "Lê Hà An",
      role: "Giáo viên SAT Verbal tại Song Nguyen Education",
      score: "1500 SAT",
      qualification: "Thạc sĩ Ngôn ngữ học ứng dụng",
      certificates: ["SAT Instructor Certification", "CELTA"],
      image: tutorImage7,
    },
    {
      id: 8,
      name: "Phạm Quỳnh Như",
      role: "Giáo viên IELTS tại Song Nguyen Education",
      score: "8.5 IELTS Overall",
      qualification: "Cử nhân Sư phạm Anh",
      certificates: ["TESOL", "Classroom Management Certification"],
      image: tutorImage2,
    },
    {
      id: 9,
      name: "Ngô Minh Quân",
      role: "Giáo viên Academic Writing tại Song Nguyen Education",
      score: "8.0 IELTS Writing",
      qualification: "Cử nhân Ngôn ngữ Anh",
      certificates: ["Academic Writing Specialist", "TESOL"],
      image: tutorImage4,
    },
    {
      id: 10,
      name: "Đinh Hồng Phúc",
      role: "Giáo viên luyện thi IELTS tại Song Nguyen Education",
      score: "8.5 IELTS Overall",
      qualification: "Thạc sĩ TESOL",
      certificates: ["TESOL Quốc tế", "IELTS Train The Trainer"],
      image: tutorImage1,
    },
  ];
  const loopTutors = [...tutors, ...tutors, ...tutors];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const singleSetWidth = slider.scrollWidth / 3;
    slider.scrollLeft = singleSetWidth;

    const handleLoopScroll = () => {
      if (slider.scrollLeft <= singleSetWidth * 0.5) {
        slider.scrollLeft += singleSetWidth;
      } else if (slider.scrollLeft >= singleSetWidth * 1.5) {
        slider.scrollLeft -= singleSetWidth;
      }
    };

    slider.addEventListener("scroll", handleLoopScroll, { passive: true });
    return () => slider.removeEventListener("scroll", handleLoopScroll);
  }, [tutors.length]);

  useEffect(() => {
    return () => {
      if (momentumFrameRef.current !== null) {
        cancelAnimationFrame(momentumFrameRef.current);
      }
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const slider = sliderRef.current;
    if (!slider) return;

    if (momentumFrameRef.current !== null) {
      cancelAnimationFrame(momentumFrameRef.current);
      momentumFrameRef.current = null;
    }

    isDraggingRef.current = true;
    pointerIdRef.current = event.pointerId;
    slider.setPointerCapture(event.pointerId);
    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current = slider.scrollLeft;
    lastPointerXRef.current = event.clientX;
    lastPointerTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const slider = sliderRef.current;
    if (!slider || !isDraggingRef.current) return;

    const distance = event.clientX - dragStartXRef.current;
    slider.scrollLeft = dragStartScrollLeftRef.current - distance;

    const now = performance.now();
    const elapsed = now - lastPointerTimeRef.current;
    if (elapsed > 0) {
      const deltaX = event.clientX - lastPointerXRef.current;
      const instantVelocity = deltaX / elapsed;
      velocityRef.current = velocityRef.current * 0.82 + instantVelocity * 0.18;
      lastPointerXRef.current = event.clientX;
      lastPointerTimeRef.current = now;
    }
  };

  const handlePointerUp = (event?: React.PointerEvent<HTMLDivElement>) => {
    const slider = sliderRef.current;
    const expectedPointerId = pointerIdRef.current;

    if (event && expectedPointerId !== null && event.pointerId !== expectedPointerId) {
      return;
    }

    if (slider && expectedPointerId !== null) {
      try {
        slider.releasePointerCapture(expectedPointerId);
      } catch {
        // Capture may already be released.
      }
    }

    isDraggingRef.current = false;
    pointerIdRef.current = null;

    if (!slider) return;

    let momentum = -velocityRef.current * 26;
    const minMomentum = 0.05;
    const friction = 0.94;

    const animateMomentum = () => {
      if (Math.abs(momentum) < minMomentum || isDraggingRef.current) {
        momentumFrameRef.current = null;
        return;
      }

      slider.scrollLeft += momentum;
      momentum *= friction;
      momentumFrameRef.current = requestAnimationFrame(animateMomentum);
    };

    momentumFrameRef.current = requestAnimationFrame(animateMomentum);
  };

  return (
    <section
      id="Tutors"
      ref={sectionRef}
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f9f7f2_0%,#f5f3ef_40%,#f7f6f3_100%)] px-4 py-16 md:px-8 md:py-24"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent" />
      <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-[#ffdbd1]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-[#d8e6ff]/35 blur-3xl" />

      <div className={`w-full ${beVietnamPro.className}`}>
        <div
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-[#1f293d] md:text-6xl">
            Đội ngũ gia sư
          </h2>
          <p className="mt-6 text-xl font-semibold text-[#293247] md:text-2xl">
            Song Nguyen gồm nhiều gia sư chất lượng cao
          </p>
          <p className="mt-4 text-base leading-8 text-[#4a5366] md:text-lg">
            Những giáo viên giỏi kiến thức và truyền đạt, tận tâm với học viên,
            luôn cải tiến để đem đến hiệu quả học tập tốt nhất.
          </p>
        </div>

        <div className="relative mt-12">
          <div
            ref={sliderRef}
            className="flex cursor-grab gap-5 overflow-x-auto pb-4 select-none touch-pan-y active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {loopTutors.map((tutor, idx) => {
              return (
                <article
                  key={`${tutor.id}-${idx}`}
                  className={`min-w-[280px] flex-shrink-0 transition-all duration-700 sm:min-w-[300px] ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-12 opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${(idx % tutors.length) * 80}ms`,
                  }}
                >
                  <div className="group relative overflow-hidden rounded-[22px] bg-white/75">
                    <Image
                      src={tutor.image}
                      alt={tutor.name}
                      draggable={false}
                      className="h-[360px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/45 to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white/95 backdrop-blur-sm md:text-sm">
                      {tutor.score}
                    </span>
                    <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-[#07142c]/85 via-[#07142c]/45 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
                      <div className="w-full translate-y-4 px-4 pb-4 text-white transition-transform duration-300 ease-out group-hover:translate-y-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/85 md:text-[11px]">
                          Trình độ
                        </p>
                        <p className="mt-1 text-sm font-bold leading-snug md:text-base">
                          {tutor.qualification}
                        </p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-white/85 md:text-[11px]">
                          Bằng cấp
                        </p>
                        <p className="mt-1 text-xs leading-5 text-white/95 md:text-sm">
                          {tutor.certificates.join(" • ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="mt-4 text-[26px] font-bold leading-tight text-[#2a2f3d] md:text-[30px]">
                    {tutor.name}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#667085] md:text-base">
                    {tutor.role}
                  </p>
                </article>
              );
            })}
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-10 bg-gradient-to-r from-[#f6f4ef] to-transparent md:w-16" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-10 bg-gradient-to-l from-[#f6f4ef] to-transparent md:w-16" />
        </div>
        <p className="mt-4 text-center text-sm font-medium text-[#6c7484] md:text-base">
          Nhấn giữ và Kéo ngang để xem thêm gia sư
        </p>
      </div>
    </section>
  );
}


function AboutAndProcessSection({
  onOpenSignup,
}: {
  onOpenSignup: (type: SignupType) => void;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [vis, setVis] = useState(false);
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  const steps = [
    { n: 1, title: "Đăng ký & Sàng lọc hồ sơ", short: "Đăng ký", desc: "Gia sư đăng ký trực tuyến và cung cấp đầy đủ thông tin cá nhân, chuyên môn, môn giảng dạy và khu vực nhận lớp. Hồ sơ bao gồm ảnh chân dung, bằng cấp hoặc chứng chỉ liên quan. Bộ phận tuyển dụng xét duyệt trong vòng 24–48 giờ và phản hồi qua Email, SMS hoặc Zalo.", icon: "📋", color: "#2563eb" },
    { n: 2, title: "Phỏng vấn & Kiểm tra năng lực", short: "Phỏng vấn", desc: "Gia sư tự do trải qua phỏng vấn online hoặc trực tiếp tập trung vào kỹ năng giao tiếp và phương pháp dạy. Gia sư đào tạo tham gia vòng kiểm tra chuyên môn và kỹ năng sư phạm, bao gồm bài thi viết, thuyết trình ngắn và demo dạy thử.", icon: "🎯", color: "#dc2626" },
    { n: 3, title: "Đào tạo nghiệp vụ sư phạm", short: "Đào tạo", desc: "Gia sư đào tạo tham gia chương trình đào tạo bài bản tại trung tâm, được trang bị kỹ năng sư phạm nâng cao, phương pháp giảng dạy hiệu quả và kỹ năng xử lý tình huống thực tế. Kết thúc đào tạo, gia sư nhận chứng chỉ Song Nguyen Education.", icon: "🎓", color: "#0891b2" },
    { n: 4, title: "Kích hoạt & Nhận lớp", short: "Nhận lớp", desc: "Sau khi hoàn tất quy trình, hồ sơ gia sư được kích hoạt chính thức trên hệ thống. Gia sư tự do đóng lệ phí nhận lớp tương đương 30% học phí tháng đầu. Gia sư đào tạo được ưu tiên ghép lớp phù hợp theo chuyên môn và khu vực hoạt động.", icon: "✅", color: "#16a34a" },
  ];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.06 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const goStep = (i: number) => {
    if (i === step || animating) return;
    setAnimating(true);
    setStep(i);
    setTimeout(() => setAnimating(false), 350);
  };

  const cur = steps[step];

  return (
    <section ref={sectionRef} className={`relative overflow-hidden bg-gradient-to-b from-[#f8faff] via-white to-[#f0f4ff] py-16 md:py-24 ${beVietnamPro.className}`}>
      {/* Subtle decorative elements */}
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full border border-[#2563eb]/[0.04]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 -translate-x-1/3 translate-y-1/4 rounded-full border border-[#dc2626]/[0.03]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2563eb]/[0.015]" />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">

        {/* ═══ ABOUT — PREMIUM ═══ */}
        <div className="relative">
          {/* Decorative grid dots */}
          <div className="pointer-events-none absolute -left-4 top-0 hidden md:block">
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="h-1 w-1 rounded-full bg-[#2563eb]/[0.12]" />
              ))}
            </div>
          </div>

          {/* Main heading area */}
          <div className={`transition-all duration-700 ${vis ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <div className="inline-flex items-center rounded-md bg-[#2563eb]/10 px-3 py-1">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#2563eb]">Về chúng tôi</span>
            </div>

            <h2 className="mt-4 text-[30px] font-extrabold leading-[1.2] text-[#0f1d40] md:text-[40px]">
              <span className={`inline-block transition-all duration-500 ${vis ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>Song Nguyen Education</span>
            </h2>
            <p className={`mt-1 text-[18px] font-medium text-[#5a6b8a] transition-all duration-500 delay-200 md:text-[20px] ${vis ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
              Nền tảng giáo dục <span className="font-bold text-[#2563eb]">minh bạch</span> · <span className="font-bold text-[#dc2626]">tận tâm</span> · <span className="font-bold text-[#0f1d40]">chất lượng</span>
            </p>
          </div>

          {/* Description + Stats */}
          <div className="mt-6 grid items-start gap-8 md:grid-cols-[1fr_auto]">
            <p className={`max-w-2xl text-[15px] leading-[1.85] text-[#4b5873] transition-all duration-600 delay-300 ${vis ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
              Trung tâm được xây dựng với mong muốn tạo nên một môi trường giáo dục minh bạch, tận tâm và chất lượng — nơi mỗi học sinh đều có cơ hội tiếp cận phương pháp học phù hợp cùng đội ngũ gia sư được tuyển chọn kỹ lưỡng và đào tạo bài bản. Bên cạnh mô hình gia sư tại nhà, Song Nguyen Education còn phát triển hệ thống lớp học trực tiếp tại trung tâm.
            </p>

            {/* Mini stats */}
            <div className={`grid grid-cols-2 gap-3 transition-all duration-600 delay-400 ${vis ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
              {[
                { num: "500+", label: "Gia sư", color: "#2563eb" },
                { num: "1000+", label: "Học sinh", color: "#dc2626" },
                { num: "50+", label: "Môn học", color: "#0891b2" },
                { num: "24h", label: "Phản hồi", color: "#16a34a" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`group flex flex-col items-center rounded-xl border border-[#e8ecf4] bg-white px-5 py-3 transition-all duration-400 hover:shadow-md ${vis ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
                  style={{ transitionDelay: `${400 + i * 100}ms` }}
                >
                  <span className="text-[22px] font-extrabold transition-colors duration-300 group-hover:text-current" style={{ color: s.color }}>{s.num}</span>
                  <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#8896b0]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vision / Mission / Contact — enhanced cards */}
          <div className={`mt-8 grid gap-4 sm:grid-cols-3 transition-all duration-600 delay-500 ${vis ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
            {[
              { icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, label: "Tầm nhìn", text: "Trở thành hệ thống gia sư và giáo dục uy tín hàng đầu, nơi chất lượng giảng dạy luôn được đặt lên hàng đầu.", color: "#2563eb", gradient: "from-[#2563eb]/5 to-transparent" },
              { icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>, label: "Sứ mệnh", text: "Kết nối học sinh — gia sư phù hợp. Nâng cao chất lượng qua đào tạo. Xây dựng môi trường giáo dục tận tâm, minh bạch.", color: "#dc2626", gradient: "from-[#dc2626]/5 to-transparent" },
              { icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>, label: "Liên hệ ngay", text: "Hotline: 0988 212 316\nEmail: songnguyeneducationcoltd@gmail.com", color: "#0891b2", gradient: "from-[#0891b2]/5 to-transparent" },
            ].map((c, i) => (
              <div
                key={c.label}
                className={`group relative overflow-hidden rounded-2xl border border-[#e8ecf4] bg-white transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${vis ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{ transitionDelay: `${500 + i * 100}ms` }}
              >
                {/* Left accent bar */}
                <div className="absolute bottom-0 left-0 top-0 w-1 transition-all duration-400 group-hover:w-1.5" style={{ background: c.color }} />

                {/* Hover gradient overlay */}
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 transition-opacity duration-400 group-hover:opacity-100`} />

                <div className="relative p-5 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-md" style={{ background: `${c.color}0c` }}>
                      {c.icon}
                    </div>
                    <h4 className="text-[14px] font-bold text-[#0f1d40]">{c.label}</h4>
                  </div>
                  <p className="mt-2.5 whitespace-pre-line text-[13px] leading-[1.7] text-[#5a6b8a]">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ PROCESS TIMELINE — PREMIUM ═══ */}
        <div className={`mt-16 transition-all duration-700 delay-300 ${vis ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          {/* Section header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center rounded-md bg-[#dc2626]/10 px-3 py-1">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#dc2626]">Quy trình tuyển chọn</span>
              </div>
              <h2 className="mt-4 text-[26px] font-extrabold leading-[1.2] text-[#0f1d40] md:text-[34px]">
                <span className={`inline-block transition-all duration-500 delay-300 ${vis ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>4 bước trở thành gia sư</span>
              </h2>
              <p className={`mt-2 text-[15px] text-[#5a6b8a] transition-all duration-500 delay-500 ${vis ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                Quy trình chuyên nghiệp, rõ ràng từ đăng ký đến nhận lớp
              </p>
            </div>

            {/* Step counter ring */}
            <div className="hidden flex-col items-center md:flex">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#e8ecf4" strokeWidth="3" />
                  <circle cx="32" cy="32" r="28" fill="none" strokeWidth="3" strokeLinecap="round"
                    className="transition-all duration-500"
                    style={{
                      stroke: cur.color,
                      strokeDasharray: `${2 * Math.PI * 28}`,
                      strokeDashoffset: `${2 * Math.PI * 28 * (1 - (step + 1) / steps.length)}`,
                    }}
                  />
                </svg>
                <span className="text-[18px] font-extrabold" style={{ color: cur.color }}>{step + 1}<span className="text-[12px] text-[#8896b0]">/{steps.length}</span></span>
              </div>
              <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[#8896b0]">Tiến trình</span>
            </div>
          </div>

          {/* ── Timeline + Content grid ── */}
          <div className="mt-8 grid gap-6 md:grid-cols-[220px_1fr]">

            {/* Left: Vertical step selector */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute bottom-0 left-5 top-0 hidden w-0.5 bg-[#e8ecf4] md:block" />
              <div
                className="absolute left-5 top-0 hidden w-0.5 transition-all duration-500 ease-out md:block"
                style={{ height: `${(step / (steps.length - 1)) * 100}%`, background: cur.color }}
              />

              <div className="flex gap-2 overflow-x-auto md:flex-col md:gap-0 md:overflow-visible">
                {steps.map((s, i) => {
                  const isActive = i === step;
                  const isDone = i < step;
                  return (
                    <button
                      key={s.n}
                      type="button"
                      onClick={() => goStep(i)}
                      className={`group flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-300 md:rounded-l-xl md:rounded-r-none ${
                        isActive ? "bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]" : "hover:bg-white/60"
                      }`}
                    >
                      {/* Circle */}
                      <div
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-400 ${
                          isActive
                            ? "text-white shadow-lg ring-4 ring-current/10"
                            : isDone
                            ? "text-white"
                            : "border-2 border-[#d1d9e6] bg-white text-[#8896b0] group-hover:border-[#a0aec0]"
                        }`}
                        style={isActive || isDone ? { background: s.color, borderColor: s.color } : {}}
                      >
                        {isDone ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        ) : s.n}
                        {isActive && <span className="absolute inset-0 animate-ping rounded-full opacity-20" style={{ background: s.color }} />}
                      </div>

                      {/* Text */}
                      <div className="hidden min-w-0 md:block">
                        <span className={`block text-[13px] font-bold transition-colors duration-300 ${isActive ? "text-[#0f1d40]" : "text-[#8896b0]"}`}>
                          {s.short}
                        </span>
                        <span className={`block truncate text-[11px] transition-colors duration-300 ${isActive ? "text-[#5a6b8a]" : "text-[#b0b9cc]"}`}>
                          Bước {s.n}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Step detail card */}
            <div className="relative overflow-hidden rounded-2xl border border-[#e8ecf4] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              {/* Top gradient bar */}
              <div className="h-1.5 transition-colors duration-400" style={{ background: `linear-gradient(90deg, ${cur.color}, ${cur.color}88)` }} />

              {/* Decorative corner circle */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-[0.04] transition-colors duration-400" style={{ background: cur.color }} />

              <div className={`relative p-6 transition-all duration-350 md:p-8 ${animating ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`}>
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-sm transition-transform duration-500"
                    style={{ background: `${cur.color}0c`, border: `1px solid ${cur.color}15` }}
                  >
                    {cur.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-white" style={{ background: cur.color }}>
                        BƯỚC {cur.n}
                      </span>
                      {step === 3 && <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Hoàn tất</span>}
                    </div>
                    <h3 className="mt-1.5 text-[20px] font-extrabold leading-tight text-[#0f1d40] md:text-[22px]">{cur.title}</h3>
                  </div>
                </div>

                {/* Body */}
                <p className="mt-4 text-[15px] leading-[1.85] text-[#4b5873]">{cur.desc}</p>

                {/* Step-specific highlights */}
                {step === 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Gia sư tự do", "Gia sư đào tạo"].map((t) => (
                      <span key={t} className="inline-flex items-center gap-1.5 rounded-lg border border-[#2563eb]/15 bg-[#2563eb]/[0.04] px-3 py-1.5 text-[12px] font-semibold text-[#2563eb]">
                        <span className="h-1 w-1 rounded-full bg-[#2563eb]" />
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {step === 1 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {["Bài thi viết", "Thuyết trình", "Demo dạy thử"].map((t) => (
                      <div key={t} className="rounded-lg bg-[#dc2626]/[0.04] px-3 py-2 text-center text-[12px] font-semibold text-[#dc2626]">{t}</div>
                    ))}
                  </div>
                )}
                {step === 2 && (
                  <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#0891b2]/[0.04] p-3">
                    <svg className="h-5 w-5 shrink-0 text-[#0891b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                    <span className="text-[13px] font-semibold text-[#0891b2]">Nhận chứng chỉ Song Nguyen Education sau khi hoàn thành đào tạo</span>
                  </div>
                )}
                {step === 3 && (
                  <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#16a34a]/[0.04] p-3">
                    <svg className="h-5 w-5 shrink-0 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span className="text-[13px] font-semibold text-[#16a34a]">Bắt đầu nhận lớp và đồng hành cùng học sinh ngay hôm nay!</span>
                  </div>
                )}

                {/* Footer nav */}
                <div className="mt-6 flex items-center justify-between border-t border-[#f0f2f7] pt-4">
                  <div className="flex items-center gap-2">
                    {steps.map((s, i) => (
                      <button
                        key={s.n}
                        type="button"
                        onClick={() => goStep(i)}
                        className={`h-1.5 rounded-full transition-all duration-400 ${i === step ? "w-8" : "w-1.5 hover:bg-[#a0aec0]"}`}
                        style={{ background: i === step ? cur.color : "#dde3ee" }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={() => goStep(step - 1)}
                        className="group/btn flex items-center gap-1 rounded-lg border border-[#e2e8f3] px-3.5 py-2 text-[12px] font-semibold text-[#5a6b8a] transition-all duration-200 hover:bg-[#f5f7fb]"
                      >
                        <svg className="h-3 w-3 transition-transform duration-200 group-hover/btn:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        Trước
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (step === 3) {
                          onOpenSignup("tutor-free");
                          return;
                        }
                        goStep(step + 1);
                      }}
                      className="group/btn flex items-center gap-1 rounded-lg px-4 py-2 text-[12px] font-bold text-white transition-all duration-200 hover:brightness-110 hover:shadow-md"
                      style={{ background: cur.color }}
                    >
                      {step === 3 ? "Đăng ký ngay" : "Tiếp theo"}
                      <svg className="h-3 w-3 transition-transform duration-200 group-hover/btn:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ TUTOR TYPES — PREMIUM ═══ */}
        <div className={`mt-16 transition-all duration-700 delay-400 ${vis ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto inline-flex items-center rounded-md bg-[#7c3aed]/10 px-3 py-1">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#7c3aed]">So sánh hình thức</span>
            </div>
            <h3 className="mt-4 text-[26px] font-extrabold text-[#0f1d40] md:text-[32px]">
              <span className={`inline-block transition-all duration-500 delay-400 ${vis ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>Hai hình thức hợp tác</span>
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-[15px] text-[#5a6b8a]">Lựa chọn hình thức phù hợp với năng lực và mục tiêu của bạn</p>
          </div>

          {/* Cards grid with VS */}
          <div className="relative mt-8 grid gap-6 md:grid-cols-2">
            {[
              {
                tag: "Gia sư tự do",
                icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
                title: "Linh hoạt — Chi phí tối ưu",
                subtitle: "Dành cho sinh viên & gia sư kinh nghiệm",
                items: [
                  { text: "Lệ phí nhận lớp 30% học phí tháng đầu", included: true },
                  { text: "Tự chủ trong giảng dạy và phương pháp", included: true },
                  { text: "Phản hồi hồ sơ trong 24–48 giờ", included: true },
                  { text: "Đào tạo nghiệp vụ sư phạm", included: false },
                  { text: "Chứng chỉ Song Nguyen Education", included: false },
                  { text: "Ưu tiên ghép lớp theo chuyên môn", included: false },
                ],
                color: "#2563eb",
                featured: false,
                cta: "Đăng ký gia sư tự do",
                signupType: "tutor-free" as const,
              },
              {
                tag: "Gia sư đào tạo",
                icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>,
                title: "Chuyên nghiệp — Được chứng nhận",
                subtitle: "Đầu tư nghiêm túc, phát triển lâu dài",
                items: [
                  { text: "Được đào tạo nghiệp vụ sư phạm bài bản", included: true },
                  { text: "Nhận chứng chỉ Song Nguyen Education", included: true },
                  { text: "Ưu tiên ghép lớp phù hợp chuyên môn", included: true },
                  { text: "Theo dõi & hỗ trợ suốt quá trình dạy", included: true },
                  { text: "Tham gia cộng đồng gia sư nội bộ", included: true },
                  { text: "Cơ hội trở thành gia sư cốt lõi", included: true },
                ],
                color: "#dc2626",
                featured: true,
                cta: "Đăng ký gia sư đào tạo",
                signupType: "tutor-trained" as const,
              },
            ].map((card, ci) => (
              <div
                key={card.tag}
                className={`group relative overflow-hidden rounded-xl border bg-white transition-all duration-400 hover:shadow-lg ${
                  card.featured ? "border-[#dc2626]/20" : "border-[#e8ecf4]"
                } ${vis ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                style={{ transitionDelay: `${500 + ci * 150}ms` }}
              >
                {/* Featured top gradient */}
                {card.featured && (
                  <div className="h-1.5 bg-gradient-to-r from-[#dc2626] via-[#ef4444] to-[#dc2626]" />
                )}

                <div className="relative p-6 md:p-7">
                  {/* Tag + badge */}
                  <div className="flex items-center gap-2.5">
                    <span className="flex text-current" style={{ color: card.color }}>{card.icon}</span>
                    <span className="rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white" style={{ background: card.color }}>{card.tag}</span>
                    {card.featured && (
                      <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        Khuyên dùng
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="mt-3 text-[20px] font-extrabold text-[#0f1d40]">{card.title}</h4>
                  <p className="mt-1 text-[13px] text-[#5a6b8a]">{card.subtitle}</p>

                  {/* Divider */}
                  <div className="my-4 h-px bg-[#f0f2f7]" />

                  {/* Feature list */}
                  <ul className="space-y-2.5">
                    {card.items.map((item, j) => (
                      <li
                        key={item.text}
                        className={`flex items-start gap-2.5 text-[14px] leading-[1.6] ${item.included ? "text-[#2d3a52]" : "text-[#b0b9cc]"}`}
                        style={{ transitionDelay: `${j * 40}ms` }}
                      >
                        {item.included ? (
                          <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="9" fill={`${card.color}12`} />
                            <path d="M6 10.5l2.5 2.5L14 7.5" stroke={card.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="9" fill="#f0f2f7" />
                            <path d="M7 7l6 6M13 7l-6 6" stroke="#b0b9cc" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        )}
                        <span className={item.included ? "" : "line-through"}>{item.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    type="button"
                    onClick={() => onOpenSignup(card.signupType)}
                    className="group/cta mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    style={
                      card.featured
                        ? { background: card.color, color: "white" }
                        : { border: `1.5px solid ${card.color}`, color: card.color }
                    }
                  >
                    {card.cta}
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CountingSection() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      id: 1,
      kind: "number" as const,
      value: 5000,
      suffix: "+",
      label: "GIA SƯ UY TÍN",
      cardClass: "bg-white text-[#0f318f]",
      labelClass: "text-[#434854]",
    },
    {
      id: 2,
      kind: "number" as const,
      value: 98,
      suffix: "%",
      label: "HỌC SINH TIẾN BỘ",
      cardClass: "bg-[#0b2f97] text-white",
      labelClass: "text-white/90",
    },
    {
      id: 3,
      kind: "number" as const,
      value: 12,
      suffix: "+",
      label: "NĂM KINH NGHIỆM",
      cardClass: "bg-white text-[#0f318f]",
      labelClass: "text-[#434854]",
    },
    {
      id: 4,
      kind: "text" as const,
      value: "TPHCM",
      label: "PHẠM VI HOẠT ĐỘNG",
      cardClass: "bg-[#c6d5f2] text-[#5c6a86]",
      labelClass: "text-[#5c6a86]",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef3ff_38%,#e9eef8_100%)] px-4 py-16 md:px-6 md:py-24"
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-60 w-60 rounded-full bg-[#85a9ff]/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-16 h-72 w-72 rounded-full bg-[#7ec9ff]/25 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div
          className={`transition-all duration-700 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          } ${beVietnamPro.className}`}
        >
          <p className="mb-3 text-sm font-semibold tracking-[0.08em] text-[#6c7ea4] md:text-base">
            Thành tựu Song Nguyen Education
          </p>
          <h2 className="max-w-[18ch] text-3xl font-extrabold leading-[1.12] text-[#112a68] max-[360px]:text-[26px] md:text-5xl">
            Số liệu biết nói, minh chứng cho chất lượng đào tạo.
          </h2>
          <p className="mt-5 max-w-[42ch] text-base font-medium leading-8 text-[#4b5873] md:text-lg">
            Chúng tôi tập trung vào kết quả thực tế: nâng cao năng lực học tập,
            xây dựng tư duy và tạo hành trình tiến bộ bền vững cho từng học viên.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5">
            {stats.map((item, idx) => (
              <article
                key={item.id}
                className={`group flex min-h-[140px] sm:min-h-[200px] flex-col justify-center rounded-[20px] sm:rounded-[24px] border border-white/60 p-4 sm:p-8 shadow-[0_16px_40px_rgba(15,34,91,0.08)] transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,34,91,0.16)] ${
                  inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                } ${item.cardClass}`}
                style={{ transitionDelay: `${120 + idx * 110}ms` }}
              >
                <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight md:text-6xl">
                  {item.kind === "number" ? (
                    <CountUpValue value={item.value} suffix={item.suffix} start={inView} />
                  ) : (
                    item.value
                  )}
                </h3>
                <p
                  className={`mt-2 sm:mt-5 max-w-[11ch] text-[13px] sm:text-2xl font-bold uppercase leading-tight tracking-[0.08em] transition-all duration-700 md:text-3xl ${
                    inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  } ${item.labelClass}`}
                  style={{ transitionDelay: `${220 + idx * 110}ms` }}
                >
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div
          className={`relative mx-auto w-full max-w-[520px] flex flex-col items-center transition-all duration-700 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          <div className="relative overflow-hidden rounded-[34px] bg-[#dce7ff] p-3 shadow-[0_24px_60px_rgba(14,39,111,0.22)] w-full">
            <Image
              src={statsMainImage}
              alt="Hoc vien trong lop hoc"
              className="h-[480px] w-full rounded-[26px] object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-x-3 bottom-3 h-32 rounded-b-[26px] bg-gradient-to-t from-[#0b2f97]/55 to-transparent" />
          </div>

          <div className="absolute -bottom-4 left-0 w-[60%] overflow-hidden rounded-[20px] border border-white/70 bg-white/85 p-2 shadow-[0_18px_36px_rgba(15,34,91,0.18)] backdrop-blur-md md:-bottom-7 md:-left-7 md:w-[46%]">
            <Image
              src={statsSubImage}
              alt="Gia su huong dan hoc vien"
              className="h-36 w-full rounded-[14px] object-cover"
            />
            <p className="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#29417b] md:text-sm">
              Lộ Trình Cá Nhân Hóa
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectFooter() {
  const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({
    hcm: false,
    hanoi: false,
    danang: false,
  });

  const campuses = {
    hcm: {
      title: "CƠ SỞ TẠI TP.HCM",
      items: [
        "Cơ sở 1: Số 3 TA15, Phường Thới An, TP.HCM",
        "Cơ sở 2: 27/31 Đường số 9, Phường An Hội Đông, TP.HCM",
        "Cơ sở 3: 188 Quang Trung, Phường Hạnh Thông, TP.HCM",
      ],
    },
    hanoi: {
      title: "CƠ SỞ TẠI HÀ NỘI",
      items: [
        "Cơ sở 1: Tầng 3, 275 Nguyễn Trãi, Thanh Xuân, Hà Nội",
        "Cơ sở 2: 158 Phố Chùa Láng, Đống Đa, Hà Nội",
      ],
    },
    danang: {
      title: "CƠ SỞ TẠI ĐÀ NẴNG",
      items: [
        "Cơ sở 1: 87 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
      ],
    },
  } as const;

  const courseLinks = [
    "Toán tư duy",
    "Tiếng Anh học thuật",
    "Luyện thi IELTS",
    "Luyện thi SAT",
    "Luyện thi vào 10",
    "Bồi dưỡng học sinh giỏi",
  ];

  const serviceLinks = [
    "Tìm gia sư tại nhà",
    "Gia sư online",
    "Đăng ký làm gia sư",
    "Chính sách học phí",
    "Lịch học & ưu đãi",
    "Câu hỏi thường gặp",
  ];

  const toggleCity = (cityKey: string) => {
    setExpandedCities((prev) => ({
      ...prev,
      [cityKey]: !prev[cityKey],
    }));
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`relative overflow-hidden bg-[linear-gradient(180deg,#141f3f_0%,#0f1a34_45%,#0c152a_100%)] px-4 pb-8 pt-14 md:px-8 md:pt-20 beVietnamPro`}>
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#4b7dff]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-8 h-72 w-72 rounded-full bg-[#73c7ff]/16 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_0.9fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3">
              {/* Logo và tên */}
              {/* Nếu cần import logoImage thì bổ sung ở đầu file */}
              <Image
                src={logoImage}
                alt="Song Nguyen Education"
                width={62}
                height={62}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <p className="text-xl font-black uppercase tracking-[0.06em] text-white">Song Nguyen Education</p>
                <p className="mt-1 text-sm font-medium text-[#9fb6e6]">Trung tâm đào tạo năng lực học thuật & kỹ năng học tập</p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {(Object.keys(campuses) as Array<keyof typeof campuses>).map((cityKey) => {
                const city = campuses[cityKey];
                const expanded = expandedCities[cityKey];
                const visibleItems = expanded ? city.items : city.items.slice(0, 1);
                const hiddenCount = city.items.length - visibleItems.length;

                return (
                  <article key={cityKey} className="border-t border-white/10 pt-4">
                    <h4 className="text-sm font-bold tracking-[0.08em] text-[#8ea9dc]">{city.title}</h4>
                    <div className="mt-3 space-y-2">
                      {visibleItems.map((item) => (
                        <p key={item} className="text-sm leading-7 text-[#e8eeff] md:text-base">{item}</p>
                      ))}
                    </div>

                    {city.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => toggleCity(cityKey)}
                        className="mt-2 text-sm font-semibold text-[#9ec8ff] transition-colors hover:text-white"
                      >
                        {expanded ? "Thu gọn" : `Xem thêm ${hiddenCount} cơ sở`}
                      </button>
                    )}
                  </article>
                );
              })}
            </div>

            <div className="mt-7 border-t border-white/10 pt-4">
              <p className="text-sm font-bold tracking-[0.08em] text-[#8ea9dc]">THÔNG TIN LIÊN HỆ</p>
              <p className="mt-3 text-sm text-[#e8eeff] md:text-base">Hotline: 1800 9696 39</p>
              <p className="mt-1 text-sm text-[#e8eeff] md:text-base">Email: support@songnguyenedu.vn</p>
              <p className="mt-1 text-sm text-[#e8eeff] md:text-base">Facebook: fb.com/songnguyeneducation</p>
            </div>
          </div>

          <div>
            <h4 className="border-b border-white/10 pb-3 text-sm font-bold tracking-[0.08em] text-[#8ea9dc]">KHÓA HỌC NỔI BẬT</h4>
            <ul className="mt-4 space-y-2">
              {courseLinks.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="text-left text-sm font-semibold text-white/95 transition-all duration-200 hover:translate-x-1 hover:text-[#9ec8ff]"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="border-b border-white/10 pb-3 text-sm font-bold tracking-[0.08em] text-[#8ea9dc]">DỊCH VỤ & CHÍNH SÁCH</h4>
            <ul className="mt-4 space-y-2">
              {serviceLinks.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="text-left text-sm font-semibold text-white/95 transition-all duration-200 hover:translate-x-1 hover:text-[#9ec8ff]"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <p className="text-sm font-bold text-[#8ea9dc]">Theo dõi chúng tôi</p>
              <div className="mt-3 flex gap-3">
                {[
                  { label: "FB", value: "Facebook" },
                  { label: "YT", value: "YouTube" },
                  { label: "TT", value: "TikTok" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    aria-label={item.value}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-sm font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8fc3ff] hover:bg-[#1e3668]"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-5 text-sm text-[#a9bbdf] md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} Song Nguyen Education. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <button type="button" className="transition-colors hover:text-white">Giới thiệu</button>
            <button type="button" className="transition-colors hover:text-white">Chính sách bảo mật</button>
            <button type="button" className="transition-colors hover:text-white">Điều khoản sử dụng</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function CountUpValue({
  value,
  suffix,
  start,
}: {
  value: number;
  suffix: string;
  start: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!start) {
      setDisplayValue(0);
      return;
    }

    const duration = 1500;
    const startTime = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, value]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}
