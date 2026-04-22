"use client";

import { usePathname } from "next/navigation";

const contactItems = [
  {
    key: "phone",
    href: "tel:1800969639",
    label: "Goi dien",
    bgClass: "bg-[#34c759]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M7.2 3.5h2.1a1 1 0 0 1 1 .84l.43 2.58a1 1 0 0 1-.29.86L9.15 9.06a12.72 12.72 0 0 0 5.79 5.79l1.28-1.29a1 1 0 0 1 .86-.29l2.58.43a1 1 0 0 1 .84 1v2.1a1 1 0 0 1-.9 1A15.5 15.5 0 0 1 6.2 4.4a1 1 0 0 1 1-0.9Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "zalo",
    href: "https://zalo.me/0795552910",
    label: "Zalo",
    bgClass: "bg-[#0071e3]",
    icon: <span className="text-sm font-semibold tracking-[-0.02em]">Zalo</span>,
  },
  {
    key: "facebook",
    href: "https://www.facebook.com/profile.php?id=61572940593112",
    label: "Facebook",
    bgClass: "bg-[#1877f2]",
    icon: <span className="text-3xl font-bold leading-none">f</span>,
  },
];

export default function PublicContactDock() {
  const pathname = usePathname();
  const shouldHideDock = pathname?.startsWith("/tutor") || pathname?.startsWith("/admin");

  if (shouldHideDock) {
    return null;
  }

  return (
    <aside className="fixed left-4 top-1/2 z-50 -translate-y-1/2 rounded-[28px] bg-[rgba(0,0,0,0.8)] p-2 shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] backdrop-blur-[20px]">
      <ul className="flex flex-col gap-2">
        {contactItems.map((item) => (
          <li key={item.key}>
            <a
              href={item.href}
              target={item.key === "phone" ? undefined : "_blank"}
              rel={item.key === "phone" ? undefined : "noreferrer"}
              aria-label={item.label}
              className={`flex h-12 w-12 items-center justify-center rounded-full text-white transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3] ${item.bgClass}`}
            >
              {item.icon}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
