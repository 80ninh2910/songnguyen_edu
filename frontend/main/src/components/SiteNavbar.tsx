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

  const navItems = useMemo(
    () => [
      { name: "Học phí", link: "/hoc-phi" },
      { name: "Lớp mới", link: "/lop-moi" },
      { name: "Gia sư", link: "/gia-su" },
      { name: "About us", link: "/about-us" },
      { name: "FAQ", link: "/faq" },
    ],
    [],
  );

  const isLoginActive = pathname === "/login";

  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} activePath={pathname} />
        <div className="flex items-center gap-4">
          <NavbarButton
            href="/login"
            variant={isLoginActive ? "dark" : "gradient"}
            className={isLoginActive ? "bg-red-600 text-white" : undefined}
          >
            Login
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
              Login
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
