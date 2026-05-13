export type StatusTone =
  | "pending"
  | "approved"
  | "rejected"
  | "open"
  | "processing";

export type DashboardKpi = {
  label: string;
  value: string;
  tone: StatusTone;
  badge: string;
  accent: string;
  meta: string;
};

export const dashboardKpis: DashboardKpi[] = [
  {
    label: "Gia sư chờ duyệt",
    value: "8",
    tone: "pending",
    badge: "CHỜ DUYỆT",
    accent: "#924700",
    meta: "↑ 2 so với hôm qua",
  },
  {
    label: "Lớp đang mở",
    value: "24",
    tone: "open",
    badge: "ĐANG MỞ",
    accent: "#0058be",
    meta: "↑ 5 lớp mới trong tuần",
  },
  {
    label: "Yêu cầu mới",
    value: "15",
    tone: "processing",
    badge: "CHỜ XỬ LÝ",
    accent: "#495e8a",
    meta: "↑ 3 yêu cầu mới hôm nay",
  },
  {
    label: "Thanh toán chờ",
    value: "6",
    tone: "pending",
    badge: "CHỜ DUYỆT",
    accent: "#059669",
    meta: "Tổng giá trị: 18.5M đ",
  },
];

export const dashboardTasks = [
  {
    title: "Duyệt 8 hồ sơ",
    priority: "Cao",
    status: "Chờ duyệt",
    tone: "#ba1a1a",
  },
  {
    title: "Xác nhận 6 thanh toán",
    priority: "Cao",
    status: "Chờ duyệt",
    tone: "#ba1a1a",
  },
  {
    title: "Phân gia sư cho 24 lớp",
    priority: "TB",
    status: "Đang mở",
    tone: "#924700",
  },
  {
    title: "Kiểm tra báo cáo",
    priority: "Thấp",
    status: "Hoàn thành",
    tone: "#059669",
  },
];

export const dashboardActivities = [
  {
    time: "10 phút trước",
    detail: "Đã duyệt gia sư Nguyễn Văn A",
    color: "#495e8a",
  },
  {
    time: "45 phút trước",
    detail: "Yêu cầu lớp Toán 12 mới",
    color: "#0058be",
  },
  {
    time: "2 giờ trước",
    detail: "Thanh toán chờ xác nhận (#TT-982)",
    color: "#924700",
  },
  {
    time: "3 giờ trước",
    detail: "Phân gia sư cho lớp Anh văn giao tiếp",
    color: "#059669",
  },
  {
    time: "5 giờ trước",
    detail: "Từ chối hồ sơ gia sư Trần Thị B",
    color: "#ba1a1a",
  },
  {
    time: "Hôm qua",
    detail: "Học viên mới đăng ký tài khoản",
    color: "#0058be",
  },
];

export const dashboardTopTutors = [
  {
    rank: 1,
    name: "Nguyễn Văn A",
    subjects: "Toán, Lý",
    lessons: 15,
    rankColor: "#FFD700",
  },
  {
    rank: 2,
    name: "Lê Minh T",
    subjects: "Anh văn",
    lessons: 12,
    rankColor: "#C0C0C0",
  },
  {
    rank: 3,
    name: "Trần Bá H",
    subjects: "Hóa học",
    lessons: 10,
    rankColor: "#CD7F32",
  },
];

export const dashboardSystemHealth = [
  { service: "Dịch vụ lõi", ratio: "99.9%", status: "Hoạt động bình thường" },
  {
    service: "Cơ sở dữ liệu",
    ratio: "100%",
    status: "Hoạt động bình thường",
  },
  {
    service: "Thư điện tử",
    ratio: "99.8%",
    status: "Hoạt động bình thường",
  },
  { service: "Lưu trữ", ratio: "100%", status: "Hoạt động bình thường" },
];

export const tutorStats = [
  { label: "Đang hoạt động", value: "1,284", icon: "person_check" },
  { label: "Chờ duyệt hồ sơ", value: "42", icon: "pending_actions" },
];

export type TutorRecord = {
  name: string;
  email: string;
  subjects: string[];
  district: string;
  status: StatusTone;
  statusLabel: string;
};

export const tutorRecords: TutorRecord[] = [
  {
    name: "Nguyễn Thị Thu Hà",
    email: "ha.ntt@gmail.com",
    subjects: ["Toán học", "Vật lý"],
    district: "Cầu Giấy, Hà Nội",
    status: "approved",
    statusLabel: "ĐÃ DUYỆT",
  },
  {
    name: "Trần Minh Quân",
    email: "quan.tm@university.edu.vn",
    subjects: ["Tiếng Anh"],
    district: "Quận 1, TP. HCM",
    status: "pending",
    statusLabel: "CHỜ DUYỆT",
  },
  {
    name: "Lê Hoàng Nam",
    email: "hoangnam.le@gmail.com",
    subjects: ["Hóa học", "Sinh học"],
    district: "Hải Châu, Đà Nẵng",
    status: "approved",
    statusLabel: "ĐÃ DUYỆT",
  },
  {
    name: "Phạm Khánh Linh",
    email: "linhpk.edu@outlook.com",
    subjects: ["Tiếng Đức"],
    district: "Ba Đình, Hà Nội",
    status: "rejected",
    statusLabel: "TỪ CHỐI",
  },
];

