"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const BackgroundLines = ({
  children,
  className,
  bottomBackgroundImage,
}: {
  children: React.ReactNode;
  className?: string;
  bottomBackgroundImage?: string;
}) => {
  return (
    <div
      className={cn(
        "relative isolate w-full overflow-hidden bg-[radial-gradient(120%_80%_at_50%_100%,#dbeafe_0%,#f8fafc_45%,#ffffff_100%)] min-h-[28rem] pb-10 md:h-screen md:pb-0",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.8) 45%, rgba(224,242,254,0.75) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 left-1/2 z-[1] h-72 w-[120%] -translate-x-1/2 rounded-[100%]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.22) 0%, rgba(37,99,235,0.12) 36%, rgba(255,255,255,0) 72%)",
          filter: "blur(10px)",
        }}
        aria-hidden="true"
      />
      {bottomBackgroundImage ? (
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-no-repeat"
          style={{
            backgroundImage: `url(${bottomBackgroundImage})`,
            backgroundSize: "auto 100%",
            backgroundPosition: "center bottom",
            filter: "blur(4px)",
            opacity: 0.3,
          }}
          aria-hidden="true"
        />
      ) : null}
      <div className="relative z-20 w-full">{children}</div>
    </div>
  );
};
