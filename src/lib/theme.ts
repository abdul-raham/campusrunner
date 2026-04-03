// CampusRunner Theme System - Modern SaaS Dashboard
// Using standard Tailwind classes

export const theme = {
  // Component Variants using standard Tailwind classes
  components: {
    // Card System
    card: {
      base: 'bg-white rounded-2xl shadow-sm border border-slate-200',
      hover: 'hover:shadow-lg transition-all duration-200',
      padding: 'p-6'
    },
    
    // Button System
    button: {
      primary: 'bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-3 rounded-xl transition-colors',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-6 py-3 rounded-xl transition-colors',
      accent: 'bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl transition-colors'
    },
    
    // Input System
    input: {
      base: 'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
    }
  }
} as const;

// Utility Functions
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Theme Utilities
export const getCardClasses = (variant: 'default' | 'hover' | 'glass' = 'default') => {
  const base = theme.components.card.base;
  const padding = theme.components.card.padding;
  
  switch (variant) {
    case 'hover':
      return cn(base, padding, theme.components.card.hover);
    case 'glass':
      return cn('bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20', padding);
    default:
      return cn(base, padding);
  }
};

export const getButtonClasses = (variant: 'primary' | 'secondary' | 'accent' = 'primary') => {
  return theme.components.button[variant];
};

export const getInputClasses = (hasError = false) => {
  return cn(
    theme.components.input.base,
    hasError && theme.components.input.error
  );
};