export type PairingCard = {
  id: string;
  code: string;
  classId: string;
  title: string;
  groupLabel: string;
  statusLabel: string;
  statusTone: StatusTone;
  fee: string;
  district: string;
  schedule: string;
  target: string;
  students: Array<{ initials: string; name: string; sub: string }>;
  applicants: Array<{
    id: string;
    initials: string;
    name: string;
    sub: string;
    matchScore: number;
    distanceKm: number;
    feeMatch: number;
    selected?: boolean;
  }>;
};

export const requestSummary = [
  { label: "Yêu cầu chờ", value: "15" },
  { label: "Lớp đang mở", value: "8" },
  { label: "Ứng viên chờ duyệt", value: "24" },
  { label: "Đã phân lớp", value: "3" },
];

export const requestCards: PairingCard[] = [
  {
    id: "class-math-11",
    code: "T11",
    classId: "#LH-2041",
    title: "Toán 11",
    groupLabel: "Nhóm 3 học sinh",
    statusLabel: "ĐANG MỞ",
    statusTone: "open",
    fee: "300,000đ/buổi",
    district: "Quận 3",
    schedule: "T2, T4, T6 (18:00 - 20:00)",
    target: "Ôn thi Đại học",
    students: [
      { initials: "BA", name: "Nguyễn Bảo Anh", sub: "Đại diện nhóm" },
      { initials: "MK", name: "Trần Minh Khoa", sub: "Học sinh" },
      { initials: "TH", name: "Lê Thu Hà", sub: "Học sinh" },
    ],
    applicants: [
      {
        id: "cand-nguyen-van-an",
        initials: "VA",
        name: "Nguyễn Văn An",
        sub: "Sinh viên - KHTN • Điểm TB 3.65",
        matchScore: 89,
        distanceKm: 2.4,
        feeMatch: 92,
        selected: true,
      },
      {
        id: "cand-le-minh-tuan",
        initials: "MT",
        name: "Lê Minh Tuấn",
        sub: "Giáo viên tự do • 3 năm KN",
        matchScore: 84,
        distanceKm: 3.1,
        feeMatch: 88,
      },
      {
        id: "cand-pham-quoc-duy",
        initials: "QD",
        name: "Phạm Quốc Duy",
        sub: "Sinh viên • Bách Khoa",
        matchScore: 78,
        distanceKm: 5.6,
        feeMatch: 81,
      },
    ],
  },
  {
    id: "class-physics-10",
    code: "L10",
    classId: "#LH-2842",
    title: "Lý 10",
    groupLabel: "Cá nhân",
    statusLabel: "CHỜ DUYỆT",
    statusTone: "pending",
    fee: "250,000đ/buổi",
    district: "Quận 1",
    schedule: "T3, T5 (19:00 - 21:00)",
    target: "Củng cố nền tảng",
    students: [
      { initials: "HP", name: "Ngọc Huyền Phương", sub: "Học sinh" },
      { initials: "", name: "", sub: "" },
      { initials: "", name: "", sub: "" },
    ],
    applicants: [
      {
        id: "cand-nguyen-quoc-thang",
        initials: "QT",
        name: "Nguyễn Quốc Thắng",
        sub: "Sinh viên - ĐHSP",
        matchScore: 86,
        distanceKm: 2.2,
        feeMatch: 90,
      },
      {
        id: "cand-vu-phuong-hang",
        initials: "PH",
        name: "Vũ Phương Hằng",
        sub: "Cử nhân Vật lý",
        matchScore: 82,
        distanceKm: 1.6,
        feeMatch: 87,
      },
      {
        id: "cand-dinh-tuan",
        initials: "DT",
        name: "Đinh Tuấn",
        sub: "Sinh viên • UTE",
        matchScore: 79,
        distanceKm: 4.7,
        feeMatch: 83,
      },
    ],
  },
];

