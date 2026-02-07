"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InstallCommandProps {
  componentName: string;
  className?: string;
  variant?: "default" | "compact";
}

export function InstallCommand({
  componentName,
  className,
  variant = "default",
}: InstallCommandProps) {
  const [copied, setCopied] = React.useState(false);
  const command = `npx shadcn@latest add https://ghl-components.vercel.app/r/${componentName}.json`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md bg-muted px-3 py-2 font-mono text-xs",
          className
        )}
      >
        <code className="flex-1 truncate text-muted-foreground">{command}</code>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={copyToClipboard}
          className="shrink-0"
        >
          {copied ? (
            <Check className="size-3 text-green-500" />
          ) : (
            <Copy className="size-3" />
          )}
          <span className="sr-only">Copy install command</span>
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 rounded-lg bg-muted/50 border px-4 py-3",
        className
      )}
    >
      <code className="flex-1 truncate font-mono text-sm">{command}</code>
      <Button
        variant="ghost"
        size="sm"
        onClick={copyToClipboard}
        className="shrink-0 gap-1.5"
      >
        {copied ? (
          <>
            <Check className="size-4 text-green-500" />
            <span className="text-green-500">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="size-4" />
            <span>Copy</span>
          </>
        )}
      </Button>
    </div>
  );
}
