
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
import heroImage from "../components/assets/image.png";
import logoImage from "../components/assets/logo.png";
import background19 from "../components/assets/19.png";
import statsMainImage from "../components/assets/21.jpg";
import statsSubImage from "../components/assets/20.jpg";
import { BackgroundLines } from "@/components/ui/background-lines";
import DomeGallery from "@/components/DomeGallery";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin", "vietnamese"],
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

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

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">Login</NavbarButton>
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
      <HeroSection />
      <div className="relative z-20 bg-transparent px-4 py-8 md:py-12">
        <h2
          className={`${bricolageGrotesque.className} mx-auto flex w-fit items-center gap-3 md:gap-5 text-[44.8px] font-bold tracking-tight`}
          style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
        >
          <span className="text-[#1f347f]">HỌC VIÊN</span>
          <span className="relative inline-flex rotate-[5deg] items-center rounded-full bg-[#f30808] px-5 py-1 md:px-8 md:py-2 lg:px-10">
            <span className="text-white">XUẤT SẮC</span>
            <svg
              className="absolute -right-6 -top-5 h-9 w-9 md:h-12 md:w-12 text-sky-400"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M32 4v16M32 44v16M4 32h16M44 32h16M11 11l12 12M41 41l12 12M53 11 41 23M23 41 11 53"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h2>
      </div>
      <DomeGallerySection />
      <DummyContent />
      <CountingSection />

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
    </BackgroundLines>
  );
}
function HeroSection() {
  return (
    <div className="Hero px-4 pb-8" id="hero">
      <Image
        src={heroImage}
        alt="Hero Image"
        className="h-auto w-full rounded-lg object-cover"
        priority
      />
    </div>
  );
}

function DomeGallerySection() {
  return (
    <div className="h-screen w-full bg-white">
      <DomeGallery
        fit={0.8}
        minRadius={600}
        maxVerticalRotationDeg={0}
        segments={34}
        dragDampening={2}
        overlayBlurColor="#ffffff"
        grayscale={false}
      />
    </div>
  );
}
const DummyContent = () => {
  return (
    <div className="container mx-auto p-8 pt-24">
      
      
    </div>
  );
};

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

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
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
          className={`relative mx-auto w-full max-w-[520px] transition-all duration-700 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          <div className="relative overflow-hidden rounded-[34px] bg-[#dce7ff] p-3 shadow-[0_24px_60px_rgba(14,39,111,0.22)]">
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
