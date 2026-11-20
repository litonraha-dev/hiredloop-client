
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Instrument_Sans, Manrope } from "next/font/google";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";

import logo from "@/app/images/logo.png";
import { cn } from "@/lib/utils";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-manrope",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-instrument-sans",
});

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar({
  className,
  ...props
}: React.ComponentProps<"header">) {

  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = useSession();
  const role = session?.user.role;


  // Logout
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed");
        return;
      }

      toast.success("Logged out successfully!");

      setMobileOpen(false);

      router.push("/sign-in");
      router.refresh();

    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong");

    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header
      className={cn(
        "pt-6",
        manrope.variable,
        instrumentSans.variable,
        className
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-[60px]">

        <nav
          aria-label="Main navigation"
          className="relative flex h-[74px] items-center justify-between rounded-2xl bg-[#222222] pr-2 pl-6 sm:pr-3"
        >

          {/* Logo */}
          <Link href="/" aria-label="Hireloop home" className="shrink-0">
            <Image
              src={logo}
              alt="Hireloop"
              priority
              className="h-11 w-auto"
            />
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-6 lg:flex">

            <ul className="flex items-center gap-10">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-base text-white transition-colors hover:text-white/70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <span
              aria-hidden
              className="h-6 w-px bg-[#a8a8a8]/40"
            />

            <div className="flex items-center gap-4">

              {isPending ? (
                <span className="text-white/60 text-sm">
                  Loading...
                </span>
              ) : session?.user ? (

                <>
                  <div className="text-right">
                    <p className="text-[#ededef] text-sm font-semibold">
                      Welcome, {session.user.name}
                    </p>

                    <p className="text-xs text-gray-400 capitalize">
                      {role || "User"}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex h-[48px] items-center gap-2 rounded-xl bg-white/10 px-4 text-white hover:bg-white/20 transition"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex h-[48px] items-center gap-2 rounded-xl bg-red-500/10 px-4 text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                  >
                    <LogOut size={18} />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>

              ) : (

                <>
                  <Link
                    href="/sign-in"
                    className={cn(
                      "flex h-[52px] items-center rounded-xl px-6 text-lg font-semibold text-[#5c53fe] transition-colors hover:bg-white/5",
                      manrope.className
                    )}
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    className={cn(
                      "flex h-[52px] items-center rounded-xl border border-[#090a15]/10 bg-[#5c53fe] px-6 text-lg font-medium text-white shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] transition-colors hover:bg-[#4a42e6]",
                      instrumentSans.className
                    )}
                  >
                    Get Started
                  </Link>
                </>

              )}

            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex size-11 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/5 lg:hidden"
          >
            {mobileOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>

        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mt-2 rounded-2xl bg-[#222222] p-6 lg:hidden">

            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-2 py-3 text-base text-white transition-colors hover:bg-white/5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <span className="my-4 block h-px w-full bg-[#a8a8a8]/40" />

            {isPending ? (
              <p className="text-white/60 text-sm">
                Loading...
              </p>
            ) : session?.user ? (

              <div className="flex flex-col gap-3">

                <div className="px-2 py-2">
                  <p className="text-white font-semibold">
                    Welcome, {session.user.name}
                  </p>

                  <p className="text-gray-400 text-sm capitalize">
                    {role || "User"}
                  </p>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-[48px] items-center justify-center gap-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex h-[48px] items-center justify-center gap-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                >
                  <LogOut size={18} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>

              </div>

            ) : (

              <div className="flex flex-col gap-3">

                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex h-[52px] items-center justify-center rounded-xl text-lg font-semibold text-[#5c53fe] transition-colors hover:bg-white/5",
                    manrope.className
                  )}
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex h-[52px] items-center justify-center rounded-xl border border-[#090a15]/10 bg-[#5c53fe] text-lg font-medium text-white shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] transition-colors hover:bg-[#4a42e6]",
                    instrumentSans.className
                  )}
                >
                  Get Started
                </Link>

              </div>

            )}

          </div>
        )}

      </div>
    </header>
  );
}
