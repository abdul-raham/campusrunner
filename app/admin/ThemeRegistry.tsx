'use client';
import * as React from 'react';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type Mode = 'light' | 'dark';
const ColorModeContext = createContext({ mode: 'light' as Mode, toggle: () => {} });
export const useColorMode = () => useContext(ColorModeContext);

function buildTheme(mode: Mode) {
  const isDark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706', contrastText: '#fff' },
      secondary: { main: '#0f172a', contrastText: '#fff' },
      background: {
        default: isDark ? '#0f172a' : '#f1f5f9',
        paper: isDark ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f1f5f9' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#64748b',
      },
      success: { main: '#10b981' },
      error: { main: '#ef4444' },
      warning: { main: '#f59e0b' },
      info: { main: '#3b82f6' },
      divider: isDark ? 'rgba(148,163,184,0.12)' : 'rgba(148,163,184,0.15)',
    },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      h4: { fontWeight: 900, letterSpacing: '-0.02em' },
      h5: { fontWeight: 800, letterSpacing: '-0.01em' },
      h6: { fontWeight: 800 },
      button: { fontWeight: 700, textTransform: 'none' },
    },
    shape: { borderRadius: 16 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: `1px solid ${isDark ? 'rgba(148,163,184,0.1)' : 'rgba(148,163,184,0.12)'}`,
            boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(15,23,42,0.06)',
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 12, fontWeight: 700, boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
          contained: { '&:hover': { boxShadow: '0 4px 12px rgba(245,158,11,0.35)' } },
        },
      },
      MuiChip: { styleOverrides: { root: { borderRadius: 8, fontWeight: 700 } } },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase',
            letterSpacing: '0.08em', color: isDark ? '#94a3b8' : '#64748b',
            backgroundColor: isDark ? '#1e293b' : '#f8fafc',
            borderBottom: `1px solid ${isDark ? 'rgba(148,163,184,0.1)' : 'rgba(148,163,184,0.15)'}`,
          },
          body: {
            borderBottom: `1px solid ${isDark ? 'rgba(148,163,184,0.07)' : 'rgba(148,163,184,0.08)'}`,
            fontSize: '0.875rem',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: 'none', backgroundImage: 'none',
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderRight: `1px solid ${isDark ? 'rgba(148,163,184,0.1)' : 'rgba(148,163,184,0.12)'}`,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12, margin: '2px 8px', padding: '10px 12px',
            '&.Mui-selected': {
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#ffffff !important',
              boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
              '& .MuiListItemIcon-root': { color: '#ffffff !important' },
              '& .MuiListItemText-primary': { color: '#ffffff !important' },
              '&:hover': { background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 12 } } },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            fontWeight: 700, fontSize: '0.75rem', borderRadius: '10px !important',
            '&.Mui-selected': {
              backgroundColor: '#f59e0b', color: '#fff',
              '&:hover': { backgroundColor: '#d97706' },
            },
          },
        },
      },
    },
  });
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('light');

  useEffect(() => {
    const saved = localStorage.getItem('admin-theme') as Mode | null;
    if (saved === 'dark' || saved === 'light') setMode(saved);
  }, []);

  const toggle = () => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('admin-theme', next);
      return next;
    });
  };

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
