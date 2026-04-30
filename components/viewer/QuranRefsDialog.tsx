"use client";

import { useState } from "react";
import { Dialog } from "radix-ui";
import { X, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuranRefRow } from "@/lib/db/types";

/** Extracts verse references from bracket notation, e.g. "[2:255,3:18]" → ["2:255","3:18"] */
function parseQrefs(qref: string | null): string[] {
  if (!qref) return [];
  const matches = qref.match(/\[([^\]]+)\]/g) ?? [];
  return matches.flatMap((m) =>
    m
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

/** Converts "2:255" → "https://quran.com/2/255" */
function quranComUrl(ref: string): string {
  const [surah, ayah] = ref.split(":");
  return `https://quran.com/${surah}/${ayah ?? ""}`.replace(/\/$/, "");
}

interface QuranRefsDialogProps {
  quranRef: QuranRefRow;
}

export function QuranRefsDialog({ quranRef }: QuranRefsDialogProps) {
  const [open, setOpen] = useState(false);
  const refs = parseQrefs(quranRef.qref);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          title="Quran links and more..."
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "inline-flex items-center gap-1 rounded-md border-input px-2 py-0.5",
            "text-xs text-muted-foreground transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          aria-label="Show Quran references"
        >
          <BookOpen className="h-3 w-3" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-xl bg-card p-6 shadow-lg ring-1 ring-foreground/10",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="text-lg font-semibold">
              {quranRef.transliteration}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                  "text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {quranRef.details && (
            <Dialog.Description className="mt-3 text-sm italic text-muted-foreground leading-relaxed">
              {quranRef.details}
            </Dialog.Description>
          )}

          {refs.length > 0 && (
            <div className="mt-4">
              <p className="text-primary font-semibold text-muted-foreground  tracking-wide mb-2">
                Quran References
              </p>
              <ul className="space-y-1.5 pl-4">
                {refs.map((ref) => (
                  <li key={ref} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <a
                      href={quranComUrl(ref)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Quran {ref}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {refs.length === 0 && !quranRef.details && (
            <p className="mt-3 text-sm text-muted-foreground">
              No references available.
            </p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
