"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";



export const HeroParallax = () => null;

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex flex-wrap items-center gap-4 text-3xl font-extrabold tracking-tight md:gap-6 md:text-7xl"
      >
        <span className="text-[#1f3a8a]">SONG NGUYEN EDUCATION</span>

        <span className="relative inline-flex rotate-[4deg] items-center rounded-full bg-[#ff0c0c] px-10 py-3 text-white md:px-14 md:py-4">
          BÀI VIẾT
          <svg
            className="absolute -right-8 -top-6 h-12 w-12 text-sky-500 md:h-16 md:w-16"
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M32 4v14M32 46v14M4 32h14M46 32h14M11 11l10 10M43 43l10 10M53 11 43 21M21 43 11 53"
              stroke="currentColor"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="max-w-2xl text-base md:text-xl mt-8 font-medium leading-8 text-[#334155]"
      >
        SONG NGUYEN EDUCATION giúp phụ huynh tìm được gia sư phù hợp đồng hành cùng con trên hành trình tri thức
      </motion.p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative shrink-0 overflow-hidden rounded-2xl bg-white/75"
    >
      <a
        href={product.link}
        className="block h-full w-full p-2 group-hover/product:shadow-2xl"
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="h-full w-full object-contain object-center"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
