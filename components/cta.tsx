import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CTA() {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold text-foreground mb-4">Ready to level up your homelab?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join the waitlist to get early access when we launch.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto mb-4">
          <Input
            type="email"
            placeholder="Enter your email"
            className="bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 whitespace-nowrap">
            Join Waitlist
          </Button>
        </div>
        <Button
          variant="link"
          className="text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/docs">Or read the documentation</Link>
        </Button>
      </div>
    </section>
  )
}
