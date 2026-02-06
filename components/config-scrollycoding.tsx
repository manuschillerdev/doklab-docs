"use client"

import { useEffect, useRef, useState } from "react"
import { highlight, Pre } from "codehike/code"
import { focus, tokenTransitions } from "./focus"

const steps = [
  {
    title: "Define your domain",
    description:
      "Start with your base domain. doklab uses this for routing all your services.\n\nPick your network mode: Tailscale for private mesh networking, or Traefik with Cloudflare for public access.",
    code: `domain: "homelab.example.com"

# !focus(1:5)
# private access via tailscale mesh
network:
  mode: tailscale
tailscale:
  hostname: "homelab"

# !focus(1:6)
# public access via traefik + cloudflare
network:
  mode: traefik
traefik:
  acme_email: "admin@example.com"
  cloudflare_api_token: "ref+sops://secrets.yaml#/cloudflare/token"`,
  },
  {
    title: "Add projects",
    description:
      "Point doklab at a git repo or local path. Git repos are cloned, pulled, and deployed automatically.\n\nSSH, HTTPS, or local filesystem — your choice.",
    code: `projects:
  # !focus(1:4)
  # git via ssh
  blog:
    source: "git@github.com:user/ghost-blog.git"
    branch: "main"
    compose_path: "docker-compose.yml"

  # !focus(1:4)
  # git via https
  api:
    source: "https://github.com/user/api-service"
    branch: "main"
    compose_path: "docker-compose.yml"

  # !focus(1:3)
  # local filesystem
  monitoring:
    source: "file:///home/user/monitoring"
    compose_path: "docker-compose.yml"`,
  },
  {
    title: "Auto-discover projects",
    description:
      "Use glob patterns to discover multiple compose files automatically. Each match becomes a separate project.\n\nThink ApplicationSets from ArgoCD, but for Docker Compose.",
    code: `projects:
  # !focus(1:4)
  # discovers apps/blog/*, apps/api/*, apps/web/*...
  apps:
    source: "https://github.com/user/monorepo"
    compose_path: "apps/*/docker-compose.yml"

  # !focus(1:3)
  # discovers monitoring/, backups/, media/...
  services:
    source: "file:///home/user/services"
    compose_path: "*/docker-compose.yml"`,
  },
  {
    title: "Layer compose overlays",
    description:
      "Different environments need different configs.\n\nOverlays merge on top of your base compose file. Perfect for production tweaks, resource limits, or environment-specific settings.",
    code: `domain: "homelab.example.com"

network:
  mode: tailscale

tailscale:
  hostname: "homelab"

projects:
  blog:
    source: "https://github.com/user/ghost-blog"
    branch: "main"
    compose_path: "docker-compose.yml"

  services:
    source: "file:///home/user/services"
    compose_path: "*/docker-compose.yml"
    # !focus(1:3)
    overlays:
      - "docker-compose.prod.yml"
      - "docker-compose.local.yml"`,
  },
  {
    title: "Route external services",
    description:
      "Not everything runs in Docker. Legacy apps, VMs, other machines — they need routing too.\n\nDefine external routes to proxy traffic to any HTTP endpoint. TLS termination included.",
    code: `# !focus(1:12)
routes:
  homeassistant:
    target: "http://192.168.1.50:8123"

  proxmox:
    target: "https://192.168.1.10:8006"
    tls_skip_verify: true

  # exposes as nas.homelab.example.com
  nas:
    target: "http://192.168.1.20:5000"`,
  },
  {
    title: "Schedule infrastructure jobs",
    description:
      "Backups, cleanups, health checks — things that need to run on a schedule.\n\nThree job types: run spawns a container, exec runs in an existing container, local runs on the host.",
    code: `jobs:
  # !focus(1:7)
  # run: spawns a new container
  backup:
    type: run
    schedule: "0 2 * * *"
    image: "restic/restic:latest"
    command: "backup /data"
    volumes:
      - "/var/doklab:/data"

  # !focus(1:5)
  # exec: runs command in existing container
  db-vacuum:
    type: exec
    schedule: "0 3 * * 0"
    container: "postgres-db"
    command: "vacuumdb --all"

  # !focus(1:4)
  # local: runs directly on the host
  cleanup:
    type: local
    schedule: "0 4 * * *"
    command: "docker system prune -f"`,
  },
  {
    title: "Software Composition and Vulnerability Scanning included",
    description:
      "Know exactly what's running on your machine. Every dependency. Every version. Every risk.\n\ndoklab runs Trivy on schedule, generating SBOMs and CVE reports. Your homelab, audited automatically.",
    code: `domain: "homelab.example.com"

network:
  mode: tailscale

tailscale:
  hostname: "homelab"

projects:
  blog:
    source: "https://github.com/user/ghost-blog"
    branch: "main"
    compose_path: "docker-compose.yml"

  services:
    source: "file:///home/user/services"
    compose_path: "*/docker-compose.yml"
    overlays:
      - "docker-compose.prod.yml"
      - "docker-compose.local.yml"

routes:
  homeassistant:
    target: "http://192.168.1.50:8123"
    tls_skip_verify: false

jobs:
  backup:
    type: run
    schedule: "0 2 * * *"
    image: "restic/restic:latest"
    command: "backup /data"
    volumes:
      - "/var/doklab:/data"

# !focus(1:2)
scanner:
  schedule: "0 0 * * *"`,
  },
  {
    title: "Your homelab, configured",
    description:
      "One YAML file. Multiple projects, routes, jobs, and automation.\n\nNo dashboards to click through. No state to manage. Just config in git, deployed on push.\n\nGitOps for homelabs. Finally.",
    code: `domain: "homelab.example.com"

network:
  mode: tailscale

tailscale:
  hostname: "homelab"

projects:
  blog:
    source: "https://github.com/user/ghost-blog"
    branch: "main"
    compose_path: "docker-compose.yml"

  services:
    source: "file:///home/user/services"
    compose_path: "*/docker-compose.yml"
    overlays:
      - "docker-compose.prod.yml"
      - "docker-compose.local.yml"

routes:
  homeassistant:
    target: "http://192.168.1.50:8123"
    tls_skip_verify: false

jobs:
  backup:
    type: run
    schedule: "0 2 * * *"
    image: "restic/restic:latest"
    command: "backup /data"
    volumes:
      - "/var/doklab:/data"

scanner:
  schedule: "0 0 * * *"`,
  },
]

