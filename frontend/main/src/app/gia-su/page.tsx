"use client";

import { Be_Vietnam_Pro } from "next/font/google";

import styles from "./page.module.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const stage1Steps = [
  {
    title: "Đăng ký trực tuyến",
    desc: "Điền thông tin cá nhân và khu vực muốn giảng dạy.",
    tag: "01",
  },
  {
    title: "Cung cấp hồ sơ",
    desc: "Tải lên ảnh, bằng cấp, chứng chỉ và kinh nghiệm.",
    tag: "02",
  },
  {
    title: "Xét duyệt nhanh",
    desc: "Phản hồi trong 24-48 giờ qua Email, SMS hoặc Zalo.",
    tag: "03",
  },
];

const modelComparison = [
  {
    title: "Gia sư tự do",
    highlight: "Phí kết nối 30% tháng đầu",
    details: [
      "Tự chủ giảng dạy và tự quản lý thời gian.",
      "Trung tâm chỉ hỗ trợ kết nối lớp phù hợp.",
      "Không bắt buộc tham gia đào tạo nghiệp vụ.",
    ],
  },
  {
    title: "Ký hợp đồng",
    highlight: "Đào tạo và phỏng vấn trước khi nhận lớp",
    details: [
      "Được đào tạo phương pháp dạy chuẩn.",
      "Có quản lý chuyên môn và đánh giá định kỳ.",
      "Ưu tiên phân lớp và có cơ hội phát triển.",
    ],
  },
];

const trainingHighlights = [
  {
    label: "10 giờ đào tạo",
    desc: "Phương pháp dạy, giao tiếp, giáo án và xử lý tình huống sư phạm.",
  },
  {
    label: "Lệ phí 1.000.000 VNĐ",
    desc: "Đóng trước khi bắt đầu khóa học nội bộ.",
  },
];

const trainingIncludes = [
  "Tài liệu và nội dung đào tạo",
  "Công tác tổ chức lớp huấn luyện",
  "Đánh giá và kiểm tra cuối khóa",
  "Cấp chứng nhận hoàn thành đào tạo nội bộ",
];

const refundTimeline = [
  {
    month: "Tháng 1",
    amount: "300.000 VNĐ",
    desc: "Cộng vào lương sau tháng dạy đầu tiên.",
  },
  {
    month: "Tháng 2",
    amount: "300.000 VNĐ",
    desc: "Duy trì chất lượng và tiếp tục hoàn phí.",
  },
  {
    month: "Tháng 3",
    amount: "400.000 VNĐ",
    desc: "Hoàn tất lộ trình hoàn phí trong 3 tháng.",
  },
];

const contractFlow = [
  "Đạt yêu cầu",
  "Ký hợp đồng",
  "Cấp chứng nhận",
  "Cấp mã quản lý",
  "Phân lớp phù hợp",
];

const stage4Details = [
  {
    title: "Phân lớp theo năng lực",
    desc: "Đối chiếu chuyên môn, khu vực và thời gian phù hợp của gia sư.",
  },
  {
    title: "Hỗ trợ chuyên môn",
    desc: "Gia sư chủ động quản lý tiến độ và nhận hỗ trợ khi cần thiết.",
  },
];

const paymentHighlights = [
  "Trung tâm thu học phí trực tiếp từ học viên trước khi thanh toán.",
  "Sau khi khấu trừ chi phí theo thỏa thuận, thanh toán chậm nhất ngày 15 hằng tháng.",
  "Phí dịch vụ được khấu trừ minh bạch, có báo cáo chi tiết.",
  "Tham gia đào tạo định kỳ để nâng cao chuyên môn và đánh giá xếp hạng.",
];

