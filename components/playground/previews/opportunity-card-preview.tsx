"use client"

import * as React from "react"
import { MoreVertical, DollarSign, User, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Opportunity {
  id: string
  name: string
  status: "open" | "won" | "lost" | "abandoned"
  monetaryValue?: number
  contactId: string
  dateAdded: string
  dateUpdated: string
  [key: string]: unknown
}

interface OpportunityCardPreviewProps {
  opportunity: Opportunity
  stageName?: string
  contactName?: string
  className?: string
}

const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; icon: React.ReactNode }> = {
  open: { variant: "default", label: "Open", icon: <TrendingUp className="h-3 w-3" /> },
  won: { variant: "secondary", label: "Won", icon: <TrendingUp className="h-3 w-3" /> },
  lost: { variant: "destructive", label: "Lost", icon: <TrendingDown className="h-3 w-3" /> },
  abandoned: { variant: "outline", label: "Abandoned", icon: <Minus className="h-3 w-3" /> },
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function OpportunityCardPreview({
  opportunity,
  stageName,
  contactName,
  className,
}: OpportunityCardPreviewProps) {
  const status = statusConfig[opportunity.status] || statusConfig.open

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1 min-w-0">
          <CardTitle className="text-base font-semibold truncate">
            {opportunity.name}
          </CardTitle>
          {stageName && (
            <CardDescription className="text-xs">{stageName}</CardDescription>
          )}
        </div>
        <div className="flex items-center gap-2 ml-2">
          <Badge variant={status.variant} className="gap-1 text-xs shrink-0">
            {status.icon}
            {status.label}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Move Stage</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {opportunity.monetaryValue !== undefined && opportunity.monetaryValue > 0 && (
          <div className="flex items-center gap-1.5 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{formatCurrency(opportunity.monetaryValue)}</span>
          </div>
        )}
        {contactName && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{contactName}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
