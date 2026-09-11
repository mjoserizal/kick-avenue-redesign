"use client";

import Link from "next/link";
import { useState } from "react";
import { SearchIcon, Menu, X, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function KickAvenueLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 227 40"
      className="w-[180px] h-9 lg:w-[184px] lg:h-8"
      role="img"
      aria-label="Kick Avenue"
    >
      <path
        d="M3.82 11.3005H9.10765L7.72706 17.7858H10.5141L19.0576 11.3005H26.3247L14.5253 19.8958L23.5894 28.6735H15.9318L9.49823 22.0058H6.84176L5.40941 28.6741H0.121765L3.82 11.3005Z"
        fill="currentColor"
      />
      <path d="M27.7571 11.3005H33.0447L29.3459 28.6735H24.0588L27.7571 11.3005Z" fill="currentColor" />
      <path
        d="M55.0541 22.1358C54.4812 24.8705 54.1947 25.6782 53.5694 26.5117C52.4235 28.0488 50.7565 28.6217 47.1618 28.7517C46.3541 28.7776 43.88 28.8041 41.6659 28.8041C36.8212 28.8041 35.2847 28.5699 34.0082 27.6582C33.1747 27.0852 32.7841 26.0694 32.7841 24.5064C32.7841 23.2041 33.2012 20.7558 33.9041 17.9429C34.8159 14.2182 35.91 12.7599 38.4624 11.8482C39.9212 11.327 41.6659 11.1705 45.7818 11.1705C51.0429 11.1705 52.8665 11.2746 54.0124 11.6394C55.5494 12.1341 56.2265 13.0458 56.2265 14.687C56.2265 15.4423 56.1224 16.1458 55.8359 17.3958H50.7829C50.8347 17.057 50.8612 16.8747 50.8612 16.6923C50.8612 15.4941 50.2882 15.3382 46.0424 15.3382C43.2035 15.3382 41.8747 15.3899 41.3018 15.5464C39.9212 15.9111 39.4788 16.5358 38.9318 18.7764C38.4629 20.7817 38.2806 21.8235 38.2806 22.657C38.2806 24.2717 39.0359 24.5841 43.1253 24.5841C47.1106 24.5841 47.7353 24.5323 48.4912 24.2199C49.2988 23.907 49.6629 23.3864 49.95 22.1364H55.0541V22.1358Z"
        fill="currentColor"
      />
      <path
        d="M59.5606 11.3005H64.8482L63.4676 17.7858H66.2547L74.7982 11.3005H82.0653L70.2659 19.8958L79.33 28.6735H71.6723L65.2382 22.0058H62.5818L61.1494 28.6741H55.8618L59.5606 11.3005Z"
        fill="currentColor"
      />
      <path
        d="M95.9212 11.3005H103.006L108.814 28.6735H103.032L101.964 25.5741H90.7635L88.4453 28.6735H82.4547L95.9212 11.3005ZM100.896 21.9535L98.6041 15.0247L93.4206 21.9535H100.896Z"
        fill="currentColor"
      />
      <path
        d="M108.658 11.3005H114.493L118.556 24.4276L128.35 11.3005H134.236L120.926 28.6735H114.232L108.658 11.3005Z"
        fill="currentColor"
      />
      <path
        d="M154.058 11.3005L153.224 15.2335H139.211L138.56 18.2288H151.818L151.088 21.667H137.831L137.179 24.7405H151.401L150.568 28.6741H131.137L134.836 11.3011H154.058V11.3005Z"
        fill="currentColor"
      />
      <path
        d="M187.762 11.3005L186.173 18.854C186.121 19.1405 186.043 19.4788 185.938 19.8958C185.574 21.5629 185.469 22.1617 185.469 22.7611C185.469 24.2717 186.433 24.6623 190.106 24.6623C194.378 24.6623 195.445 24.5323 196.175 23.8546C196.722 23.3599 197.034 22.6829 197.373 21.1458C197.451 20.8335 197.451 20.8335 197.634 19.9999C197.712 19.557 197.738 19.4005 197.764 19.2705L199.457 11.2999H204.771L202.817 20.4158C201.905 25.0782 201.15 26.4587 198.78 27.787C196.696 28.7505 196.358 28.8029 189.82 28.8287C183.959 28.7764 183.465 28.7505 182.162 28.204C180.678 27.6046 179.896 26.4587 179.896 24.8958C179.896 23.6976 180.001 22.9682 180.495 20.6505L182.475 11.2999H187.762V11.3005Z"
        fill="currentColor"
      />
      <path
        d="M226.466 11.3005L225.633 15.2335H211.62L210.969 18.2288H224.226L223.497 21.667H210.239L209.588 24.7405H223.81L222.976 28.6741H203.546L207.245 11.3011H226.466V11.3005Z"
        fill="currentColor"
      />
      <path
        d="M156.219 11.3005H164.632L172.342 24.5058L174.999 11.3005H180L176.328 28.6735H167.836L160.231 15.5982L157.6 28.6735H152.521L156.219 11.3005Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex items-center gap-3 lg:gap-6 px-3 sm:px-4 lg:px-24 py-3 lg:py-4 max-w-[1440px] mx-auto">
        <button
          type="button"
          className="flex lg:hidden items-center justify-center"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>

        <Link href="/" className="flex items-center shrink-0" aria-label="Kick Avenue Home">
          <KickAvenueLogo />
        </Link>

        <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 bg-neutral-50 rounded-lg p-3 w-full max-w-md flex-1">
          <SearchIcon className="size-4 text-neutral-800 shrink-0" />
          <Input
            type="text"
            placeholder="1,000,000+ authentic items here"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm border-none shadow-none focus-visible:ring-0 h-auto p-0"
          />
        </form>

        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6 ml-auto">
          <Link href="/" className="text-sm font-semibold hover:opacity-70 transition-opacity">
            Home
          </Link>
          <Link href="/search" className="text-sm hover:opacity-70 transition-opacity">
            Market
          </Link>
          <Link href="/sell" className="text-sm hover:opacity-70 transition-opacity">
            Sell
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 ml-auto lg:ml-0">
          <button
            type="button"
            className="flex lg:hidden items-center justify-center"
            aria-label="Toggle search"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <SearchIcon className="size-6" />
          </button>
          <Button variant="ghost" size="icon" aria-label="Wishlist" className="hidden sm:inline-flex">
            <ShoppingBag className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Account" className="hidden sm:inline-flex">
            <User className="size-5" />
          </Button>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={handleSearch} className="lg:hidden px-4 pb-3">
          <div className="flex items-center gap-2 bg-neutral-50 rounded-lg p-3">
            <SearchIcon className="size-4 text-neutral-800 shrink-0" />
            <Input
              type="text"
              placeholder="1,000,000+ authentic items here"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm border-none shadow-none focus-visible:ring-0 h-auto p-0"
            />
          </div>
        </form>
      )}

      {mobileOpen && (
        <nav className="lg:hidden border-t bg-white px-4 py-4 flex flex-col gap-4">
          <Link href="/" className="text-sm font-semibold">
            Home
          </Link>
          <Link href="/search" className="text-sm">
            Market
          </Link>
          <Link href="/sell" className="text-sm">
            Sell
          </Link>
        </nav>
      )}
    </header>
  );
}