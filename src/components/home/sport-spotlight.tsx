"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const IMAGE_BASE =
  "https://kickavenue-assets.s3.amazonaws.com/asset-images/homepage";

const sports = [
  {
    index: "01",
    title: "Running",
    href: "/collection/running-sneakers",
    image: `${IMAGE_BASE}/44cf2064d033f214fc8b0a5f8dba4970.jpg`,
  },
  {
    index: "02",
    title: "Court",
    href: "/collection/tennis-padel",
    image: `${IMAGE_BASE}/0d848f49732696d3b6a76a0af62fec34.jpg`,
  },
  {
    index: "03",
    title: "Basket",
    href: "/collection/basketball-sneakers",
    image: `${IMAGE_BASE}/8f29209c59ce1effa520784a8bee6ddd.jpg`,
  },
  {
    index: "04",
    title: "Jersey",
    href: "/collection/sport-jerseys",
    image: `${IMAGE_BASE}/ae464363354223b98d6fddb86c6e0b07.jpg`,
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function SportSpotlight() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 pb-6 lg:px-24 lg:pb-10">
      <div className="grid items-center gap-6 lg:grid-cols-[0.8fr_1.5fr] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="lg:pr-4"
        >
          <p className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-dark">
            <span className="h-px w-6 bg-brand-dark" />
            Shop by sport
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-neutral-950 lg:text-4xl">
            Find your arena
          </h3>
          <p className="mt-3 max-w-xs text-sm leading-6 text-neutral-500">
            The right pair for every game — from the track to the court.
          </p>
          <Link
            href="/search"
            className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-950"
          >
            View all sports
            <span className="flex size-7 items-center justify-center rounded-full border border-neutral-300 transition-all group-hover:border-neutral-950 group-hover:bg-neutral-950 group-hover:text-white">
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-5"
        >
          {sports.map((sport) => (
            <motion.div key={sport.title} variants={itemVariants}>
              <Link href={sport.href} className="group block">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-neutral-200/70 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-hover:ring-neutral-950 lg:p-4">
                  <div className="relative h-full w-full">
                    <Image
                      src={sport.image}
                      alt={sport.title}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-neutral-600 lg:text-sm">
                  <span className="font-black text-brand-dark">
                    {sport.index}
                  </span>
                  <span className="transition-colors group-hover:text-neutral-950">
                    {sport.title}
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}