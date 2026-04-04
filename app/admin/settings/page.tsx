'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import InputAdornment from '@mui/material/InputAdornment';
import SettingsIcon from '@mui/icons-material/Settings';
import PercentIcon from '@mui/icons-material/Percent';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SaveIcon from '@mui/icons-material/Save';
import BrushIcon from '@mui/icons-material/Brush';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ImageIcon from '@mui/icons-material/Image';
import { alpha, useTheme } from '@mui/material/styles';
import { supabase } from '@/lib/supabase';

interface Settings {
  support_email: string;
  commission_rate: string;
  service_fee: string;
  min_payout: string;
  maintenance_mode: string;
  app_name: string;
  logo_url: string;
  currency: string;
}

const DEFAULTS: Settings = {
  support_email: 'support@campusrunner.app',
  commission_rate: '10',
  service_fee: '100',
  min_payout: '5000',
  maintenance_mode: 'false',
  app_name: 'CampusRunner',
  logo_url: '',
  currency: 'NGN',
};

const CURRENCY_SYMBOLS: Record<string, string> = { NGN: '₦', GHS: '₵', KES: 'KSh' };

function SectionCard({
  icon, title, color, children,
}: {
  icon: React.ReactNode; title: string; color: string; children: React.ReactNode;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: alpha(color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
            {icon}
          </Box>
          <Typography variant="body1" fontWeight={800}>{title}</Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {children}
      </CardContent>
    </Card>
  );
}

export default function AdminSettingsPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${session?.access_token ?? ''}` },
      })
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.settings) setSettings({ ...DEFAULTS, ...d.settings }); })
        .catch(() => {})
        .finally(() => setLoading(false));
    };
    load();
  }, []);

  const set = (key: keyof Settings, value: string) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token ?? ''}` },
        body: JSON.stringify(settings),
      });
      setMessage({ text: res.ok ? 'Settings saved successfully!' : 'Failed to save settings.', ok: res.ok });
    } catch {
      setMessage({ text: 'Network error. Please try again.', ok: false });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: isDark ? alpha('#fff', 0.04) : alpha('#f8fafc', 0.9),
    },
  };

  const symbol = CURRENCY_SYMBOLS[settings.currency] || '₦';
  const orderAmount = 10000;
  const platformEarning = orderAmount * Number(settings.commission_rate || 0) / 100 + Number(settings.service_fee || 0);
  const runnerEarning = orderAmount - platformEarning;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
        <CircularProgress sx={{ color: '#f59e0b' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }}
        justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: alpha('#f59e0b', 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
            <SettingsIcon />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={900}>App Settings</Typography>
            <Typography variant="body2" color="text.secondary">Configure your CampusRunner platform</Typography>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
          {message && (
            <Alert severity={message.ok ? 'success' : 'error'} sx={{ py: 0.5, borderRadius: 2, fontSize: 13 }}>
              {message.text}
            </Alert>
          )}
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={15} sx={{ color: '#fff' }} /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{ borderRadius: 2, minWidth: 140, fontWeight: 800 }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        {/* Branding */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard icon={<BrushIcon fontSize="small" />} title="Branding" color="#8b5cf6">
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                <Avatar
                  src={settings.logo_url || undefined}
                  sx={{ width: 52, height: 52, bgcolor: '#f59e0b', fontSize: 20, fontWeight: 900 }}
                >
                  {!settings.logo_url && settings.app_name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={800}>{settings.app_name}</Typography>
                  <Typography variant="caption" color="text.secondary">App preview</Typography>
                </Box>
              </Stack>
              <TextField
                label="App Name"
                value={settings.app_name}
                onChange={e => set('app_name', e.target.value)}
                size="small" fullWidth sx={fieldSx}
                helperText="Display name shown across the platform"
              />
              <TextField
                label="Logo URL"
                value={settings.logo_url}
                onChange={e => set('logo_url', e.target.value)}
                size="small" fullWidth sx={fieldSx}
                placeholder="https://example.com/logo.png"
                helperText="Direct URL to your logo image"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><ImageIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></InputAdornment>,
                }}
              />
              <TextField
                label="Support Email"
                type="email"
                value={settings.support_email}
                onChange={e => set('support_email', e.target.value)}
                size="small" fullWidth sx={fieldSx}
                helperText="Email shown to users for support"
              />
              <FormControl size="small" fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select value={settings.currency} onChange={e => set('currency', e.target.value)} label="Currency" sx={fieldSx}>
                  <MenuItem value="NGN">Nigerian Naira (₦)</MenuItem>
                  <MenuItem value="GHS">Ghanaian Cedi (₵)</MenuItem>
                  <MenuItem value="KES">Kenyan Shilling (KSh)</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </SectionCard>
        </Grid>

        {/* Platform Fees */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard icon={<PercentIcon fontSize="small" />} title="Monetization & Fees" color="#10b981">
            <Stack spacing={2}>
              <TextField
                label="Commission Rate (%)"
                type="number"
                value={settings.commission_rate}
                onChange={e => set('commission_rate', e.target.value)}
                size="small" fullWidth sx={fieldSx}
                inputProps={{ min: 0, max: 100, step: 0.5 }}
                helperText="% taken from each completed order"
                InputProps={{
                  endAdornment: <InputAdornment position="end"><PercentIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></InputAdornment>,
                }}
              />
              <TextField
                label={`Service Fee (${symbol})`}
                type="number"
                value={settings.service_fee}
                onChange={e => set('service_fee', e.target.value)}
                size="small" fullWidth sx={fieldSx}
                inputProps={{ min: 0 }}
                helperText="Fixed fee added to every order"
              />
              <TextField
                label={`Minimum Payout (${symbol})`}
                type="number"
                value={settings.min_payout}
                onChange={e => set('min_payout', e.target.value)}
                size="small" fullWidth sx={fieldSx}
                inputProps={{ min: 0 }}
                helperText="Minimum amount runners can withdraw"
              />

              {/* Live fee preview */}
              <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: alpha('#10b981', 0.06), border: '1px solid', borderColor: alpha('#10b981', 0.15) }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Fee Preview — {symbol}{orderAmount.toLocaleString()} order
                </Typography>
                <Grid container spacing={1} sx={{ mt: 0.5 }}>
                  <Grid size={6}>
                    <Typography variant="caption" color="text.secondary">Platform earns</Typography>
                    <Typography variant="body2" fontWeight={900} sx={{ color: '#10b981' }}>
                      {symbol}{platformEarning.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="caption" color="text.secondary">Runner earns</Typography>
                    <Typography variant="body2" fontWeight={900} sx={{ color: '#3b82f6' }}>
                      {symbol}{Math.max(0, runnerEarning).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </SectionCard>
        </Grid>

        {/* System */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard icon={<SettingsIcon fontSize="small" />} title="System" color="#64748b">
            <Stack spacing={1.5}>
              <Box sx={{
                p: 2, borderRadius: 2.5, border: '1px solid',
                borderColor: settings.maintenance_mode === 'true' ? alpha('#f59e0b', 0.4) : 'divider',
                bgcolor: settings.maintenance_mode === 'true' ? alpha('#f59e0b', 0.05) : 'transparent',
                transition: 'all 0.2s',
              }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.maintenance_mode === 'true'}
                      onChange={e => set('maintenance_mode', e.target.checked ? 'true' : 'false')}
                      size="small"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#f59e0b' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#f59e0b' },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" fontWeight={700}>Maintenance Mode</Typography>
                        {settings.maintenance_mode === 'true' && (
                          <Chip label="ACTIVE" size="small" sx={{ bgcolor: '#f59e0b', color: '#fff', fontSize: 9, fontWeight: 900, height: 16 }} />
                        )}
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Temporarily disables the platform for all users
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Stack>
          </SectionCard>
        </Grid>

        {/* Notifications */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard icon={<NotificationsIcon fontSize="small" />} title="Notifications" color="#3b82f6">
            <Stack spacing={1.5}>
              {[
                { label: 'New order alerts', desc: 'Notify when students place orders' },
                { label: 'Runner verification requests', desc: 'Alerts for pending runner approvals' },
                { label: 'Low wallet balance alerts', desc: 'Notify when user wallets are low' },
                { label: 'Weekly summary reports', desc: 'Automated weekly platform reports' },
              ].map((n, i) => (
                <Box key={n.label} sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider',
                }}>
                  <Box>
                    <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.8rem' }}>{n.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{n.desc}</Typography>
                  </Box>
                  <Switch
                    defaultChecked={i !== 2}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#3b82f6' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#3b82f6' },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        {/* Danger zone */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ border: '1px solid', borderColor: alpha('#ef4444', 0.25) }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: alpha('#ef4444', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                  <WarningAmberIcon fontSize="small" />
                </Box>
                <Typography variant="body1" fontWeight={800} color="error.main">Danger Zone</Typography>
              </Stack>
              <Divider sx={{ mb: 2, borderColor: alpha('#ef4444', 0.12) }} />
              <Grid container spacing={1.5}>
                {[
                  { label: 'Clear all notifications', desc: 'Permanently delete all platform notifications' },
                  { label: 'Reset platform stats', desc: 'Reset all counters and analytics data' },
                  { label: 'Purge test orders', desc: 'Remove all orders marked as test data' },
                ].map(action => (
                  <Grid key={action.label} size={{ xs: 12, sm: 4 }}>
                    <Box sx={{
                      display: 'flex', flexDirection: 'column', gap: 1,
                      p: 2, borderRadius: 2, border: '1px solid',
                      borderColor: alpha('#ef4444', 0.15),
                      bgcolor: alpha('#ef4444', 0.02),
                    }}>
                      <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.8rem' }}>{action.label}</Typography>
                      <Typography variant="caption" color="text.secondary">{action.desc}</Typography>
                      <Button variant="outlined" color="error" size="small" sx={{ borderRadius: 2, mt: 0.5, alignSelf: 'flex-start', fontSize: 11 }}>
                        Execute
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
