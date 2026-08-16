import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { UserPreferences, Currency, ConversionResult } from '@/types';

interface AppState {
  // User preferences
  preferences: UserPreferences;
  setTheme: (theme: UserPreferences['theme']) => void;
  setLanguage: (language: string) => void;
  addFavorite: (currency: string) => void;
  removeFavorite: (currency: string) => void;
  setDefaultCurrency: (currency: string) => void;

  // Currencies
  currencies: Currency[];
  setCurrencies: (currencies: Currency[]) => void;

  // Conversion state
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  conversionResult: ConversionResult | null;
  isConverting: boolean;
  setAmount: (amount: string) => void;
  setFromCurrency: (currency: string) => void;
  setToCurrency: (currency: string) => void;
  setConversionResult: (result: ConversionResult | null) => void;
  setIsConverting: (isConverting: boolean) => void;
  swapCurrencies: () => void;

  // History
  conversionHistory: ConversionResult[];
  addToHistory: (result: ConversionResult) => void;
  clearHistory: () => void;

  // Error handling
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      preferences: {
        theme: 'light',
        language: 'en',
        favorites: ['USD', 'EUR', 'GBP', 'JPY'],
        defaultCurrency: 'USD',
      },
      currencies: [],
      amount: '',
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      conversionResult: null,
      isConverting: false,
      conversionHistory: [],
      error: null,

      // Preference actions
      setTheme: (theme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme },
        })),

      setLanguage: (language) =>
        set((state) => ({
          preferences: { ...state.preferences, language },
        })),

      addFavorite: (currency) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            favorites: [...new Set([...state.preferences.favorites, currency])],
          },
        })),

      removeFavorite: (currency) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            favorites: state.preferences.favorites.filter((f) => f !== currency),
          },
        })),

      setDefaultCurrency: (currency) =>
        set((state) => ({
          preferences: { ...state.preferences, defaultCurrency: currency },
        })),

      // Currency actions
      setCurrencies: (currencies) => set({ currencies }),

      // Conversion actions
      setAmount: (amount) => set({ amount }),
      setFromCurrency: (fromCurrency) => set({ fromCurrency }),
      setToCurrency: (toCurrency) => set({ toCurrency }),
      setConversionResult: (conversionResult) => set({ conversionResult }),
      setIsConverting: (isConverting) => set({ isConverting }),

      swapCurrencies: () => {
        const { fromCurrency, toCurrency } = get();
        set({
          fromCurrency: toCurrency,
          toCurrency: fromCurrency,
        });
      },

      // History actions
      addToHistory: (result) =>
        set((state) => ({
          conversionHistory: [result, ...state.conversionHistory.slice(0, 49)],
        })),

      clearHistory: () => set({ conversionHistory: [] }),

      // Error actions
      setError: (error) => set({ error }),
    }),
    {
      name: 'currency-converter-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        conversionHistory: state.conversionHistory,
      }),
    }
  )
);