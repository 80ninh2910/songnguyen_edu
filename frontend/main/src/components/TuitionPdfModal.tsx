"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Building2,
  Clock3,
  Download,
  FileText,
  GraduationCap,
  Languages,
  Palette,
  X,
} from "lucide-react";

export const TUITION_PDF_PATH = "/documents/bang-hoc-phi-anh-van-2026.pdf";
export const CENTER_ACADEMIC_TUITION_PDF_PATH =
  "/documents/bang-hoc-phi-trung-tam-van-hoa.pdf";
export const CENTER_TALENT_TUITION_PDF_PATH =
  "/documents/bang-hoc-phi-trung-tam-nang-khieu-2025.pdf";
export const TUTOR_ACADEMIC_TUITION_PDF_PATH =
  "/documents/bang-hoc-phi-gia-su-van-hoa.pdf";
export const TUTOR_ENGLISH_TUITION_PDF_PATH =
  "/documents/bang-hoc-phi-gia-su-anh-van.pdf";
export const TUTOR_TALENT_TUITION_PDF_PATH =
  "/documents/bang-hoc-phi-gia-su-nang-khieu.pdf";

type LearningFormat = "center" | "tutor";
type SubjectGroup = "academic" | "english" | "talent";

type TuitionDocument = {
  title: string;
  subtitle: string;
  description: string;
  pdfPath: string | null;
};

const LEARNING_FORMATS: Array<{
  id: LearningFormat;
  label: string;
  description: string;
  icon: typeof Building2;
}> = [
  {
    id: "center",
    label: "Lớp trung tâm",
    description: "Học trực tiếp tại trung tâm",
    icon: Building2,
  },
  {
    id: "tutor",
    label: "Lớp gia sư",
    description: "Học riêng theo nhu cầu",
    icon: GraduationCap,
  },
];

const SUBJECT_GROUPS: Array<{
  id: SubjectGroup;
  label: string;
  icon: typeof BookOpen;
}> = [
  { id: "academic", label: "Văn hóa", icon: BookOpen },
  { id: "english", label: "Anh văn", icon: Languages },
  { id: "talent", label: "Năng khiếu", icon: Palette },
];

const TUITION_DOCUMENTS: Record<
  LearningFormat,
  Record<SubjectGroup, TuitionDocument>
> = {
  center: {
    academic: {
      title: "Lớp trung tâm - Văn hóa",
      subtitle: "Chi nhánh Quận 12/Gò Vấp",
      description:
        "Bảng phí theo khối lớp, môn học và số buổi học mỗi tuần tại trung tâm.",
      pdfPath: CENTER_ACADEMIC_TUITION_PDF_PATH,
    },
    english: {
      title: "Lớp trung tâm - Anh văn",
      subtitle: "Chi nhánh Quận 12/Gò Vấp - năm 2026",
      description:
        "Bảng phí theo cấp độ và thời hạn khóa học, gồm Kid, Starters, Movers, Flyers, KET, PET và các lớp luyện thi.",
      pdfPath: TUITION_PDF_PATH,
    },
    talent: {
      title: "Lớp trung tâm - Năng khiếu",
      subtitle: "Mỹ thuật, cờ, piano, organ, tin học và aerobic",
      description:
        "Bảng phí theo cấp độ và số buổi học mỗi tuần tại chi nhánh Quận 12/Gò Vấp.",
      pdfPath: CENTER_TALENT_TUITION_PDF_PATH,
    },
  },
  tutor: {
    academic: {
      title: "Lớp gia sư - Văn hóa",
      subtitle: "Theo khối lớp và loại gia sư",
      description:
        "Bảng phí tham khảo theo buổi cho gia sư tự do, gia sư đào tạo và giáo viên.",
      pdfPath: TUTOR_ACADEMIC_TUITION_PDF_PATH,
    },
    english: {
      title: "Lớp gia sư - Anh văn",
      subtitle: "Từ Kid đến PET và các lớp luyện thi",
      description:
        "Bảng phí theo cấp độ dành cho gia sư tự do, gia sư đào tạo và giáo viên.",
      pdfPath: TUTOR_ENGLISH_TUITION_PDF_PATH,
    },
    talent: {
      title: "Lớp gia sư - Năng khiếu",
      subtitle: "Vẽ, cờ, piano, organ và tin học",
      description:
        "Bảng phí học tại nhà theo môn, cấp độ và loại gia sư hoặc giáo viên.",
      pdfPath: TUTOR_TALENT_TUITION_PDF_PATH,
    },
  },
};

type TuitionPdfModalProps = {
  open: boolean;
  onClose: () => void;
  initialLearningFormat?: LearningFormat;
};