export const classCards: PairingCard[] = [
  {
    id: "class-chemistry-12",
    code: "H12",
    classId: "#LH-2043",
    title: "Hóa 12",
    groupLabel: "Nhóm 2 học sinh",
    statusLabel: "ĐANG MỞ",
    statusTone: "open",
    fee: "320,000đ/buổi",
    district: "Bình Thạnh",
    schedule: "T2, T5 (17:30 - 19:30)",
    target: "Luyện thi THPT",
    students: [
      { initials: "QN", name: "Quang Nam", sub: "Đại diện nhóm" },
      { initials: "HT", name: "Huỳnh Thảo", sub: "Học sinh" },
      { initials: "", name: "", sub: "" },
    ],
    applicants: [
      {
        id: "cand-le-hai",
        initials: "LH",
        name: "Lê Hải",
        sub: "Giáo viên tự do • 5 năm KN",
        matchScore: 92,
        distanceKm: 1.8,
        feeMatch: 100,
        selected: true,
      },
      {
        id: "cand-bich-ngan",
        initials: "BN",
        name: "Bích Ngân",
        sub: "Sinh viên năm 4",
        matchScore: 86,
        distanceKm: 3.4,
        feeMatch: 92,
      },
      {
        id: "cand-duy-anh",
        initials: "DA",
        name: "Duy Anh",
        sub: "Gia sư bán thời gian",
        matchScore: 79,
        distanceKm: 4.1,
        feeMatch: 88,
      },
    ],
  },
  {
    id: "class-english-communication",
    code: "A9",
    classId: "#LH-1872",
    title: "Anh văn giao tiếp",
    groupLabel: "1 học viên",
    statusLabel: "CHỜ DUYỆT",
    statusTone: "pending",
    fee: "280,000đ/buổi",
    district: "Phú Nhuận",
    schedule: "T4, T6 (20:00 - 21:30)",
    target: "Giao tiếp doanh nghiệp",
    students: [
      { initials: "NL", name: "Ngọc Lan", sub: "Học viên" },
      { initials: "", name: "", sub: "" },
      { initials: "", name: "", sub: "" },
    ],
    applicants: [
      {
        id: "cand-khanh-ky",
        initials: "KK",
        name: "Khánh Kỳ",
        sub: "IELTS 8.0",
        matchScore: 90,
        distanceKm: 2.8,
        feeMatch: 95,
      },
      {
        id: "cand-thao-linh",
        initials: "TL",
        name: "Thảo Linh",
        sub: "TOEIC 920",
        matchScore: 83,
        distanceKm: 1.9,
        feeMatch: 89,
      },
      {
        id: "cand-ngoc-anh",
        initials: "NA",
        name: "Ngọc Ánh",
        sub: "Giáo viên THPT",
        matchScore: 87,
        distanceKm: 3.6,
        feeMatch: 91,
      },
    ],
  },
];

export const paymentTabs = [
  { label: "Chờ xác nhận", count: 6, active: true },
  { label: "Đã xác nhận", count: 47, active: false },
  { label: "Đã từ chối", count: 12, active: false },
];

export const paymentInfo = [
  { label: "Gia sư nộp", value: "Nguyễn Văn An" },
  { label: "Mã lớp", value: "#LH-2041" },
  { label: "Môn học", value: "Toán 11 (Nhóm 3 hs)" },
  { label: "Số tiền cần nộp", value: "300,000đ" },
];

export const paymentTimeline = [
  {
    title: "Đã từ chối",
    meta: "14:30 - 20/10/2023 | Lý do: Số tiền thiếu 50,000đ",
    color: "#ba1a1a",
  },
  {
    title: "Nộp lại biên nhận (Chờ xác nhận)",
    meta: "09:15 - 21/10/2023 | Gia sư tải lên ảnh biên nhận mới",
    color: "#924700",
  },
];

export const auditRecords = [
  {
    time: "2026-04-18 10:38",
    actor: "Admin User",
    action: "PAYMENT_CONFIRMED",
    target: "payment:LH-2041",
    status: "SUCCESS",
  },
  {
    time: "2026-04-18 10:12",
    actor: "Admin User",
    action: "TUTOR_APPROVED",
    target: "tutor:TUT-2041",
    status: "SUCCESS",
  },
  {
    time: "2026-04-18 09:45",
    actor: "Support Agent",
    action: "REQUEST_REJECTED",
    target: "request:REQ-981",
    status: "WARN",
  },
  {
    time: "2026-04-18 09:07",
    actor: "System",
    action: "SYNC_WEBHOOK_RETRY",
    target: "integration:payment_gateway",
    status: "INFO",
  },
];

export const auditPayload = {
  id: "evt_18A9421",
  actorId: "admin_1001",
  actorRole: "SUPER_ADMIN",
  action: "PAYMENT_CONFIRMED",
  targetType: "payment",
  targetId: "LH-2041",
  ip: "14.167.22.41",
  userAgent: "Chrome/136",
  before: {
    status: "PENDING",
    reviewedBy: null,
  },
  after: {
    status: "CONFIRMED",
    reviewedBy: "admin_1001",
    reviewedAt: "2026-04-18T10:38:12.000Z",
  },
};
