'use client';

import { ThemeToggle } from '../components/theme-toggle';

export default function ThemeTestPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Theme Test Page</h1>
          <ThemeToggle />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Light Mode Card</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This card should have a light background in light mode and dark background in dark mode.
            </p>
          </div>
          
          <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100">Colored Card</h2>
            <p className="text-blue-700 dark:text-blue-200">
              This card demonstrates color variations between themes.
            </p>
          </div>
        </div>
        
        <div className="mt-8 p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-sm">
            Toggle the theme using the button above. The page should switch between light and dark modes.
          </p>
        </div>
      </div>
    </div>
  );
}