"use client";

import Image from "next/image";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  AnimatePresence,
} from "motion/react";

import styles from "./page.module.css";

/* ─────────────────────────────────────────────────────────
   UTILITY COMPONENTS
   ───────────────────────────────────────────────────────── */

/* Scroll-triggered reveal */
function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  blur = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none" | "scale";
  blur?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 60 : 0,
      x: direction === "left" ? -60 : direction === "right" ? 60 : 0,
      scale: direction === "scale" ? 0.85 : 1,
      filter: blur ? "blur(10px)" : "blur(0px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        duration: 0.85,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* Animated character split */
function SplitText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.025,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

/* Floating particles */
function Particles({ count = 40 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 8,
        opacity: Math.random() * 0.4 + 0.1,
      })),
    [count],
  );

  return (
    <div className={styles.particles}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* Animated counter with spring */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const springVal = useSpring(0, { stiffness: 30, damping: 18 });
  const display = useTransform(springVal, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (isInView) springVal.set(value);
  }, [isInView, springVal, value]);

  return (
    <motion.div ref={ref} className={styles.statNumber}>
      <motion.span>{display}</motion.span>
    </motion.div>
  );
}

/* 3D tilt card */
function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  const glowX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);
  const glowBg = useMotionTemplate`radial-gradient(400px circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.06), transparent 60%)`;

  function handleMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        backgroundImage: glowBg,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  );
}

/* Scroll progress bar */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return <motion.div className={styles.scrollProgress} style={{ scaleX }} />;
}

