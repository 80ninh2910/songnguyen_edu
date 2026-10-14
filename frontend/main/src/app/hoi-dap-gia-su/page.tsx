import type { ReactNode } from "react";
import { Be_Vietnam_Pro } from "next/font/google";

import styles from "./page.module.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

type FaqItem = {
  question: string;
  answer: ReactNode;
};

type FaqSection = {
  id: string;
  title: string;
  items: FaqItem[];
};

const learnerFaqSections: FaqSection[] = [
  {
    id: "faq-tim-kiem",
    title: "1. Tìm kiếm, Đăng ký & Ký hợp đồng",
    items: [
      {
        question: "Làm thế nào để tìm được gia sư phù hợp?",
        answer:
          "Bạn chỉ cần để lại nhu cầu theo môn học, cấp lớp và khu vực. Đội ngũ điều phối sẽ gửi hồ sơ gia sư phù hợp trong 24-48 giờ.",
      },
      {
        question: "Có học thử trước khi đăng ký chính thức không?",
        answer:
          "Có. Học viên có thể học thử 1-2 buổi để đánh giá phong cách giảng dạy và độ tương thích trước khi chốt lộ trình dài hạn với gia sư được đề xuất.",
      },
      {
        question: "Sự khác biệt giữa Gia sư tự do và Gia sư qua đào tạo là gì?",
        answer: (
          <>
            <p>
              <strong>Gia sư qua đào tạo:</strong> Đã vượt qua kiểm tra nghiệp vụ sư phạm của trung tâm,
              được nhân viên hỗ trợ làm thủ tục ký hợp đồng và trung tâm cam kết sát sao lộ trình học.
            </p>
            <p>
              <strong>Gia sư tự do:</strong> Đã xác minh CCCD và bằng cấp/thẻ sinh viên tại trung tâm,
              phù hợp cho nhu cầu học linh hoạt với chi phí tối ưu.
            </p>
          </>
        ),
      },
      {
        question: "Quy trình ký hợp đồng diễn ra như thế nào?",
        answer: (
          <>
            <p>
              <strong>Nếu chọn Gia sư qua đào tạo:</strong> Chuyên viên trung tâm sẽ đến tận nhà phụ huynh
              để tư vấn, ký hợp đồng và tiếp nhận học phí (hoặc phụ huynh có thể đến trực tiếp văn phòng
              trung tâm).
            </p>
            <p>
              <strong>Nếu chọn Gia sư tự do:</strong> Phụ huynh làm thủ tục xác nhận và ký hợp đồng trực
              tiếp tại văn phòng trung tâm hoặc online qua hệ thống.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "faq-hoc-phi",
    title: "2. Học phí, Thanh toán & Cam kết",
    items: [
      {
        question: "Học phí được tính như thế nào và thanh toán qua hình thức nào?",
        answer:
          "Học phí tùy thuộc vào môn học, cấp lớp và trình độ gia sư. Phụ huynh thanh toán theo từng tháng hoặc theo khóa qua chuyển khoản, ví điện tử, thẻ ngân hàng hoặc nộp trực tiếp khi ký hợp đồng.",
      },
      {
        question: "Tôi thanh toán tiền cho gia sư hay qua nền tảng/trung tâm?",
        answer:
          "Toàn bộ học phí được thanh toán trực tiếp tại bàn lễ tân của Trung tâm hoặc thông qua hình thức thanh toán trực tuyến qua Zalo. Trung tâm sẽ thực hiện thanh toán cho gia sư sau khi gia sư hoàn thành đầy đủ số buổi dạy theo thỏa thuận và đúng cam kết ban đầu. Quy trình này nhằm đảm bảo việc thanh toán được minh bạch, đồng thời bảo vệ quyền lợi của phụ huynh và học viên trong suốt quá trình học tập.",
      },
      {
        question: "Chính sách hoàn tiền hoặc hủy lớp được quy định ra sao?",
        answer: (
          <>
            <p><strong>Chính sách hủy lớp và hoàn phí</strong></p>
            <p>
              Trường hợp buổi học bị hủy do lỗi từ phía gia sư, Trung tâm sẽ chủ động sắp xếp lịch dạy bù
              phù hợp, đảm bảo quyền lợi học tập của học viên.
            </p>
            <p>
              Trường hợp lớp học không thể tiếp tục vì lý do khách quan hoặc bất khả kháng, Trung tâm sẽ
              xem xét và hỗ trợ hoàn lại 100% học phí của các buổi học chưa sử dụng. Một số trường hợp có
              thể bao gồm:
            </p>
            <ol>
              <li>Gia sư chủ động xin nghỉ hoặc không thể tiếp tục đảm nhận lớp vì lý do cá nhân, sức khỏe hoặc lý do chính đáng khác.</li>
              <li>Gia sư không thể tiếp tục giảng dạy do các trường hợp bất khả kháng.</li>
              <li>Học viên gặp vấn đề về sức khỏe hoặc phát sinh sự cố bất khả kháng khiến không thể tiếp tục lớp học.</li>
              <li>Lớp học không thể tiếp tục do những nguyên nhân khách quan khác được Trung tâm xác nhận.</li>
            </ol>
            <p>
              Đối với trường hợp học viên đã tham gia một buổi học nhưng sau đó phát sinh lý do bất khả
              kháng, Trung tâm sẽ hoàn lại chi phí tương ứng với các buổi học chưa sử dụng, sau khi đối
              chiếu số buổi đã học thực tế.
            </p>
            <p>
              Các yêu cầu hủy lớp hoặc hoàn phí cần được thông báo và gửi đến Trung tâm trong vòng 07 ngày
              kể từ ngày đăng ký học để được tiếp nhận và xử lý theo chính sách.
            </p>
            <p>
              Trung tâm sẽ căn cứ vào tình hình thực tế, thông tin xác nhận từ các bên và số buổi học đã
              thực hiện để đảm bảo việc xử lý minh bạch, hợp lý và quyền lợi của cả phụ huynh, học viên và
              gia sư.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "faq-tien-do",
    title: "3. Theo dõi Tiến độ & Chất lượng",
    items: [
      {
        question: "Trung tâm theo dõi tiến độ học tập như thế nào?",
        answer: (
          <>
            <p>Phụ huynh theo dõi qua 3 kênh:</p>
            <ol>
              <li><strong>Sổ liên lạc điện tử:</strong> Gia sư cập nhật nhận xét, điểm danh và bài tập về nhà sau mỗi buổi dạy.</li>
              <li><strong>Báo cáo định kỳ:</strong> Trung tâm tổng hợp kết quả đánh giá năng lực hằng tháng.</li>
              <li><strong>Trao đổi trực tiếp:</strong> Phụ huynh có thể trao đổi 5-10 phút đầu/cuối buổi hoặc liên hệ chuyên viên điều phối.</li>
            </ol>
          </>
        ),
      },
      {
        question: "Làm sao để biết gia sư dạy đúng giờ và đủ số buổi?",
        answer:
          "Gia sư thực hiện điểm danh Check-in/Check-out trực tiếp trên website khi bắt đầu và kết thúc buổi học. Phụ huynh dễ dàng đối soát lịch sử dạy học ngay trên tài khoản cá nhân.",
      },
      {
        question: "Bằng cấp và lý lịch của gia sư được xác minh bằng cách nào?",
        answer:
          "100% gia sư phải nộp CCCD, bằng đại học/thẻ sinh viên và chứng chỉ chuyên môn. Đội ngũ kiểm duyệt sẽ đối soát thông tin thực tế trước khi duyệt hồ sơ lên hệ thống.",
      },
      {
        question: "Nếu học sinh không tiến bộ hoặc không hợp gia sư thì xử lý thế nào?",
        answer:
          "Trung tâm sẽ rà soát lại phương pháp dạy, tổ chức đánh giá lại năng lực học sinh hoặc hỗ trợ đổi gia sư mới nhanh chóng mà không phát sinh thêm chi phí.",
      },
    ],
  },
  {
    id: "faq-doi-lich",
    title: "4. Xin nghỉ, Đổi lịch & Dạy bù",
    items: [
      {
        question: "Nếu học sinh bận đột xuất muốn xin nghỉ hoặc đổi lịch thì làm thế nào?",
        answer:
          "Phụ huynh/Học sinh cần báo trước cho gia sư trước ít nhất 6 tiếng. Buổi nghỉ có báo trước sẽ được sắp xếp dạy bù vào thời gian phù hợp.",
      },
      {
        question: "Nếu sắp đến kỳ thi (Giữa kỳ/Cuối kỳ), gia sư có thể tăng số buổi học không?",
        answer:
          "Có. Phụ huynh trao đổi với gia sư và đăng ký số buổi tăng cường trên hệ thống. Chi phí tính theo đơn giá buổi học đã cam kết trong hợp đồng.",
      },
      {
        question: "Hợp đồng kết thúc có tự động gia hạn không?",
        answer:
          "Hợp đồng không tự động gia hạn. Trước khi hết hạn 1-2 tuần, trung tâm sẽ liên hệ tham khảo ý kiến phụ huynh để hỗ trợ làm thủ tục gia hạn nếu gia đình có nhu cầu.",
      },
    ],
  },
];

const tutorFaqSections: FaqSection[] = [
  {
    id: "faq-ho-so-gia-su",
    title: "1. Điều kiện, Hồ sơ & Nhận lớp",
    items: [
      {
        question: "Điều kiện để trở thành gia sư của trung tâm là gì?",
        answer:
          "Ứng viên cần hồ sơ lý lịch rõ ràng (CCCD, Bằng cấp/Thẻ sinh viên), nền tảng chuyên môn tốt và vượt qua vòng phỏng vấn/đánh giá năng lực của trung tâm.",
      },
      {
        question: "Gia sư tự do hoàn tất thủ tục nhận lớp như thế nào?",
        answer:
          "Sau khi đăng ký nhận lớp online thành công, gia sư tự do cần đến trực tiếp văn phòng trung tâm để xác minh giấy tờ gốc (CCCD, Thẻ sinh viên/Bằng cấp) và ký hợp đồng nhận lớp.",
      },
      {
        question: "Làm thế nào để trở thành Gia sư qua đào tạo của trung tâm?",
        answer:
          'Gia sư tự do có đánh giá tốt hoặc ứng viên hoàn thành khóa kiểm tra nghiệp vụ sư phạm do trung tâm tổ chức sẽ được nâng cấp lên "Gia sư qua đào tạo" để ưu tiên giao lớp và nhận mức thù lao cao hơn.',
      },
      {
        question: "Làm sao để hồ sơ gia sư thu hút phụ huynh và được duyệt nhanh?",
        answer:
          "Cập nhật ảnh chân dung lịch sự, tải đầy đủ bằng cấp/chứng chỉ (IELTS, HSK, giải thưởng...), viết phần giới thiệu bản thân chi tiết và cập nhật lịch rảnh chính xác trên profile.",
      },
    ],
  },
  {
    id: "faq-thu-lao",
    title: "2. Thù lao, Phí & Quyền lợi",
    items: [
      {
        question: "Khi nào gia sư nhận được tiền thù lao dạy học?",
        answer:
          "Thu nhập được tổng hợp tự động trên hệ thống sau khi gia sư điểm danh hoàn thành các buổi học. Tiền thù lao được chuyển về tài khoản ngân hàng cá nhân của gia sư theo chu kỳ cố định ngày 15 hằng tháng.",
      },
      {
        question: "Phí nhận lớp và chính sách hỗ trợ ra sao?",
        answer:
          "Phí dịch vụ hiển thị minh bạch tại chi tiết từng lớp học trước khi gia sư đăng ký. Gia sư được trung tâm hỗ trợ giáo trình, tài liệu giảng dạy, quy trình làm việc và xử lý các vấn đề phát sinh với phụ huynh.",
      },
      {
        question: "Nếu phụ huynh thanh toán trễ hoặc hủy lớp giữa chừng thì quyền lợi gia sư ra sao?",
        answer:
          "Trung tâm là đơn vị đứng ra bảo đảm thù lao. Gia sư vẫn nhận đủ 100% tiền thù lao cho các buổi đã giảng dạy thực tế theo ghi nhận trên hệ thống.",
      },
    ],
  },
  {
    id: "faq-quy-dinh-gia-su",
    title: "3. Quy định Lớp học & Xử lý Sự cố",
    items: [
      {
        question: "Nếu gia sư bận việc đột xuất không thể dạy thì quy trình thế nào?",
        answer:
          "Gia sư phải báo trước cho Phụ huynh và Trung tâm ít nhất 12-24 tiếng, đồng thời đề xuất lịch dạy bù. Gia sư tự ý bỏ lớp hoặc báo nghỉ sát giờ không lý do sẽ bị trừ điểm uy tín hoặc xử lý theo quy định hợp đồng.",
      },
      {
        question: "Nếu phụ huynh/học sinh hủy lớp sát giờ thì xử lý thế nào?",
        answer:
          "Phụ huynh cần báo trước theo quy định. Trường hợp phụ huynh hủy lớp sát giờ nhiều lần không lý do, trung tâm sẽ làm việc lại để bảo lưu hoặc tính % thù lao buổi học đó cho gia sư.",
      },
      {
        question: "Trung tâm có hỗ trợ xử lý các tranh chấp trong quá trình dạy không?",
        answer:
          "Có. Bộ phận điều phối đồng hành xuyên suốt, hỗ trợ kết nối với phụ huynh, điều chỉnh lịch học và đứng ra giải quyết các bất đồng phát sinh để gia sư yên tâm giảng dạy.",
      },
    ],
  },
];

const generalFaq: FaqItem[] = [
  {
    question: "Thông tin cá nhân và số điện thoại của tôi có bị tiết lộ không?",
    answer:
      "Nền tảng cam kết bảo mật tuyệt đối. Số điện thoại và địa chỉ nhà chỉ được chia sẻ giữa Phụ huynh và Gia sư sau khi lớp học được xác nhận ghép đôi thành công và ký hợp đồng.",
  },
  {
    question: "Tôi quên mật khẩu hoặc gặp sự cố đăng nhập thì phải làm sao?",
    answer:
      'Bạn bấm vào tính năng "Quên mật khẩu" tại màn hình đăng nhập để nhận mã OTP khôi phục qua SMS/Email, hoặc nhấn nút "Hỗ trợ" để gặp tư vấn viên.',
  },
  {
    question: "Tôi có thể liên hệ bộ phận hỗ trợ qua những kênh nào?",
    answer: (
      <>
        <p>
          Hotline/Zalo CSKH: <a href="https://zalo.me/0988212316">0988 212 316</a>
          <br />
          Email: <a href="mailto:songnguyeneducationcoltd@gmail.com">songnguyeneducationcoltd@gmail.com</a>
        </p>
        <p>Hoặc đến trực tiếp một trong các cơ sở trong giờ làm việc (8:00 - 17:30, Thứ 2 - Thứ 7):</p>
        <ul>
          <li>Cơ sở 1: Số 3 TA15, Phường Thới An, TP.HCM</li>
          <li>Cơ sở 2: 27/31 Đường số 9, Phường An Hội Đông, TP.HCM</li>
          <li>Cơ sở 3: 188 Quang Trung, Phường Hạnh Thông, TP.HCM</li>
        </ul>
      </>
    ),
  },
];

function FaqDetails({ item }: { item: FaqItem }) {
  return (
    <details>
      <summary>{item.question}</summary>
      <div className={styles.answer}>{item.answer}</div>
    </details>
  );
}

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
          </div>
        </section>

        <section className={styles.faqGrid}>
          <aside className={styles.categoryCard}>
            <p className={styles.categoryTag}>Danh mục</p>
            <ul>
              <li><a className={styles.categoryLearner} href="#faq-phu-huynh">Dành cho Phụ huynh &amp; Học sinh</a></li>
              <li><a className={styles.categoryTutor} href="#faq-gia-su">Dành cho Gia sư</a></li>
              <li><a className={styles.categorySupport} href="#faq-ho-tro">Kỹ thuật, Bảo mật &amp; Hỗ trợ chung</a></li>
              <li><a className={styles.categoryTuition} href="/hoc-phi">Tham khảo học phí</a></li>
            </ul>
          </aside>

          <div className={styles.faqColumns}>
            <section id="faq-phu-huynh" className={`${styles.faqGroup} ${styles.learnerGroup}`}>
              <h2>I. Dành cho Phụ huynh &amp; Học sinh</h2>
              {learnerFaqSections.map((section) => (
                <div className={styles.faqSubsection} id={section.id} key={section.id}>
                  <h3>{section.title}</h3>
                  {section.items.map((item) => <FaqDetails item={item} key={item.question} />)}
                </div>
              ))}
            </section>

            <section id="faq-gia-su" className={`${styles.faqGroup} ${styles.tutorGroup}`}>
              <h2>II. Dành cho Gia sư</h2>
              {tutorFaqSections.map((section) => (
                <div className={styles.faqSubsection} id={section.id} key={section.id}>
                  <h3>{section.title}</h3>
                  {section.items.map((item) => <FaqDetails item={item} key={item.question} />)}
                </div>
              ))}
            </section>

            <section id="faq-ho-tro" className={`${styles.faqGroup} ${styles.supportGroup}`}>
              <h2>III. Kỹ thuật, Bảo mật &amp; Hỗ trợ chung</h2>
              {generalFaq.map((item) => <FaqDetails item={item} key={item.question} />)}
            </section>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2>Vẫn còn câu hỏi?</h2>
          <p>
            Để lại thông tin, chúng tôi sẽ liên hệ trong giờ làm việc sớm nhất để tư vấn lộ trình học phù hợp.
          </p>
          <div className={styles.ctaActions}>
            <a href="https://zalo.me/0988212316" className={styles.ctaPrimary}>Liên hệ hỗ trợ</a>
            <a href="/hoc-phi" className={styles.ctaSecondary}>Xem học phí chi tiết</a>
          </div>
        </section>
      </div>
    </main>
  );
}
