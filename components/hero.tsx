import Image from "next/image"
import { Button } from "@/components/ui/button"
import logo from "@/public/logo.png"

export function Hero() {
  return (
    <section className="relative border-b border-border bg-background px-6 py-24 md:py-32 snap-start">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col-reverse gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl text-center lg:text-left">
            <h1 className="text-balance font-sans text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
              Platform features for Docker Compose
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              A Docker plugin that adds platform features like GitOps, automatic routing with TLS, external secrets, cronjobs, backups, and self-healing/auto-scaling to Docker Compose.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
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
          </div>
          <div className="flex justify-center lg:block">
            <Image
              src={logo}
              alt="doklab"
              width={500}
              height={500}
              className="rounded-2xl w-48 h-48 lg:w-[500px] lg:h-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
