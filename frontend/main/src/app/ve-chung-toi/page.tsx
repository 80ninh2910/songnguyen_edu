import Image from "next/image";

import styles from "./page.module.css";

export default function VeChungToiPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <span className={styles.heroTag}>Trung tâm ngoại ngữ uy tín</span>
            <h1>
              Học tiếng Anh <span>chuẩn quốc tế</span> với không gian hiện đại
            </h1>
            <p>
              Anh Ngữ Song Nguyên mang đến lộ trình học cá nhân hóa, đội ngũ
              giáo viên tận tâm và môi trường truyền cảm hứng để học viên tự tin
              bứt phá.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.ctaPrimary} href="/dang-nhap-gia-su">
                Đăng ký ngay
              </a>
              <a className={styles.ctaSecondary} href="/hoc-phi">
                Xem học phí
              </a>
            </div>
            <div className={styles.heroHighlights}>
              <div>
                <strong>97%</strong>
                <span>Học viên hài lòng</span>
              </div>
              <div>
                <strong>24-48h</strong>
                <span>Phản hồi tư vấn</span>
              </div>
              <div>
                <strong>30+</strong>
                <span>Lớp học mỗi tuần</span>
              </div>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.imageCard}>
              <Image
                src="/landing.png"
                alt="Minh hoa trung tam Anh ngu Song Nguyen"
                fill
                sizes="(max-width: 960px) 100vw, 50vw"
                priority
              />
            </div>
            <div className={styles.infoBadge}>
              <span>Isometric 3D</span>
              <strong>Campus Learning Hub</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
