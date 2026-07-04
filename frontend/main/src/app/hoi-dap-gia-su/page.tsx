import { Be_Vietnam_Pro } from "next/font/google";

import styles from "./page.module.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const learnerFaq = [
  {
    question: "Làm thế nào để tìm được gia sư phù hợp?",
    answer:
      "Bạn chỉ cần để lại nhu cầu theo môn học, cấp lớp và khu vực. Đội ngũ điều phối sẽ gợi ý hồ sơ gia sư phù hợp trong 24-48 giờ.",
  },
  {
    question: "Có học thử trước khi đăng ký chính thức không?",
    answer:
      "Có. Học viên có thể đăng ký 1-2 buổi học thử để đánh giá phong cách giảng dạy và mức độ tương thích trước khi chốt lộ trình dài hạn.",
  },
  {
    question: "Trung tâm theo dõi tiến độ học tập như thế nào?",
    answer:
      "Sau mỗi giai đoạn, gia sư cập nhật nhận xét chuyên môn và trung tâm tổng hợp báo cáo để phụ huynh nắm rõ năng lực, điểm mạnh và phần cần cải thiện.",
  },
  {
    question: "Nếu cần đổi lịch học hoặc đổi gia sư thì sao?",
    answer:
      "Bạn có thể báo trước để trung tâm điều phối lại lịch. Trường hợp cần đổi gia sư, chúng tôi hỗ trợ nhanh nhằm đảm bảo tiến độ học tập liên tục.",
  },
];

const tutorFaq = [
  {
    question: "Điều kiện trở thành gia sư của trung tâm là gì?",
    answer:
      "Ứng viên cần hồ sơ rõ ràng, nền tảng chuyên môn phù hợp và vượt qua vòng phỏng vấn nghiệp vụ để đảm bảo chất lượng giảng dạy.",
  },
  {
    question: "Phí nhận lớp và quyền lợi của gia sư ra sao?",
    answer:
      "Chính sách phí nhận lớp minh bạch theo từng hạng lớp. Gia sư được hỗ trợ tài liệu, quy trình làm việc và tư vấn xử lý tình huống trong quá trình dạy.",
  },
  {
    question: "Trung tâm có hỗ trợ xử lý phát sinh trong lớp học không?",
    answer:
      "Có. Bộ phận điều phối đồng hành xuyên suốt, hỗ trợ kết nối với phụ huynh, điều chỉnh lịch học và xử lý các phát sinh để gia sư tập trung chuyên môn.",
  },
];

export default function FaqPage() {
  return (
    <main className={`${styles.page} ${beVietnamPro.className}`}>
      <div className={styles.container}>
        <section className={styles.heroSection}>
          <div className={styles.heroOverlay}>
            <h1>Câu hỏi thường gặp</h1>
            <p>
              Tìm hiểu thêm về cách chúng tôi kết nối gia sư chất lượng cùng học sinh.
              Nếu bạn cần hỗ trợ nhanh, đội ngũ tư vấn luôn sẵn sàng.
            </p>
            <label className={styles.searchBox}>
              <span aria-hidden="true">⌕</span>
              <input type="text" placeholder="Tìm kiếm câu hỏi..." aria-label="Tìm kiếm câu hỏi thường gặp" />
            </label>
          </div>
        </section>

        <section className={styles.faqGrid}>
          <aside className={styles.categoryCard}>
            <p className={styles.categoryTag}>Danh mục</p>
            <ul>
              <li>
                <a href="#faq-phu-huynh">Dành cho Phụ huynh &amp; Học sinh</a>
              </li>
              <li>
                <a href="#faq-gia-su">Dành cho Gia sư</a>
              </li>
              <li>
                <a href="/hoc-phi">Tham khảo học phí</a>
              </li>
            </ul>
          </aside>

          <div className={styles.faqColumns}>
            <section id="faq-phu-huynh" className={styles.faqGroup}>
              <h2>Dành cho Phụ huynh &amp; Học sinh</h2>
              {learnerFaq.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </section>

            <section id="faq-gia-su" className={styles.faqGroup}>
              <h2>Dành cho Gia sư</h2>
              {tutorFaq.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </section>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2>Vẫn còn câu hỏi?</h2>
          <p>
            Để lại thông tin, chúng tôi sẽ liên hệ trong giờ làm việc sớm nhất để tư vấn lộ trình học phù hợp.
          </p>
          <div className={styles.ctaActions}>
            <a href="/" className={styles.ctaPrimary}>
              Liên hệ hỗ trợ
            </a>
            <a href="/hoc-phi" className={styles.ctaSecondary}>
              Xem học phí chi tiết
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
