import type { SVGProps } from "react";

export type AdminIconName =
  | "dashboard"
  | "group"
  | "school"
  | "list_alt"
  | "history"
  | "settings"
  | "add"
  | "person"
  | "logout"
  | "menu"
  | "search"
  | "notifications"
  | "apps"
  | "download"
  | "autorenew"
  | "analytics"
  | "calendar_month"
  | "menu_book"
  | "chevron_right"
  | "chevron_left"
  | "check_circle"
  | "filter_list"
  | "sort"
  | "verified"
  | "cancel"
  | "arrow_back"
  | "arrow_forward_ios"
  | "hub"
  | "person_check"
  | "pending_actions"
  | "visibility"
  | "edit"
  | "warning"
  | "domain"
  | "account_balance"
  | "web"
  | "upload"
  | "save"
  | "location_on"
  | "call"
  | "mail"
  | "manage_accounts"
  | "delete"
  | "close"
  | "lock"
  | "lock_reset";

type AdminIconProps = SVGProps<SVGSVGElement> & {
  name: AdminIconName;
};

function IconPaths({ name }: { name: AdminIconName }) {
  switch (name) {
    case "dashboard":
      return (
        <>
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="13" y="3" width="8" height="5" rx="1.5" />
          <rect x="13" y="10" width="8" height="11" rx="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" />
        </>
      );

    case "group":
      return (
        <>
          <circle cx="9" cy="9" r="3" />
          <circle cx="17" cy="10" r="2.5" />
          <path d="M3.5 19c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5" />
          <path d="M14 18.8c.3-2 1.9-3.2 4-3.2 1.4 0 2.5.5 3.2 1.4" />
        </>
      );

    case "school":
      return (
        <>
          <path d="m2.8 9 9.2-4.5L21.2 9 12 13.5z" />
          <path d="M6 11.2V16c0 1.9 2.7 3.4 6 3.4s6-1.5 6-3.4v-4.8" />
          <path d="M21.2 9v5" />
        </>
      );

    case "list_alt":
      return (
        <>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8" />
          <path d="M8 12h8" />
          <path d="M8 16h6" />
        </>
      );

    case "history":
      return (
        <>
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v4h4" />
          <path d="M12 7v5l3 2" />
        </>
      );

    case "settings":
      return (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.6z" />
        </>
      );

    case "add":
      return <path d="M12 5v14M5 12h14" />;

    case "person":
      return (
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 19c0-3.2 3-5.3 7-5.3s7 2.1 7 5.3" />
        </>
      );

    case "logout":
      return (
        <>
          <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
          <path d="M13 16l4-4-4-4" />
          <path d="M9 12h8" />
        </>
      );

    case "menu":
      return (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      );

    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-4.1-4.1" />
        </>
      );

    case "notifications":
      return (
        <>
          <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16z" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </>
      );

    case "apps":
      return (
        <>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </>
      );

    case "download":
      return (
        <>
          <path d="M12 4v10" />
          <path d="m8 10 4 4 4-4" />
          <path d="M4 19h16" />
        </>
      );

    case "autorenew":
      return (
        <>
          <path d="M21 12a8.5 8.5 0 0 0-14.5-6L4 8.5" />
          <path d="M3.8 3.8 4 8.5l4.7-.2" />
          <path d="M3 12a8.5 8.5 0 0 0 14.5 6l2.5-2.5" />
          <path d="m20.2 20.2-.2-4.7-4.7.2" />
        </>
      );

    case "analytics":
      return (
        <>
          <path d="M5 19V9" />
          <path d="M12 19V5" />
          <path d="M19 19v-7" />
          <path d="M4 19h16" />
        </>
      );

    case "calendar_month":
      return (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
          <path d="M3 10h18" />
        </>
      );

    case "menu_book":
      return (
        <>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z" />
          <path d="M4 5.5V19" />
          <path d="M8 7h8" />
        </>
      );

    case "chevron_right":
      return <path d="m9 6 6 6-6 6" />;

    case "chevron_left":
      return <path d="m15 6-6 6 6 6" />;

    case "check_circle":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </>
      );

    case "filter_list":
      return (
        <>
          <path d="M4 6h16" />
          <path d="M7 12h10" />
          <path d="M10 18h4" />
        </>
      );

    case "sort":
      return (
        <>
          <path d="m8 6-3 3-3-3" transform="translate(3 0)" />
          <path d="M8 6v12" />
          <path d="m16 18 3-3 3 3" transform="translate(-3 0)" />
          <path d="M16 6v12" />
        </>
      );

    case "verified":
      return (
        <>
          <path d="m12 3 7 3v5c0 5-3.1 8.2-7 10-3.9-1.8-7-5-7-10V6z" />
          <path d="m9 12 2 2 4-4" />
        </>
      );

    case "cancel":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m9 9 6 6" />
          <path d="m15 9-6 6" />
        </>
      );

    case "arrow_back":
      return (
        <>
          <path d="m10 6-6 6 6 6" />
          <path d="M4 12h16" />
        </>
      );

    case "arrow_forward_ios":
      return <path d="m10 6 5 6-5 6" />;

    case "hub":
      return (
        <>
          <circle cx="12" cy="12" r="2.5" />
          <circle cx="5" cy="6" r="2" />
          <circle cx="19" cy="6" r="2" />
          <circle cx="5" cy="18" r="2" />
          <circle cx="19" cy="18" r="2" />
          <path d="M10 10 6.5 7.5" />
          <path d="M14 10 17.5 7.5" />
          <path d="M10 14 6.5 16.5" />
          <path d="M14 14 17.5 16.5" />
        </>
      );

    case "person_check":
      return (
        <>
          <circle cx="10" cy="8" r="3" />
          <path d="M4.5 18c0-2.8 2.5-4.5 5.5-4.5 1.5 0 2.9.4 3.9 1.1" />
          <path d="m16 16 2 2 3-3" />
        </>
      );

    case "pending_actions":
      return (
        <>
          <rect x="5" y="4" width="11" height="16" rx="2" />
          <path d="M8 8h5" />
          <path d="M8 12h4" />
          <circle cx="18.5" cy="16.5" r="2.5" />
          <path d="M18.5 15v1.5h1.2" />
        </>
      );

    case "visibility":
      return (
        <>
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      );

    case "edit":
      return (
        <>
          <path d="M4 20h4l10-10-4-4L4 16z" />
          <path d="m12 6 4 4" />
        </>
      );

    case "warning":
      return (
        <>
          <path d="M12 3 2.8 20.5h18.4z" />
          <path d="M12 9v5" />
          <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
        </>
      );

    case "domain":
      return (
        <>
          <rect x="3" y="5" width="8" height="14" rx="1" />
          <rect x="13" y="3" width="8" height="16" rx="1" />
          <path d="M6 9h2" />
          <path d="M6 13h2" />
          <path d="M16 7h2" />
          <path d="M16 11h2" />
        </>
      );

    case "account_balance":
      return (
        <>
          <path d="m3 8 9-4 9 4z" />
          <path d="M4 10h16" />
          <path d="M6 10v7" />
          <path d="M10 10v7" />
          <path d="M14 10v7" />
          <path d="M18 10v7" />
          <path d="M3 19h18" />
        </>
      );

    case "web":
      return (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 8h18" />
          <path d="M8 6h.01" />
          <path d="M12 6h.01" />
        </>
      );

    case "upload":
      return (
        <>
          <path d="M12 20V10" />
          <path d="m8 14 4-4 4 4" />
          <path d="M4 20h16" />
        </>
      );

    case "save":
      return (
        <>
          <path d="M5 4h12l2 2v14H5z" />
          <path d="M8 4v6h8V4" />
          <path d="M8 20v-6h8v6" />
        </>
      );

    case "location_on":
      return (
        <>
          <path d="M12 21s6-5.7 6-10a6 6 0 1 0-12 0c0 4.3 6 10 6 10z" />
          <circle cx="12" cy="11" r="2.2" />
        </>
      );

    case "call":
      return (
        <>
          <path d="M5.5 4.5c.8-.8 2.1-.8 2.9 0l1.8 1.8c.7.7.8 1.8.2 2.6l-1 1.3c-.2.3-.2.8.1 1.1l3.5 3.5c.3.3.8.3 1.1.1l1.3-1c.8-.6 1.9-.5 2.6.2l1.8 1.8c.8.8.8 2.1 0 2.9l-1 1c-1.4 1.4-3.5 1.8-5.3 1-2.7-1.2-5.4-3.2-8-5.8s-4.6-5.3-5.8-8c-.8-1.8-.4-3.9 1-5.3z" />
        </>
      );

    case "mail":
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </>
      );

    case "manage_accounts":
      return (
        <>
          <circle cx="10" cy="8" r="3.5" />
          <path d="M2.5 20c0-3 3.4-5.5 7.5-5.5" />
          <path d="M18 14.5v1.8l1.2.7-.8 1.4-1.4-.8a3 3 0 0 1-2 0l-1.4.8-.8-1.4 1.2-.7V14.5l-1.2-.7.8-1.4 1.4.8a3 3 0 0 1 2 0l1.4-.8.8 1.4z" />
          <circle cx="18" cy="17" r="1" fill="currentColor" />
        </>
      );

    case "delete":
      return (
        <>
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6" />
        </>
      );

    case "close":
      return (
        <>
          <path d="M18 6 6 18M6 6l12 12" />
        </>
      );

    case "lock":
      return (
        <>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 1 1 8 0v4" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </>
      );

    case "lock_reset":
      return (
        <>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 7.5-2" />
          <path d="M17 3v4h-4" />
          <path d="M17 7a5 5 0 0 0-8.5-2.5" />
          <path d="M12 15v2" />
        </>
      );

    default:
      return <circle cx="12" cy="12" r="4" />;
  }
}

export function AdminIcon({ name, className, ...props }: AdminIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`admin-icon${className ? ` ${className}` : ""}`}
      {...props}
    >
      <IconPaths name={name} />
    </svg>
  );
}
