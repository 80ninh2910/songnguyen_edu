"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import new1 from "@/components/assets/Screenshot 2026-04-12 182511.png";
import new2 from "@/components/assets/Screenshot 2026-04-12 182529.png";
import new3 from "@/components/assets/Screenshot 2026-04-12 182553.png";
import new4 from "@/components/assets/Screenshot 2026-04-12 182641.png";
import new5 from "@/components/assets/Screenshot 2026-04-12 182657.png";
import new6 from "@/components/assets/Screenshot 2026-04-12 182724.png";
import new7 from "@/components/assets/Screenshot 2026-04-12 182739.png";
import new8 from "@/components/assets/Screenshot 2026-04-12 182749.png";
import new9 from "@/components/assets/Screenshot 2026-04-12 182800.png";
import new10 from "@/components/assets/Screenshot 2026-04-12 182511.png";
import new12 from "@/components/assets/Screenshot 2026-04-12 182529.png";
import new13 from "@/components/assets/Screenshot 2026-04-12 182553.png";
import new14 from "@/components/assets/Screenshot 2026-04-12 182641.png";
import new15 from "@/components/assets/Screenshot 2026-04-12 182657.png";
import new11 from "@/components/assets/Screenshot 2026-04-12 182749.png";
export default function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}
export const products = [
  {
    title: "Moonbeam",
    link: "",
    thumbnail: new1.src,
  },
  {
    title: "Cursor",
    link: "",
    thumbnail: new2.src,
  },
  {
    title: "Rogue",
    link: "",
    thumbnail: new3.src,
  },

  {
    title: "Editorially",
    link: "",
    thumbnail: new4.src,
  },
  {
    title: "Editrix AI",
    link: "https://editrix.ai",
    thumbnail: new5.src,
  },
  {
    title: "Pixel Perfect",
    link: "https://app.pixelperfect.quest",
    thumbnail: new6.src,
  },

  {
    title: "Algochurn",
    link: "https://algochurn.com",
    thumbnail: new7.src,
  },
  {
    title: "Aceternity UI",
    link: "https://ui.aceternity.com",
    thumbnail: new8.src,
  },
  {
    title: "Tailwind Master Kit",
    link: "https://tailwindmasterkit.com",
    thumbnail: new9.src,
  },
  {
    title: "SmartBridge",
    link: "https://smartbridgetech.com",
    thumbnail: new10.src,
  },
  {
    title: "Renderwork Studio",
    link: "https://renderwork.studio",
    thumbnail: new11.src,
  },

  {
    title: "Creme Digital",
    link: "https://cremedigital.com",
    thumbnail: new12.src,
  },
  {
    title: "Golden Bells Academy",
    link: "https://goldenbellsacademy.com",
    thumbnail: new13.src,
  },
  {
    title: "Invoker Labs",
    link: "https://invoker.lol",
    thumbnail: new14.src,
  },
  {
    title: "E Free Invoice",
    link: "https://efreeinvoice.com",
    thumbnail: new15.src,
  },
];
