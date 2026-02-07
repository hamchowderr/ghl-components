import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InstallCommand } from "./install-command";
import { Github, ExternalLink } from "lucide-react";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center text-center py-16 px-4">
      <Badge variant="secondary" className="mb-4">
        Open Source Component Registry
      </Badge>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-3xl">
        GHL Components
      </h1>

      <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
        A shadcn/ui component registry for{" "}
        <span className="font-semibold text-foreground">GoHighLevel</span>{" "}
        integrations. Build GHL-connected applications without wrestling with
        OAuth flows, webhook signatures, and API complexity.
      </p>

      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <Button asChild size="lg">
          <a href="#components">
            Browse Components
            <ExternalLink className="size-4" />
          </a>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <a
            href="https://github.com/your-org/ghl-components"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="size-4" />
            GitHub
          </a>
        </Button>
      </div>

      <div className="w-full max-w-2xl">
        <p className="text-sm text-muted-foreground mb-3">
          Get started with a single command:
        </p>
        <InstallCommand componentName="ghl-provider" />
      </div>
    </section>
  );
}
