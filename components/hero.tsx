import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Terminal } from "lucide-react"

export function Hero() {
  return (
    <section className="relative border-b border-border bg-background px-6 py-24 md:py-32 snap-start">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-balance font-sans text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
              Platform features for Docker Compose
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Add routing, secrets, backups, autoheal, scale-to-zero, and GitOps to your Docker Compose apps. No new DSL
              to learn. Just labels.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border bg-transparent text-foreground hover:bg-muted"
              >
                View Documentation
              </Button>
            </div>
            <div className="mt-8 rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Terminal className="h-4 w-4" />
                <span className="font-mono">curl -sSL https://get.doklab.sh | sh</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <Image
              src="/logo.png"
              alt="doklab"
              width={500}
              height={500}
              className="rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
