
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
import tutorImage1 from "../components/assets/11.jpg";
import tutorImage2 from "../components/assets/12.jpg";
import tutorImage3 from "../components/assets/13.jpg";
import tutorImage4 from "../components/assets/14.jpg";
import tutorImage5 from "../components/assets/15.jpg";
import tutorImage6 from "../components/assets/16.jpg";
import tutorImage7 from "../components/assets/17.jpg";
import { BackgroundLines } from "@/components/ui/background-lines";
import { HeroParallax } from "@/components/ui/hero-parallax";
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
      <TutorClassSection />
      <HeroParallaxDemo />
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
export function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}
export const products = [
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "https://www.aceternity.com/images/products/thumbnails/new/moonbeam.png",
  },
  {
    title: "Cursor",
    link: "https://cursor.so",
    thumbnail:
      "https://www.aceternity.com/images/products/thumbnails/new/cursor.png",
  },
  {
    title: "Rogue",
    link: "https://userogue.com",
    thumbnail:
      "https://www.aceternity.com/images/products/thumbnails/new/rogue.png",
  },
 
  {
    title: "Editorially",
    link: "https://editorially.org",
    thumbnail:
      "https://www.aceternity.com/images/products/thumbnails/new/editorially.png",
  },
  {
    title: "Editrix AI",
    link: "https://editrix.ai",
    thumbnail:
      "https://www.aceternity.com/images/products/thumbnails/new/editrix.png",
  },
  {
    title: "Pixel Perfect",
    link: "https://app.pixelperfect.quest",
    thumbnail:
      "https://www.aceternity.com/images/products/thumbnails/new/pixelperfect.png",
  },
 
  {
    title: "Algochurn",
    link: "https://algochurn.com",
    thumbnail:
      "https://www.aceternity.com/images/products/thumbnails/new/algochurn.png",
  },
  {
    title: "Aceternity UI",
    link: "https://ui.aceternity.com",
    thumbnail:
      "https://www.aceternity.com/images/products/thumbnails/new/aceternityui.png",
  },
  {
    title: "Tailwind Master Kit",
    link: "https://tailwindmasterkit.com",
    thumbnail:
      "https://www.aceternity.com/images/products/thumbnails/new/tailwindmasterkit.png",
  },
  {
    title: "SmartBridge",
    link: "https://smartbridgetech.com",
    thumbnail:
      "https://www.aceternity.com/images/products/thumbnails/new/smartbridge.png",
  },
  {
    title: "Renderwork Studio",
    link: "https://renderwork.studio",
    thumbnail:
      "https://www.aceternity.com/images/products/thumbnails/new/renderwork.png",
  },
 
  {
    title: "Creme Digital",
    link: "https://cremedigital.com",
    thumbnail:
      "https://www.aceternity.com/images/products/thumbnails/new/cremedigital.png",
  },
  {
    title: "Golden Bells Academy",
    link: "https://goldenbellsacademy.com",
    thumbnail:
      "https://www.aceternity.com/images/products/thumbnails/new/goldenbellsacademy.png",
  },
  {
    title: "Invoker Labs",
    link: "https://invoker.lol",
    thumbnail:
      "https://www.aceternity.com/images/products/thumbnails/new/invoker.png",
  },
  {
    title: "E Free Invoice",
    link: "https://efreeinvoice.com",
    thumbnail:
      "https://www.aceternity.com/images/products/thumbnails/new/efreeinvoice.png",
  },
];
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
