import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">© 2025 doklab</p>
        <div className="flex gap-6">
          <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Documentation
          </Link>
        </div>
      </div>
    </footer>
  )
}
