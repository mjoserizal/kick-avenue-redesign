import Link from "next/link";
import { ArrowRight, MapPin, Mail, Phone } from "lucide-react";

const footerLinks = [
  { title: "Get to Know Us", links: ["About Us", "Careers", "Kick Avenue Newsroom", "Investment"] },
  { title: "Let Us Help You", links: ["Account", "Order Status", "Payment Options", "Shipping & Delivery", "Returns & Refunds", "Contact Us"] },
  { title: "For Sellers", links: ["Sell on Kick Avenue", "Seller Central", "Become an Affiliate", "Seller Guidelines"] },
  { title: "Community", links: ["Community Guidelines", "Kick Avenue Community", "Blog", "Events"] },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/kickavenue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/kickavenue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    href: "https://twitter.com/kickavenue",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@kickavenue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@kickavenue",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      {/* Newsletter */}
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto grid max-w-[1440px] items-center gap-6 px-4 py-10 lg:grid-cols-2 lg:px-24 lg:py-12">
          <div>
            <h2 className="text-xl font-bold tracking-tight lg:text-2xl">
              Drop in for the latest drops
            </h2>
            <p className="mt-1.5 text-sm text-neutral-600">
              New arrivals, restocks and exclusive offers. Straight to your
              inbox, no spam.
            </p>
          </div>
          <div className="flex w-full items-center gap-2 rounded-full border border-neutral-300 bg-white py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-neutral-950 focus-within:ring-2 focus-within:ring-neutral-950/10 sm:gap-1 odd:text-neutral-400">
            <Mail className="size-4 shrink-0 text-neutral-400" />
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
            <button
              type="button"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-neutral-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 sm:px-5"
            >
              Subscribe
              <ArrowRight className="hidden size-4 sm:block" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-12 lg:px-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:grid-cols-6">
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-bold tracking-wide text-neutral-950">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-neutral-500 transition-colors hover:text-neutral-950"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-bold tracking-wide text-neutral-950">
              Follow Us
            </h3>
            <div className="mt-4 flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-all hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
            <ul className="mt-5 space-y-2 text-sm text-neutral-500">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-neutral-400" />
                Jakarta, Indonesia
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-neutral-400" />
                +62 812-1000-5425
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Kick Avenue. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500">
            <Link href="#" className="transition-colors hover:text-neutral-950">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-neutral-950">
              Terms of Service
            </Link>
            <Link href="#" className="transition-colors hover:text-neutral-950">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}