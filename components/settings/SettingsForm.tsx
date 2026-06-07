"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Undo2, X } from "lucide-react";

// Resolve a CSS variable to a #rrggbb hex by injecting a hidden element and
// letting the browser compute the color — works for any color format and
// correctly inherits the live dark/light cascade from the DOM.
function readCssColor(cssVar: string): string | null {
  if (typeof window === "undefined" || !document.body) return null;
  const el = document.createElement("div");
  el.style.cssText = `color:var(${cssVar});position:absolute;visibility:hidden`;
  document.body.appendChild(el);
  const rgb = getComputedStyle(el).color; // always resolves to rgb(r, g, b)
  document.body.removeChild(el);
  const m = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  return (
    "#" +
    [m[1], m[2], m[3]]
      .map((n) => parseInt(n).toString(16).padStart(2, "0"))
      .join("")
  );
}
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FontSizeSlider } from "./FontSizeSlider";
import { LanguageSelect } from "./LanguageSelect";
import { BackgroundImagePicker } from "./BackgroundImagePicker";
import { Switch } from "@/components/ui/switch";
import { NamePanel } from "@/components/viewer/NamePanel";
import { useSettings, SETTINGS_BOUNDS } from "@/lib/store/settings-store";
import type { LanguageRow, NameWithTranslations } from "@/lib/db/types";

interface SettingsFormProps {
  languages: LanguageRow[];
  /**
   * A single example name used for the live preview card. Passing it
   * from the server keeps this form otherwise pure client.
   */
  previewName: NameWithTranslations;
  /** Direction for the preview's transliteration (from the current transliterationLanguage). */
  previewTransliterationDirection: "ltr" | "rtl";
  /** Direction for the preview's translation (from the current translationLanguage). */
  previewTranslationDirection: "ltr" | "rtl";
}

