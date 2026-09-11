"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Bike, Box } from "lucide-react";

const serviceCards = [
  {
    title: "100% authentic",
    copy: "Every item is checked before it reaches you.",
    icon: BadgeCheck,
    accent: "text-emerald-700",
    iconSurface: "bg-emerald-50",
  },
  {
    title: "Express shipping",
    copy: "Order before 15.00 WIB for express dispatch.",
    icon: Bike,
    accent: "text-sky-700",
    iconSurface: "bg-sky-50",
  },
  {
    title: "Sell with ease",
    copy: "Turn your closet into your next best find.",
    icon: Box,
    accent: "text-amber-700",
    iconSurface: "bg-amber-50",
  },
];

export function ServiceRail() {
  const reducedMotion = useReducedMotion();
  const loopCards = [...serviceCards, ...serviceCards];

  return (
    <section className="overflow-hidden bg-white">
      <motion.div
        className="flex w-max gap-3 bg-white py-3 lg:gap-4 lg:px-24"
        animate={reducedMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reducedMotion
            ? undefined
            : { duration: 22, ease: "linear", repeat: Infinity }
        }
      >
        {loopCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={`${card.title}-${index}`}
              className="flex w-[calc(100vw-2rem)] shrink-0 items-start gap-4 rounded-2xl bg-white px-5 py-5 shadow-sm sm:w-[28rem] lg:w-[calc((100vw-12rem)/3)] lg:px-6"
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-full shadow-sm ${card.iconSurface} ${card.accent}`}
              >
                <Icon className="size-5" strokeWidth={1.7} />
              </span>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  {card.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-neutral-600">
                  {card.copy}
                </p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
