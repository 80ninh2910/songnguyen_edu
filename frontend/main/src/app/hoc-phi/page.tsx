import Image from "next/image";
import { Be_Vietnam_Pro } from "next/font/google";

import styles from "./page.module.css";
import statsMainImage from "@/components/assets/21.jpg";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const tuitionPlans = [
  {
    level: "Tiểu học",
    price: "150.000",
    unit: "VNĐ/buổi",
    bullets: [
      "Khởi động vững nền tảng học tập.",
      "Xây dựng thói quen học đúng và chủ động.",
      "Giáo án bám sát năng lực theo từng tuần.",
    ],
  },
  {
    level: "THCS (Cấp 2)",
    price: "200.000",
    unit: "VNĐ/buổi",
    highlighted: true,
    bullets: [
      "Bám sát định hướng thi giữa kỳ và cuối kỳ.",
      "Luyện kỹ năng tự học và phản biện logic.",
      "Theo dõi tiến bộ học tập hằng tuần cho phụ huynh.",
    ],
  },
  {
    level: "THPT (Cấp 3)",
    price: "250.000",
    unit: "VNĐ/buổi",
    bullets: [
      "Luyện thi lớp 10, thi học kỳ và tốt nghiệp.",
      "Hiểu sâu bản chất kiến thức và chiến lược làm bài.",
      "Điều phối theo mục tiêu vào trường mong muốn.",
    ],
  },
];

export default function HocPhiPage() {
  return (
    <main className={`${styles.page} ${beVietnamPro.className}`}>
      <div className={styles.container}>
        <section className={styles.heroCard}>
          <p className={styles.heroTag}>Học phí linh hoạt</p>
          <h1 className={styles.heroTitle}>
            Đầu tư vào <span>tương lai</span> với mức phí hợp lý
          </h1>
          <p className={styles.heroDescription}>
            Chúng tôi tin rằng mọi học sinh đều xứng đáng được tiếp cận nền giáo dục chất lượng cao.
            Bảng giá được thiết kế rõ ràng, minh bạch và phù hợp với từng giai đoạn học tập.
          </p>
        </section>

        <section className={styles.pricingGrid}>
          {tuitionPlans.map((plan) => (
            <article
              key={plan.level}
              className={styles.planCard}
            >
              <div className={styles.planHeader}>
                <h2>{plan.level}</h2>
                {plan.highlighted ? <span className={styles.planBadge}>Phổ biến nhất</span> : null}
              </div>
              <p className={styles.planPrice}>
                {plan.price}
                <span>{plan.unit}</span>
              </p>
              <ul className={styles.planList}>
                {plan.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <button type="button" className={styles.planButton}>
                Xem chi tiết cấp học
              </button>
            </article>
          ))}
        </section>

        <section className={styles.valueSection}>
          <div>
            <h2>
              Giá trị cốt lõi từ
              <br />
              <span>Gia Sư Chất Lượng</span>
            </h2>
            <p>
              Chúng tôi không chỉ cung cấp kiến thức, mà còn đồng hành xây dựng động lực tự học.
              Mỗi khóa học được cá nhân hóa theo mục tiêu và lộ trình riêng của học viên.
            </p>
            <ul>
              <li>Gia sư được tuyển chọn kỹ qua chuyên môn và kỹ năng sư phạm.</li>
              <li>Cam kết theo lộ trình rõ ràng, báo cáo tiến độ định kỳ.</li>
              <li>Ưu tiên trải nghiệm học tập tích cực và bền vững cho học viên.</li>
            </ul>
          </div>
          <div className={styles.valueMedia}>
            <Image
              src={statsMainImage}
              alt="Gia sư đang hướng dẫn học viên trong buổi học trực tiếp"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2>Sẵn sàng để bắt đầu?</h2>
          <p>
            Đăng ký tư vấn miễn phí ngay hôm nay để nhận lộ trình học tập phù hợp nhất cho con.
          </p>
          <div className={styles.ctaActions}>
            <a href="/gia-su" className={styles.ctaPrimary}>
              Tìm gia sư ngay
            </a>
            <a href="/hoi-dap-gia-su" className={styles.ctaSecondary}>
              Nhận tư vấn miễn phí
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
