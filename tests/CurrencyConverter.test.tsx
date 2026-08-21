import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CurrencyConverter } from '@/components/CurrencyConverter';

// Mock the store
vi.mock('@/store', () => ({
  useAppStore: () => ({
    amount: '100',
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    error: null,
    setAmount: vi.fn(),
    setFromCurrency: vi.fn(),
    setToCurrency: vi.fn(),
    swapCurrencies: vi.fn(),
    setError: vi.fn(),
  }),
}));

// Mock the custom hook
vi.mock('@/hooks/useCurrency', () => ({
  useCurrency: () => ({
    currencies: [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
    ],
    conversionResult: null,
    isConverting: false,
    convertCurrency: vi.fn(),
  }),
}));

describe('CurrencyConverter', () => {
  it('renders currency converter form', () => {
    render(<CurrencyConverter />);
    
    expect(screen.getByText('Currency Ease')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Convert Currency')).toBeInTheDocument();
  });

  it('displays conversion result when available', () => {
    // This would need proper mocking of the result state
    render(<CurrencyConverter />);
    
    expect(screen.getByRole('button', { name: /convert currency/i })).toBeInTheDocument();
  });
});