export function SettingsForm({
  languages,
  previewName,
  previewTransliterationDirection,
  previewTranslationDirection,
}: SettingsFormProps) {
  const router = useRouter();

  // Track the computed theme colors so the color picker shows the correct
  // default swatch in both light and dark mode. Re-reads whenever the
  // `.dark` class is toggled on <html>.
  const [themeColors, setThemeColors] = useState({
    translit: "#737373",
    trans: "#fff",
  });
  useEffect(() => {
    const update = () =>
      setThemeColors({
        translit: readCssColor("--muted-foreground") ?? "#737373",
        trans: readCssColor("--foreground") ?? "#fff",
      });
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Per-picker undo stack (one level). null = no snapshot yet.
  const [prevColors, setPrevColors] = useState<{
    translit: string | null;
    trans: string | null;
  }>({
    translit: null,
    trans: null,
  });

  // Subscribe to each field individually so we only re-render on real changes.
  const namesPerPage = useSettings((s) => s.namesPerPage);
  const showTransliteration = useSettings((s) => s.showTransliteration);
  const showTranslation = useSettings((s) => s.showTranslation);
  const transliterationColor = useSettings((s) => s.transliterationColor);
  const translationColor = useSettings((s) => s.translationColor);
  const swipeUpDown = useSettings((s) => s.swipeUpDown);
  const swipeLeftRight = useSettings((s) => s.swipeLeftRight);
  const transliterationLanguage = useSettings((s) => s.transliterationLanguage);
  const arabicFontSize = useSettings((s) => s.arabicFontSize);
  const transliterationFontSize = useSettings((s) => s.transliterationFontSize);
  const translationFontSize = useSettings((s) => s.translationFontSize);
  const backgroundImageUrl = useSettings((s) => s.backgroundImageUrl);

  const update = useSettings((s) => s.update);
  const reset = useSettings((s) => s.reset);

  /**
   * Updating a language in settings should both persist the choice
   * and navigate to the matching viewer route — otherwise the current
   * route's URL params still dictate what the viewer page fetches.
   */
  const handleLanguageChange = (code: string) => {
    update({ transliterationLanguage: code, translationLanguage: code });
    router.push(`/asmaul-husna/${code}`);
    router.refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Main column: controls */}
      <div className="flex flex-col gap-6">
        {/* Display section */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Display</h2>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="names-per-page">Names per page</Label>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {namesPerPage}
                </span>
              </div>
              <Slider
                id="names-per-page"
                value={[namesPerPage]}
                min={SETTINGS_BOUNDS.namesPerPage.min}
                max={SETTINGS_BOUNDS.namesPerPage.max}
                step={SETTINGS_BOUNDS.namesPerPage.step}
                onValueChange={(v) => update({ namesPerPage: v[0] })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-transliteration">Show Transliteration</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-md border border-input px-1 py-1">
                  <div className="relative h-6 w-6 shrink-0">
                    <div
                      className="h-6 w-6 rounded border border-input"
                      style={{
                        backgroundColor:
                          transliterationColor || themeColors.translit,
                      }}
                    />
                    <input
                      type="color"
                      aria-label="Transliteration colour"
                      value={transliterationColor || themeColors.translit}
                      onFocus={() =>
                        setPrevColors((p) => ({
                          ...p,
                          translit: transliterationColor,
                        }))
                      }
                      onChange={(e) =>
                        update({ transliterationColor: e.target.value })
                      }
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    title="Undo"
                    disabled={
                      prevColors.translit === null ||
                      prevColors.translit === transliterationColor
                    }
                    onClick={() => {
                      const current = transliterationColor;
                      update({
                        transliterationColor: prevColors.translit ?? "",
                      });
                      setPrevColors((p) => ({ ...p, translit: current }));
                    }}
                  >
                    <Undo2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    title="Reset to default"
                    // disabled={transliterationColor === ""}
                    onClick={() => {
                      setPrevColors((p) => ({
                        ...p,
                        translit: transliterationColor,
                      }));
                      update({ transliterationColor: "" });
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Switch
                  id="show-transliteration"
                  checked={showTransliteration}
                  onCheckedChange={(v) => update({ showTransliteration: v })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-translation">Show Translation</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-md border border-input px-1 py-1">
                  <div className="relative h-6 w-6 shrink-0">
                    <div
                      className="h-6 w-6 rounded border border-input"
                      style={{
                        backgroundColor: translationColor || themeColors.trans,
                      }}
                    />
                    <input
                      type="color"
                      aria-label="Translation colour"
                      value={translationColor || themeColors.trans}
                      onFocus={() =>
                        setPrevColors((p) => ({
                          ...p,
                          trans: translationColor,
                        }))
                      }
                      onChange={(e) =>
                        update({ translationColor: e.target.value })
                      }
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    title="Undo"
                    disabled={
                      prevColors.trans === null ||
                      prevColors.trans === translationColor
                    }
                    onClick={() => {
                      const current = translationColor;
                      update({ translationColor: prevColors.trans ?? "" });
                      setPrevColors((p) => ({ ...p, trans: current }));
                    }}
                  >
                    <Undo2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    title="Reset to default"
                    disabled={translationColor === ""}
                    onClick={() => {
                      setPrevColors((p) => ({ ...p, trans: translationColor }));
                      update({ translationColor: "" });
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Switch
                  id="show-translation"
                  checked={showTranslation}
                  onCheckedChange={(v) => update({ showTranslation: v })}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Swipe navigation */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Swipe navigation</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="swipe-left-right">Swipe right / left</Label>
              <Switch
                id="swipe-left-right"
                checked={swipeLeftRight}
                onCheckedChange={(v) => update({ swipeLeftRight: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="swipe-up-down">Swipe up / down</Label>
              <Switch
                id="swipe-up-down"
                checked={swipeUpDown}
                onCheckedChange={(v) => update({ swipeUpDown: v })}
              />
            </div>
          </div>
        </Card>

        {/* Languages */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Language</h2>
          <LanguageSelect
            id="language"
            // label="Language"
            value={transliterationLanguage}
            languages={languages}
            onChange={handleLanguageChange}
            excludeArabic
          />
        </Card>

        {/* Font sizes */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Font sizes</h2>
          <div className="flex flex-col gap-6">
            <FontSizeSlider
              id="arabic-font-size"
              label="Arabic"
              value={arabicFontSize}
              min={SETTINGS_BOUNDS.arabicFontSize.min}
              max={SETTINGS_BOUNDS.arabicFontSize.max}
              step={SETTINGS_BOUNDS.arabicFontSize.step}
              onChange={(v) => update({ arabicFontSize: v })}
              previewText={previewName.arabic}
              previewFontFamily="var(--font-uthmanic)"
              previewDirection="rtl"
            />
            <FontSizeSlider
              id="transliteration-font-size"
              label="Transliteration"
              value={transliterationFontSize}
              min={SETTINGS_BOUNDS.transliterationFontSize.min}
              max={SETTINGS_BOUNDS.transliterationFontSize.max}
              step={SETTINGS_BOUNDS.transliterationFontSize.step}
              onChange={(v) => update({ transliterationFontSize: v })}
              previewText={previewName.transliteration ?? "Ar-Rahman"}
              previewDirection={previewTransliterationDirection}
              previewColor={transliterationColor || undefined}
            />
            <FontSizeSlider
              id="translation-font-size"
              label="Translation"
              value={translationFontSize}
              min={SETTINGS_BOUNDS.translationFontSize.min}
              max={SETTINGS_BOUNDS.translationFontSize.max}
              step={SETTINGS_BOUNDS.translationFontSize.step}
              onChange={(v) => update({ translationFontSize: v })}
              previewText={previewName.translation ?? "The Most Compassionate"}
              previewDirection={previewTranslationDirection}
              previewColor={translationColor || undefined}
            />
          </div>
        </Card>

        {/* Background */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Background</h2>
          <BackgroundImagePicker
            value={backgroundImageUrl}
            onChange={(url) => update({ backgroundImageUrl: url })}
          />
        </Card>

        {/* Reset */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              if (confirm("Reset all settings to defaults?")) {
                reset();
              }
            }}
          >
            Reset to defaults
          </Button>
        </div>
      </div>

      {/* Side column: live preview */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="mb-3 text-sm font-medium text-muted-foreground">
          Preview
        </div>
        <NamePanel
          name={previewName}
          transliterationDirection={previewTransliterationDirection}
          translationDirection={previewTranslationDirection}
        />
      </aside>
    </div>
  );
}
