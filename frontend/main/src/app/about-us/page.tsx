import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Nền tảng đặt gia sư uy tín và minh bạch",
  description:
    "Tìm hiểu về chúng tôi: đội ngũ giáo dục tận tâm, quy trình chọn lọc gia sư nghiêm ngặt và hệ sinh thái hỗ trợ phụ huynh học viên tối ưu.",
};

import { redirect } from "next/navigation";

export default function AboutUsPage() {
  redirect("/gioi-thieu-gia-su-uy-tin");
}
