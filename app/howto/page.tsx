import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export const metadata: Metadata = {
  title: "How to recite — Asmaul Husna",
  description: "How to correctly recite the 99 Beautiful Names of Allah.",
};

export default function HowtoPage() {
  return (
    <main className="container mx-auto max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild aria-label="Back">
            <Link href="/asmaul-husna">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">
            How to recite the Asmaul Husna
          </h1>
        </div>
        <ThemeToggle />
      </div>

      <div className="max-w-none space-y-8 leading-relaxed">
        <section className="space-y-3 border-b-2">
          <p className="text-foreground/90 mb-4">
            Reciting Asmaul Husna (the 99 Names of Allah) involves calling upon
            Allah by His beautiful attributes. You can recite them sequentially
            as a daily Dhikr, or incorporate specific names into personal
            supplications (Dua) that align with your needs.
          </p>
        </section>
        <section className="space-y-3">
          <p className="text-sm text-muted-foreground">
            The advice below is extracted from{" "}
            <span className="font-semibold">
              Dua&apos;s for the contentment of the Heart
            </span>
          </p>
        </section>
        <section className="space-y-3">
          <div className="text-foreground/90">
            <p>
              When wishing to recite ALL the Beautiful Names of Allah, begin by
              saying:
            </p>
            <p
              className="font-uthmanic text-xl text-center mt-2 mb-2"
              dir="rtl"
              lang="ar"
            >
              هُوَ اللهُ الَّذِیْ لَا اِلٰهَ اِلَّا هُوَ الرَّحْمٰنُ الرَّحِیْمُ
            </p>
            <p className="text-xs text-center italic text-muted-foreground mb-2">
              He is Allah, other than whom there is no deity, the Most Gracious,
              the Most Merciful
            </p>
            <p>
              Then, continue reciting the names until the end. But the last
              letter of each word should be recited with the vowel Dhamma (Pesh)
              and joined to the next word. But when pausing to take breath the
              last letter should be recited with Saakin (jazam) and the
              following word should be started with.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-foreground/90">
            When adopting a particular Name as <em>wazeefah</em> (which one
            intends to recite daily) add{" "}
            <span className="font-uthmanic" dir="rtl" lang="ar">
              يَا
            </span>{" "}
            before the Name and eliminate the{" "}
            <span className="font-uthmanic" dir="rtl" lang="ar">
              ال
            </span>
            . For example,{" "}
            <span className="font-uthmanic" dir="rtl" lang="ar">
              اَلرَّحْمٰنُ
            </span>{" "}
            will be said as{" "}
            <span className="font-uthmanic" dir="rtl" lang="ar">
              يَا رَحْمٰنُ
            </span>{" "}
            and NOT{" "}
            <span className="font-uthmanic" dir="rtl" lang="ar">
              يَا اَلرَّحْمٰنُ
            </span>
            .
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-foreground/90">
            A learned Aalim should be consulted when one experiences any
            difficulty.
          </p>
        </section>
      </div>
    </main>
  );
}
