export type TuitionMode = "parent" | "center";

export type TuitionOption = {
  value: string;
  label: string;
};

export type TuitionEstimate = {
  amount: number;
  unitLabel: string;
  monthlyAmount: number | null;
  calculation: string;
  sourceCategory: "Văn hóa" | "Anh văn" | "Năng khiếu";
  note: string;
};

export type TuitionEstimateInput = {
  mode: TuitionMode;
  subject: string;
  level: string;
  sessionsPerWeek: string;
  studentCount: string;
  tutorLevel: string;
  pricingPackage: string;
};

const ALL_SESSIONS = ["1", "2", "3", "4", "5"];

const SUBJECTS_BY_MODE: Record<TuitionMode, TuitionOption[]> = {
  parent: [
    { value: "Toán", label: "Toán" },
    {
      value: "Tiếng Việt / Rèn chữ / Báo bài",
      label: "Tiếng Việt / Rèn chữ / Báo bài",
    },
    { value: "Ngữ văn", label: "Ngữ văn" },
    { value: "KHTN", label: "Khoa học tự nhiên" },
    { value: "Tiếng Anh", label: "Tiếng Anh" },
    { value: "Vẽ màu sáp", label: "Vẽ màu sáp" },
    { value: "Vẽ màu nước", label: "Vẽ màu nước" },
    { value: "Cờ vua", label: "Cờ vua" },
    { value: "Cờ tướng", label: "Cờ tướng" },
    { value: "Piano / Organ", label: "Piano / Organ" },
    { value: "Tin học", label: "Tin học" },
  ],
  center: [
    { value: "Toán", label: "Toán" },
    {
      value: "Tiếng Việt / Rèn chữ / Báo bài",
      label: "Tiếng Việt / Rèn chữ / Báo bài",
    },
    { value: "Ngữ văn", label: "Ngữ văn" },
    { value: "KHTN", label: "Khoa học tự nhiên" },
    { value: "Tiếng Anh", label: "Tiếng Anh" },
    { value: "Vẽ màu sáp", label: "Vẽ màu sáp" },
    { value: "Vẽ màu nước", label: "Vẽ màu nước" },
    { value: "Cờ vua", label: "Cờ vua" },
    { value: "Cờ tướng", label: "Cờ tướng" },
    { value: "Piano / Organ", label: "Piano / Organ" },
    { value: "Tin học", label: "Tin học" },
    { value: "Aerobic / Nhịp điệu", label: "Aerobic / Nhịp điệu" },
  ],
};

const TUTOR_LEVELS: Record<string, string[]> = {
  Toán: [
    "Lá, lớp 1, 2, 5",
    "Lớp 3, 4",
    "Lớp 6, 7, 8",
    "Lớp 9",
    "Lớp 10, 11",
    "Lớp 12",
    "Luyện thi lớp 9",
    "Luyện thi lớp 12",
  ],
  "Tiếng Việt / Rèn chữ / Báo bài": ["Lá, lớp 1, 2, 5", "Lớp 3, 4"],
  "Ngữ văn": [
    "Lớp 6, 7, 8",
    "Lớp 9",
    "Lớp 10, 11",
    "Lớp 12",
    "Luyện thi lớp 9",
    "Luyện thi lớp 12",
  ],
  KHTN: [
    "Lớp 6, 7, 8",
    "Lớp 9",
    "Lớp 10, 11",
    "Lớp 12",
    "Luyện thi lớp 12",
  ],
  "Tiếng Anh": [
    "KID (Chồi, Lá)",
    "STARTERS (Lớp 1, 2)",
    "MOVERS (Lớp 3, 4)",
    "FLYERS (Lớp 5)",
    "KET (Lớp 6, 7)",
    "PET (Lớp 8, 9)",
    "Luyện thi Flyers",
    "Luyện thi 9 lên 10",
    "Luyện thi 12 lên đại học",
  ],
  "Vẽ màu sáp": ["Sơ cấp", "Trung cấp", "Nâng cao"],
  "Vẽ màu nước": ["Sơ cấp", "Trung cấp", "Nâng cao"],
  "Cờ vua": ["Sơ cấp", "Trung cấp", "Nâng cao"],
  "Cờ tướng": ["Sơ cấp", "Trung cấp", "Nâng cao"],
  "Piano / Organ": ["Sơ cấp"],
  "Tin học": ["Tin học cơ bản", "IC3", "Chứng chỉ MOS"],
};

