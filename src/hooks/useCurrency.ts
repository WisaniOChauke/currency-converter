import { useEffect, useCallback, useRef } from 'react';
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

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCurrencies = async () => {
      try {
        const response = await apiService.getCurrencies();
        if (response.success && Object.keys(response.data).length > 0) {
          const currencyList: Currency[] = Object.entries(response.data).map(
            ([code, name]) => ({
              code,
              name: name || getCurrencyName(code),
              symbol: code,
            })
          );
          setCurrencies(currencyList);
        } else {
          setError('Failed to load currencies. Please refresh.');
        }
      } catch {
        setError('Network error. Please check your connection.');
      }
    };

    fetchCurrencies();
  }, []);

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

  return { currencies, conversionResult, isConverting, convertCurrency };
};
