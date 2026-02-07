"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComponentCard } from "./component-card";
import { componentRegistry, type ComponentData } from "@/lib/showcase/mock-data";
import { KeyRound, Users, Calendar, Server } from "lucide-react";

const categories: {
  value: ComponentData["category"] | "all";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "all", label: "All", icon: Server },
  { value: "auth", label: "Auth", icon: KeyRound },
  { value: "contacts", label: "Contacts", icon: Users },
  { value: "calendars", label: "Calendars", icon: Calendar },
  { value: "server", label: "Server", icon: Server },
];

export function ComponentGrid() {
  const [activeTab, setActiveTab] = React.useState<string>("all");

  const filteredComponents = React.useMemo(() => {
    if (activeTab === "all") {
      return componentRegistry;
    }
    return componentRegistry.filter(
      (component) => component.category === activeTab
    );
  }, [activeTab]);

  const getCategoryCount = (category: ComponentData["category"] | "all") => {
    if (category === "all") {
      return componentRegistry.length;
    }
    return componentRegistry.filter((c) => c.category === category).length;
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="h-auto flex-wrap gap-1 p-1">
            {categories.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="gap-1.5 px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon className="size-4" />
                <span>{label}</span>
                <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium">
                  {getCategoryCount(value)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredComponents.map((component) => (
              <ComponentCard key={component.name} component={component} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
