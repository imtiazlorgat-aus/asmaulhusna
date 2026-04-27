"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useSettings } from "@/lib/store/settings-store";

export function WelcomeToast() {
  const hasSeenWelcome = useSettings((s) => s.hasSeenWelcome);
  const hasHydrated = useSettings((s) => s.hasHydrated);
  const update = useSettings((s) => s.update);

  useEffect(() => {
    if (!hasHydrated || hasSeenWelcome) return;
    toast("Welcome to Asma-ul-Husna", {
      description:
        "Swipe right/left to browse pages. Swipe controls, language and display settings can be changed under Settings.",
      duration: 8000,
    });
    update({ hasSeenWelcome: true });
  }, [hasHydrated, hasSeenWelcome, update]);

  return null;
}