const CENTER_LEVELS: Record<string, string[]> = {
  Toán: ["Tiền tiểu học - Tiểu học", "Cấp II - III"],
  "Tiếng Việt / Rèn chữ / Báo bài": ["Tiền tiểu học - Tiểu học"],
  "Ngữ văn": ["Cấp II - III"],
  KHTN: ["Cấp II - III"],
  "Tiếng Anh": [
    "KID (Chồi, Lá)",
    "STARTERS (Lớp 1, 2)",
    "MOVERS (Lớp 3, 4)",
    "FLYERS (Lớp 5)",
    "KET (Lớp 6, 7)",
    "PET (Lớp 8, 9)",
    "Luyện thi Flyers - học viên cũ",
    "Luyện thi Flyers - học viên tự do",
    "Luyện thi 9 lên 10",
    "Luyện thi 12 lên đại học",
    "Luyện thi tổng hợp",
  ],
  "Vẽ màu sáp": ["Sơ cấp", "Trung cấp", "Nâng cao"],
  "Vẽ màu nước": ["Sơ cấp", "Trung cấp", "Nâng cao"],
  "Cờ vua": ["Sơ cấp", "Trung cấp", "Nâng cao"],
  "Cờ tướng": ["Sơ cấp", "Trung cấp", "Nâng cao"],
  "Piano / Organ": ["Theo loại lớp"],
  "Tin học": ["Tin học cơ bản", "IC3", "Chứng chỉ MOS"],
  "Aerobic / Nhịp điệu": ["4 - 6 tuổi", "Trên 6 tuổi"],
};

type TutorColumns = [number, number, number];

const TUTOR_RATES: Record<string, TutorColumns> = {
  "Toán|Lá, lớp 1, 2, 5": [140000, 180000, 230000],
  "Tiếng Việt / Rèn chữ / Báo bài|Lá, lớp 1, 2, 5": [140000, 180000, 230000],
  "Toán|Lớp 3, 4": [150000, 190000, 240000],
  "Tiếng Việt / Rèn chữ / Báo bài|Lớp 3, 4": [150000, 190000, 240000],
  "Toán|Lớp 6, 7, 8": [160000, 200000, 250000],
  "Ngữ văn|Lớp 6, 7, 8": [220000, 260000, 310000],
  "KHTN|Lớp 6, 7, 8": [200000, 240000, 290000],
  "Toán|Lớp 9": [180000, 220000, 270000],
  "Ngữ văn|Lớp 9": [250000, 290000, 340000],
  "KHTN|Lớp 9": [230000, 270000, 320000],
  "Toán|Lớp 10, 11": [200000, 240000, 290000],
  "Ngữ văn|Lớp 10, 11": [280000, 320000, 370000],
  "KHTN|Lớp 10, 11": [260000, 300000, 350000],
  "Toán|Lớp 12": [220000, 260000, 310000],
  "Ngữ văn|Lớp 12": [280000, 320000, 370000],
  "KHTN|Lớp 12": [250000, 290000, 340000],
  "Toán|Luyện thi lớp 9": [220000, 260000, 310000],
  "Ngữ văn|Luyện thi lớp 9": [220000, 260000, 310000],
  "Toán|Luyện thi lớp 12": [250000, 290000, 340000],
  "Ngữ văn|Luyện thi lớp 12": [250000, 290000, 340000],
  "KHTN|Luyện thi lớp 12": [250000, 290000, 340000],
  "Tiếng Anh|KID (Chồi, Lá)": [160000, 200000, 250000],
  "Tiếng Anh|STARTERS (Lớp 1, 2)": [170000, 210000, 260000],
  "Tiếng Anh|MOVERS (Lớp 3, 4)": [180000, 220000, 270000],
  "Tiếng Anh|FLYERS (Lớp 5)": [190000, 230000, 280000],
  "Tiếng Anh|KET (Lớp 6, 7)": [210000, 240000, 300000],
  "Tiếng Anh|PET (Lớp 8, 9)": [240000, 280000, 330000],
  "Tiếng Anh|Luyện thi Flyers": [270000, 310000, 360000],
  "Tiếng Anh|Luyện thi 9 lên 10": [220000, 260000, 310000],
  "Tiếng Anh|Luyện thi 12 lên đại học": [300000, 340000, 390000],
  "Vẽ màu sáp|Sơ cấp": [220000, 260000, 310000],
  "Vẽ màu sáp|Trung cấp": [250000, 290000, 340000],
  "Vẽ màu sáp|Nâng cao": [300000, 340000, 390000],
  "Vẽ màu nước|Sơ cấp": [250000, 290000, 340000],
  "Vẽ màu nước|Trung cấp": [280000, 320000, 370000],
  "Vẽ màu nước|Nâng cao": [310000, 350000, 400000],
  "Cờ vua|Sơ cấp": [220000, 260000, 310000],
  "Cờ vua|Trung cấp": [250000, 290000, 340000],
  "Cờ vua|Nâng cao": [300000, 340000, 390000],
  "Cờ tướng|Sơ cấp": [250000, 290000, 340000],
  "Cờ tướng|Trung cấp": [280000, 320000, 370000],
  "Cờ tướng|Nâng cao": [310000, 350000, 400000],
  "Piano / Organ|Sơ cấp": [350000, 400000, 500000],
  "Tin học|Tin học cơ bản": [800000, 840000, 890000],
  "Tin học|IC3": [900000, 940000, 990000],
  "Tin học|Chứng chỉ MOS": [1200000, 1250000, 1290000],
};

