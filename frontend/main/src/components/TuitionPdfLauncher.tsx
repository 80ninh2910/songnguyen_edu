"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

import TuitionPdfModal from "@/components/TuitionPdfModal";

export default function TuitionPdfLauncher({ autoOpen = false }: { autoOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (autoOpen) setIsOpen(true);
  }, [autoOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#d92335] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(217,35,53,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#bf1728]"
      >
        <FileText className="h-5 w-5" aria-hidden="true" />
        Xem các bảng học phí
      </button>
      <TuitionPdfModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
