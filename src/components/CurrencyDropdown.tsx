import React, { useMemo } from 'react';
import { HiOutlineStar, HiStar } from 'react-icons/hi2';
import { useAppStore } from '@/store';
import { getCurrencyName } from '@/utils';
import type { Currency } from '@/types';

interface CurrencyDropdownProps {
  currencies: Currency[];
  value: string;
  onChange: (currency: string) => void;
  label?: string;
  disabled?: boolean;
}

export const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  currencies,
  value,
  onChange,
  label,
  disabled = false,
}) => {
  const preferences = useAppStore(s => s.preferences);
  const addFavorite = useAppStore(s => s.addFavorite);
  const removeFavorite = useAppStore(s => s.removeFavorite);
  const { favorites } = preferences;

  const { favoriteOptions, regularOptions } = useMemo(() => {
    const favoritesSet = new Set(favorites);
    return {
      favoriteOptions: currencies.filter(c => favoritesSet.has(c.code)),
      regularOptions: currencies,
    };
  }, [currencies, favorites]);

  const isFavorite = favorites.includes(value);
  const isLoading = currencies.length === 0;

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isFavorite ? removeFavorite(value) : addFavorite(value);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || isLoading}
          className="
            w-full pl-4 pr-16 py-3 border-2 border-gray-200 dark:border-gray-600
            bg-white/80 backdrop-blur-sm dark:bg-gray-800 text-gray-900 dark:text-white
            rounded-xl shadow-sm transition-all duration-300
            focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
            hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none
          "
        >
          {isLoading ? (
            <option value="">Loading currencies...</option>
          ) : (
            <>
              {favoriteOptions.length > 0 && (
                <optgroup label="⭐ Favorites">
                  {favoriteOptions.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {getCurrencyName(c.code)}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="All Currencies">
                {regularOptions.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {getCurrencyName(c.code)}
                  </option>
                ))}
              </optgroup>
            </>
          )}
        </select>

        {!isLoading && (
          <button
            onClick={handleFavoriteToggle}
            disabled={disabled}
            className={`
              absolute right-8 top-1/2 -translate-y-1/2
              p-1.5 z-10 rounded-md border
              disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none
              ${isFavorite
                ? 'text-yellow-500 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700'
                : 'text-gray-400 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-600'
              }
            `}
            type="button"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <HiStar size={16} /> : <HiOutlineStar size={16} />}
          </button>
        )}

        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
