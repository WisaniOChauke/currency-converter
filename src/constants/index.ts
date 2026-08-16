export const API_CONFIG = {
  BASE_URL: 'https://api.frankfurter.dev/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
} as const;

export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'] as const;

export const DEFAULT_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY'] as const;

export const THEME_OPTIONS = ['light', 'dark', 'system'] as const;

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
} as const;

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'Fr',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  CZK: 'Kč',
  HUF: 'Ft',
  RUB: '₽',
  BRL: 'R$',
  MXN: '$',
  ZAR: 'R',
  KRW: '₩',
  SGD: 'S$',
  HKD: 'HK$',
  NZD: 'NZ$',
};