export function ConfigScrollycoding() {
  const [activeStep, setActiveStep] = useState(0)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])
  const [highlightedCode, setHighlightedCode] = useState<any>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = stepsRef.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setActiveStep(index)
            }
          }
        })
      },
      {
        threshold: 0.5,
        rootMargin: "-20% 0px -20% 0px",
      },
    )

    stepsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    async function updateCode() {
      const code = await highlight(
        { value: steps[activeStep].code, lang: "yaml", meta: "" },
        "dracula",
      )
      setHighlightedCode(code)
    }
    updateCode()
  }, [activeStep])

  return (
    <section className="relative py-24 bg-muted/20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Content side - scrolls with snap */}
          <div className="space-y-[40vh] lg:col-span-1 lg:order-2">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => {
                  stepsRef.current[index] = el
                }}
                className="min-h-[40vh] flex flex-col justify-start pt-32 snap-start snap-always scroll-mt-8"
              >
                <h2 className="text-2xl font-semibold text-foreground mb-4">{step.title}</h2>
                <div className="text-[15px] text-muted-foreground leading-relaxed whitespace-pre-line">
                  {step.description}
                </div>
              </div>
            ))}
          </div>

          {/* Code side - sticky */}
          <div className="lg:sticky lg:top-32 lg:self-start h-fit lg:col-span-2 lg:order-1">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 border-b border-border flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-xs text-muted-foreground font-mono ml-2">config.yaml</span>
              </div>
              {highlightedCode && (
                <Pre
                  code={highlightedCode}
                  className="m-0 p-6 bg-transparent text-sm overflow-x-auto max-h-[600px]"
                  handlers={[focus, tokenTransitions]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
