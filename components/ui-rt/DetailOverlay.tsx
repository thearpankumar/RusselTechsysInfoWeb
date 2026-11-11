"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { IconButton } from "./IconButton";
import { cn } from "@/lib/utils";

export interface DetailOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Small kicker above the title (label-caps). */
  eyebrow?: React.ReactNode;
  /** Entity title (headline-xl). */
  title: React.ReactNode;
  /** One-line description under the title (body-lg, body). Also the accessible description. */
  description?: React.ReactNode;
  /** Counter "02 / 07" — 0-based index. */
  index?: number;
  total?: number;
  /** Prev/next handlers; buttons (and ←/→ keys) appear when provided. */
  onPrev?: () => void;
  onNext?: () => void;
  /** Width: md = 3xl (default), lg = 5xl for tables/template views. */
  size?: "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}


/** Detail overlay ("everything is a door"): modal on background, rounded.xl, 48px padding, counter + prev/next/close. */
export function DetailOverlay({ open, onOpenChange, eyebrow, title, description, onPrev, onNext, size = "md", className, children }: DetailOverlayProps) {
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" && onPrev) {
      e.preventDefault();
      onPrev();
    } else if (e.key === "ArrowRight" && onNext) {
      e.preventDefault();
      onNext();
    }
    // Keep ←/→ and "/" from reaching the page-level chapter navigation.
    e.stopPropagation();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onKeyDown={onKeyDown}
        className={cn(size === "lg" ? "sm:max-w-5xl" : "sm:max-w-3xl", "gap-0", className)}
      >
        <div className="mb-8 flex items-center justify-end gap-2">
          {onPrev && <IconButton label="Previous" icon={<ChevronLeft />} onClick={onPrev} />}
          {onNext && <IconButton label="Next" icon={<ChevronRight />} onClick={onNext} />}
          <DialogClose asChild>
            <IconButton label="Close" icon={<X />} />
          </DialogClose>
        </div>
        {eyebrow && <p className="mb-3 t-label-caps text-muted">{eyebrow}</p>}
        <DialogTitle className="t-headline-xl text-on-surface">{title}</DialogTitle>
        {description ? (
          <DialogDescription className="mt-4 t-body-lg text-body">{description}</DialogDescription>
        ) : (
          <DialogPrimitive.Description className="sr-only">Details</DialogPrimitive.Description>
        )}
        {children && <div className="mt-8">{children}</div>}
      </DialogContent>
    </Dialog>
  );
}
