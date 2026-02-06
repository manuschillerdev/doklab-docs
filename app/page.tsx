import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ComposeScrollycoding } from "@/components/compose-scrollycoding"
import { ConfigScrollycoding } from "@/components/config-scrollycoding"
import { FeaturesMobile } from "@/components/features-mobile"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen lg:h-screen overflow-y-auto bg-black dark lg:snap-y lg:snap-mandatory">
      <Header />
      <Hero />
      <FeaturesMobile />
      <ComposeScrollycoding />
      <div className="py-16 px-6 text-center border-y border-border hidden lg:block">
        <h2 className="text-2xl font-semibold text-foreground mb-3">One config to rule them all</h2>
        <p className="text-[15px] text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Your compose files define services. The doklab config defines how they're deployed, synced, and maintained.
        </p>
      </div>
      <ConfigScrollycoding />
      <CTA />
      <Footer />
    </main>
  )
}
