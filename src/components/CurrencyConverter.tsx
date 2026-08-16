import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowsRightLeft, HiClock, HiTrash } from 'react-icons/hi2';
import { useAppStore } from '@/store';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency, validateAmount } from '@/utils';
import { CurrencyDropdown } from './CurrencyDropdown';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export const CurrencyConverter: React.FC = () => {
  const amount = useAppStore(s => s.amount);
  const fromCurrency = useAppStore(s => s.fromCurrency);
  const toCurrency = useAppStore(s => s.toCurrency);
  const error = useAppStore(s => s.error);
  const conversionHistory = useAppStore(s => s.conversionHistory);
  const setAmount = useAppStore(s => s.setAmount);
  const setFromCurrency = useAppStore(s => s.setFromCurrency);
  const setToCurrency = useAppStore(s => s.setToCurrency);
  const swapCurrencies = useAppStore(s => s.swapCurrencies);
  const setError = useAppStore(s => s.setError);
  const clearHistory = useAppStore(s => s.clearHistory);

  const { currencies, conversionResult, isConverting, convertCurrency } = useCurrency();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (error && validateAmount(value)) setError(null);
  };

  const handleConvert = () => {
    if (!validateAmount(amount)) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    convertCurrency();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur-md dark:bg-gray-800 rounded-3xl shadow-2xl border border-white/20"
    >
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:text-white mb-10"
      >
        Currency Ease
      </motion.h1>

      <div className="space-y-6">
        {/* Amount Input */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            min="0"
            step="any"
            error={error || undefined}
          />
        </motion.div>

        {/* Currency Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <CurrencyDropdown
              label="From"
              currencies={currencies}
              value={fromCurrency}
              onChange={setFromCurrency}
              disabled={isConverting}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={swapCurrencies}
              disabled={isConverting}
              className="p-3 rounded-full"
              aria-label="Swap currencies"
            >
              <HiArrowsRightLeft className="w-5 h-5" />
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <CurrencyDropdown
              label="To"
              currencies={currencies}
              value={toCurrency}
              onChange={setToCurrency}
              disabled={isConverting}
            />
          </motion.div>
        </div>

        {/* Convert Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleConvert}
            loading={isConverting}
            disabled={!amount || !fromCurrency || !toCurrency || currencies.length === 0}
            size="lg"
            className="px-8"
          >
            Convert Currency
          </Button>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {conversionResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:bg-green-900/20 border-2 border-emerald-200 dark:border-green-800 rounded-2xl shadow-lg"
            >
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-800 mb-2 tracking-wide uppercase">
                  Conversion Result
                </p>
                <p className="text-3xl font-black text-slate-800 dark:text-slate-900 tracking-tight">
                  {formatCurrency(conversionResult.amount, conversionResult.from)} ={' '}
                  {formatCurrency(conversionResult.result, conversionResult.to)}
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-800 mt-2">
                  Rate: 1 {conversionResult.from} = {conversionResult.rate.toFixed(6)} {conversionResult.to}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversion History */}
        <AnimatePresence>
          {conversionHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="mt-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <HiClock className="w-4 h-4" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Recent Conversions</span>
                </div>
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  <HiTrash className="w-3 h-3" />
                  Clear
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {conversionHistory.slice(0, 5).map((item, index) => (
                  <motion.div
                    key={item.timestamp}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between px-4 py-2.5 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-600 text-sm"
                  >
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {formatCurrency(item.amount, item.from)}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-xs">→</span>
                    <span className="text-slate-700 dark:text-slate-200 font-semibold">
                      {formatCurrency(item.result, item.to)}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-xs">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
