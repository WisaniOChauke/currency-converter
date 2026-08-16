import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/store';
import { apiService } from '@/services/api';
import { validateAmount, getCurrencyName } from '@/utils';
import type { Currency } from '@/types';

export const useCurrency = () => {
  const {
    currencies,
    setCurrencies,
    amount,
    fromCurrency,
    toCurrency,
    conversionResult,
    isConverting,
    setConversionResult,
    setIsConverting,
    addToHistory,
    setError,
  } = useAppStore();

  // Fetch currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      const response = await apiService.getCurrencies();
      if (response.success) {
        const currencyList: Currency[] = Object.entries(response.data).map(
          ([code]) => ({
            code,
            name: getCurrencyName(code),
            symbol: code,
          })
        );
        setCurrencies(currencyList);
      } else {
        setError(response.error || 'Failed to fetch currencies');
      }
    };

    fetchCurrencies();
  }, [setCurrencies, setError]);

  // Convert currency
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
      const response = await apiService.convertCurrency(
        numAmount,
        fromCurrency,
        toCurrency
      );

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
  }, [
    amount,
    fromCurrency,
    toCurrency,
    setIsConverting,
    setConversionResult,
    addToHistory,
    setError,
  ]);

  return {
    currencies,
    conversionResult,
    isConverting,
    convertCurrency,
  };
};