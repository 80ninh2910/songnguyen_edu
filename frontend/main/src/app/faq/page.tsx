export default function FaqPage() {
  const faqItems = [
    {
      question: "Trung tam co nhan day tat ca mon hoc khong?",
      answer:
        "Chung toi ho tro nhieu mon hoc tu cap tieu hoc den THPT, bao gom Toan, Ly, Hoa, Van, Anh, IELTS va cac mon nang khieu co ban.",
    },
    {
      question: "Bao lau thi co the ghep duoc gia su phu hop?",
      answer:
        "Thong thuong trong 24-48 gio, bo phan dieu phoi se gui danh sach gia su phu hop de phu huynh/chinh hoc vien lua chon.",
    },
    {
      question: "Co hoc thu truoc khi dang ky dai han khong?",
      answer:
        "Co. Ban co the dang ky 1-2 buoi hoc thu de danh gia phong cach day hoc va muc do phu hop truoc khi hoc chinh thuc.",
    },
    {
      question: "Hoc phi duoc tinh nhu the nao?",
      answer:
        "Hoc phi duoc tinh theo mon hoc, cap lop, hinh thuc hoc (online/tai nha), tan suat hoc va yeu cau kinh nghiem cua gia su.",
    },
    {
      question: "Neu can doi lich hoc thi xu ly ra sao?",
      answer:
        "Hoc vien va gia su co the thong bao doi lich truoc 6-12 gio. Trung tam se ho tro dieu phoi de dam bao tien do hoc tap.",
    },
    {
      question: "Co theo doi tien do hoc tap khong?",
      answer:
        "Co. Gia su cap nhat nhan xet dinh ky va trung tam tong hop de phu huynh de dang theo doi ket qua theo tuan/thang.",
    },
    {
      question: "Neu khong phu hop voi gia su hien tai thi sao?",
      answer:
        "Trung tam ho tro doi gia su khi can thiet. Uu tien la giu dung muc tieu hoc tap va toi uu trai nghiem hoc cho hoc vien.",
    },
    {
      question: "Trung tam co hop dong va chinh sach ro rang khong?",
      answer:
        "Co. Tat ca thong tin ve hoc phi, lich hoc, quy trinh hoan/huy va trach nhiem cac ben deu duoc thong tin minh bach.",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 md:pt-32">
      <section className="rounded-3xl border border-[#d9e5ff] bg-[linear-gradient(135deg,#f7faff_0%,#eef4ff_100%)] p-6 shadow-[0_14px_40px_rgba(20,54,122,0.08)] md:p-10">
        <p className="inline-flex rounded-full bg-[#e4edff] px-4 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#2a56c6]">
          FAQ Demo
        </p>
        <h1 className="mt-4 text-3xl font-extrabold text-[#14367a] md:text-4xl">Cau hoi thuong gap</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-[#465f92]">
          Day la noi dung mau de ban test thanh dieu huong: active route, sticky behavior va do dong nhat CSS giua cac trang.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        {faqItems.map((item, index) => (
          <details
            key={item.question}
            className="group rounded-2xl border border-[#dbe6ff] bg-white px-5 py-4 shadow-[0_6px_20px_rgba(20,54,122,0.06)] open:border-[#b9ceff]"
          >
            <summary className="cursor-pointer list-none pr-6 text-base font-bold text-[#1a428f] md:text-lg">
              {index + 1}. {item.question}
            </summary>
            <p className="mt-3 text-sm leading-7 text-[#4d628f] md:text-base">{item.answer}</p>
          </details>
        ))}
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { title: "Ho tro nhanh", value: "24/7" },
          { title: "Lop dang hoat dong", value: "1,200+" },
          { title: "Muc do hai long", value: "98%" },
        ].map((stat) => (
          <article key={stat.title} className="rounded-2xl border border-[#dbe6ff] bg-[#f8fbff] p-5">
            <p className="text-3xl font-black text-[#1d4ecb]">{stat.value}</p>
            <p className="mt-2 text-sm font-semibold text-[#486293]">{stat.title}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-dashed border-[#c7d8ff] bg-[#f7faff] p-6">
        <h2 className="text-xl font-bold text-[#14367a]">Ghi chu test navbar</h2>
        <ul className="mt-3 space-y-2 text-sm leading-7 text-[#4d628f]">
          <li>- Khi o route /faq, nut FAQ tren navbar se co nen do.</li>
          <li>- Chuyen qua route khac de kiem tra active state cap nhat dung.</li>
          <li>- Thu tren mobile menu de xac nhan style active dong bo.</li>
        </ul>
      </section>
    </main>
  );
}
