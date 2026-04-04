'use client';
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface Stats {
  totalStudents: number;
  totalRunners: number;
  pendingRunners: number;
  totalOrders: number;
  completedOrders: number;
  revenue: number;
}

const weeklyOrders = [
  { day: 'Mon', orders: 4, revenue: 12000 },
  { day: 'Tue', orders: 7, revenue: 21000 },
  { day: 'Wed', orders: 5, revenue: 15000 },
  { day: 'Thu', orders: 9, revenue: 27000 },
  { day: 'Fri', orders: 12, revenue: 36000 },
  { day: 'Sat', orders: 8, revenue: 24000 },
  { day: 'Sun', orders: 6, revenue: 18000 },
];

const monthlyRevenue = [
  { month: 'Aug', revenue: 48000 },
  { month: 'Sep', revenue: 72000 },
  { month: 'Oct', revenue: 61000 },
  { month: 'Nov', revenue: 95000 },
  { month: 'Dec', revenue: 88000 },
  { month: 'Jan', revenue: 110000 },
];

// Animated counter hook
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(ease * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return value;
}

function StatCard({
  title, value, rawValue, icon, color, trend, loading,
}: {
  title: string; value: string; rawValue: number;
  icon: React.ReactNode; color: string; trend?: number; loading: boolean;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const animated = useCountUp(loading ? 0 : rawValue);

  const displayValue = loading
    ? '—'
    : value.startsWith('₦')
    ? `₦${animated.toLocaleString()}`
    : String(animated);

  return (
    <Card
      sx={{
        position: 'relative', overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 28px ${alpha(color, 0.18)}` },
      }}
    >
      {/* Accent bar */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: color, borderRadius: '20px 20px 0 0' }} />
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, pt: { xs: 2.5, sm: 3 } }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem' }}>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5, color: 'text.primary', letterSpacing: '-0.02em' }}>
              {displayValue}
            </Typography>
            {trend !== undefined && (
              <Stack direction="row" alignItems="center" spacing={0.4} sx={{ mt: 0.5 }}>
                {trend >= 0
                  ? <TrendingUpIcon sx={{ fontSize: 13, color: '#10b981' }} />
                  : <TrendingDownIcon sx={{ fontSize: 13, color: '#ef4444' }} />}
                <Typography variant="caption" fontWeight={700}
                  sx={{ color: trend >= 0 ? '#10b981' : '#ef4444', fontSize: '0.7rem' }}>
                  {Math.abs(trend)}% vs last week
                </Typography>
              </Stack>
            )}
          </Box>
          <Box sx={{
            width: 42, height: 42, borderRadius: 2.5, flexShrink: 0,
            bgcolor: alpha(color, isDark ? 0.15 : 0.1),
            display: 'flex', alignItems: 'center', justifyContent: 'center', color,
          }}>
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function LiveDot() {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 10, height: 10 }}>
      <Box sx={{
        position: 'absolute', width: 10, height: 10, borderRadius: '50%', bgcolor: '#10b981',
        animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
        '@keyframes ping': { '0%': { transform: 'scale(1)', opacity: 0.8 }, '100%': { transform: 'scale(2.2)', opacity: 0 } },
      }} />
      <FiberManualRecordIcon sx={{ fontSize: 8, color: '#10b981', position: 'relative' }} />
    </Box>
  );
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0, totalRunners: 0, pendingRunners: 0,
    totalOrders: 0, completedOrders: 0, revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalStudents: data.totalStudents || 0,
            totalRunners: data.totalRunners || 0,
            pendingRunners: data.pendingRunners || 0,
            totalOrders: data.totalOrders || 0,
            completedOrders: data.completedOrders || 0,
            revenue: data.revenue || 0,
          });
        }
      } finally {
        setLoading(false);
        setTick(t => t + 1);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const completionRate = stats.totalOrders
    ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0;

  const pieData = [
    { name: 'Completed', value: stats.completedOrders, color: '#10b981' },
    { name: 'Pending', value: stats.totalOrders - stats.completedOrders, color: '#f59e0b' },
  ];

  const statCards = [
    { title: 'Total Revenue', value: `₦${stats.revenue.toLocaleString()}`, rawValue: stats.revenue, icon: <AccountBalanceWalletIcon sx={{ fontSize: 20 }} />, color: '#10b981', trend: 12 },
    { title: 'Total Orders', value: String(stats.totalOrders), rawValue: stats.totalOrders, icon: <ShoppingCartIcon sx={{ fontSize: 20 }} />, color: '#3b82f6', trend: 8 },
    { title: 'Total Students', value: String(stats.totalStudents), rawValue: stats.totalStudents, icon: <PeopleIcon sx={{ fontSize: 20 }} />, color: '#8b5cf6', trend: 5 },
    { title: 'Active Runners', value: String(stats.totalRunners - stats.pendingRunners), rawValue: stats.totalRunners - stats.pendingRunners, icon: <DirectionsRunIcon sx={{ fontSize: 20 }} />, color: '#f59e0b', trend: -2 },
  ];

  const gridLine = isDark ? 'rgba(148,163,184,0.08)' : 'rgba(148,163,184,0.15)';
  const tickColor = isDark ? '#64748b' : '#94a3b8';
  const tooltipStyle = {
    borderRadius: 12, border: `1px solid ${isDark ? 'rgba(148,163,184,0.15)' : 'rgba(148,163,184,0.2)'}`,
    background: isDark ? '#1e293b' : '#fff',
    color: isDark ? '#f1f5f9' : '#0f172a',
    fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  };

  const quickActions = [
    { title: 'Review Orders', desc: 'Assign runners & monitor tasks', href: '/admin/orders', color: '#3b82f6' },
    { title: 'Approve Runners', desc: 'Process pending accounts', href: '/admin/runners', color: '#f59e0b' },
    { title: 'Manage Students', desc: 'Inspect profiles & activity', href: '/admin/students', color: '#8b5cf6' },
    { title: 'Transactions', desc: 'Track payouts & revenue', href: '/admin/transactions', color: '#10b981' },
  ];

  return (
    <Box>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }}
        justifyContent="space-between" spacing={1.5} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: '-0.02em' }}>
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
            <LiveDot />
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Live dashboard · auto-refreshes every 30s
            </Typography>
          </Stack>
        </Box>
        {stats.pendingRunners > 0 && (
          <Chip
            label={`${stats.pendingRunners} runner${stats.pendingRunners > 1 ? 's' : ''} pending approval`}
            size="small"
            icon={<AccessTimeIcon style={{ fontSize: 13 }} />}
            onClick={() => router.push('/admin/runners')}
            sx={{ bgcolor: alpha('#f59e0b', 0.12), color: '#d97706', fontWeight: 800, fontSize: 11, cursor: 'pointer', border: 'none' }}
          />
        )}
      </Stack>

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid key={card.title} size={{ xs: 6, sm: 6, lg: 3 }}>
            <StatCard {...card} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Charts row 1 */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Weekly orders area chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight={800}>Weekly Order Activity</Typography>
                  <Typography variant="caption" color="text.secondary">Orders placed per day this week</Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <LiveDot />
                  <Typography variant="caption" fontWeight={700} color="text.secondary">Live</Typography>
                </Stack>
              </Stack>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyOrders} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridLine} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="orders" stroke="#f59e0b" strokeWidth={2.5}
                    fill="url(#ordersGrad)" dot={{ fill: '#f59e0b', r: 3 }} activeDot={{ r: 5 }} name="Orders" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Order status pie */}
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Typography variant="body2" fontWeight={800} sx={{ mb: 0.5 }}>Order Completion</Typography>
              <Typography variant="caption" color="text.secondary">All-time breakdown</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={loading || stats.totalOrders === 0
                        ? [{ name: 'No data', value: 1, color: isDark ? '#334155' : '#e2e8f0' }]
                        : pieData}
                      cx="50%" cy="50%"
                      innerRadius={48} outerRadius={72}
                      paddingAngle={3} dataKey="value"
                      strokeWidth={0}
                    >
                      {(loading || stats.totalOrders === 0
                        ? [{ color: isDark ? '#334155' : '#e2e8f0' }]
                        : pieData
                      ).map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {pieData.map(d => (
                  <Stack key={d.name} direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: d.color }} />
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>{d.name}</Typography>
                    </Stack>
                    <Typography variant="caption" fontWeight={800}>{loading ? '—' : d.value}</Typography>
                  </Stack>
                ))}
                <Divider />
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Completion Rate</Typography>
                  <Typography variant="caption" fontWeight={900} sx={{ color: '#10b981' }}>
                    {loading ? '—' : `${completionRate}%`}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts row 2 */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Monthly revenue bar */}
        <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Typography variant="body2" fontWeight={800} sx={{ mb: 0.5 }}>Monthly Revenue</Typography>
              <Typography variant="caption" color="text.secondary">Last 6 months (₦)</Typography>
              <ResponsiveContainer width="100%" height={160} style={{ marginTop: 12 }}>
                <BarChart data={monthlyRevenue} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridLine} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => [`₦${Number(v).toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Platform health */}
        <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Typography variant="body2" fontWeight={800} sx={{ mb: 0.5 }}>Platform Health</Typography>
              <Typography variant="caption" color="text.secondary">Real-time snapshot</Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {[
                  { label: 'Completed Orders', value: loading ? '—' : stats.completedOrders, icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, color: '#10b981', pct: completionRate },
                  { label: 'Active Runners', value: loading ? '—' : stats.totalRunners - stats.pendingRunners, icon: <DirectionsRunIcon sx={{ fontSize: 16 }} />, color: '#3b82f6', pct: stats.totalRunners ? Math.round(((stats.totalRunners - stats.pendingRunners) / stats.totalRunners) * 100) : 0 },
                  { label: 'Pending Approvals', value: loading ? '—' : stats.pendingRunners, icon: <AccessTimeIcon sx={{ fontSize: 16 }} />, color: '#f59e0b', pct: stats.totalRunners ? Math.round((stats.pendingRunners / stats.totalRunners) * 100) : 0 },
                ].map(item => (
                  <Box key={item.label}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Stack direction="row" alignItems="center" spacing={0.8}>
                        <Box sx={{ color: item.color }}>{item.icon}</Box>
                        <Typography variant="caption" fontWeight={700}>{item.label}</Typography>
                      </Stack>
                      <Typography variant="caption" fontWeight={900} sx={{ color: item.color }}>{item.value}</Typography>
                    </Stack>
                    <Box sx={{ height: 5, borderRadius: 99, bgcolor: alpha(item.color, 0.12), overflow: 'hidden' }}>
                      <Box sx={{
                        height: '100%', borderRadius: 99, bgcolor: item.color,
                        width: `${item.pct}%`,
                        transition: 'width 1s ease',
                      }} />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick actions */}
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Typography variant="body2" fontWeight={800} sx={{ mb: 2 }}>Quick Actions</Typography>
          <Grid container spacing={1.5}>
            {quickActions.map((action) => (
              <Grid key={action.title} size={{ xs: 6, sm: 6, lg: 3 }}>
                <Box
                  onClick={() => router.push(action.href)}
                  sx={{
                    p: { xs: 1.5, sm: 2 }, borderRadius: 3, cursor: 'pointer',
                    border: '1px solid', borderColor: 'divider',
                    bgcolor: 'background.default',
                    transition: 'all 0.18s',
                    '&:hover': {
                      bgcolor: 'background.paper',
                      borderColor: alpha(action.color, 0.4),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 20px ${alpha(action.color, 0.14)}`,
                    },
                  }}
                >
                  <Typography variant="body2" fontWeight={800} sx={{ mb: 0.3, fontSize: '0.8rem' }}>{action.title}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>{action.desc}</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.4} sx={{ mt: 1.5, color: action.color }}>
                    <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.7rem' }}>Open</Typography>
                    <ArrowForwardIcon sx={{ fontSize: 12 }} />
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
