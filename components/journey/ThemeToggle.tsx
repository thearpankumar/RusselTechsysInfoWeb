"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui-rt/IconButton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { setTheme, useTheme, type Theme } from "@/lib/theme";

const focusRing = "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/** Light/dark switch; the choice persists per browser (see lib/theme.ts). */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const theme = useTheme();
  const next = theme === "light" ? "dark" : "light";
  const label = next === "light" ? "Light theme" : "Dark theme";
  const icon = next === "light" ? <Sun /> : <Moon />;
  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton label={`Switch to ${label.toLowerCase()}`} icon={icon} size="sm" variant="bare" onClick={() => setTheme(next)} />
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className={cn("inline-flex h-10 cursor-pointer items-center gap-3 rounded-full px-3 t-body-sm text-muted transition-colors duration-150 ease-out hover:bg-background hover:text-on-surface [&_svg]:size-4", focusRing)}
    >
      {icon}
      {label}
    </button>
  );
}

/** Labelled Dark | Light pair (passcode page): both options visible, current one filled. Same persisted setting as the rail toggle. */
export function ThemeSwitch({ className }: { className?: string }) {
  const theme = useTheme();
  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "dark", label: "Dark", icon: <Moon /> },
    { value: "light", label: "Light", icon: <Sun /> },
  ];
  return (
    <div role="group" aria-label="Theme" className={cn("inline-flex rounded-full border border-border bg-surface p-1", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={theme === o.value}
          onClick={() => setTheme(o.value)}
          className={cn(
            "inline-flex h-8 cursor-pointer items-center gap-2 rounded-full px-3 t-body-sm transition-colors duration-150 ease-out [&_svg]:size-4",
            focusRing,
            theme === o.value ? "bg-primary text-on-primary" : "text-muted hover:text-on-surface"
          )}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}
