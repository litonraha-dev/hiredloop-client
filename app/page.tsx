import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"

export default function Page() {
  return (
    <div className="min-h-svh bg-[#010103]">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  )
}
