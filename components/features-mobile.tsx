import { Shield, Globe, Database, Clock, Heart, FolderSync } from "lucide-react"

const features = [
  {
    icon: Globe,
    title: "Routing with automatic TLS",
    description: "Two labels. Your service gets a public HTTPS endpoint with automatic certificate provisioning.",
  },
  {
    icon: Shield,
    title: "Secrets management",
    description: "Resolve secrets at deploy time from SOPS, Vault, AWS, GCP, Azure, 1Password, and more.",
  },
  {
    icon: Clock,
    title: "Scale to zero",
    description: "Containers stop after idle timeout. First request wakes them up in under a second.",
  },
  {
    icon: Heart,
    title: "Autoheal",
    description: "Automatically restart containers that fail health checks. No more manual intervention.",
  },
  {
    icon: Database,
    title: "Simple backups",
    description: "One label enables volume snapshots. Local or remote storage via Kopia.",
  },
  {
    icon: FolderSync,
    title: "GitOps deployment",
    description: "Point at a git repo. It gets cloned, pulled, and deployed automatically.",
  },
]

export function FeaturesMobile() {
  return (
    <section className="py-16 px-6 lg:hidden">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
          Platform features, compose simplicity
        </h2>
        <div className="grid gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-5 rounded-lg border border-border bg-card"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-md bg-accent/10">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