const CENTER_CULTURE_RATES: Record<string, number> = {
  "Toán|Tiền tiểu học - Tiểu học|2": 700000,
  "Toán|Tiền tiểu học - Tiểu học|3": 800000,
  "Toán|Tiền tiểu học - Tiểu học|4": 900000,
  "Toán|Tiền tiểu học - Tiểu học|5": 1000000,
  "Tiếng Việt / Rèn chữ / Báo bài|Tiền tiểu học - Tiểu học|2": 700000,
  "Tiếng Việt / Rèn chữ / Báo bài|Tiền tiểu học - Tiểu học|3": 800000,
  "Tiếng Việt / Rèn chữ / Báo bài|Tiền tiểu học - Tiểu học|4": 900000,
  "Tiếng Việt / Rèn chữ / Báo bài|Tiền tiểu học - Tiểu học|5": 1000000,
  "Toán|Cấp II - III|3": 1000000,
  "Toán|Cấp II - III|5": 1300000,
  "Ngữ văn|Cấp II - III|2": 800000,
  "KHTN|Cấp II - III|2": 800000,
};

const CENTER_ENGLISH_RATES: Record<string, Partial<Record<string, number>>> = {
  "KID (Chồi, Lá)": { "1m": 1650000, "3m": 4150000, "6m": 7850000, "9m": 11150000, "12m": 14250000 },
  "STARTERS (Lớp 1, 2)": { "1m": 1750000, "3m": 4400000, "6m": 8300000, "9m": 11850000, "12m": 15200000 },
  "MOVERS (Lớp 3, 4)": { "1m": 1850000, "3m": 4650000, "6m": 8800000, "9m": 12500000, "12m": 16150000 },
  "FLYERS (Lớp 5)": { "1m": 1950000, "3m": 4900000, "6m": 9300000, "9m": 13200000, "12m": 17100000 },
  "KET (Lớp 6, 7)": { "1m": 2150000, "3m": 5400000, "6m": 10200000, "9m": 14500000, "12m": 19000000 },
  "PET (Lớp 8, 9)": { "1m": 2400000, "3m": 6000000, "6m": 11400000, "9m": 16200000, "12m": 20900000 },
  "Luyện thi Flyers - học viên cũ": { "1m": 2750000, "3m": 6875000, "6m": 11000000 },
  "Luyện thi Flyers - học viên tự do": { "1m": 3300000, "3m": 8250000, "6m": 13200000 },
  "Luyện thi 9 lên 10": { "1m": 3300000, "3m": 8250000, "6m": 13200000 },
  "Luyện thi 12 lên đại học": { "1m": 3850000, "3m": 9625000, "6m": 15400000 },
  "Luyện thi tổng hợp": { "1m": 3100000, "3m": 7750000, "6m": 12400000 },
};

