"use client"

import {useEffect, useRef, useState} from "react"
import {highlight, Pre, HighlightedCode} from "codehike/code"
import {focus, tokenTransitions} from "./focus"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"

type Step = {
    title: string
    description: string
    tabs: {name: string; code: string}[]
}

// Parse description with [[tabname]] links
function parseDescription(description: string, onTabClick: (tab: string) => void) {
    const parts = description.split(/(\[\[[^\]]+\]\])/g)
    return parts.map((part, i) => {
        const match = part.match(/^\[\[([^\]]+)\]\]$/)
        if (match) {
            return (
                <button
                    key={i}
                    onClick={() => onTabClick(match[1])}
                    className="text-accent hover:text-accent/80 underline underline-offset-2 cursor-pointer"
                >
                    {match[1]}
                </button>
            )
        }
        return part
    })
}

const steps = [
    {
        title: "Start with a compose file",
        description:
            "You have a Docker Compose file. Nothing special — just a service, an image, maybe a build context.\n\nThis is where every homelab starts.",
        tabs: [{
            name: "compose.yaml",
            code: `# !focus(1:3)
services:
  api:
    image: my-golang-service:v1.0.0`,
        }],
    },
    {
        title: "Routing with automatic TLS",
        description:
            "Two labels. Your service gets a public HTTPS endpoint.\n\ndoklab configures Traefik as your reverse proxy, handles TLS certificate provisioning via Let's Encrypt, and routes traffic to your container.\n\nNo nginx configs. No certbot cron jobs. No manual certificate renewals.",
        tabs: [{
            name: "compose.yaml",
            code: `services:
  api:
    image: my-golang-service:v1.0.0
    labels:
      # !focus(1:2)
      doklab.route.host: api.yourdomain.tld
      doklab.route.containerPort: 8080`,
        }],
    },
    {
        title: "Secret management",
        description:
            "Passwords don't belong in git. But they need to get into containers somehow.\n\ndoklab resolves secrets at deploy time from SOPS, HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, 1Password, Doppler, and more.\n\nWorks with labels or [[.env]] files — your compose stays compatible with local dev.",
        tabs: [
            {
                name: "compose.yaml",
                code: `services:
  db:
    image: postgres:16
    # !focus(1:2)
    environment:
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    labels:
      # !focus(1:3)
      # decrypted and injected at deploy time
      doklab.secret.env.POSTGRES_PASSWORD: |
        ref+sops://secrets.yaml#/db/password`,
            },
            {
                name: ".env",
                code: `# !focus(1:4)
# .env file with secret references
# doklab expands these before docker compose runs
POSTGRES_PASSWORD=ref+sops://secrets.yaml#/db/password
API_KEY=ref+vault://secret/api#key`,
            },
        ],
    },
    {
        title: "Secrets as mounted files",
        description:
            "Some apps need certificates or config files, not environment variables.\n\ndoklab mounts secrets as files with optional base64 decoding. Same provider support, different delivery method.\n\nThis also works for .env files — resolve secrets into a mounted .env and your app reads them naturally.",
        tabs: [{
            name: "compose.yaml",
            code: `services:
  api:
    image: my-golang-service:v1.0.0
    labels:
      # !focus(1:4)
      doklab.secret.file.tls-cert: |
        ref+sops://secrets.yaml#/tls/cert
      doklab.secret.file.tls-cert.mountPath: /etc/ssl/cert.pem
      doklab.secret.file.tls-cert.decodeFrom: base64`,
        }],
    },
    {
        title: "Scale to zero",
        description:
            "Why run containers that nobody's using?\n\nSet an idle timeout. After 15 minutes of no traffic, the container stops. The first request wakes it up — typically in under a second.\n\nSave resources. Save power. Save money.",
        tabs: [{
            name: "compose.yaml",
            code: `services:
  api:
    image: my-golang-service:v1.0.0
    labels:
      doklab.route.host: api
      # !focus(1:2)
      # scales down after 15min idle, wakes on request
      doklab.lifecycle.idle: 15m`,
        }],
    },
    {
        title: "Autoheal unhealthy containers",
        description:
            "Have you tried turning it off and on again?\n\nDocker Compose has no native mechanism to restart unhealthy containers — it only restarts crashed ones.\n\ndoklab monitors health checks and automatically restarts containers that fail them.",
        tabs: [{
            name: "compose.yaml",
            code: `services:
  api:
    image: my-golang-service:v1.0.0
    # !focus(1:3)
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
    labels:
      # !focus(1:2)
      # restarts container when healthcheck fails
      doklab.lifecycle.autoheal: "true"`,
        }],
    },
    {
        title: "Simple volume backups",
        description:
            "Volumes are precious. Losing them hurts.\n\nNautical watches your containers and snapshots volumes on schedule. One label enables it.\n\nBackups are stored locally or pushed to remote storage via Kopia.",
        tabs: [{
            name: "compose.yaml",
            code: `services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
    labels:
      # !focus(1:3)
      # stops container, snapshots volume, restarts
      doklab.backup.enable: "true"
      doklab.backup.stop-before: "true"

volumes:
  pgdata:`,
        }],
    },
    {
        title: "Custom backup commands",
        description:
            "Sometimes you need more than a volume snapshot.\n\nRun pg_dump before backup. Export application state. Execute any pre-backup command you need.\n\nThe command runs inside the container, then the volume gets snapshotted.",
        tabs: [{
            name: "compose.yaml",
            code: `services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
    labels:
      doklab.backup.enable: "true"
      # !focus(1:2)
      doklab.backup.exec.pre: |
        pg_dump -U postgres mydb > /var/lib/postgresql/data/backup.sql

volumes:
  pgdata:`,
        }],
    },
    {
        title: "Backup groups",
        description:
            "Multiple services that need consistent backups?\n\nGroup them. They stop together, backup together, and restart together.\n\nNo partial snapshots. No data inconsistencies between your app and database.",
        tabs: [{
            name: "compose.yaml",
            code: `services:
  api:
    image: my-golang-service:v1.0.0
    volumes:
      - uploads:/app/uploads
    labels:
      # !focus
      doklab.backup.group: myapp

  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
    labels:
      doklab.backup.enable: "true"
      # !focus
      doklab.backup.group: myapp

volumes:
  pgdata:
  uploads:`,
        }],
    },
    {
        title: "See what you don't see",
        description:
            "Look at the compose file. Notice what's missing?\n\nNo exposed ports. No 8080:8080 bindings cluttering your server.\n\nNo plaintext passwords in environment variables. No secrets.env files committed to git.\n\nYour attack surface stays minimal. Your secrets stay secret.",
        tabs: [{
            name: "compose.yaml",
            code: `services:
  api:
    image: my-golang-service:v1.0.0
    # !focus(1:2)
    # no ports: — routed through traefik
    # no env: — secrets injected at deploy time
    labels:
      doklab.route.host: api

  db:
    image: postgres:16
    # !focus(1:4)
    # no ports: — only reachable from api
    # no environment:
    #   POSTGRES_PASSWORD: "plaintext-password-123"
    # no volumes:
    #   - ./secrets.env:/run/secrets/db.env
    labels:
      doklab.secret.env.POSTGRES_PASSWORD: |
        ref+sops://secrets.yaml#/db/password`,
        }],
    },
    {
        title: "Still just a compose file",
        description:
            "Look at it. It's still Docker Compose.\n\nNo new DSL to learn. No migration required. Your existing knowledge transfers directly.\n\nBut now it has routing, secrets, backups, autoheal, and scale-to-zero.\n\nPlatform features. Compose simplicity.",
        tabs: [{
            name: "compose.yaml",
            code: `services:
  api:
    image: my-golang-service:v1.0.0
    labels:
      doklab.route.host: api
      doklab.lifecycle.idle: 15m
      doklab.lifecycle.autoheal: "true"
      doklab.backup.group: myapp

  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
    labels:
      doklab.secret.env.POSTGRES_PASSWORD: |
        ref+sops://secrets.yaml#/db/password
      doklab.backup.enable: "true"
      doklab.backup.group: myapp

volumes:
  pgdata:`,
        }],
    },
]

