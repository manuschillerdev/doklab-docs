import { Button } from "@/components/ui/button"
import { Terminal } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold text-foreground mb-4">Ready to level up your homelab?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Install doklab in seconds and start adding platform features to your Docker Compose apps.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="border-border bg-transparent text-foreground hover:bg-muted">
            Read the Docs
          </Button>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-card">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <code className="font-mono text-sm text-foreground">curl -sSL https://get.doklab.sh | sh</code>
        </div>
      </div>
    </section>
  )
}
