import Image from "next/image";
import Link from "next/link";
import { Apple, Play } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { APP_DOWNLOAD_URL } from "@/lib/i18n";

export function DownloadApp() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6 lg:px-24 lg:py-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-brand-dark lg:rounded-3xl">
        <div className="grid items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_auto] lg:px-14 lg:py-12">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
              <Image
                src="/download.svg"
                alt=""
                width={18}
                height={18}
                className="opacity-90"
              />
              Download the app
            </p>
            <h2 className="max-w-xl text-2xl font-bold leading-tight tracking-tight text-white lg:text-4xl">
              Shop faster. Sell smarter. Everywhere.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-neutral-300">
              Get exclusive drops, instant price alerts and express checkout on
              the Kick Avenue app.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={APP_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-soft"
              >
                <Apple className="size-4" />
                App Store
              </Link>
              <Link
                href={APP_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Play className="size-4 fill-current" />
                Google Play
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2.5 rounded-2xl bg-white p-5 shadow-xl lg:p-6">
            <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
              <Image
                src="/download.svg"
                alt=""
                width={15}
                height={15}
                className="opacity-90"
              />
              Scan to download
            </span>
            <QRCodeSVG
              value={APP_DOWNLOAD_URL}
              size={136}
              level="M"
              fgColor="#0a0a0a"
              bgColor="#ffffff"
            />
            <p className="text-[11px] font-medium text-neutral-400">
              Kick Avenue app
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}