export default function TuitionPdfModal({
  open,
  onClose,
  initialLearningFormat = "center",
}: TuitionPdfModalProps) {
  const [mounted, setMounted] = useState(false);
  const [learningFormat, setLearningFormat] =
    useState<LearningFormat>(initialLearningFormat);
  const [subjectGroup, setSubjectGroup] = useState<SubjectGroup>("english");

  const activeDocument = useMemo(
    () => TUITION_DOCUMENTS[learningFormat][subjectGroup],
    [learningFormat, subjectGroup],
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setLearningFormat(initialLearningFormat);
  }, [initialLearningFormat, open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[260] flex items-center justify-center bg-[#06132d]/78 p-2 backdrop-blur-md sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="flex h-[96vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/35 bg-white shadow-[0_30px_100px_rgba(3,15,42,0.55)] sm:h-[92vh] sm:rounded-[28px]"
        role="dialog"
        aria-modal="true"
        aria-label="Danh mục bảng học phí tham khảo"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#d9e4f7] bg-[linear-gradient(115deg,#f4f7ff_0%,#ffffff_52%,#fff2f3_100%)] px-3 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1559c7] text-white shadow-[0_8px_20px_rgba(21,89,199,0.24)]">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[#132f69] sm:text-lg">
                Bảng học phí tham khảo
              </p>
              <p className="hidden text-xs font-medium text-[#60708f] sm:block">
                Chọn hình thức học và nhóm môn phù hợp
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {activeDocument.pdfPath ? (
              <a
                href={activeDocument.pdfPath}
                download
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#c7d7f4] bg-white px-3 text-xs font-extrabold text-[#174ba9] transition-colors hover:bg-[#edf3ff] sm:px-4 sm:text-sm"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Tải PDF</span>
              </a>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng bảng học phí"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#d92335] text-white transition-colors hover:bg-[#bd1727]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col bg-[#e9eef7] md:grid md:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="shrink-0 overflow-y-auto border-b border-[#d8e1ef] bg-white p-3 md:border-r md:border-b-0 md:p-4">
            <div>
              <p className="mb-2 text-[0.68rem] font-black tracking-[0.14em] text-[#66758f] uppercase">
                1. Hình thức học
              </p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
                {LEARNING_FORMATS.map((option) => {
                  const Icon = option.icon;
                  const selected = learningFormat === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setLearningFormat(option.id)}
                      className={`flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all md:gap-3 md:py-3 ${
                        selected
                          ? "border-[#1559c7] bg-[#edf4ff] text-[#113b86] shadow-[0_6px_18px_rgba(21,89,199,0.12)]"
                          : "border-[#dbe3ef] bg-white text-[#44536d] hover:border-[#9db7e4] hover:bg-[#f8faff]"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          selected ? "bg-[#1559c7] text-white" : "bg-[#edf1f7] text-[#53627a]"
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-extrabold sm:text-sm">
                          {option.label}
                        </span>
                        <span className="hidden text-[0.68rem] font-medium text-[#73819a] md:block">
                          {option.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 md:mt-5">
              <p className="mb-2 text-[0.68rem] font-black tracking-[0.14em] text-[#66758f] uppercase">
                2. Nhóm môn
              </p>
              <div className="grid grid-cols-3 gap-2">
                {SUBJECT_GROUPS.map((option) => {
                  const Icon = option.icon;
                  const selected = subjectGroup === option.id;
                  const available = Boolean(
                    TUITION_DOCUMENTS[learningFormat][option.id].pdfPath,
                  );

                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSubjectGroup(option.id)}
                      className={`relative rounded-xl border px-2 py-2.5 text-center transition-all ${
                        selected
                          ? "border-[#d92335] bg-[#fff1f3] text-[#a81323]"
                          : "border-[#dbe3ef] bg-white text-[#53627a] hover:border-[#e5a4ac]"
                      }`}
                    >
                      <Icon className="mx-auto h-4 w-4" aria-hidden="true" />
                      <span className="mt-1 block text-xs font-extrabold">
                        {option.label}
                      </span>
                      <span
                        className={`mt-1 inline-flex rounded-full px-1.5 py-0.5 text-[0.58rem] font-black ${
                          available
                            ? "bg-[#dcfce7] text-[#166534]"
                            : "bg-[#f1f3f7] text-[#778398]"
                        }`}
                      >
                        {available ? "CÓ BẢNG PHÍ" : "ĐANG CẬP NHẬT"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-[#dce5f4] bg-[#f7f9fd] p-3 md:mt-5">
              <p className="text-xs font-black text-[#183b78]">
                {activeDocument.title}
              </p>
              <p className="mt-1 text-[0.68rem] leading-relaxed font-medium text-[#697893]">
                {activeDocument.description}
              </p>
            </div>
          </aside>

          <div className="flex min-h-0 flex-1 flex-col p-1.5 sm:p-3">
            <div className="mb-2 flex shrink-0 items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 shadow-sm">
              <div className="min-w-0">
                <p className="truncate text-xs font-black text-[#183b78] sm:text-sm">
                  {activeDocument.title}
                </p>
                <p className="truncate text-[0.66rem] font-medium text-[#74819a] sm:text-xs">
                  {activeDocument.subtitle}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[0.62rem] font-black ${
                  activeDocument.pdfPath
                    ? "bg-[#dcfce7] text-[#166534]"
                    : "bg-[#fff4df] text-[#92530b]"
                }`}
              >
                {activeDocument.pdfPath ? "SẴN SÀNG" : "SẮP CÓ"}
              </span>
            </div>

            {activeDocument.pdfPath ? (
              <iframe
                key={activeDocument.pdfPath}
                src={`${activeDocument.pdfPath}#view=FitH&toolbar=1&navpanes=0`}
                title={activeDocument.title}
                className="min-h-[52vh] flex-1 rounded-xl border-0 bg-white"
              />
            ) : (
              <div
                className="flex min-h-[52vh] flex-1 items-center justify-center rounded-xl border border-dashed border-[#b8c7dc] bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f7fc_72%)] p-6 text-center"
                role="status"
              >
                <div className="max-w-md">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf2fa] text-[#52698f]">
                    <Clock3 className="h-8 w-8" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-black text-[#183b78]">
                    Bảng học phí đang cập nhật
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed font-medium text-[#677690]">
                    {activeDocument.description} Vui lòng liên hệ trung tâm để được tư vấn mức phí hiện hành.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}
