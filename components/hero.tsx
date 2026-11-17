import Image from "next/image"
import Link from "next/link"
import {
  BriefcaseBusiness,
  Building2,
  FileSearch,
  MapPin,
  Search,
  Star,
  Users,
} from "lucide-react"
import {
  Instrument_Sans,
  Inter_Tight,
  Manrope,
  Plus_Jakarta_Sans,
  Space_Mono,
} from "next/font/google"

import globe from "@/app/images/globe.png"
import { cn } from "@/lib/utils"

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-manrope",
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-instrument-sans",
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-plus-jakarta-sans",
})

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inter-tight",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-space-mono",
})

const stats = [
  { icon: FileSearch, value: "50K", label: "Active Jobs" },
  { icon: Building2, value: "12K", label: "Companies" },
  { icon: Users, value: "2M", label: "Job Seekers" },
  { icon: Star, value: "97%", label: "Satisfaction Rate" },
]

const trendingRoles = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

export function Hero({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        manrope.variable,
        instrumentSans.variable,
        plusJakartaSans.variable,
        interTight.variable,
        spaceMono.variable,
        className
      )}
      {...props}
    >
      {/* Background */}
      <Image
        src={globe}
        alt=""
        aria-hidden
        priority
        className="pointer-events-none absolute inset-x-0 top-0 w-full select-none"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-[60px]">
        {/* Hero content */}
        <div className="mx-auto flex max-w-[784px] flex-col items-center pt-28 text-center sm:pt-44">
          {/* Badge */}
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="h-px w-16 bg-gradient-to-r from-transparent to-white/70"
            />
            <div className="flex items-center gap-4 rounded-full bg-gradient-to-b from-[#474747] to-[#010102] py-3 pr-6 pl-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3),inset_0_0_12px_rgba(0,0,0,0.1)]">
              <BriefcaseBusiness
                className="size-6 text-white"
                strokeWidth={1.5}
              />
              <span className={cn("text-xl text-white", spaceMono.className)}>
                50,000+ new jobs this month
              </span>
            </div>
            <span
              aria-hidden
              className="h-px w-16 bg-gradient-to-l from-transparent to-white/70"
            />
          </div>

          <h1
            className={cn(
              "mt-8 text-4xl font-bold text-white sm:text-5xl lg:text-[56px] lg:leading-[1.15]",
              manrope.className
            )}
          >
            Find Your Dream Job Today
          </h1>

          <p
            className={cn(
              "mt-4 text-lg text-white/70 sm:text-xl sm:leading-[1.6]",
              manrope.className
            )}
          >
            HireLoop connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role —
            faster.
          </p>

          {/* Search bar */}
          <form
            role="search"
            className="mt-12 flex w-full flex-col gap-3 rounded-2xl border border-white/20 bg-[#101010] p-3 sm:flex-row sm:items-center sm:gap-6 sm:py-2 sm:pr-2 sm:pl-6"
          >
            <div className="flex flex-1 items-center gap-2">
              <Search className="size-6 shrink-0 text-white" />
              <input
                type="text"
                name="q"
                placeholder="Job title, skill or company"
                className="w-full bg-transparent py-2 text-base text-white outline-none placeholder:text-white/80"
              />
            </div>

            <span
              aria-hidden
              className="hidden h-6 w-px bg-white/20 sm:block"
            />

            <div className="flex flex-1 items-center gap-2">
              <MapPin className="size-6 shrink-0 text-white" />
              <input
                type="text"
                name="location"
                placeholder="Location or Remote"
                className="w-full bg-transparent py-2 text-base text-white outline-none placeholder:text-white/80"
              />
            </div>

            <button
              type="submit"
              aria-label="Search jobs"
              className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#5c53fe] text-white transition-colors hover:bg-[#4a42e6]"
            >
              <Search className="size-6" />
            </button>
          </form>

          {/* Trending */}
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <span className={cn("text-base text-white/70", manrope.className)}>
              Trending Position
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {trendingRoles.map((role) => (
                <Link
                  key={role}
                  href={`/jobs?q=${encodeURIComponent(role)}`}
                  className="rounded-full border border-white/10 bg-[#1a1a1b] px-3 py-1.5 text-sm text-white transition-colors hover:border-white/25"
                >
                  {role}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="pt-40 pb-18 sm:pt-[428px]">
          <h2
            className={cn(
              "mx-auto max-w-[600px] text-center text-3xl font-medium text-white sm:text-[40px] sm:leading-[1.3]",
              instrumentSans.className
            )}
          >
            Assisting over 15,000 job seekers find their dream positions.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex min-h-[254px] flex-col items-start justify-between rounded-2xl border border-white/10 bg-gradient-to-t from-[#010102] to-[#313131] p-6"
              >
                <stat.icon className="size-6 text-white" strokeWidth={1.5} />
                <div>
                  <div
                    className={cn(
                      "text-5xl font-semibold text-white lg:text-[56px] lg:leading-[1.15]",
                      plusJakartaSans.className
                    )}
                  >
                    {stat.value}
                  </div>
                  <div
                    className={cn(
                      "mt-4 text-lg text-white",
                      interTight.className
                    )}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
