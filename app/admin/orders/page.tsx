'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Cancel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { alpha } from '@mui/material/styles';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string; title: string; description: string; status: string;
  final_amount: number; created_at: string; student_id: string;
  runner_id: string | null; pickup_location: string; service_category_id: string;
  service_categories: { name: string } | null;
  student_profile: { full_name: string; phone: string } | null;
  runner_profile: { full_name: string } | null;
}
const STATUS_CONFIG: Record<string, { label: string; color: 'success' | 'info' | 'warning' | 'error' | 'default' }> = {
  completed: { label: 'Completed', color: 'success' },
  in_progress: { label: 'In Progress', color: 'info' },
  accepted: { label: 'Accepted', color: 'info' },
  pending: { label: 'Pending', color: 'warning' },
  cancelled: { label: 'Cancelled', color: 'error' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, []);
  useEffect(() => {
    let r = orders;
    if (statusFilter !== 'all') r = r.filter(o => o.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(o => o.title.toLowerCase().includes(q) || o.student_profile?.full_name.toLowerCase().includes(q));
    }
    setFiltered(r);
  }, [statusFilter, search, orders]);

  const fetchOrders = async () => {
    try {
      const { data } = await supabase.from('orders')
        .select('id,title,description,status,final_amount,created_at,student_id,runner_id,pickup_location,service_category_id')
        .order('created_at', { ascending: false });
      const studentIds = [...new Set((data || []).map(o => o.student_id).filter(Boolean))];
      const runnerIds = [...new Set((data || []).map(o => o.runner_id).filter(Boolean))];
      const catIds = [...new Set((data || []).map(o => o.service_category_id).filter(Boolean))];
      const [{ data: students }, { data: runnerProfiles }, { data: cats }] = await Promise.all([
        studentIds.length ? supabase.from('profiles').select('id,full_name,phone').in('id', studentIds) : Promise.resolve({ data: [] }),
        runnerIds.length ? supabase.from('profiles').select('id,full_name').in('id', runnerIds) : Promise.resolve({ data: [] }),
        catIds.length ? supabase.from('service_categories').select('id,name').in('id', catIds) : Promise.resolve({ data: [] }),
      ]);
      setOrders((data || []).map(o => ({
        ...o,
        service_categories: (cats || []).find(c => c.id === o.service_category_id) || { name: 'General' },
        student_profile: (students || []).find(s => s.id === o.student_id) || null,
        runner_profile: (runnerProfiles || []).find(r => r.id === o.runner_id) || null,
      })));
    } finally { setLoading(false); }
  };

  const cancelOrder = async (id: string) => {
    setCancelling(id);
    try {
      await fetch('/api/admin/cancel-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: id }) });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
    } finally { setCancelling(null); }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: alpha('#f59e0b', 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
          <ShoppingCartIcon />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={900}>Order Management</Typography>
          <Typography variant="body2" color="text.secondary">Monitor, assign, and manage all platform orders</Typography>
        </Box>
      </Stack>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField size="small" placeholder="Search orders or students..." value={search} onChange={e => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
              sx={{ flex: 1 }} />
            <ToggleButtonGroup size="small" value={statusFilter} exclusive onChange={(_, v) => v && setStatusFilter(v)}>
              {['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'].map(s => (
                <ToggleButton key={s} value={s} sx={{ px: 2, fontWeight: 700, fontSize: 12 }}>
                  {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Runner</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}><CircularProgress sx={{ color: '#f59e0b' }} /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}><Typography color="text.secondary">No orders found</Typography></TableCell></TableRow>
              ) : filtered.map(order => {
                const sc = STATUS_CONFIG[order.status] || { label: order.status, color: 'default' as const };
                return (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 160 }}>{order.title}</Typography>
                    </TableCell>
                    <TableCell><Typography variant="body2">{order.student_profile?.full_name || '—'}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{order.service_categories?.name}</Typography></TableCell>
                    <TableCell><Typography variant="body2" fontWeight={700}>₦{(order.final_amount || 0).toLocaleString()}</Typography></TableCell>
                    <TableCell><Chip label={sc.label} color={sc.color} size="small" /></TableCell>
                    <TableCell><Typography variant="body2">{order.runner_profile?.full_name || '—'}</Typography></TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{new Date(order.created_at).toLocaleDateString()}</Typography></TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <IconButton size="small" component={Link} href={`/admin/orders/${order.id}`}><VisibilityIcon fontSize="small" /></IconButton>
                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                          <IconButton size="small" onClick={() => cancelOrder(order.id)} disabled={cancelling === order.id} sx={{ color: 'error.main' }}>
                            {cancelling === order.id ? <CircularProgress size={16} /> : <CancelIcon fontSize="small" />}
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>


    </Box>
  );
}