export function ComposeScrollycoding() {
    const [activeStep, setActiveStep] = useState(0)
    const stepsRef = useRef<(HTMLDivElement | null)[]>([])
    const [highlightedTabs, setHighlightedTabs] = useState<{name: string; code: HighlightedCode}[] | null>(null)
    const [activeTab, setActiveTab] = useState<string>("")

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
            const step = steps[activeStep]
            const highlighted = await Promise.all(
                step.tabs.map(async (tab) => ({
                    name: tab.name,
                    code: await highlight(
                        {value: tab.code, lang: tab.name.endsWith('.env') ? 'bash' : 'yaml', meta: ""},
                        "dracula",
                    ),
                }))
            )
            setHighlightedTabs(highlighted)
            setActiveTab(highlighted[0]?.name || "")
        }

        updateCode()
    }, [activeStep])

    return (
        <section className="relative py-24 hidden lg:block">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* Content side - scrolls with snap */}
                    <div className="space-y-[60vh] lg:col-span-1">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                ref={(el) => {
                                    stepsRef.current[index] = el
                                }}
                                className="min-h-[40vh] snap-start snap-always scroll-mt-8"
                            >
                                <div className="lg:sticky lg:top-32">
                                    <h2 className="text-2xl font-semibold text-foreground mb-4">{step.title}</h2>
                                    <div className="text-[15px] text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {parseDescription(step.description, setActiveTab)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Code side - sticky */}
                    <div className="lg:sticky lg:top-32 lg:self-start h-fit lg:col-span-2">
                        <div className="rounded-lg border border-border bg-card overflow-hidden">
                            {highlightedTabs && (
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <div className="bg-muted/50 px-4 py-2 border-b border-border flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"/>
                                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"/>
                                            <div className="w-3 h-3 rounded-full bg-[#27c93f]"/>
                                        </div>
                                        <TabsList className="ml-2 bg-transparent h-auto p-0 gap-0">
                                            {highlightedTabs.map((tab) => (
                                                <TabsTrigger
                                                    key={tab.name}
                                                    value={tab.name}
                                                    className="text-xs text-muted-foreground font-mono px-3 py-1 rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-foreground data-[state=active]:bg-transparent"
                                                >
                                                    {tab.name}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                    </div>
                                    {highlightedTabs.map((tab) => (
                                        <TabsContent key={tab.name} value={tab.name} className="m-0">
                                            <Pre
                                                code={tab.code}
                                                className="m-0 p-6 bg-transparent text-sm overflow-x-auto max-h-[600px]"
                                                handlers={[focus, tokenTransitions]}
                                            />
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
