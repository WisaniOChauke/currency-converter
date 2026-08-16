import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/store';
import { apiService } from '@/services/api';
import { validateAmount, getCurrencyName } from '@/utils';
import type { Currency } from '@/types';

export const useCurrency = () => {
  const currencies = useAppStore(s => s.currencies);
  const setCurrencies = useAppStore(s => s.setCurrencies);
  const amount = useAppStore(s => s.amount);
  const fromCurrency = useAppStore(s => s.fromCurrency);
  const toCurrency = useAppStore(s => s.toCurrency);
  const conversionResult = useAppStore(s => s.conversionResult);
  const isConverting = useAppStore(s => s.isConverting);
  const setConversionResult = useAppStore(s => s.setConversionResult);
  const setIsConverting = useAppStore(s => s.setIsConverting);
  const addToHistory = useAppStore(s => s.addToHistory);
  const setError = useAppStore(s => s.setError);

  const fetchCurrencies = useCallback(() => {
    setError(null);
    fetch('https://api.frankfurter.app/currencies')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Record<string, string>) => {
        const currencyList: Currency[] = Object.entries(data).map(([code, name]) => ({
          code,
          name: name || getCurrencyName(code),
          symbol: code,
        }));
        setCurrencies(currencyList);
      })
      .catch((err: unknown) => {
        setError(`Failed to load currencies: ${err instanceof Error ? err.message : 'Network error'}. Click retry.`);
      });
  }, [setCurrencies, setError]);

  useEffect(() => {
    if (currencies.length > 0) return;
    fetchCurrencies();
  }, [fetchCurrencies]);

  const convertCurrency = useCallback(async () => {
    if (!validateAmount(amount)) {
      setError('Please enter a valid amount');
      return;
    }
    if (fromCurrency === toCurrency) {
      setError('Please select different currencies');
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      const numAmount = parseFloat(amount);
      const response = await apiService.convertCurrency(numAmount, fromCurrency, toCurrency);

      if (response.success) {
        const result = {
          amount: numAmount,
          from: fromCurrency,
          to: toCurrency,
          result: numAmount * response.data.rate,
          rate: response.data.rate,
          timestamp: Date.now(),
        };
        setConversionResult(result);
        addToHistory(result);
      } else {
        setError(response.error || 'Conversion failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  return { currencies, conversionResult, isConverting, convertCurrency, fetchCurrencies };
};
