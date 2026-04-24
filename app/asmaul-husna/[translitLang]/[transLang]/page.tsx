import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Settings as SettingsIcon } from "lucide-react";
import {
  getActiveLanguages,
  getLanguagePairs,
  getNamesWithTranslations,
} from "@/lib/db/queries";
import { NameGrid } from "@/components/viewer/NameGrid";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ShareButton } from "@/components/viewer/ShareButton";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ translitLang: string; transLang: string }>;
}

export async function generateStaticParams() {
  return getLanguagePairs();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { translitLang, transLang } = await params;
  const langs = await getActiveLanguages();
  const translit = langs.find((l) => l.code === translitLang);
  const trans = langs.find((l) => l.code === transLang);

  if (!translit || !trans) {
    return { title: "Asma-ul-Husna" };
  }

  const title = "The 99 Names and Attributes of Allah (SWT)";
  const description = `Read and reflect on the 99 Names of Allah in Arabic, with ${translit.name} transliteration and ${trans.name} translation.`;
  const url = `/asmaul-husna/${translitLang}/${transLang}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default async function ViewerPage({ params }: PageProps) {
  const { translitLang, transLang } = await params;

  const langs = await getActiveLanguages();
  const translit = langs.find((l) => l.code === translitLang);
  const trans = langs.find((l) => l.code === transLang);

  if (!translit || !trans) {
    notFound();
  }

  const names = await getNamesWithTranslations(translitLang, transLang);

  return (
    <main className="container mx-auto p-6">
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Asma-ul-Husna</h1>
          <h2 className="text-xl font-semibold text-gray-400">
            The 99 Names and Attributes of Allah (SWT)
          </h2>
          <div className="flex items-center gap-2">
            <ShareButton />
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link href="/asmaul-husna/settings">
                <SettingsIcon className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
        <div className="italic text-gray-500 text-center">
          And to Allah belong the best names, so invoke Him by them.{" "}
          <span className="text-xs">[Quran | Surah Al-A&apos;raf | 7:180]</span>
        </div>
      </div>
      <NameGrid
        names={names}
        transliterationDirection={translit.direction}
        translationDirection={trans.direction}
      />
    </main>
  );
}
