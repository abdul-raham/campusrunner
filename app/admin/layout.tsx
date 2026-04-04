'use client';
import * as React from 'react';
import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopLoadingBar from '@/components/TopLoadingBar';
import NavigationProgress from '@/components/NavigationProgress';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { alpha } from '@mui/material/styles';
import { useAuth } from '@/hooks/useAuth';
import ThemeRegistry, { useColorMode } from './ThemeRegistry';
import AdminSidebar, { DRAWER_WIDTH } from './Sidebar';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, profile, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggle } = useColorMode();
  const isDark = mode === 'dark';

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.replace('/login');
    }
  }, [loading, user, profile, router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <CircularProgress sx={{ color: '#f59e0b' }} size={44} thickness={4} />
      </Box>
    );
  }

  if (!user || profile?.role !== 'admin') return null;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminSidebar
        profileName={profile?.full_name || 'Admin'}
        onLogout={logout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { lg: `${DRAWER_WIDTH}px` },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Glass AppBar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            bgcolor: isDark ? 'rgba(15,23,42,0.75)' : 'rgba(255,255,255,0.75)',
            borderBottom: '1px solid',
            borderColor: isDark ? 'rgba(148,163,184,0.1)' : 'rgba(148,163,184,0.15)',
            color: 'text.primary',
            boxShadow: isDark
              ? '0 1px 20px rgba(0,0,0,0.25)'
              : '0 1px 20px rgba(15,23,42,0.06)',
          }}
        >
          <Toolbar sx={{ gap: 1, minHeight: '56px !important', px: { xs: 2, sm: 3 } }}>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              size="small"
              sx={{ mr: 1, display: { lg: 'none' } }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
            <Typography
              variant="subtitle2"
              fontWeight={800}
              sx={{ flexGrow: 1, display: { lg: 'none' }, letterSpacing: '-0.01em' }}
            >
              CampusRunner
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'block' } }} />

            <Tooltip title="Notifications">
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <NotificationsNoneIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton onClick={toggle} size="small" sx={{ color: 'text.secondary' }}>
                {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            <Avatar
              sx={{
                width: 30, height: 30, fontSize: 12, fontWeight: 800,
                bgcolor: '#f59e0b', color: '#fff', ml: 0.5,
              }}
            >
              {(profile?.full_name || 'A').charAt(0).toUpperCase()}
            </Avatar>
          </Toolbar>
        </AppBar>

        <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeRegistry>
      <Suspense><TopLoadingBar /></Suspense>
      <NavigationProgress />
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </ThemeRegistry>
  );
}
