import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Timer, Truck, Sparkles } from "lucide-react";
import { SellSteps } from "@/components/sell/sell-steps";

export const metadata: Metadata = {
  title: "Sell - Kick Avenue Redesign",
  description:
    "Sell your sneakers, apparel, trading cards and luxury items on Kick Avenue. Quick authentication, fair offers, fast payout.",
};

const perks = [
  {
    icon: ShieldCheck,
    title: "Authenticated by experts",
    description:
      "Every item is reviewed by our verification team before it reaches the buyer.",
  },
  {
    icon: Timer,
    title: "Payout in 24 hours",
    description:
      "Receive your money within a day of successful verification. No hidden fees.",
  },
  {
    icon: Truck,
    title: "Free shipping label",
    description:
      "Print or drop off with our prepaid label — fully insured along the way.",
  },
];

export default function SellPage() {
  return (
    <main>
      <section className="border-b border-neutral-200 bg-gradient-to-b from-neutral-50 to-white">
        <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-24 lg:py-24">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-dark/20 bg-brand-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-dark">
            <Sparkles className="size-3.5" />
            Sell on Kick Avenue
          </span>
          <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-neutral-950 lg:text-5xl">
            Turn your collection into cash
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-500 lg:text-base">
            List your sneakers, trading cards, luxury and apparel in minutes.
            We authenticate, we handle shipping, and your money arrives within
            24 hours.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/6281210005425?text=Halo%2C%20saya%20ingin%20menjual%20item%20di%20Kick%20Avenue"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-brand-dark"
            >
              Start selling
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <Link
              href="/search?category=trading%20cards"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:border-neutral-950"
            >
              See what sells
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 lg:px-24 lg:py-20">
        <div className="mb-8 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-dark">
            How it works
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 lg:text-3xl">
            Four steps to your payout
          </h2>
        </div>
        <SellSteps />
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50/60">
        <div className="mx-auto max-w-[1440px] px-4 py-14 lg:px-24 lg:py-20">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
            {perks.map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="rounded-2xl border border-neutral-200/80 bg-white p-5 lg:p-6"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 text-sm font-bold tracking-tight text-neutral-950">
                    {perk.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-neutral-500">
                    {perk.description}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-10 text-center text-sm text-neutral-500">
            Sell in minutes, get paid in a day.{" "}
            <a
              href="https://wa.me/6281210005425"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-neutral-950 underline underline-offset-4"
            >
              Chat with our team
            </a>{" "}
            for anything your items need.
          </p>
        </div>
      </section>
    </main>
  );
}