/* Marquee text */
function Marquee({ text, reverse = false }: { text: string; reverse?: boolean }) {
  return (
    <div className={styles.marquee}>
      <motion.div
        className={styles.marqueeTrack}
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className={styles.marqueeItem}>
            {text}
            <span className={styles.marqueeDot}>◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* Magnetic button */
function MagneticButton({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {children}
    </motion.a>
  );
}

/* Parallax image wrapper */
function ParallaxImage({
  src,
  alt,
  className,
  speed = 0.15,
}: {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div style={{ y, width: "100%", height: "120%", position: "relative" }}>
        <Image src={src} alt={alt} fill sizes="(max-width: 960px) 100vw, 50vw" style={{ objectFit: "cover" }} />
      </motion.div>
    </div>
  );
}

/* Glowing text on scroll simplified to standard reveal without prior blur or opacity dimming */
function GlowText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={className} direction="up" delay={0.05} blur={false}>
      {children}
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function VeChungToiPage() {
  const heroRef = useRef<HTMLElement>(null);
  const scrollClassName = "ve-chung-toi-scroll";
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.15]);
  const heroBlur = useTransform(heroScroll, [0, 1], [0, 8]);
  const heroFilter = useMotionTemplate`blur(${heroBlur}px)`;

  useEffect(() => {
    document.documentElement.classList.add(scrollClassName);
    document.body.classList.add(scrollClassName);

    return () => {
      document.documentElement.classList.remove(scrollClassName);
      document.body.classList.remove(scrollClassName);
    };
  }, [scrollClassName]);

  return (
    <main className={styles.page}>
      <ScrollProgress />

      {/* ═══ 1. HERO — Immersive parallax + particles ═══ */}
      <section className={styles.hero} ref={heroRef}>
        <motion.div className={styles.heroBg} style={{ y: heroY, scale: heroScale, filter: heroFilter }}>
          <Image
            src="/aboutus.png"
            alt="Song Nguyen Education – Không gian giáo dục hiện đại"
            fill
            sizes="100vw"
            priority
          />
        </motion.div>
        <div className={styles.heroOverlay} />
        <Particles count={50} />

        {/* Animated grid lines */}
        <div className={styles.heroGrid} />

        <motion.div className={styles.heroContent} style={{ opacity: heroOpacity }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.heroTagline}>
              <span className={styles.heroTaglinePulse} />
              Trung tâm gia sư uy tín
            </span>
          </motion.div>

          <h1 className={styles.heroTitle}>
            <SplitText text="Song Nguyen" delay={0.4} />
            <br />
            <span className={styles.heroTitleAccent}>
              <SplitText text="Education" delay={0.7} />
            </span>
          </h1>

          <motion.p
            className={styles.heroDesc}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Tạo nên một môi trường giáo dục minh bạch, tận tâm và chất lượng —
            nơi mỗi học sinh đều có cơ hội tiếp cận phương pháp học phù hợp.
          </motion.p>

          <motion.div
            className={styles.heroCTAs}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <MagneticButton href="/dang-nhap-gia-su" className={styles.heroBtnPrimary}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              Khám phá ngay
            </MagneticButton>
            <MagneticButton href="/hoc-phi" className={styles.heroBtnGhost}>
              Xem học phí
            </MagneticButton>
          </motion.div>

          <motion.div
            className={styles.heroScrollHint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
          >
            <div className={styles.scrollMouse}>
              <div className={styles.scrollWheel} />
            </div>
            <span>Cuộn xuống</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ MARQUEE DIVIDER ═══ */}
      <Marquee text="SONG NGUYEN EDUCATION" />

      {/* ═══ 2. STORY — Introduction ═══ */}
      <section className={styles.story}>
        <div className={styles.storyDecor} />
        <div className={styles.storyDecor2} />
        <div className={styles.storyInner}>
          <div className={styles.storyTextBlock}>
            <Reveal blur>
              <span className={styles.sectionLabel}>
                <span className={styles.sectionLabelDot} />
                Câu chuyện của chúng tôi
              </span>
            </Reveal>

            <GlowText>
              <h2 className={styles.sectionTitle}>
                Xây dựng nền tảng giáo dục{" "}
                <span className={styles.sectionTitleHighlight}>tận tâm</span>
              </h2>
            </GlowText>

            <Reveal delay={0.15} blur>
              <p className={styles.storyParagraph}>
                Song Nguyen Education được xây dựng với mong muốn tạo nên một môi
                trường giáo dục minh bạch, tận tâm và chất lượng, nơi mỗi học sinh
                đều có cơ hội tiếp cận phương pháp học phù hợp cùng đội ngũ gia sư
                được tuyển chọn kỹ lưỡng.
              </p>
            </Reveal>

            <Reveal delay={0.25} blur>
              <p className={styles.storyParagraph}>
                Đội ngũ gia sư được xác minh hồ sơ rõ ràng và phân tầng theo năng lực
                nhằm giúp phụ huynh dễ dàng lựa chọn hình thức phù hợp với nhu cầu
                học tập cũng như ngân sách.
              </p>
            </Reveal>

            <Reveal delay={0.35} blur>
              <p className={styles.storyParagraph}>
                Đặc biệt, các gia sư tham gia chương trình đào tạo nghiệp vụ tại trung
                tâm sẽ được trang bị thêm kỹ năng sư phạm, phương pháp giảng dạy và kỹ
                năng xử lý tình huống thực tế.
              </p>
            </Reveal>
          </div>

          <Reveal direction="right" delay={0.1}>
            <ParallaxImage
              src="/about-hero.png"
              alt="Không gian học tập Song Nguyen Education"
              className={styles.storyImageBlock}
              speed={0.1}
            />
          </Reveal>
        </div>
      </section>

      {/* ═══ 3. PILLARS — 3D tilt cards ═══ */}
      <section className={styles.pillars}>
        <div className={styles.pillarsBgGlow} />
        <div className={styles.pillarsBgGlow2} />
        <Particles count={25} />

        <div className={styles.pillarsInner}>
          <Reveal blur>
            <span className={styles.sectionLabel}>
              <span className={styles.sectionLabelDot} />
              Giá trị cốt lõi
            </span>
          </Reveal>

          <GlowText className={styles.pillarsTitleWrap}>
            <h2 className={styles.pillarsTitle}>
              Ba trụ cột định hình chất lượng
            </h2>
          </GlowText>

          <Reveal delay={0.1}>
            <p className={styles.pillarsSubtitle}>
              Mỗi yếu tố được thiết kế để mang đến trải nghiệm giáo dục toàn diện
              và đáng tin cậy.
            </p>
          </Reveal>

          <div className={styles.pillarsGrid}>
            {[
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                title: "Gia sư xác minh & phân tầng",
                desc: "Hồ sơ gia sư được xác minh rõ ràng, phân tầng theo năng lực giúp phụ huynh dễ dàng lựa chọn phù hợp nhu cầu và ngân sách.",
                gradient: "linear-gradient(135deg, #0b2f97, #0053cc)",
              },
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                ),
                title: "Đào tạo nghiệp vụ sư phạm",
                desc: "Chương trình đào tạo trang bị kỹ năng sư phạm, phương pháp giảng dạy và xử lý tình huống thực tế cho gia sư.",
                gradient: "linear-gradient(135deg, #dc2626, #ef4444)",
              },
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                ),
                title: "Lớp học tại trung tâm",
                desc: "Hệ thống lớp học trực tiếp tại trung tâm với môi trường chuyên nghiệp, tăng khả năng tương tác và hỗ trợ toàn diện.",
                gradient: "linear-gradient(135deg, #16a34a, #4ade80)",
              },
            ].map((pillar, i) => (
              <Reveal key={i} delay={0.15 + i * 0.12} direction="scale">
                <TiltCard className={styles.pillarCard}>
                  <div className={styles.pillarCardGlow} style={{ background: pillar.gradient }} />
                  <div className={styles.pillarIcon} style={{ background: `${pillar.gradient.split(",")[0].replace("linear-gradient(135deg", "")}15)`.replace(" ", "rgba(").replace("#", "") }}>
                    {pillar.icon}
                  </div>
                  <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                  <p className={styles.pillarDesc}>{pillar.desc}</p>
                  <div className={styles.pillarNumber}>0{i + 1}</div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE DIVIDER (reversed) ═══ */}
      <Marquee text="TẬN TÂM • MINH BẠCH • CHẤT LƯỢNG" reverse />

      {/* ═══ 4. VISION & MISSION ═══ */}
      <section className={styles.vision}>
        <div className={styles.visionDecor} />
        <div className={styles.visionInner}>
          {/* Tầm nhìn */}
          <Reveal direction="left" blur>
            <div className={styles.visionBlock}>
              <div className={styles.visionIconRow}>
                <motion.div
                  className={`${styles.visionIconCircle} ${styles.brandBg}`}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    <path d="M2 12h20" />
                  </svg>
                </motion.div>
                <span className={styles.visionBlockLabel}>Tầm nhìn</span>
              </div>

              <GlowText>
                <h2 className={styles.visionBlockTitle}>
                  Hệ thống gia sư và giáo dục uy tín hàng đầu
                </h2>
              </GlowText>

              <p className={styles.visionBlockText}>
                Trở thành hệ thống gia sư và giáo dục uy tín, nơi chất lượng giảng
                dạy luôn được đặt lên hàng đầu. Với định hướng phát triển lâu dài,
                Song Nguyen Education mong muốn trở thành cầu nối đáng tin cậy giữa
                phụ huynh, học sinh và đội ngũ gia sư chất lượng.
              </p>

              {/* Animated line */}
              <motion.div
                className={styles.visionLine}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </Reveal>

          {/* Sứ mệnh */}
          <Reveal direction="right" delay={0.15} blur>
            <div className={styles.visionBlock}>
              <div className={styles.visionIconRow}>
                <motion.div
                  className={`${styles.visionIconCircle} ${styles.accentBg}`}
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </motion.div>
                <span className={styles.visionBlockLabel}>Sứ mệnh</span>
              </div>

              <GlowText>
                <h2 className={styles.visionBlockTitle}>
                  Nâng cao giá trị giáo dục cá nhân hóa
                </h2>
              </GlowText>

              <ul className={styles.missionList}>
                {[
                  { num: "01", text: "Kết nối học sinh với gia sư phù hợp", color: "linear-gradient(135deg, #0b2f97, #0053cc)" },
                  { num: "02", text: "Nâng cao chất lượng gia sư thông qua đào tạo", color: "linear-gradient(135deg, #dc2626, #ef4444)" },
                  { num: "03", text: "Xây dựng môi trường giáo dục tận tâm và minh bạch", color: "linear-gradient(135deg, #16a34a, #4ade80)" },
                ].map((item, i) => (
                  <Reveal key={i} delay={0.15 + i * 0.12}>
                    <motion.li
                      className={styles.missionItem}
                      whileHover={{ x: 8, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className={styles.missionBullet} style={{ background: item.color }}>
                        {item.num}
                      </div>
                      <span className={styles.missionItemText}>{item.text}</span>
                      <svg className={styles.missionArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </motion.li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 5. ECOSYSTEM — Parallax ═══ */}
      <section className={styles.ecosystem}>
        <Particles count={20} />
        <div className={styles.ecosystemInner}>
          <Reveal direction="left">
            <ParallaxImage
              src="/about-ecosystem.png"
              alt="Hệ sinh thái giáo dục Song Nguyen"
              className={styles.ecosystemImageBlock}
              speed={0.12}
            />
          </Reveal>

          <div className={styles.ecosystemTextBlock}>
            <Reveal blur>
              <span className={styles.sectionLabel}>
                <span className={styles.sectionLabelDot} />
                Hệ sinh thái
              </span>
            </Reveal>

            <GlowText>
              <h2 className={styles.ecosystemTitle}>
                Lớp học tại trung tâm —{" "}
                <span className={styles.ecosystemTitleAccent}>chuyên nghiệp & toàn diện</span>
              </h2>
            </GlowText>

            <Reveal delay={0.15} blur>
              <p className={styles.ecosystemDesc}>
                Bên cạnh mô hình gia sư tại nhà, Song Nguyen Education còn phát triển
                hệ thống lớp học trực tiếp tại trung tâm nhằm mang đến môi trường học
                tập chuyên nghiệp, tăng khả năng tương tác và hỗ trợ học sinh toàn diện
                hơn trong quá trình học tập.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className={styles.ecosystemFeatures}>
                {["Tương tác trực tiếp", "Giám sát chuyên sâu", "Nhóm nhỏ hiệu quả"].map((f, i) => (
                  <motion.div
                    key={i}
                    className={styles.ecosystemFeature}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 6. STATS — Animated counters ═══ */}
      <section className={styles.stats}>
        <div className={styles.statsPattern} />
        <div className={styles.statsInner}>
          {[
            { value: 97, suffix: "%", label: "Phụ huynh hài lòng", icon: "❤️" },
            { value: 48, suffix: "h", label: "Phản hồi tư vấn", icon: "⚡" },
            { value: 100, suffix: "+", label: "Gia sư đã xác minh", icon: "✅" },
            { value: 30, suffix: "+", label: "Lớp học mỗi tuần", icon: "📚" },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1} direction="scale">
              <motion.div
                className={styles.statItem}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={styles.statEmoji}>{stat.icon}</div>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <div className={styles.statLabel}>{stat.label}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ 7. CTA — Contact ═══ */}
      <section className={styles.cta}>
        <div className={styles.ctaDecorLeft} />
        <div className={styles.ctaDecorRight} />
        <div className={styles.ctaDecorCenter} />

        <div className={styles.ctaInner}>
          <Reveal direction="scale" blur>
            <h2 className={styles.ctaTitle}>
              Sẵn sàng bắt đầu{" "}
              <span className={styles.ctaTitleAccent}>hành trình học tập?</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1} blur>
            <p className={styles.ctaDesc}>
              Liên hệ ngay với Song Nguyen Education để được tư vấn miễn phí và tìm
              gia sư phù hợp nhất cho con bạn.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className={styles.ctaActions}>
              <MagneticButton href="/?scrollTo=tutor-register-section" className={styles.ctaBtnPrimary}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                Đăng ký gia sư
              </MagneticButton>
              <MagneticButton href="/hoc-phi" className={styles.ctaBtnSecondary}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                Xem học phí
              </MagneticButton>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className={styles.ctaContactInfo}>
              <motion.div
                className={styles.ctaContactCard}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={styles.ctaContactIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <div className={styles.ctaContactLabel}>Điện thoại</div>
                  <div className={styles.ctaContactValue}>0988 212 316</div>
                </div>
              </motion.div>

              <motion.div
                className={styles.ctaContactCard}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={styles.ctaContactIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <div className={styles.ctaContactLabel}>Email</div>
                  <div className={styles.ctaContactValue}>songnguyeneducationcoltd@gmail.com</div>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className={styles.footer}>
        <Reveal>
          <div className={styles.footerBrand}>Song Nguyen Education</div>
          <p>© {new Date().getFullYear()} Song Nguyen Education Co., Ltd. All rights reserved.</p>
        </Reveal>
      </footer>
    </main>
  );
}