const CENTER_TALENT_BASE: Record<string, Record<string, number[]>> = {
  "Vẽ màu sáp": {
    "Sơ cấp": [600000, 750000, 900000, 1050000],
    "Trung cấp": [900000, 1050000, 1200000, 1350000],
    "Nâng cao": [1200000, 1350000, 1500000, 1650000],
  },
  "Vẽ màu nước": {
    "Sơ cấp": [750000, 900000, 1050000, 1200000],
    "Trung cấp": [1200000, 1350000, 1500000, 1650000],
    "Nâng cao": [1500000, 1650000, 1800000, 1950000],
  },
  "Cờ vua": {
    "Sơ cấp": [600000, 750000, 900000, 1050000],
    "Trung cấp": [900000, 1050000, 1200000, 1350000],
    "Nâng cao": [1200000, 1350000, 1500000, 1650000],
  },
  "Cờ tướng": {
    "Sơ cấp": [750000, 900000, 1050000, 1200000],
    "Trung cấp": [1200000, 1350000, 1500000, 1650000],
    "Nâng cao": [1500000, 1650000, 1800000, 1950000],
  },
};

const CENTER_PIANO_RATES: Record<string, number[]> = {
  group: [1200000, 2100000, 2850000, 3750000, 4500000],
  small: [1500000, 2700000, 4050000, 5250000, 6450000],
  private: [3000000, 5250000, 7500000, 9750000, 12000000],
};

const CENTER_IT_RATES: Record<string, Record<string, number>> = {
  "Tin học cơ bản": { "4w": 700000, "12w": 1800000 },
  IC3: { "4w": 800000, "12w": 2000000 },
  "Chứng chỉ MOS": { "4w": 1000000, "12w": 2500000 },
};

const CENTER_AEROBIC_RATES: Record<string, number[]> = {
  "4 - 6 tuổi": [300000, 500000, 600000],
  "Trên 6 tuổi": [400000, 600000, 700000],
};

const TALENT_SUBJECTS = new Set([
  "Vẽ màu sáp",
  "Vẽ màu nước",
  "Cờ vua",
  "Cờ tướng",
  "Piano / Organ",
  "Tin học",
  "Aerobic / Nhịp điệu",
]);

function categoryFor(subject: string): TuitionEstimate["sourceCategory"] {
  if (subject === "Tiếng Anh") return "Anh văn";
  if (TALENT_SUBJECTS.has(subject)) return "Năng khiếu";
  return "Văn hóa";
}

function packageLabel(value: string): string {
  return value
    .replace("m", " tháng")
    .replace("4w", "4 tuần")
    .replace("12w", "12 tuần");
}

export function getTuitionSubjectOptions(mode: TuitionMode): TuitionOption[] {
  return SUBJECTS_BY_MODE[mode];
}

export function getTuitionLevelOptions(
  mode: TuitionMode,
  subject: string,
): TuitionOption[] {
  const values = (mode === "center" ? CENTER_LEVELS : TUTOR_LEVELS)[subject] ?? [];
  return values.map((value) => ({ value, label: value }));
}

export function getTuitionPackageOptions(
  mode: TuitionMode,
  subject: string,
  level: string,
): TuitionOption[] {
  if (mode !== "center") return [];

  if (subject === "Tiếng Anh") {
    const packages = Object.keys(CENTER_ENGLISH_RATES[level] ?? {});
    return packages.map((value) => ({ value, label: `Gói ${packageLabel(value)}` }));
  }

  if (subject === "Tin học") {
    return [
      { value: "4w", label: "Gói 4 tuần" },
      { value: "12w", label: "Gói 12 tuần" },
    ];
  }

  if (CENTER_TALENT_BASE[subject] || subject === "Piano / Organ") {
    return [
      { value: "4w", label: "Gói 4 tuần" },
      { value: "12w", label: "Gói 12 tuần (giảm 10%)" },
    ];
  }

  return [];
}

