"use client";

import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  NavItems,
  Navbar,
  NavbarButton,
  NavbarLogo,
} from "@/components/ui/resizable-navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { BookOpenCheck, GraduationCap } from "lucide-react";

import { SIGNUP_MODAL_EVENT, type SignupType } from "@/lib/signup-modal";

export default function SiteNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const shouldHideNavbar =
    pathname?.startsWith("/tai-khoan-gia-su") ||
    pathname?.startsWith("/admin") ||
    pathname === "/dang-nhap-gia-su";

  const navItems = useMemo(
    () => [
      { name: "Học phí", link: "/hoc-phi" },
      { name: "Gia sư", link: "/gia-su" },
      { name: "Về chúng tôi", link: "/ve-chung-toi" },
      { name: "Hỏi đáp", link: "/hoi-dap-gia-su" },
    ],
    [],
  );

  const isLoginActive = pathname === "/dang-nhap-gia-su";

  const handleSignupClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    signupType: SignupType,
  ) => {
    setIsMobileMenuOpen(false);
    if (pathname !== "/") return;

    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent<SignupType>(SIGNUP_MODAL_EVENT, { detail: signupType }),
    );
  };

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <Navbar>
      <NavBody>
        {/* Left Section: Logo + Brand */}
        <div className="flex shrink-0 items-center justify-start whitespace-nowrap">
          <NavbarLogo />
        </div>

        {/* Center Section: Navigation Menu */}
        <div className="flex shrink-0 items-center justify-center whitespace-nowrap">
          <NavItems items={navItems} activePath={pathname} />
        </div>

        {/* Right Section: Primary signup actions + login */}
        <div className="flex shrink-0 items-center justify-end gap-2 whitespace-nowrap">
          <Link
            href="/?signup=parent"
            onClick={(event) => handleSignupClick(event, "parent")}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#d92335] px-3.5 py-2 text-xs font-extrabold text-white shadow-[0_8px_20px_rgba(217,35,53,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#bf1728] hover:shadow-[0_10px_24px_rgba(217,35,53,0.34)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d92335]"
          >
            <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
            Đăng ký lớp
          </Link>
          <Link
            href="/?signup=tutor-free"
            onClick={(event) => handleSignupClick(event, "tutor-free")}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1559c7] px-3.5 py-2 text-xs font-extrabold text-white shadow-[0_8px_20px_rgba(21,89,199,0.26)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0d47a8] hover:shadow-[0_10px_24px_rgba(21,89,199,0.32)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1559c7]"
          >
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Đăng ký gia sư
          </Link>
          <NavbarButton
            href="/dang-nhap-gia-su"
            variant={isLoginActive ? "dark" : "secondary"}
            className={
              isLoginActive
                ? "shrink-0 rounded-full bg-[#15233f] text-white"
                : "shrink-0 rounded-full px-3 text-[#243b72] hover:bg-[#edf3ff]"
            }
          >
            Đăng nhập
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader className="rounded-full border border-white/80 bg-white/92 px-2.5 py-1.5 shadow-[0_8px_24px_rgba(16,42,91,0.12)] backdrop-blur-xl">
          <NavbarLogo />
          <div className="ml-auto mr-3 flex items-center gap-1.5">
            <Link
              href="/?signup=parent"
              aria-label="Đăng ký lớp"
              onClick={(event) => handleSignupClick(event, "parent")}
              className="inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full bg-[#d92335] px-2.5 text-[11px] font-extrabold text-white shadow-[0_6px_16px_rgba(217,35,53,0.25)] transition-transform active:scale-95"
            >
              <BookOpenCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Đăng ký lớp</span>
            </Link>
            <Link
              href="/?signup=tutor-free"
              aria-label="Đăng ký gia sư"
              onClick={(event) => handleSignupClick(event, "tutor-free")}
              className="inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full bg-[#1559c7] px-2.5 text-[11px] font-extrabold text-white shadow-[0_6px_16px_rgba(21,89,199,0.24)] transition-transform active:scale-95"
            >
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="min-[360px]:hidden">Gia sư</span>
              <span className="hidden min-[360px]:inline">Đăng ký gia sư</span>
            </Link>
          </div>
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.link;
            return (
              <a
                key={item.link}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className={isActive ? "rounded-full bg-red-600 px-3 py-1 text-white" : "relative px-3 py-1 text-black"}
              >
                <span className="block">{item.name}</span>
              </a>
            );
          })}
          <div className="flex w-full flex-col gap-4">
            <NavbarButton
              href="/dang-nhap-gia-su"
              onClick={() => setIsMobileMenuOpen(false)}
              variant={isLoginActive ? "dark" : "gradient"}
              className={isLoginActive ? "w-full bg-red-600 text-white" : "w-full"}
            >
              Đăng nhập
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
