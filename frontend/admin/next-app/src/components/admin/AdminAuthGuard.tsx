"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getAccessToken } from "@/lib/adminAuth";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    const authorized = Boolean(token);

    if (!authorized) {
      router.replace("/login");
    }

    setIsAuthorized(authorized);
  }, [router, pathname]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