export default function TutorRegistrationProcessPage() {
  return (
    <main className={`${styles.page} ${beVietnamPro.className}`}>
      <section className={styles.hero}>
        <div className={styles.heroBackdrop} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.grid12}>
            <div className={styles.heroContent}>
              <span className={styles.heroTag}>Song Nguyen Education</span>
              <h1 className={styles.heroTitle}>
                Quy trình trở thành <span>gia sư chuyên nghiệp</span>
              </h1>
              <p className={styles.heroDesc}>
                Lộ trình được thiết kế rõ ràng, minh bạch và có đội ngũ
                đào tạo đồng hành, giúp gia sư tự tin nhận lớp và dạy hiệu quả.
                Song Nguyen Education đảm bảo chất lượng và tính chuyên nghiệp
                trong mọi giai đoạn tuyển chọn.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryButton} href="/dang-nhap-gia-su">
                  Đăng ký ngay
                </a>
                <a className={styles.secondaryButton} href="/hoi-dap-gia-su">
                  Tư vấn thêm
                </a>
              </div>
              <div className={styles.heroMeta}>
                <div>
                  <strong>24-48h</strong>
                  <span>Phản hồi hồ sơ</span>
                </div>
                <div>
                  <strong>6 giai đoạn</strong>
                  <span>Hoàn thiện quy trình</span>
                </div>
              </div>
            </div>
            <div className={styles.heroStage}>
              <div className={styles.stageHeader}>
                <p>
                  <strong>Giai đoạn 1</strong>
                </p>
                <h2>Đăng ký gia sư</h2>
              </div>
              <div className={styles.stageCards}>
                {stage1Steps.map((step) => (
                  <article key={step.title} className={styles.stageCard}>
                    <div className={styles.stageIcon} aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M5 7h14M5 12h14M5 17h10" />
                      </svg>
                    </div>
                    <span>{step.tag}</span>
                    <h3>{step.title}</h3>
                    <p>
                      {step.title === "Xét duyệt nhanh" ? (
                        <>
                          <span className={styles.iconBadge} aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                              <path d="M12 7v5l3 2" />
                              <circle cx="12" cy="12" r="9" />
                            </svg>
                          </span>
                          <strong className={styles.keywordStrong}>24-48 giờ</strong> qua Email, SMS hoặc Zalo.
                        </>
                      ) : (
                        step.desc
                      )}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.stageBlock1}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Lựa chọn hợp tác</span>
            <h2>
              <strong>
                Chọn mô hình <span>phù hợp</span>
              </strong>
            </h2>
            <p>
              Hai mô hình vận hành rõ ràng, giúp gia sư chủ động chọn
              phong cách làm việc.
            </p>
          </div>
          <div className={styles.comparisonGrid}>
            {modelComparison.map((item, index) => (
              <article
                key={item.title}
                className={index === 0 ? styles.compareCard : styles.compareCardAlt}
              >
                <div className={styles.compareHeader}>
                  <span className={index === 0 ? styles.compareIconFree : styles.compareIconContract}>
                    {index === 0 ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                        />
                      </svg>
                    )}
                  </span>
                  <h3>{item.title}</h3>
                  {index === 1 ? (
                    <span className={styles.recommendedBadge}>Chuyên nghiệp</span>
                  ) : null}
                </div>
                {index === 0 ? (
                  <div className={styles.feeHighlight}>
                    <span>Phí nhận lớp</span>
                    <strong>30% học phí tháng đầu tiên</strong>
                  </div>
                ) : (
                  <>
                    <p className={styles.compareHighlight}>{item.highlight}</p>
                    <div className={styles.contractPattern}>
                      <div className={styles.contractPatternBadge}>Lệ phí đào tạo</div>
                      <strong>1.000.000 VNĐ</strong>
                      <p>Hoàn trong vòng 3 tháng sau khi hoàn tất đào tạo.</p>
                    </div>
                  </>
                )}
                <ul>
                  {item.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
                <a className={styles.compareCta} href="/dang-nhap-gia-su">
                  Đăng ký ngay
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.sectionAlt} ${styles.stageBlock2}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>
              <strong>Giai đoạn 2</strong>
            </span>
            <h2>
              <strong>
                Huấn luyện & <span>chi phí</span>
              </strong>
            </h2>
            <p>
              Đào tạo tập trung vào chuyên môn, kỹ năng giao tiếp và xử lý
              tình huống thực tế.
            </p>
          </div>
          <div className={styles.trainingGrid}>
            {trainingHighlights.map((item) => (
              <div
                key={item.label}
                className={
                  item.label.includes("1.000.000")
                    ? `${styles.trainingCard} ${styles.trainingCardFee}`
                    : styles.trainingCard
                }
              >
                <div className={styles.cardIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    {item.label.includes("1.000.000") ? (
                      <path d="M6 7h12v10H6zM8 5h8" />
                    ) : (
                      <path d="M12 3v5m0 0l2-2m-2 2l-2-2M5 14h14v5H5z" />
                    )}
                  </svg>
                </div>
                <h3>
                  {item.label.includes("1.000.000") ? (
                    <span className={styles.feeLabel}>
                      Lệ phí đào tạo <span className={styles.feeBadge}>1.000.000 VNĐ</span>
                    </span>
                  ) : (
                    <span className={styles.keywordStrong}>{item.label}</span>
                  )}
                </h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.trainingIncludes}>
            <div className={styles.trainingNote}>
              <h3>Yêu cầu hoàn thành</h3>
              <p>
                <span className={styles.alertBadge}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 7v6m0 4h.01" />
                    <path d="M10 3h4l7 14H3z" />
                  </svg>
                  Hoàn thành 10 giờ đào tạo
                </span>
                và bài kiểm tra cuối khóa để đủ điều kiện nhận lớp. Khóa học
                tổ chức trực tiếp tại trung tâm và yêu cầu tham gia đầy đủ.
              </p>
            </div>
            <div className={styles.trainingList}>
              {trainingIncludes.map((item) => (
                <div key={item} className={styles.trainingListItem}>
                  <span />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.refundPanel}>
            <div className={styles.refundHeader}>
              <h3>Chính sách hoàn phí</h3>
              <p>
                Lộ trình 3 tháng được cộng vào lương hằng tháng nếu gia sư duy
                trì hợp tác đúng quy định.
              </p>
            </div>
            <div className={styles.refundTimeline}>
              {refundTimeline.map((item, index) => (
                <div
                  key={item.month}
                  className={index === refundTimeline.length - 1 ? styles.refundStepLast : styles.refundStep}
                >
                  <div className={styles.refundDot} aria-hidden="true" />
                  <strong>{item.month}</strong>
                  <span className={styles.refundAmount}>{item.amount}</span>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.stageBlock3}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>
              <strong>Giai đoạn 3-4</strong>
            </span>
            <h2>
              <strong>
                Hợp đồng, chứng nhận & <span>phân lớp</span>
              </strong>
            </h2>
            <p>
              Sau khi đạt yêu cầu, gia sư sẽ được ký hợp đồng, cấp chứng nhận
              và mã số quản lý riêng để theo dõi lịch dạy và đánh giá.
            </p>
          </div>
          <div className={styles.flowChart}>
            {contractFlow.map((step) => (
              <div key={step} className={styles.flowItem}>
                <span>{step}</span>
              </div>
            ))}
          </div>
          <div className={styles.stage4Grid}>
            {stage4Details.map((item) => (
              <div key={item.title} className={styles.stage4Card}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.mockupGrid}>
            <div className={styles.certificateMockup}>
              <div className={styles.certificateBadge}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 4h10v10H7z" />
                  <path d="M9 18l3-2 3 2" />
                </svg>
                Certificate
              </div>
              <h3>Chứng nhận Gia sư Song Nguyen EDU</h3>
              <p>Cấp cho giáo viên đạt chuẩn chuyên môn và đạo đức nghề.</p>
              <div className={styles.certificateFooter}>
                <span>Mã số: SNE-2026-114</span>
                <span>Chữ ký số</span>
              </div>
            </div>
            <div className={styles.dashboardMockup}>
              <div className={styles.dashboardHeader}>
                <h3>Dashboard quản lý gia sư</h3>
                <span>Cập nhật lớp, lịch dạy, đánh giá</span>
              </div>
              <div className={styles.dashboardPanels}>
                <div>
                  <strong>05</strong>
                  <span>Lớp đang phụ trách</span>
                </div>
                <div>
                  <strong>98%</strong>
                  <span>Đánh giá trung bình</span>
                </div>
                <div>
                  <strong>12/15</strong>
                  <span>Buổi dạy tháng này</span>
                </div>
              </div>
              <div className={styles.dashboardChart} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.sectionAlt} ${styles.stageBlock5}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>
              <strong>Giai đoạn 5-6</strong>
            </span>
            <h2>
              <strong>
                Thanh toán & <span>phát triển</span>
              </strong>
            </h2>
            <p>
              Trung tâm đảm bảo thanh toán đúng hạn và hỗ trợ gia sư
              nâng cao chuyên môn liên tục.
            </p>
          </div>
          <div className={styles.paymentGrid}>
            <div className={styles.paymentSummary}>
              <h3 className={styles.paymentTitle}>
                <span className={styles.paymentIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 7h16v10H4z" />
                    <path d="M7 10h5M7 14h10" />
                  </svg>
                </span>
                Ngày thanh toán cố định
              </h3>
              <div className={styles.paymentHighlight}>
                <span>15</span>
                <p>Hằng tháng</p>
              </div>
              <a className={styles.primaryButton} href="/dang-nhap-gia-su">
                Đăng ký ngay
              </a>
              <p className={styles.paymentNote}>
                Thanh toán sau khi khấu trừ chi phí quản lý theo thỏa thuận.
              </p>
            </div>
            <div className={styles.paymentDetails}>
              {paymentHighlights.map((item) => (
                <div key={item} className={styles.paymentCard}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12l4 4 10-10" />
                  </svg>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
