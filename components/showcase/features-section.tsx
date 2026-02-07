import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Webhook, Type, Puzzle } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "OAuth Made Simple",
    description:
      "Pre-built authentication components handle the entire OAuth 2.0 flow with GoHighLevel. Just add your credentials and connect.",
  },
  {
    icon: Webhook,
    title: "Secure Webhooks",
    description:
      "RSA-SHA256 signature verification out of the box. Handle 20+ webhook event types with type-safe handlers.",
  },
  {
    icon: Type,
    title: "Full TypeScript Support",
    description:
      "Comprehensive type definitions for all GHL entities: contacts, opportunities, calendars, conversations, and more.",
  },
  {
    icon: Puzzle,
    title: "shadcn/ui Pattern",
    description:
      "Components copy into your project for full customization. No npm packages to manage, just beautiful, accessible UI.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Why GHL Components?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Stop reinventing the wheel. Get production-ready components that work
          seamlessly with GoHighLevel.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {features.map((feature) => (
          <Card key={feature.title} className="border-0 shadow-none bg-muted/30">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <feature.icon className="size-5 text-primary" />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
