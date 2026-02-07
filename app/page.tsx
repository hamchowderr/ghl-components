import { HeroSection } from "@/components/showcase/hero-section";
import { FeaturesSection } from "@/components/showcase/features-section";
import { ComponentGrid } from "@/components/showcase/component-grid";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <HeroSection />

        <FeaturesSection />

        <section id="components" className="py-16 px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Components</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our library of GHL-ready components. Each component can be
              installed with a single command and customized to match your design.
            </p>
          </div>

          <ComponentGrid />
        </section>

        <footer className="border-t py-8 px-4 text-center text-sm text-muted-foreground">
          <p>
            Built for the GoHighLevel community.{" "}
            <a
              href="https://github.com/your-org/ghl-components"
              className="underline underline-offset-4 hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
