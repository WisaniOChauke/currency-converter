import React from 'react';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { Header } from '@/components/layout/Header';
import { CurrencyConverter } from '@/components/CurrencyConverter';
import { useTheme } from '@/hooks/useTheme';

const App: React.FC = () => {
  useTheme(); // Initialize theme

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-200">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <CurrencyConverter />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;