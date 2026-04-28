"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LanguageRow } from "@/lib/db/types";
import Image from "next/image";

interface LanguageSelectProps {
  id: string;
  value: string;
  languages: LanguageRow[];
  onChange: (code: string) => void;
  /**
   * If true, excludes Arabic from the options (transliterating Arabic
   * to Arabic doesn't make sense).
   */
  excludeArabic?: boolean;
}

function LanguageOption({ lang }: { lang: LanguageRow }) {
  return (
    <span className="flex items-center gap-2">
      {lang.countrycode && (
        <Image
          src={`/flags/${lang.countrycode}.svg`}
          alt={lang.name}
          width={20}
          height={15}
          className="object-cover"
        />
      )}
      {lang.name}
    </span>
  );
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

  const selected = options.find((l) => l.code === value);

  return (
    <div className="flex flex-col gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id}>
          {selected ? <LanguageOption lang={selected} /> : <SelectValue />}
        </SelectTrigger>
        <SelectContent position="popper">
          {options.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <LanguageOption lang={lang} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
