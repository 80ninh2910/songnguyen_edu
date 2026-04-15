"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import Image from "next/image";
import { Be_Vietnam_Pro, Bricolage_Grotesque } from "next/font/google";
import { useEffect, useRef, useState } from "react";
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

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin", "vietnamese"],
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

type ProcessType = "parent" | "tutor";

export default function NavbarDemo() {
  const navItems = [
    {
      name: "Trang chủ",
      link: "#Main",
    },
    {
      name: "Học phí",
      link: "#pricing",
    },
    {
      name: "Tìm gia sư",
      link: "#Tutors",
    },
    {
      name: "Về chúng tôi",
      link: "#features",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeProcessModal, setActiveProcessModal] = useState<ProcessType | null>(null);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton href="/login" variant="secondary">Login</NavbarButton>
            <NavbarButton variant="primary">Book a call</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-black"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <BackgroundLinesDemo />
      <TemplateContentSection />
      {/* ĐÃ XÓA: Hệ Thống Gia Sư & Giáo Viên section theo yêu cầu */}
      <section className="bg-[#edf2f8] px-4 py-10 md:px-8 md:py-12">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="min-w-0">
            <TutorMatchingClassSection onOpenProcessModal={() => setActiveProcessModal("parent")} />
          </div>
          <div className="min-w-0">
            <TutorRegistrationClassSection onOpenProcessModal={() => setActiveProcessModal("tutor")} />
          </div>
        </div>
      </section>
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

      {/* Navbar */}
    </div>
  );

};
export function BackgroundLinesDemo() {
  return (
    <BackgroundLines
      className="flex items-center justify-center w-full flex-col px-4"
      bottomBackgroundImage={background19.src}
    >
      <div className="px-2 pb-28 md:pb-36">
        <h2 className="text-center text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
          <span className="text-red-600">SONG NGUYEN</span>
          <br />
          <span className="text-neutral-800">EDUCATION</span>
        </h2>
        <Image
          src={logoImage}
          alt="line1"
          width={180}
          height={180}
          className="mx-auto -mt-3 block h-36 w-36 rounded-full object-cover shadow-md"
        />
        <br />
        <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
          trung tâm đào tạo năng khiếu và văn hóa, với sứ mệnh giúp học sinh phát triển toàn diện về kiến thức, kỹ năng và tư duy sáng tạo.
        </p>
      </div>

      <div className={`${beVietnamPro.className} absolute inset-x-4 bottom-0 z-30 md:bottom-1`}>
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 md:grid-cols-[1fr_2.2fr_1fr] md:gap-4">
          <button
            type="button"
            className="w-full rounded-2xl bg-[linear-gradient(180deg,rgba(232,41,53,0.88)_0%,rgba(217,31,43,0.84)_55%,rgba(191,23,34,0.8)_100%)] px-6 py-3.5 text-sm font-semibold tracking-[-0.01em] text-white backdrop-blur-xl transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-[0.98]"
          >
            Tôi là phụ huynh tìm gia sư
          </button>

          <div className="flex min-h-14 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(241,246,255,0.9)_100%)] px-6 py-3.5 text-center text-sm font-medium tracking-[-0.01em] text-[#3a3a3c] backdrop-blur-xl transition-transform duration-300 ease-out hover:scale-[1.02] md:text-base">
            Cơ sở 1: Số 3 TA 15, Phường Thới An, TP.HCM
            <br />
            Cơ sở 2: 27/31 Đường số 9, Phường An Hội Đông, TP.HCM
          </div>

          <button
            type="button"
            className="w-full rounded-2xl bg-[linear-gradient(180deg,rgba(232,41,53,0.88)_0%,rgba(217,31,43,0.84)_55%,rgba(191,23,34,0.8)_100%)] px-6 py-3.5 text-sm font-semibold tracking-[-0.01em] text-white backdrop-blur-xl transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-[0.98]"
          >
            Tôi là gia sư tìm lớp
          </button>
        </div>
      </div>
    </BackgroundLines>
  );
}

