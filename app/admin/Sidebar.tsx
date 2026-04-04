'use client';
import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { alpha, useTheme } from '@mui/material/styles';

export const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Dashboard',    href: '/admin',              icon: DashboardIcon },
  { label: 'Orders',       href: '/admin/orders',       icon: ShoppingCartIcon },
  { label: 'Runners',      href: '/admin/runners',      icon: DirectionsRunIcon },
  { label: 'Students',     href: '/admin/students',     icon: PeopleIcon },
  { label: 'Transactions', href: '/admin/transactions', icon: AccountBalanceWalletIcon },
  { label: 'Settings',     href: '/admin/settings',     icon: SettingsIcon },
];

interface SidebarProps {
  profileName: string;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function SidebarContent({ profileName, onLogout }: { profileName: string; onLogout: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', px: 1, py: 2 }}>
      {/* Logo */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{
            width: 40, height: 40, borderRadius: 2,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245,158,11,0.35)',
          }}>
            <DirectionsRunIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={900} lineHeight={1.1}>
              CampusRunner
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Admin Control
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Profile card */}
      <Box sx={{
        mx: 1, mb: 2, p: 1.5, borderRadius: 3,
        bgcolor: alpha('#f59e0b', isDark ? 0.1 : 0.07),
        border: '1px solid', borderColor: alpha('#f59e0b', 0.2),
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ width: 36, height: 36, fontSize: 14, fontWeight: 800, bgcolor: '#f59e0b', color: '#fff' }}>
            {profileName.charAt(0).toUpperCase()}
          </Avatar>
          <Box minWidth={0}>
            <Typography variant="body2" fontWeight={700} noWrap>{profileName}</Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Online</Typography>
            </Stack>
          </Box>
          <Chip label="Admin" size="small" sx={{ ml: 'auto', fontSize: 10, fontWeight: 800, bgcolor: alpha('#f59e0b', 0.15), color: '#d97706', border: 'none' }} />
        </Stack>
      </Box>

      <Divider sx={{ mx: 1, mb: 1 }} />

      {/* Nav */}
      <List sx={{ flex: 1, py: 0 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push(item.href)}
                sx={{
                  borderRadius: 3, mx: 0.5, py: 1.2,
                  ...(isActive
                    ? {
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
                        '&:hover': { background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
                      }
                    : {
                        '&:hover': { bgcolor: alpha('#f59e0b', isDark ? 0.1 : 0.06) },
                      }),
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isActive ? '#fff' : 'text.secondary' }}>
                  <Icon fontSize="small" sx={{ color: isActive ? '#fff' : undefined }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ '& .MuiListItemText-primary': { color: isActive ? '#fff' : 'text.primary', fontWeight: isActive ? 800 : 600, fontSize: '0.875rem' } }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 1, mt: 1, mb: 1 }} />

      {/* Logout */}
      <List sx={{ py: 0 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={onLogout}
            sx={{
              borderRadius: 3, mx: 0.5, py: 1.2,
              '&:hover': { bgcolor: alpha('#ef4444', 0.08) },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{ '& .MuiListItemText-primary': { color: 'error.main', fontWeight: 700, fontSize: '0.875rem' } }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}

export default function AdminSidebar({ profileName, onLogout, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <SidebarContent profileName={profileName} onLogout={onLogout} />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
        open
      >
        <SidebarContent profileName={profileName} onLogout={onLogout} />
      </Drawer>
    </>
  );
}
