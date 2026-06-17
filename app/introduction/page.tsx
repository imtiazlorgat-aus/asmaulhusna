import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export const metadata: Metadata = {
  title: "Introduction — Asmaul Husna",
  description:
    "An introduction to the 99 Names of Allah and the importance of remembrance.",
};

export default function IntroductionPage() {
  return (
    <main className="container mx-auto max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild aria-label="Back">
            <Link href="/asmaul-husna">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Introduction</h1>
        </div>
        <ThemeToggle />
      </div>

      <div className="max-w-none space-y-8 leading-relaxed">
        <section className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Extracted from{" "}
            <span className="font-semibold">
              Dua&apos;s for the contentment of the Heart
            </span>
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-foreground/90">
            When we look at this world we see beauty, grandeur, sublimity,
            strength, the power of joy or the power of destruction manifested in
            it. We are attracted or repulsed by these manifestations. We feel
            threatened by some or inspired by awe. There is an inevitable link
            between what we see and feel, and ourselves.
          </p>
          <p className="text-foreground/90">
            That link is provided by attributes of Allah. Each object manifests
            some power of Allah. His joy or His anger, His love or His
            magnificence emanates through these objects. There is no end to
            these manifestations so long as the process of creation exists.
          </p>
          <p className="text-foreground/90">
            The first man Adam <span className="italic">(Alayhis Salaam)</span>{" "}
            was taught the names of everything.{" "}
            <span className="font-semibold">Teaching the names</span> means
            making man conscious of the essence of these things. This
            consciousness implies full knowledge. Full knowledge is impossible
            without the essence becoming part and parcel of the being. That is
            why Adam <span className="italic">(Alayhis Salaam)</span> could
            represent Allah as His Khalifa and become worthy of receiving the
            salutation of the angels. That is why Allah granted him and through
            him to man the mastery of this entire creation.
          </p>
          <p className="text-foreground/90">
            Allah, therefore, tells us to remember Him and draw near to Him by
            reciting His name or His attributes.{" "}
          </p>
          <p className="text-foreground/90 font-semibold">Allah (SWT) says:</p>
        </section>

        <section className="space-y-3 border-l border-blue-400">
          <p className="font-uthmanic text-center" dir="rtl" lang="ar">
            ٱلَّذِينَ ءَامَنُوا۟ وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ ٱللَّهِ ۗ
            أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ ٢٨
          </p>
          <p className="text-foreground/90 text-sm pl-4">
            Those who believe and whose hearts find satisfaction in the
            remembrance of Allah: for without doubt in the remembrance of Allah
            do hearts find satisfaction.
            <span className="text-muted-foreground text-xs italic">
              {" "}
              (Quran - Surah Ar-Ra&apos;d - 13:28)
            </span>
          </p>
          <p className="font-uthmanic text-center" dir="rtl" lang="ar">
            ٱتْلُ مَآ أُوحِىَ إِلَيْكَ مِنَ ٱلْكِتَـٰبِ وَأَقِمِ ٱلصَّلَوٰةَ ۖ
            إِنَّ ٱلصَّلَوٰةَ تَنْهَىٰ <br />
            عَنِ ٱلْفَحْشَآءِ وَٱلْمُنكَرِ ۗ وَلَذِكْرُ ٱللَّهِ أَكْبَرُ ۗ
            وَٱللَّهُ يَعْلَمُ مَا تَصْنَعُونَ ٤٥
          </p>
          <p className="text-foreground/90 text-sm pl-4">
            Recite what has been revealed to you of the Book and establish
            prayer. Indeed, prayer prohibits immorality and wrongdoing, and the
            remembrance of Allah is greater. And Allah knows that which you do.{" "}
            <span className="text-muted-foreground text-xs italic">
              (Quran - Surah Al-Ankabut - 29:45)
            </span>
          </p>
          <p className="font-uthmanic text-center" dir="rtl" lang="ar">
            يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱذْكُرُوا۟ ٱللَّهَ ذِكْرًۭا
            كَثِيرًۭا ٤١
          </p>
          <p className="text-foreground/90 text-sm pl-4">
            O&apos; You who believe! Celebrate the praises of Allah, and do this
            often.{" "}
            <span className="text-muted-foreground text-xs italic">
              (Quran - Surah Al-Ahzab - 33:41)
            </span>
          </p>
          <p className="font-uthmanic text-center" dir="rtl" lang="ar">
            فَٱذْكُرُونِىٓ أَذْكُرْكُمْ وَٱشْكُرُوا۟ لِى وَلَا تَكْفُرُونِ ١٥٢
          </p>
          <p className="text-foreground/90 text-sm pl-4">
            Therefore, remember Me and I will remember you; and be thankful unto
            Me and be you not ungrateful towards Me.{" "}
            <span className="text-muted-foreground text-xs italic">
              (Quran - Surah Al-Baqarah - 2:152)
            </span>
          </p>
          <p className="font-uthmanic text-center" dir="rtl" lang="ar">
            وَٱذْكُر رَّبَّكَ فِى نَفْسِكَ تَضَرُّعًۭا وَخِيفَةًۭ وَدُونَ
            ٱلْجَهْرِ مِنَ ٱلْقَوْلِ بِٱلْغُدُوِّ وَٱلْـَٔاصَالِ وَلَا تَكُن
            مِّنَ ٱلْغَـٰفِلِينَ ٢٠٥
          </p>
          <p className="text-foreground/90 text-sm pl-4">
            And do you (O reader!) bring Your Lord to remembrance in your (very)
            soul with humility and in reverence, without loudness in words, in
            the mornings and evenings; and to be not you of those who are
            unheedful.{" "}
            <span className="text-muted-foreground text-xs italic">
              (Quran - Surah Al-A&apos;raf - 7:205)
            </span>
          </p>
        </section>
        <section className="space-y-3">
          <p className="text-foreground/90">
            The remembrance of Allah is the happiest and also the wisest of
            pastime. Its blessings can never be counted and the satisfaction it
            brings cannot be measured. It relieves one of worries that otherwise
            eat into one&apos;s heart and improves one&apos;s spiritual and
            worldly life.
          </p>
        </section>
        <section className="space-y-3  border-t-2 mt-4">
          <p className="text-foreground/90 font-semibold mt-2">
            Hadith narrated by Abu Huraira{" "}
            <span className="font-uthmanic" dir="rtl" lang="ar">
              رضى الله عنه
            </span>{" "}
            — Allah&apos;s Messenger{" "}
            <span className="font-uthmanic" dir="rtl" lang="ar">
              ﷺ
            </span>{" "}
            said:
          </p>{" "}
          <section className="space-y-3 border-l border-blue-400 pl-4">
            <p className="text-foreground/90 text-center">
              <span className="font-uthmanic" dir="rtl" lang="ar">
                حَدَّثَنَا أَبُو الْيَمَانِ، أَخْبَرَنَا شُعَيْبٌ، حَدَّثَنَا
                أَبُو الزِّنَادِ، عَنِ الأَعْرَجِ، عَنْ أَبِي هُرَيْرَةَ ، رضى
                الله عنه ،
                <br />
                أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ إِنَّ لِلَّهِ
                تِسْعَةً وَتِسْعِينَ اسْمَا مِائَةً إِلاَّ وَاحِدًا مَنْ
                أَحْصَاهَا دَخَلَ الْجَنَّةَ
              </span>
            </p>
            <p className="text-foreground/90 text-sm">
              Allah has ninety-nine names, i.e. one-hundred minus one, and
              whoever knows them will go to Paradise.{" "}
              <span className="text-muted-foreground text-xs italic">
                (Sahih al-Bukhari 2736 - Book 54, Hadith 23)
              </span>
            </p>

            <p className="text-foreground/90 text-center">
              <span className="font-uthmanic" dir="rtl" lang="ar">
                حَدَّثَنَا عَلِيُّ بْنُ عَبْدِ اللَّهِ، حَدَّثَنَا سُفْيَانُ،
                قَالَ حَفِظْنَاهُ مِنْ أَبِي الزِّنَادِ عَنِ الأَعْرَجِ، عَنْ
                أَبِي هُرَيْرَةَ، <br />
                رِوَايَةً قَالَ لِلَّهِ تِسْعَةٌ وَتِسْعُونَ اسْمًا، مِائَةٌ
                إِلاَّ وَاحِدًا، لاَ يَحْفَظُهَا أَحَدٌ إِلاَّ دَخَلَ
                الْجَنَّةَ، وَهْوَ وَتْرٌ يُحِبُّ الْوَتْرَ
              </span>
            </p>
            <p className="text-foreground/90 text-sm">
              Allah has ninety-nine Names, i.e., one hundred minus one, and
              whoever believes in their meanings and acts accordingly, will
              enter Paradise; and Allah is <em>witr</em> (one) and loves the{" "}
              <em>witr</em> (i.e. odd numbers).{" "}
              <span className="text-muted-foreground text-xs italic">
                (Sahih al-Bukhari 6410 - Book 80, Hadith 105)
              </span>
            </p>
          </section>
        </section>
      </div>
    </main>
  );
}