export function getTuitionSessionOptions(
  mode: TuitionMode,
  subject: string,
  level: string,
): TuitionOption[] {
  let values = ALL_SESSIONS;

  if (mode === "center") {
    if (subject === "Toán" && level === "Tiền tiểu học - Tiểu học") values = ["2", "3", "4", "5"];
    else if (subject === "Tiếng Việt / Rèn chữ / Báo bài") values = ["2", "3", "4", "5"];
    else if (subject === "Toán" && level === "Cấp II - III") values = ["3", "5"];
    else if (subject === "Ngữ văn" || subject === "KHTN") values = ["2"];
    else if (CENTER_TALENT_BASE[subject]) values = ["2", "3", "4", "5"];
    else if (subject === "Tin học") values = ["2"];
    else if (subject === "Aerobic / Nhịp điệu") values = ["1", "2", "3"];
  }

  return values.map((value) => ({
    value,
    label: `${value} buổi / tuần`,
  }));
}

function tutorColumnIndex(tutorLevel: string): number | null {
  if (tutorLevel === "Gia sư tự do") return 0;
  if (tutorLevel === "Gia sư đào tạo") return 1;
  return null;
}

function calculateTutorTuition(input: TuitionEstimateInput): TuitionEstimate | null {
  const columns = TUTOR_RATES[`${input.subject}|${input.level}`];
  const column = tutorColumnIndex(input.tutorLevel);
  const sessions = Number(input.sessionsPerWeek);
  if (!columns || column === null || !Number.isFinite(sessions) || sessions <= 0) return null;

  const amount = columns[column];
  const isItPackage = input.subject === "Tin học";
  const durationNote =
    categoryFor(input.subject) === "Văn hóa"
      ? "Gia sư tự do và gia sư đào tạo: 120 phút/buổi."
      : ["Vẽ màu sáp", "Vẽ màu nước", "Cờ vua", "Cờ tướng"].includes(input.subject)
        ? "Thời lượng theo PDF: 90 phút/buổi."
        : "Mức phí được lấy trực tiếp từ bảng PDF.";

  if (isItPackage) {
    return {
      amount,
      unitLabel: "mức tham khảo theo bảng",
      monthlyAmount: null,
      calculation: "Tra trực tiếp chương trình và loại gia sư; PDF chưa ghi rõ đơn vị thời lượng.",
      sourceCategory: "Năng khiếu",
      note: "Môn Tin học gia sư chưa có đơn vị buổi/tháng rõ trong PDF, cần xác nhận khi tư vấn.",
    };
  }

  return {
    amount,
    unitLabel: "mỗi buổi",
    monthlyAmount: amount * sessions * 4,
    calculation: `${amount.toLocaleString("vi-VN")} × ${sessions} buổi/tuần × 4 tuần`,
    sourceCategory: categoryFor(input.subject),
    note: durationNote,
  };
}

