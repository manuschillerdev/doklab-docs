"use client"

import { useEffect, useState } from "react"
import { highlight, Pre, HighlightedCode } from "codehike/code"

const exampleCode = `services:
  api:
    image: my-service:1.0.0
    labels:
      # automatic ingress route configuration
      doklab.route.host: my-service.domain.tld
      doklab.route.containerPort: 8080

      # secrets from external providers
      doklab.secret.env.API_KEY: |
        ref+sops://secrets.yaml#/api/key

      # self-healing & scaling
      doklab.lifecycle.autoheal: "true"
      doklab.lifecycle.idle: 15m

      # backups
      doklab.backup.enable: "true"`

export function ExampleMobile() {
  const [highlighted, setHighlighted] = useState<HighlightedCode | null>(null)

  useEffect(() => {
    highlight(
      { value: exampleCode, lang: "yaml", meta: "" },
      "dracula"
    ).then(setHighlighted)
  }, [])

  return (
    <section className="py-12 px-6 lg:hidden">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-xl font-semibold text-foreground mb-2 text-center">
          Opt-in, no crappy browser UI
        </h2>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Fully versionable and compose compatible
        </p>
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="bg-muted/50 px-4 py-2 border-b border-border flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-xs text-muted-foreground font-mono ml-2">compose.yaml</span>
          </div>
          {highlighted && (
            <Pre
              code={highlighted}
              className="m-0 p-4 bg-transparent text-xs overflow-x-auto"
            />
          )}
        </div>
      </div>
    </section>
  )
}
