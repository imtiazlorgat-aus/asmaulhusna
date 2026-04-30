import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export const metadata: Metadata = {
  title: "About — Asmaul Husna",
  description:
    "About this website, the 99 Names of Allah, and acknowledgements.",
};

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild aria-label="Back">
            <Link href="/asmaul-husna">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">About</h1>
        </div>
        <ThemeToggle />
      </div>

      <div className="max-w-none space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Asmaul Husna</h2>
          <p className="text-foreground/90">
            <span className="font-uthmanic text-xl" dir="rtl" lang="ar">
              الأَسْمَاءُ الْحُسْنَى
            </span>
            &nbsp;— the Most Beautiful Names — are the <b>99 names of Allah</b>{" "}
            (SWT) mentioned in the Quran and the hadith. Muslims have
            traditionally recited, reflected upon, and studied these names as a
            means of drawing closer to Allah (SWT) and understanding His
            attributes.
          </p>
          <p className="text-foreground/90">
            This site offers a simple, focused interface for reading and
            listening to the names. There are no accounts, no tracking of
            activity, and no advertising. Your display preferences are stored
            only in your browser.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Source of the names</h2>
          <p className="text-foreground/90">
            The list and ordering used here follow the enumeration traditionally
            attributed to a narration in Sunan at-Tirmidhi. Scholars have
            historically discussed variations in the list, and this site
            reflects one widely-used version.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Translations and review</h2>
          <p className="text-foreground/90">
            Translating divine names across languages is a sensitive task. The
            renderings presented here are working drafts compiled from{" "}
            <a
              href="https://digitalislamicguide.com/99-names-of-allah/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              DigitalIslamicGuide.com/99-names-of-allah
            </a>
            .
          </p>
          <p className="text-foreground/90">
            If you notice an error or have a suggestion, please reach out.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Acknowledgements</h2>
          <ul className="ml-5 list-disc space-y-2 text-foreground/90">
            <li>
              Arabic typeface: <strong>KFGQPC Uthmanic Script HAFS</strong>,
              published by the King Fahd Glorious Qur&apos;an Printing Complex.
            </li>
            <li>
              Translations: 99-names-of-allah, published on
              DigitalIslamicGuide.com
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Disclaimer</h2>
          <p className="text-sm text-muted-foreground">
            This site is an independent effort and is not affiliated with any
            religious or governmental institution. Information is provided for
            personal reflection and study. Consult a qualified scholar for
            religious guidance.
          </p>
        </section>
      </div>
    </main>
  );
}
