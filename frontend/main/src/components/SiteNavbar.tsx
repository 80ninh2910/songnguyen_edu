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
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

export default function SiteNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const shouldHideNavbar =
    pathname?.startsWith("/tutor") ||
    pathname?.startsWith("/admin") ||
    pathname === "/login";

  const navItems = useMemo(
    () => [
      { name: "Học phí", link: "/hoc-phi" },
      { name: "Lớp mới", link: "/lop-moi" },
      { name: "Gia sư", link: "/gia-su" },
      { name: "Về chúng tôi", link: "/about-us" },
      { name: "FAQ", link: "/faq" },
    ],
    [],
  );

  const isLoginActive = pathname === "/login";

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

        {/* Right Section: Login Button */}
        <div className="flex shrink-0 items-center justify-end whitespace-nowrap">
          <NavbarButton
            href="/login"
            variant={isLoginActive ? "dark" : "gradient"}
            className={isLoginActive ? "bg-red-600 text-white shrink-0" : "shrink-0"}
          >
            Đăng nhập
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
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
              href="/login"
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