function calculateCenterTuition(input: TuitionEstimateInput): TuitionEstimate | null {
  const sessions = Number(input.sessionsPerWeek);
  if (!Number.isFinite(sessions) || sessions <= 0) return null;

  const category = categoryFor(input.subject);
  if (category === "Văn hóa") {
    const amount = CENTER_CULTURE_RATES[`${input.subject}|${input.level}|${input.sessionsPerWeek}`];
    if (!amount) return null;
    return {
      amount,
      unitLabel: "mức trung tâm tham khảo",
      monthlyAmount: null,
      calculation: `Tra trực tiếp ${input.level}, ${sessions} buổi/tuần`,
      sourceCategory: "Văn hóa",
      note: "PDF văn hóa trung tâm không ghi rõ chu kỳ thu; mức này được hiển thị đúng nguyên giá trong bảng.",
    };
  }

  if (input.subject === "Tiếng Anh") {
    const amount = CENTER_ENGLISH_RATES[input.level]?.[input.pricingPackage];
    if (!amount) return null;
    return {
      amount,
      unitLabel: `gói ${packageLabel(input.pricingPackage)}`,
      monthlyAmount: null,
      calculation: `Tra trực tiếp ${input.level}, gói ${packageLabel(input.pricingPackage)}`,
      sourceCategory: "Anh văn",
      note: "Số buổi/tuần dùng để xếp lịch; học phí được tra theo thời lượng khóa học trong PDF.",
    };
  }

  if (CENTER_TALENT_BASE[input.subject]) {
    const row = CENTER_TALENT_BASE[input.subject]?.[input.level];
    const fourWeekAmount = row?.[sessions - 2];
    if (!fourWeekAmount || !input.pricingPackage) return null;
    const amount = input.pricingPackage === "12w" ? Math.round(fourWeekAmount * 3 * 0.9) : fourWeekAmount;
    return {
      amount,
      unitLabel: input.pricingPackage === "12w" ? "gói 12 tuần" : "gói 4 tuần",
      monthlyAmount: null,
      calculation:
        input.pricingPackage === "12w"
          ? `${fourWeekAmount.toLocaleString("vi-VN")} × 3 kỳ × 90%`
          : `Tra trực tiếp ${input.level}, ${sessions} buổi/tuần`,
      sourceCategory: "Năng khiếu",
      note: input.pricingPackage === "12w" ? "Áp dụng giảm 10% khi đóng khóa 12 tuần theo PDF." : "Học phí 4 tuần theo PDF.",
    };
  }

  if (input.subject === "Piano / Organ") {
    const count = Number(input.studentCount);
    if (!Number.isFinite(count) || !input.pricingPackage) return null;
    const classType = count === 1 ? "private" : count <= 3 ? "small" : "group";
    const fourWeekAmount = CENTER_PIANO_RATES[classType]?.[sessions - 1];
    if (!fourWeekAmount) return null;
    const amount = input.pricingPackage === "12w" ? Math.round(fourWeekAmount * 3 * 0.9) : fourWeekAmount;
    const classLabel = classType === "private" ? "lớp kèm riêng" : classType === "small" ? "lớp 2-3 học viên" : "lớp nhóm";
    return {
      amount,
      unitLabel: input.pricingPackage === "12w" ? "gói 12 tuần" : "gói 4 tuần",
      monthlyAmount: null,
      calculation:
        input.pricingPackage === "12w"
          ? `${fourWeekAmount.toLocaleString("vi-VN")} × 3 kỳ × 90%`
          : `Tra trực tiếp ${classLabel}, ${sessions} buổi/tuần`,
      sourceCategory: "Năng khiếu",
      note: `${classLabel}; ${input.pricingPackage === "12w" ? "đã áp dụng giảm 10% khóa 12 tuần." : "học phí 4 tuần."}`,
    };
  }

  if (input.subject === "Tin học") {
    const amount = CENTER_IT_RATES[input.level]?.[input.pricingPackage];
    if (!amount) return null;
    return {
      amount,
      unitLabel: input.pricingPackage === "12w" ? "gói 12 tuần" : "gói 4 tuần",
      monthlyAmount: null,
      calculation: `Tra trực tiếp ${input.level}, ${packageLabel(input.pricingPackage)}`,
      sourceCategory: "Năng khiếu",
      note: "Chương trình trung tâm học 2 buổi/tuần; gói 12 tuần dùng đúng mức phí niêm yết trong PDF.",
    };
  }

  if (input.subject === "Aerobic / Nhịp điệu") {
    const amount = CENTER_AEROBIC_RATES[input.level]?.[sessions - 1];
    if (!amount) return null;
    return {
      amount,
      unitLabel: "gói 4 tuần",
      monthlyAmount: null,
      calculation: `Tra trực tiếp độ tuổi ${input.level}, ${sessions} buổi/tuần`,
      sourceCategory: "Năng khiếu",
      note: "Học phí 4 tuần theo PDF.",
    };
  }

  return null;
}

export function calculateTuitionEstimate(
  input: TuitionEstimateInput,
): TuitionEstimate | null {
  return input.mode === "center"
    ? calculateCenterTuition(input)
    : calculateTutorTuition(input);
}
