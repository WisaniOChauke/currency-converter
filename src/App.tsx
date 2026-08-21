import React, { lazy, Suspense } from 'react';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { Header } from '@/components/layout/Header';
import { useTheme } from '@/hooks/useTheme';

const CurrencyConverter = lazy(() =>
  import('@/components/CurrencyConverter').then(m => ({ default: m.CurrencyConverter }))
);

const App: React.FC = () => {
  useTheme();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-200">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" /></div>}>
            <CurrencyConverter />
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;