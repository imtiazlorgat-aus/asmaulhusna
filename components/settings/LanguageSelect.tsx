"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LanguageRow } from "@/lib/db/types";

interface LanguageSelectProps {
  id: string;
  // label: string;
  value: string;
  languages: LanguageRow[];
  onChange: (code: string) => void;
  /**
   * If true, excludes Arabic from the options (transliterating Arabic
   * to Arabic doesn't make sense).
   */
  excludeArabic?: boolean;
}

export function LanguageSelect({
  id,
  value,
  languages,
  onChange,
  excludeArabic,
}: LanguageSelectProps) {
  const options = excludeArabic
    ? languages.filter((l) => l.code !== "ar")
    : languages;

  return (
    <div className="flex flex-col gap-2">
      {/* <Label htmlFor={id}>{label}</Label> */}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