function TemplateContentSection() {
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
              <button className="mt-8 w-full rounded-xl bg-[linear-gradient(135deg,#0053cc_0%,#779dff_100%)] py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(0,83,204,0.28)]">Đăng ký ngay</button>
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

function TutorMatchingClassSection({
  onOpenProcessModal,
}: {
  onOpenProcessModal: () => void;
}) {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [studentForm, setStudentForm] = useState({
    phone: "",
    subject: "",
    gender: "",
    location: "",
    level: "",
    studentCount: "",
    sessionsPerWeek: "",
  });
  const [tutorForm, setTutorForm] = useState({
    gender: "",
    detail: "",
    level: "",
  });
  const [activeWeekdays, setActiveWeekdays] = useState<string[]>([]);
  const [activeTimeSlots, setActiveTimeSlots] = useState<string[]>([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const inputBaseClass =
    "h-12 w-full rounded-xl border border-[#d5dff1] bg-white/95 px-4 text-[15px] font-medium text-[#243b72] outline-none transition-all duration-300 placeholder:text-[#6b7aa0] focus:border-[#4f86ff] focus:ring-4 focus:ring-[#8ab4ff]/25";

  const requiredFields = [
    studentForm.phone,
    studentForm.subject,
    studentForm.location,
    studentForm.level,
    studentForm.studentCount,
    studentForm.sessionsPerWeek,
    tutorForm.level,
  ];

  const completedFields = requiredFields.filter((value) => value.trim().length > 0).length;
  const scheduleDone = activeWeekdays.length > 0 && activeTimeSlots.length > 0;
  const completionRate = Math.round(((completedFields + (scheduleDone ? 2 : 0)) / (requiredFields.length + 2)) * 100);

  const estimatedFee = (() => {
    const sessions = Number(studentForm.sessionsPerWeek) || 0;
    const students = Math.max(Number(studentForm.studentCount) || 1, 1);
    const base = subjectBasePrice[studentForm.subject] ?? 250000;
    const levelScale = levelMultiplier[studentForm.level] ?? 1;
    const groupDiscount = students >= 3 ? 0.86 : students === 2 ? 0.93 : 1;
    const value = Math.round(base * sessions * 4 * levelScale * groupDiscount);
    return value > 0 ? value : 1000000;
  })();

  const formatVnd = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  const toggleWeekday = (key: string) => {
    setActiveWeekdays((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const toggleTimeSlot = (slot: string) => {
    setActiveTimeSlots((prev) =>
      prev.includes(slot) ? prev.filter((item) => item !== slot) : [...prev, slot]
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!/^(0|\+84)\d{9,10}$/.test(studentForm.phone.replace(/\s+/g, ""))) {
      nextErrors.phone = "Số điện thoại không hợp lệ.";
    }
    if (!studentForm.subject) nextErrors.subject = "Vui lòng chọn môn học.";
    if (!studentForm.location.trim()) nextErrors.location = "Vui lòng nhập địa điểm dạy.";
    if (!studentForm.level) nextErrors.level = "Vui lòng chọn cấp độ.";
    if (!studentForm.sessionsPerWeek) nextErrors.sessionsPerWeek = "Vui lòng chọn số buổi.";
    if (!studentForm.studentCount) nextErrors.studentCount = "Vui lòng chọn số học viên.";
    if (!tutorForm.level) nextErrors.tutorLevel = "Vui lòng chọn trình độ gia sư.";
    if (activeWeekdays.length === 0) nextErrors.weekdays = "Hãy chọn ít nhất 1 ngày học.";
    if (activeTimeSlots.length === 0) nextErrors.timeSlots = "Hãy chọn ít nhất 1 khung giờ.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitMessage("Thông tin chưa đầy đủ. Vui lòng kiểm tra các trường bắt buộc.");
      return;
    }

    setSubmitMessage("Yêu cầu đã được ghi nhận. Học vụ sẽ liên hệ tư vấn và ghép gia sư phù hợp trong 24h.");
  };

  return (
    <section
      ref={sectionRef}
      id="parent-find-tutor"
      className="relative"
    >
      <div className={`relative mx-auto w-full max-w-7xl ${beVietnamPro.className}`}>
        <article
          className={`overflow-hidden rounded-[30px] border border-[#cfdaef] bg-[#f3f4f7]/92 p-4 shadow-[0_24px_55px_rgba(17,45,112,0.12)] backdrop-blur-sm transition-all duration-700 md:p-6 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-4xl font-black uppercase tracking-[0.02em] text-[#17367b] md:text-[45px]">
            PHỤ HUYNH TÌM GIA SƯ
          </h2>
          <p className="mt-2 max-w-[56ch] text-xl italic leading-9 text-[#1f3f86] md:text-2xl">
            SONG NGUYEN EDUCATION giúp phụ huynh tìm được gia sư phù hợp đồng hành cùng con trên hành trình tri thức
          </p>
          <button
            type="button"
            onClick={onOpenProcessModal}
            className="mt-2 inline-block text-left text-sm italic text-[#2d4f96] underline decoration-[#6f88c0] underline-offset-4 transition-colors hover:text-[#17367b]"
          >
            *Phụ huynh tìm hiểu về quy trình đăng ký lớp tại đây
          </button>

          <div className="mt-4 overflow-hidden rounded-full border border-[#d3dff5] bg-white/80">
            <div
              className="h-2 rounded-full bg-[linear-gradient(90deg,#0d3ea8_0%,#51a5ff_55%,#8fe3ff_100%)] transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold text-[#2a4b8c]">Tiến độ hoàn thiện yêu cầu: {completionRate}%</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="rounded-[24px] border border-white/70 bg-[#e8e9ec] p-4 md:p-5">
              <h3 className="text-[30px] font-extrabold italic text-[#1d3979] md:text-[34px]">Thông tin học viên</h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <input
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Số điện thoại"
                  className={inputBaseClass}
                />
                <select
                  value={studentForm.subject}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, subject: e.target.value }))}
                  className={inputBaseClass}
                >
                  <option value="">Môn học</option>
                  {Object.keys(subjectBasePrice).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <select
                  value={studentForm.gender}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, gender: e.target.value }))}
                  className={inputBaseClass}
                >
                  <option value="">Giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
                <input
                  value={studentForm.location}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Địa điểm dạy"
                  className={inputBaseClass}
                />
                <select
                  value={studentForm.level}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, level: e.target.value }))}
                  className={inputBaseClass}
                >
                  <option value="">Lớp / Cấp độ</option>
                  {Object.keys(levelMultiplier).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <select
                  value={studentForm.studentCount}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, studentCount: e.target.value }))}
                  className={inputBaseClass}
                >
                  <option value="">Số học viên</option>
                  <option value="1">1 học viên</option>
                  <option value="2">2 học viên</option>
                  <option value="3">3 học viên</option>
                  <option value="4">4+ học viên</option>
                </select>
                <select
                  value={studentForm.sessionsPerWeek}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, sessionsPerWeek: e.target.value }))}
                  className={`${inputBaseClass} lg:col-span-1`}
                >
                  <option value="">Số buổi / tuần</option>
                  <option value="1">1 buổi</option>
                  <option value="2">2 buổi</option>
                  <option value="3">3 buổi</option>
                  <option value="4">4 buổi</option>
                  <option value="5">5+ buổi</option>
                </select>
              </div>
              {(errors.phone || errors.subject || errors.location || errors.level || errors.studentCount || errors.sessionsPerWeek) && (
                <p className="mt-3 text-sm font-semibold text-[#cc1f1f]">Vui lòng điền đầy đủ thông tin học viên.</p>
              )}
            </div>

            <div className="mt-4 rounded-[24px] border border-white/70 bg-[#e8e9ec] p-4 md:p-5">
              <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <h3 className="text-[30px] font-extrabold italic text-[#1d3979] md:text-[34px]">Yêu cầu gia sư</h3>
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
                    <select
                      value={tutorForm.level}
                      onChange={(e) => setTutorForm((prev) => ({ ...prev, level: e.target.value }))}
                      className={inputBaseClass}
                    >
                      <option value="">Trình độ</option>
                      <option value="Gia sư">Gia sư</option>
                      <option value="Giáo viên">Giáo viên</option>
                      <option value="Cử nhân / Thạc sĩ">Cử nhân / Thạc sĩ</option>
                    </select>
                  </div>
                  <a
                    href="#"
                    className="mt-2 inline-block text-xs italic text-[#2d4f96] underline decoration-[#6f88c0] underline-offset-4 hover:text-[#17367b]"
                  >
                    * Tìm hiểu về các cấp độ gia sư tại đây
                  </a>
                  {errors.tutorLevel && (
                    <p className="mt-2 text-sm font-semibold text-[#cc1f1f]">{errors.tutorLevel}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#2a4b8c] md:text-base">
                    Các buổi trong tuần học viên có thể học
                  </p>
                  <div className="mt-3 rounded-2xl border border-white/70 bg-white/75 p-4">
                    <div className="grid grid-cols-7 gap-2">
                      {weekDays.map((day) => {
                        const isActive = activeWeekdays.includes(day.key);
                        return (
                          <button
                            key={day.key}
                            type="button"
                            onClick={() => toggleWeekday(day.key)}
                            className={`rounded-xl px-2 py-3 text-center text-sm font-bold transition-all duration-300 md:text-base ${
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

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => {
                        const active = activeTimeSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => toggleTimeSlot(slot)}
                            className={`rounded-xl px-3 py-2 text-sm font-bold transition-all duration-300 ${
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

              <h4 className="mt-5 text-3xl font-extrabold text-[#17367b] md:text-4xl">Học phí tham khảo</h4>

              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr]">
                <div className="relative overflow-hidden rounded-xl bg-[#03933b] px-4 py-4 text-center text-[24px] font-black leading-tight text-white shadow-[0_14px_34px_rgba(3,147,59,0.35)] md:text-[28px] lg:text-[30px]">
                  {formatVnd(estimatedFee)}
                  <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0)_42%,rgba(255,255,255,0.18)_100%)]" />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-[linear-gradient(180deg,#f00b0b_0%,#d80404_100%)] px-4 py-4 text-center text-[22px] font-black leading-tight text-white shadow-[0_16px_34px_rgba(216,4,4,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 md:text-[26px] lg:text-[30px]"
                >
                  Tìm gia sư ngay
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
        </article>
      </div>

    </section>
  );
}

function TutorRegistrationClassSection({
  onOpenProcessModal,
}: {
  onOpenProcessModal: () => void;
}) {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [personalForm, setPersonalForm] = useState({
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
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const weekDays = [
    { key: "su", label: "Su", full: "Chủ nhật" },
    { key: "mo", label: "Mo", full: "Thứ 2" },
    { key: "tu", label: "Tu", full: "Thứ 3" },
    { key: "we", label: "We", full: "Thứ 4" },
    { key: "th", label: "Th", full: "Thứ 5" },
    { key: "fr", label: "Fr", full: "Thứ 6" },
    { key: "sa", label: "Sa", full: "Thứ 7" },
  ];

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
      { threshold: 0.22 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const requiredFields = [
    personalForm.phone,
    personalForm.role,
    personalForm.email,
    personalForm.gender,
    personalForm.address,
    tutorForm.teachingLevel,
    tutorForm.subject,
    tutorForm.school,
    tutorForm.area,
  ];

  const completionRate = Math.round(
    ((requiredFields.filter((value) => value.trim().length > 0).length +
      (activeWeekdays.length > 0 ? 1 : 0)) /
      (requiredFields.length + 1)) *
      100
  );

  const inputBaseClass =
    "h-12 w-full rounded-xl border border-[#d5dff1] bg-white/95 px-4 text-[15px] font-medium text-[#243b72] outline-none transition-all duration-300 placeholder:text-[#6b7aa0] focus:border-[#4f86ff] focus:ring-4 focus:ring-[#8ab4ff]/25";

  const toggleWeekday = (key: string) => {
    setActiveWeekdays((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!/^(0|\+84)\d{9,10}$/.test(personalForm.phone.replace(/\s+/g, ""))) {
      nextErrors.phone = "Số điện thoại không hợp lệ.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalForm.email.trim())) {
      nextErrors.email = "Email không hợp lệ.";
    }
    if (!personalForm.role) nextErrors.role = "Vui lòng chọn vai trò hiện tại.";
    if (!personalForm.gender) nextErrors.gender = "Vui lòng chọn giới tính.";
    if (!personalForm.address.trim()) nextErrors.address = "Vui lòng nhập địa chỉ.";
    if (!tutorForm.teachingLevel) nextErrors.teachingLevel = "Vui lòng chọn lớp dạy.";
    if (!tutorForm.subject.trim()) nextErrors.subject = "Vui lòng nhập môn dạy.";
    if (!tutorForm.school.trim()) nextErrors.school = "Vui lòng nhập trường đã/đang học.";
    if (!tutorForm.area.trim()) nextErrors.area = "Vui lòng nhập khu vực dạy.";
    if (activeWeekdays.length === 0) nextErrors.weekdays = "Vui lòng chọn các buổi có thể dạy.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitMessage("Thông tin chưa đầy đủ. Vui lòng kiểm tra các trường bắt buộc.");
      return;
    }

    setSubmitMessage("Đăng ký thành công. Học vụ sẽ liên hệ xác minh hồ sơ gia sư trong thời gian sớm nhất.");
  };

  return (
    <section
      ref={sectionRef}
      id="tutor-register"
      className="relative"
    >
      <div className={`relative mx-auto w-full max-w-7xl ${beVietnamPro.className}`}>
        <article
          className={`overflow-hidden rounded-[30px] border border-[#cfdaef] bg-[#f0f1f5]/92 p-4 shadow-[0_24px_55px_rgba(17,45,112,0.12)] backdrop-blur-sm transition-all duration-700 md:p-6 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-4xl font-black uppercase tracking-[0.02em] text-[#17367b] md:text-[45px]">
            GIA SƯ ĐĂNG KÝ NHẬN LỚP
          </h2>
          <p className="mt-2 max-w-[56ch] text-xl italic leading-9 text-[#1f3f86] md:text-2xl">
            SONG NGUYEN EDUCATION giúp gia sư kết nối lớp dạy phù hợp và đồng hành hiệu quả cùng học viên
          </p>

          <div className="mt-4 overflow-hidden rounded-full border border-[#d3dff5] bg-white/80">
            <div
              className="h-2 rounded-full bg-[linear-gradient(90deg,#0d3ea8_0%,#51a5ff_55%,#8fe3ff_100%)] transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold text-[#2a4b8c]">Tiến độ hoàn thiện hồ sơ: {completionRate}%</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="rounded-[24px] border border-white/70 bg-[#e6e7eb] p-4 md:p-5">
              <h3 className="text-[30px] font-extrabold text-[#1d3979] md:text-[34px]">Thông tin cá nhân</h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  value={personalForm.phone}
                  onChange={(e) => setPersonalForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Số điện thoại"
                  className={inputBaseClass}
                />
                <select
                  value={personalForm.role}
                  onChange={(e) => setPersonalForm((prev) => ({ ...prev, role: e.target.value }))}
                  className={inputBaseClass}
                >
                  <option value="">Bạn đang là</option>
                  <option value="Sinh viên">Sinh viên</option>
                  <option value="Gia sư tự do">Gia sư tự do</option>
                  <option value="Giáo viên">Giáo viên</option>
                </select>
                <input
                  value={personalForm.email}
                  onChange={(e) => setPersonalForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Email"
                  className={inputBaseClass}
                />
                <select
                  value={personalForm.gender}
                  onChange={(e) => setPersonalForm((prev) => ({ ...prev, gender: e.target.value }))}
                  className={inputBaseClass}
                >
                  <option value="">Giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
                <input
                  value={personalForm.address}
                  onChange={(e) => setPersonalForm((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Địa chỉ"
                  className={inputBaseClass}
                />
                <input
                  value={personalForm.note}
                  onChange={(e) => setPersonalForm((prev) => ({ ...prev, note: e.target.value }))}
                  placeholder="Ghi chú thêm"
                  className={inputBaseClass}
                />
              </div>
              {(errors.phone || errors.email || errors.role || errors.gender || errors.address) && (
                <p className="mt-3 text-sm font-semibold text-[#cc1f1f]">Vui lòng kiểm tra lại thông tin cá nhân.</p>
              )}

              <button
                type="button"
                onClick={onOpenProcessModal}
                className="mt-4 inline-block text-left text-sm text-[#21408c] underline decoration-[#6f88c0] underline-offset-4 hover:text-[#17367b]"
              >
                *Tìm hiểu quy trình đăng ký nhận lớp tại đây
              </button>
            </div>

            <div className="rounded-[24px] border border-white/70 bg-[#e6e7eb] p-4 md:p-5">
              <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <h3 className="text-[30px] font-extrabold text-[#1d3979] md:text-[34px]">Thông tin gia sư</h3>
                  <div className="mt-4 space-y-3">
                    <select
                      value={tutorForm.teachingLevel}
                      onChange={(e) => setTutorForm((prev) => ({ ...prev, teachingLevel: e.target.value }))}
                      className={inputBaseClass}
                    >
                      <option value="">Lớp dạy</option>
                      <option value="Tiểu học">Tiểu học</option>
                      <option value="THCS">THCS</option>
                      <option value="THPT">THPT</option>
                      <option value="Luyện thi chứng chỉ">Luyện thi chứng chỉ</option>
                    </select>
                    <input
                      value={tutorForm.subject}
                      onChange={(e) => setTutorForm((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="Môn dạy"
                      className={inputBaseClass}
                    />
                    <input
                      value={tutorForm.school}
                      onChange={(e) => setTutorForm((prev) => ({ ...prev, school: e.target.value }))}
                      placeholder="Trường đã/đang học"
                      className={inputBaseClass}
                    />
                    <input
                      value={tutorForm.area}
                      onChange={(e) => setTutorForm((prev) => ({ ...prev, area: e.target.value }))}
                      placeholder="Khu vực dạy"
                      className={inputBaseClass}
                    />
                  </div>

                  {(errors.teachingLevel || errors.subject || errors.school || errors.area) && (
                    <p className="mt-3 text-sm font-semibold text-[#cc1f1f]">Vui lòng điền đầy đủ thông tin gia sư.</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#2a4b8c] md:text-base">
                    Các buổi trong tuần có thể dạy
                  </p>
                  <div className="mt-3 rounded-2xl border border-white/70 bg-white/75 p-4">
                    <div className="grid grid-cols-7 gap-2">
                      {weekDays.map((day) => {
                        const isActive = activeWeekdays.includes(day.key);
                        return (
                          <button
                            key={day.key}
                            type="button"
                            onClick={() => toggleWeekday(day.key)}
                            className={`rounded-xl px-2 py-3 text-center text-sm font-bold transition-all duration-300 md:text-base ${
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
                  type="button"
                  onClick={onOpenProcessModal}
                  className="inline-block text-left text-lg font-semibold text-[#21408c] underline decoration-[#6f88c0] underline-offset-4 hover:text-[#17367b]"
                >
                  *Tìm hiểu quy trình đăng ký nhận lớp tại đây
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[linear-gradient(180deg,#f00b0b_0%,#d80404_100%)] px-6 py-3 text-center text-lg font-black text-white shadow-[0_16px_34px_rgba(216,4,4,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 md:px-7 md:text-xl lg:text-[22px]"
                >
                  ĐĂNG KÝ LÀM GIA SƯ NGAY
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
        </article>
      </div>
    </section>
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
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#061534]/50 px-4 backdrop-blur-sm"
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
          <h2 className="max-w-[18ch] text-3xl font-extrabold leading-[1.12] text-[#112a68] md:text-5xl">
            Số liệu biết nói, minh chứng cho chất lượng đào tạo.
          </h2>
          <p className="mt-5 max-w-[42ch] text-base font-medium leading-8 text-[#4b5873] md:text-lg">
            Chúng tôi tập trung vào kết quả thực tế: nâng cao năng lực học tập,
            xây dựng tư duy và tạo hành trình tiến bộ bền vững cho từng học viên.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {stats.map((item, idx) => (
              <article
                key={item.id}
                className={`group flex min-h-[200px] flex-col justify-center rounded-[24px] border border-white/60 p-8 shadow-[0_16px_40px_rgba(15,34,91,0.08)] transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,34,91,0.16)] ${
                  inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                } ${item.cardClass}`}
                style={{ transitionDelay: `${120 + idx * 110}ms` }}
              >
                <h3 className="text-5xl font-extrabold tracking-tight md:text-6xl">
                  {item.kind === "number" ? (
                    <CountUpValue value={item.value} suffix={item.suffix} start={inView} />
                  ) : (
                    item.value
                  )}
                </h3>
                <p
                  className={`mt-5 max-w-[11ch] text-2xl font-bold uppercase leading-tight tracking-[0.08em] transition-all duration-700 md:text-3xl ${
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

          <div className="absolute -bottom-7 -left-7 w-[46%] overflow-hidden rounded-[20px] border border-white/70 bg-white/85 p-2 shadow-[0_18px_36px_rgba(15,34,91,0.18)] backdrop-blur-md">
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
