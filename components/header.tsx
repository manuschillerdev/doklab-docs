import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-mono text-lg font-bold text-foreground">doklab</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/docs" className="hidden md:block text-sm text-muted-foreground hover:text-foreground transition-colors">
            Documentation
          </Link>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link
              href="https://github.com/manuschillerdev/doklab"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
