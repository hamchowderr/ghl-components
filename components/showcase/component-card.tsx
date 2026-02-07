"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InstallCommand } from "./install-command";
import { type ComponentData } from "@/lib/showcase/mock-data";
import { cn } from "@/lib/utils";

interface ComponentCardProps {
  component: ComponentData;
  className?: string;
}

const categoryColors: Record<ComponentData["category"], string> = {
  auth: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  contacts:
    "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  calendars:
    "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  server:
    "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
};

const categoryLabels: Record<ComponentData["category"], string> = {
  auth: "Authentication",
  contacts: "Contacts",
  calendars: "Calendars",
  server: "Server",
};

export function ComponentCard({ component, className }: ComponentCardProps) {
  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">
            {component.title}
          </CardTitle>
          <Badge
            variant="outline"
            className={cn("shrink-0 text-xs", categoryColors[component.category])}
          >
            {categoryLabels[component.category]}
          </Badge>
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {component.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-0">
        <InstallCommand componentName={component.name} variant="compact" />
      </CardContent>
    </Card>
  );
}
