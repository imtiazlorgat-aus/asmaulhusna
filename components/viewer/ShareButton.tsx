"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const TITLE = "Asma-ul-Husna — The 99 Names of Allah";
const DESCRIPTION =
  "Read and reflect on the 99 Names of Allah in Arabic, with transliteration and translation in multiple languages.";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const getUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${TITLE}\n${DESCRIPTION}\n${getUrl()}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: TITLE, text: DESCRIPTION, url: getUrl() });
      } catch {
        await handleCopy();
      }
    } else {
      await handleCopy();
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleShare}
      aria-label="Share this page"
      title="Share"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
    </Button>
  );
}
