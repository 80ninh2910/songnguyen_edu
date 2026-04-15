export default function UserStitchPage() {
  return (
    <div className="bg-background text-on-surface">
      <header className="bg-white/70 backdrop-blur-xl top-0 sticky z-50 shadow-[0_8px_24px_rgba(0,83,204,0.06)]">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-blue-700 font-headline">
            Song Nguyen Education
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              className="text-blue-700 font-bold border-b-2 border-blue-700 pb-1 font-['Plus_Jakarta_Sans'] font-medium text-sm tracking-tight"
              href="#"
            >
              Home
            </a>
            <a
              className="text-slate-600 hover:text-blue-600 transition-all duration-300 font-['Plus_Jakarta_Sans'] font-medium text-sm tracking-tight"
              href="#"
            >
              Classes
            </a>
            <a
              className="text-slate-600 hover:text-blue-600 transition-all duration-300 font-['Plus_Jakarta_Sans'] font-medium text-sm tracking-tight"
              href="#"
            >
              Parents
            </a>
            <a
              className="text-slate-600 hover:text-blue-600 transition-all duration-300 font-['Plus_Jakarta_Sans'] font-medium text-sm tracking-tight"
              href="#"
            >
              Tutors
            </a>
            <a
              className="text-slate-600 hover:text-blue-600 transition-all duration-300 font-['Plus_Jakarta_Sans'] font-medium text-sm tracking-tight"
              href="#"
            >
              Consultancy
            </a>
            <a
              className="text-slate-600 hover:text-blue-600 transition-all duration-300 font-['Plus_Jakarta_Sans'] font-medium text-sm tracking-tight"
              href="#"
            >
              Articles
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2 rounded-full text-blue-700 font-semibold text-sm hover:bg-blue-50/50 transition-all scale-95 active:opacity-80">
              Login
            </button>
            <button className="px-6 py-2 rounded-full liquid-gradient-primary text-white font-bold text-sm shadow-lg scale-95 active:opacity-80 transition-all">
              Register
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden py-20">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              alt="Modern architectural school building with glass facade reflecting blue sky and lush green campus landscaping in soft daylight"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxRJfM5pnDIP2CoTkvKqSnHPCUd5vlx823xwKwuOFE15DWaktil618Ukef_XIK1YCM4l_hqEEAMq_z8MgPCFbNtWsnuUgYaIXyUTFRM1ynNJt-jWdbw9-USyH-xlGQeMvKExg4KoWfaosr-tTD0YiXMKAL0GBgKzi387IX3oVh75cfzbqGghLPHK5i4gpu0dxZcx5mcrr-oU1lnXxQXfrexXzjwcOqItELM-lOs8tNh9A23JUmTafULgXbu4mPPJy0nwU9Swqzdh0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/40 to-transparent" />
          </div>

          <div className="absolute top-20 right-[10%] w-64 h-64 bg-tertiary-fixed-dim/20 blur-[80px] rounded-full" />
          <div className="absolute bottom-20 left-[5%] w-80 h-80 bg-secondary-container/20 blur-[100px] rounded-full" />

          <div className="relative z-10 max-w-screen-2xl mx-auto px-8 w-full">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-container/20 text-primary font-bold text-xs tracking-widest uppercase mb-6">
                Chương Trình Đào Tạo Chuẩn Quốc Tế
              </span>
              <h1 className="text-6xl md:text-8xl font-extrabold text-primary font-headline leading-[1.1] tracking-tight mb-6">
                SONG NGUYEN EDUCATION
              </h1>
              <p className="text-xl md:text-2xl text-on-surface/80 font-medium tracking-wide mb-12 border-l-4 border-secondary pl-6">
                UY TÍN - CHẤT LƯỢNG - AN TOÀN - TẬN TÂM
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <button className="group relative px-10 py-5 rounded-xl liquid-gradient-secondary text-white font-bold text-lg overflow-hidden shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                  <span>TÔI LÀ PHỤ HUYNH</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
                <button className="group relative px-10 py-5 rounded-xl liquid-gradient-primary text-white font-bold text-lg overflow-hidden shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                  <span>TÔI LÀ GIA SƯ</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    school
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-8 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel bg-surface-container-lowest/40 p-8 rounded-lg border border-white/20 shadow-[0_8px_24px_rgba(0,83,204,0.04)] hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-16 h-16 rounded-2xl liquid-gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-white text-3xl">verified</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Chất Lượng</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Đội ngũ giảng viên tinh hoa, giáo trình cập nhật liên tục theo chuẩn quốc tế.
              </p>
            </div>

            <div className="glass-panel bg-surface-container-lowest/40 p-8 rounded-lg border border-white/20 shadow-[0_8px_24px_rgba(0,83,204,0.04)] hover:-translate-y-2 transition-all duration-500 md:mt-12">
              <div className="w-16 h-16 rounded-2xl bg-tertiary-container flex items-center justify-center mb-6 shadow-lg shadow-tertiary/20">
                <span className="material-symbols-outlined text-on-tertiary-container text-3xl">lightbulb</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Tư Vấn</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Lộ trình học tập cá nhân hóa, định hướng nghề nghiệp dựa trên năng lực thực tế.
              </p>
            </div>

            <div className="glass-panel bg-surface-container-lowest/40 p-8 rounded-lg border border-white/20 shadow-[0_8px_24px_rgba(0,83,204,0.04)] hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl liquid-gradient-secondary flex items-center justify-center mb-6 shadow-lg shadow-secondary/20">
                <span className="material-symbols-outlined text-white text-3xl">security</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">An Toàn</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Môi trường học tập minh bạch, bảo mật thông tin và hỗ trợ học viên 24/7.
              </p>
            </div>

            <div className="glass-panel bg-surface-container-lowest/40 p-8 rounded-lg border border-white/20 shadow-[0_8px_24px_rgba(0,83,204,0.04)] hover:-translate-y-2 transition-all duration-500 md:mt-12">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-6 shadow-lg">
                <span className="material-symbols-outlined text-primary text-3xl">visibility</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Minh Bạch</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Hợp đồng rõ ràng, học phí công khai, đánh giá trung thực từ cộng đồng.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface-container-low relative overflow-hidden">
          <div className="absolute -right-20 top-0 w-96 h-96 liquid-gradient-primary opacity-5 blur-[120px] rounded-full" />
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-primary font-headline mb-4">
                Hệ Thống Gia Sư & Giáo Viên
              </h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">
                Chúng tôi kết nối những nhà giáo dục tận tâm nhất để đồng hành cùng sự phát triển của học sinh.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="relative group h-full">
                <div className="h-full glass-panel bg-white/60 p-10 rounded-lg border border-white/40 shadow-sm transition-all duration-500 group-hover:shadow-2xl flex flex-col">
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-5xl font-extrabold text-blue-700/10 font-headline">01</span>
                    <h3 className="text-2xl font-bold text-on-surface">GIA SƯ TỰ DO</h3>
                  </div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <li className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                      <span>Sinh viên từ các trường đại học hàng đầu</span>
                    </li>
                    <li className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                      <span>Năng động, phương pháp dạy gần gũi</span>
                    </li>
                    <li className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                      <span>Chi phí tối ưu cho gia đình</span>
                    </li>
                  </ul>
                  <div className="h-48 w-full rounded-xl overflow-hidden mb-6">
                    <img
                      className="w-full h-full object-cover"
                      alt="Energetic university student tutoring a younger child in a modern library setting, natural sunlight, academic focus"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaZVipdjoUbV3TI8LCsGkUroh7LebK5-4Ji52uRS_XfjZ4qA66YsxpZpXjsoejudkQskRLpbwe9pVmZmUPky2nhhpheabIqlcARNWG0Wrk7zEvEHY8wX2XYs3oeJSa1HycGl__RQC9Hos16aTFHnjn2C0WVgrVWogd7xhIScNtwtwPDlaqxOKQ978wCWPQAKCwzEs6z3usjCpiW26cSswp9Y1Q3TLvxJIFReOMvYpC8XsY3dQBg4lUtqc35mkY-Xe2IsyWIivjOkQ"
                    />
                  </div>
                  <button className="w-full py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
                    TÌM HIỂU THÊM
                  </button>
                </div>
              </div>

              <div className="relative group h-full lg:-translate-y-8">
                <div className="h-full glass-panel bg-white/80 p-10 rounded-lg border-2 border-primary/20 shadow-xl flex flex-col">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                    Phổ Biến Nhất
                  </div>
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-5xl font-extrabold text-primary/10 font-headline">02</span>
                    <h3 className="text-2xl font-bold text-primary">GIA SƯ ĐÀO TẠ</h3>
                  </div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <li className="flex items-center gap-3 text-on-surface">
                      <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-semibold">Vượt qua kỳ kiểm tra nghiệp vụ khắt khe</span>
                    </li>
                    <li className="flex items-center gap-3 text-on-surface">
                      <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-semibold">Chứng chỉ đào tạo Song Nguyen</span>
                    </li>
                    <li className="flex items-center gap-3 text-on-surface">
                      <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-semibold">Kỹ năng sư phạm chuyên nghiệp</span>
                    </li>
                  </ul>
                  <div className="h-48 w-full rounded-xl overflow-hidden mb-6">
                    <img
                      className="w-full h-full object-cover"
                      alt="Professional tutor explaining complex mathematical concepts on a glass board to a group of engaged students, high-key lighting"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2hlVoo0Hcz4DbY5_KYLVmGima8WfVdQlSyN-kpWqAxgbXkNzqZSyDg14INNqOtLUJEgTmhdh-AZiNc87MxxvreMfcGNJuVoVXdoX-92s7mhywbMhBNgo1iCw6bzrPdFZHRW9TamJZrV0i_kLUK5ULBiPEFGGQeu9xAh1WY_4bDoFx4-NecD922z-HMAwa0wbLv95T3bK111HKlDoEbj9usMDZxF7VnunJbBoVSmwsbA58NcsmLHzUuIiBjtnvlG3b5BhxL7ZyWDY"
                    />
                  </div>
                  <button className="w-full py-4 rounded-xl liquid-gradient-primary text-white font-bold shadow-lg shadow-primary/30 transition-all hover:scale-[1.02]">
                    ĐĂNG KÝ NGAY
                  </button>
                </div>
              </div>

              <div className="relative group h-full">
                <div className="h-full glass-panel bg-white/60 p-10 rounded-lg border border-white/40 shadow-sm transition-all duration-500 group-hover:shadow-2xl flex flex-col">
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-5xl font-extrabold text-secondary/10 font-headline">03</span>
                    <h3 className="text-2xl font-bold text-secondary">GIÁO VIÊN</h3>
                  </div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <li className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary text-lg">school</span>
                      <span>Đang giảng dạy tại các trường chính quy</span>
                    </li>
                    <li className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary text-lg">school</span>
                      <span>Nhiều năm kinh nghiệm ôn luyện thi</span>
                    </li>
                    <li className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary text-lg">school</span>
                      <span>Chuyên gia trong từng lĩnh vực môn học</span>
                    </li>
                  </ul>
                  <div className="h-48 w-full rounded-xl overflow-hidden mb-6">
                    <img
                      className="w-full h-full object-cover"
                      alt="Distinguished teacher in a classroom setting, warm environment, bookshelf background, focused and professional demeanor"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6KYAMiFWCdew4uAVNGnV6542dB-zNQlIEwifpdXTO8PAbn8PYH_KxnFVjrmTGrNLzfaJxrbWWeGfSP-QlYoevWrj8hB3itLNIllvnUrnvecEpX834_-NULd3SE5WFuCUSVVXq0t9ylQ3dpCI-bWKJTr9V5dSkbrsHPx7legfwX1KmfMGlWTSHdQkjLINIfu5hNYwzYy3trrt5zUV86BjCe_r3VdgC8J6B6N8pbWC9S6YGOCzRGdwRGSemGv6W97OhhHKvo41mlhQ"
                    />
                  </div>
                  <button className="w-full py-4 rounded-xl border-2 border-secondary text-secondary font-bold hover:bg-secondary hover:text-white transition-all">
                    XEM DANH SÁCH
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-8 max-w-screen-2xl mx-auto">
          <div className="liquid-gradient-primary rounded-lg p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative z-10 max-w-xl">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white font-headline leading-tight mb-6">
                Sẵn sàng kiến tạo tương lai cùng Song Nguyen?
              </h2>
              <p className="text-white/80 text-lg mb-0">
                Hơn 5000+ phụ huynh đã tin tưởng lựa chọn chúng tôi làm người đồng hành giáo dục cho con em mình.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-xl hover:bg-surface transition-all">
                Khám Phá Khóa Học
              </button>
              <button className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm">
                Liên Hệ Tư Vấn
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 full-width py-12 border-t border-slate-200/15">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 max-w-screen-2xl mx-auto">
          <div className="col-span-1 md:col-span-1">
            <div className="text-lg font-bold text-blue-700 mb-6">Song Nguyen Education</div>
            <p className="font-['Manrope'] text-sm text-slate-500 leading-relaxed">
              Hệ thống giáo dục toàn diện, tập trung vào việc khơi dậy tiềm năng và trí thông minh linh hoạt của mỗi học sinh.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-6">Về Chúng Tôi</h4>
            <ul className="space-y-4">
              <li>
                <a
                  className="font-['Manrope'] text-sm text-slate-500 hover:text-blue-500 transition-transform duration-200 hover:translate-x-1 inline-block"
                  href="#"
                >
                  Quality Assurance
                </a>
              </li>
              <li>
                <a
                  className="font-['Manrope'] text-sm text-slate-500 hover:text-blue-500 transition-transform duration-200 hover:translate-x-1 inline-block"
                  href="#"
                >
                  Safety Policy
                </a>
              </li>
              <li>
                <a
                  className="font-['Manrope'] text-sm text-slate-500 hover:text-blue-500 transition-transform duration-200 hover:translate-x-1 inline-block"
                  href="#"
                >
                  Transparency
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-6">Liên Kết</h4>
            <ul className="space-y-4">
              <li>
                <a
                  className="font-['Manrope'] text-sm text-slate-500 hover:text-blue-500 transition-transform duration-200 hover:translate-x-1 inline-block"
                  href="#"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  className="font-['Manrope'] text-sm text-slate-500 hover:text-blue-500 transition-transform duration-200 hover:translate-x-1 inline-block"
                  href="#"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  className="font-['Manrope'] text-sm text-slate-500 hover:text-blue-500 transition-transform duration-200 hover:translate-x-1 inline-block"
                  href="#"
                >
                  Support Center
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-6">Newsletter</h4>
            <div className="flex gap-2">
              <input
                className="bg-white/50 border-none rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-primary/20"
                placeholder="Email của bạn"
                type="email"
              />
              <button className="bg-primary text-white p-2 rounded-lg">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto px-8 mt-12 pt-8 border-t border-slate-200/10 text-center">
          <p className="font-['Manrope'] text-sm text-slate-500 opacity-80">
            © 2024 Song Nguyen Education. Empowering Fluid Intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
