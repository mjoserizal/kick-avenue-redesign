"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Bike, Box, ShieldCheck } from "lucide-react";

const serviceCards = [
  {
    title: "100% authentic",
    copy: "Every item is checked before it reaches you.",
    icon: BadgeCheck,
  },
  {
    title: "Express shipping",
    copy: "Order before 15.00 WIB for express dispatch.",
    icon: Bike,
  },
  {
    title: "Secure payment",
    copy: "Your money stays protected until you are happy.",
    icon: ShieldCheck,
  },
  {
    title: "Sell with ease",
    copy: "Turn your closet into your next best find.",
    icon: Box,
  },
];

function ServiceCard({
  card,
  ...rest
}: {
  card: (typeof serviceCards)[number];
} & React.ComponentProps<"div">) {
  const Icon = card.icon;
  return (
    <div
      {...rest}
      className="flex w-[18rem] shrink-0 items-center gap-3.5 rounded-2xl bg-background px-5 py-4 ring-1 ring-neutral-200/70 transition-transform duration-300 hover:-translate-y-0.5 lg:w-[22rem]"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white shadow-sm">
        <Icon className="size-5" strokeWidth={1.7} />
      </span>
      <div>
        <h3 className="text-sm font-bold text-neutral-950">{card.title}</h3>
        <p className="mt-0.5 text-xs leading-5 text-neutral-500">
          {card.copy}
        </p>
      </div>
    </div>
  );
}

export function ServiceRail() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden bg-background">
      <motion.div
        className="relative flex w-max"
        animate={reducedMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reducedMotion
            ? undefined
            : { duration: 28, ease: "linear", repeat: Infinity }
        }
      >
        {[0, 1].map((half) => (
          <div
            key={half}
            className="flex shrink-0 items-stretch gap-3 px-2 py-5 lg:gap-4 lg:px-3"
          >
            {serviceCards.map((card) => (
              <ServiceCard key={card.title} card={card} />
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  );
}