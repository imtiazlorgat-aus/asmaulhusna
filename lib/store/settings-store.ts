import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * User-facing settings for the Asmaul Husna viewer.
 *
 * Persisted to localStorage under the key `asmaulhusna-settings`.
 * All settings are device-local — there are no accounts in v1.
 */
export interface Settings {
  // Pagination
  namesPerPage: number;

  // Visibility toggles
  showTransliteration: boolean;
  showTranslation: boolean;

  // Language selection (matches `languages.code` in the DB)
  transliterationLanguage: string;
  translationLanguage: string;

  // Font sizes in pixels
  arabicFontSize: number;
  transliterationFontSize: number;
  translationFontSize: number;

  // Background image: null for no image, a string for a preset key
  // or a full URL. The component decides how to render either case.
  backgroundImageUrl: string | null;
}

/**
 * Sensible defaults. Keep these conservative — a first-time visitor
 * should see something readable on any reasonable screen size.
 */
export const DEFAULT_SETTINGS: Settings = {
  namesPerPage: 6,
  showTransliteration: true,
  showTranslation: true,
  transliterationLanguage: 'en',
  translationLanguage: 'en',
  arabicFontSize: 48,
  transliterationFontSize: 18,
  translationFontSize: 16,
  backgroundImageUrl: null,
};

/**
 * Per-setting bounds. Centralized so the settings page sliders and
 * any defensive clamping elsewhere stay in sync.
 */
export const SETTINGS_BOUNDS = {
  namesPerPage:              { min: 1,  max: 12, step: 1 },
  arabicFontSize:            { min: 24, max: 96, step: 2 },
  transliterationFontSize:   { min: 12, max: 36, step: 1 },
  translationFontSize:       { min: 12, max: 32, step: 1 },
} as const;

interface SettingsState extends Settings {
  /** Partial update — merge new values over existing. */
  update: (patch: Partial<Settings>) => void;
  /** Restore all defaults. */
  reset: () => void;
  /**
   * Flag indicating the store has hydrated from localStorage.
   * Use this to avoid SSR/CSR mismatches — server-rendered output
   * always reflects DEFAULT_SETTINGS until hydration completes.
   */
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      update: (patch) => set((state) => ({ ...state, ...patch })),
      reset: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: 'asmaulhusna-settings',
      storage: createJSONStorage(() => {
        // Guard against SSR — persist middleware runs on the server during
        // the initial render. Returning a noop storage there is fine;
        // hydration will kick in on the client.
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      // Persist only the Settings fields — skip actions and hydration flag.
      partialize: (state): Settings => ({
        namesPerPage: state.namesPerPage,
        showTransliteration: state.showTransliteration,
        showTranslation: state.showTranslation,
        transliterationLanguage: state.transliterationLanguage,
        translationLanguage: state.translationLanguage,
        arabicFontSize: state.arabicFontSize,
        transliterationFontSize: state.transliterationFontSize,
        translationFontSize: state.translationFontSize,
        backgroundImageUrl: state.backgroundImageUrl,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      // If we ever change the settings shape, bump this and handle migration.
      version: 1,
    },
  ),
);

/**
 * Selector hooks — use these in components to subscribe to just the
 * slices you care about. This avoids re-rendering a whole component
 * when an unrelated setting changes.
 */
export const useNamesPerPage        = () => useSettings((s) => s.namesPerPage);
export const useShowTransliteration = () => useSettings((s) => s.showTransliteration);
export const useShowTranslation     = () => useSettings((s) => s.showTranslation);
export const useArabicFontSize      = () => useSettings((s) => s.arabicFontSize);
export const useHasHydrated         = () => useSettings((s) => s.hasHydrated);
