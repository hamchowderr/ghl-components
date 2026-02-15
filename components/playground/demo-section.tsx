"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface DemoSectionProps {
  title: string
  description: string
  category: string
  children: React.ReactNode
  className?: string
}

const categoryColors: Record<string, string> = {
  auth: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  contacts: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  calendars: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  opportunities: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  conversations: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20",
  server: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
}

export function DemoSection({
  title,
  description,
  category,
  children,
  className,
}: DemoSectionProps) {
  return (
    <section id={category} className={cn("space-y-4", className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Badge variant="outline" className={cn("text-xs", categoryColors[category])}>
            {category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-lg border bg-muted/30 p-6">{children}</div>
    </section>
  )
}
