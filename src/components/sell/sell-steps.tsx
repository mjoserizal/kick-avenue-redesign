"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Camera, ScanLine, PlaneTakeoff, Banknote } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const steps = [
  {
    icon: Camera,
    number: "01",
    title: "Submit your item",
    description:
      "Tells us the brand, model, size and condition. Attach clear photos on every angle.",
  },
  {
    icon: ScanLine,
    number: "02",
    title: "Get an offer, instantly approved",
    description:
      "Our experts authenticate and give you a fair, instant offer you can accept in one tap.",
  },
  {
    icon: PlaneTakeoff,
    number: "03",
    title: "Ship it — we cover the label",
    description:
      "Pack your item and drop it off. We handle insurance and provide the shipping label.",
  },
  {
    icon: Banknote,
    number: "04",
    title: "Get paid fast",
    description:
      "Once verified, payment lands in your account within 24 hours. No waiting around.",
  },
];

export function SellSteps() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4"
    >
      {steps.map((step) => {
        const Icon = step.icon;
        return (
          <motion.div
            key={step.number}
            variants={itemVariants}
            className="group rounded-2xl border border-neutral-200/80 bg-white p-5 transition-shadow hover:shadow-md lg:p-6"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand-dark transition-transform duration-300 group-hover:scale-110">
                <Icon className="size-5" strokeWidth={1.8} />
              </span>
              <span className="text-3xl font-bold tracking-tight text-neutral-950/10">
                {step.number}
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold tracking-tight text-neutral-950 lg:text-lg">
              {step.title}
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-neutral-500">
              {step.description}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}