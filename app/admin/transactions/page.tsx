'use client';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PaidIcon from '@mui/icons-material/Paid';
import { alpha } from '@mui/material/styles';
import { supabase } from '@/lib/supabase';

type Tx = {
  id: string; amount: number; type: 'credit' | 'debit';
  status: string; note: string | null; created_at: string;
  user_id: string; order_id: string | null; user_name: string;
};

type Withdrawal = {
  id: string; user_id: string; amount: number; status: string;
  created_at: string; user_name: string;
  bank_name: string | null; bank_account_number: string | null; bank_account_name: string | null;
};

const TX_STATUS: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'default' }> = {
  completed: { label: 'Completed', color: 'success' },
  held:      { label: 'Held',      color: 'warning' },
  refunded:  { label: 'Refunded',  color: 'info' },
};

const W_STATUS: Record<string, { label: string; color: 'warning' | 'success' | 'error' | 'info' | 'default' }> = {
  pending:  { label: 'Pending',  color: 'warning' },
  approved: { label: 'Approved', color: 'info' },
  paid:     { label: 'Paid',     color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
};

export default function AdminTransactionsPage() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [txFilter, setTxFilter] = useState('all');
  const [wFilter, setWFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authHeader = { Authorization: `Bearer ${session?.access_token ?? ''}` };
      const [txRes, wRes] = await Promise.all([
        fetch('/api/admin/transactions', { headers: authHeader }),
        fetch('/api/admin/withdrawals', { headers: authHeader }),
      ]);
      if (txRes.ok) { const d = await txRes.json(); setTxs(d.data || []); }
      if (wRes.ok)  { const d = await wRes.json();  setWithdrawals(d.data || []); }
    } finally { setLoading(false); }
  };

  const updateWithdrawal = async (id: string, status: string) => {
    setUpdating(id + status);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/withdrawals/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token ?? ''}` },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w));
    } finally { setUpdating(null); }
  };

  const filteredTxs = useMemo(() => {
    let r = [...txs];
    if (txFilter !== 'all') r = r.filter(t => t.status === txFilter);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(t => t.user_name.toLowerCase().includes(q) || (t.note || '').toLowerCase().includes(q));
    }
    return r;
  }, [txs, txFilter, search]);

  const filteredWithdrawals = useMemo(() => {
    let r = [...withdrawals];
    if (wFilter !== 'all') r = r.filter(w => w.status === wFilter);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(w => w.user_name.toLowerCase().includes(q));
    }
    return r;
  }, [withdrawals, wFilter, search]);

  const totalRevenue = txs.filter(t => t.status === 'completed' && t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const heldCount = txs.filter(t => t.status === 'held').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: alpha('#10b981', 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
          <AccountBalanceWalletIcon />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={900}>Money & Transactions</Typography>
          <Typography variant="body2" color="text.secondary">Track wallet flow, holds, and withdrawal requests</Typography>
        </Box>
      </Stack>

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Revenue', value: `₦${totalRevenue.toLocaleString()}`, color: '#10b981' },
          { label: 'Held Funds', value: heldCount, color: '#f59e0b' },
          { label: 'Pending Withdrawals', value: pendingWithdrawals, color: '#3b82f6' },
        ].map(s => (
          <Grid key={s.label} size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem' }}>
                  {s.label}
                </Typography>
                <Typography variant="h5" fontWeight={900} sx={{ color: s.color, mt: 0.5 }}>{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs + search/filter */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <Tabs
              value={tab}
              onChange={(_, v) => { setTab(v); setSearch(''); }}
              sx={{
                minHeight: 36,
                '& .MuiTab-root': { minHeight: 36, fontWeight: 700, fontSize: 13, textTransform: 'none', px: 2 },
                '& .MuiTabs-indicator': { bgcolor: '#f59e0b' },
              }}
            >
              <Tab label="Wallet Transactions" />
              <Tab label={`Withdrawals${pendingWithdrawals > 0 ? ` (${pendingWithdrawals})` : ''}`} />
            </Tabs>

            <Box sx={{ flex: 1 }} />

            <TextField
              size="small" placeholder="Search name or note…"
              value={search} onChange={e => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
              sx={{ width: { xs: '100%', md: 220 } }}
            />

            {tab === 0 ? (
              <ToggleButtonGroup size="small" value={txFilter} exclusive onChange={(_, v) => v && setTxFilter(v)}>
                {['all', 'completed', 'held', 'refunded'].map(s => (
                  <ToggleButton key={s} value={s} sx={{ px: 1.5, fontWeight: 700, fontSize: 11 }}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            ) : (
              <ToggleButtonGroup size="small" value={wFilter} exclusive onChange={(_, v) => v && setWFilter(v)}>
                {['all', 'pending', 'approved', 'paid', 'rejected'].map(s => (
                  <ToggleButton key={s} value={s} sx={{ px: 1.5, fontWeight: 700, fontSize: 11 }}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Transactions table */}
      {tab === 0 && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress sx={{ color: '#f59e0b' }} /></TableCell></TableRow>
                ) : filteredTxs.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><Typography color="text.secondary">No transactions found</Typography></TableCell></TableRow>
                ) : filteredTxs.map(tx => {
                  const sc = TX_STATUS[tx.status] || { label: tx.status, color: 'default' as const };
                  const isCredit = tx.type === 'credit';
                  return (
                    <TableRow key={tx.id} hover>
                      <TableCell>
                        <Box sx={{
                          width: 32, height: 32, borderRadius: 2,
                          bgcolor: alpha(isCredit ? '#10b981' : '#ef4444', 0.1),
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: isCredit ? '#10b981' : '#ef4444',
                        }}>
                          {isCredit ? <ArrowUpwardIcon sx={{ fontSize: 16 }} /> : <ArrowDownwardIcon sx={{ fontSize: 16 }} />}
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="body2" fontWeight={700}>{tx.user_name}</Typography></TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                          {tx.note || (tx.order_id ? `Order #${tx.order_id.slice(-6)}` : tx.type)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={800} sx={{ color: isCredit ? '#10b981' : '#ef4444' }}>
                          {isCredit ? '+' : '-'}₦{tx.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell><Chip label={sc.label} color={sc.color} size="small" /></TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Withdrawals table */}
      {tab === 1 && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Runner</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Bank Details</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress sx={{ color: '#f59e0b' }} /></TableCell></TableRow>
                ) : filteredWithdrawals.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><Typography color="text.secondary">No withdrawal requests found</Typography></TableCell></TableRow>
                ) : filteredWithdrawals.map(w => {
                  const sc = W_STATUS[w.status] || { label: w.status, color: 'default' as const };
                  return (
                    <TableRow key={w.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700}>{w.user_name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={800} sx={{ color: '#10b981' }}>
                          ₦{w.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{w.bank_name || '—'}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {w.bank_account_number || '—'} · {w.bank_account_name || ''}
                        </Typography>
                      </TableCell>
                      <TableCell><Chip label={sc.label} color={sc.color} size="small" /></TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(w.created_at).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          {w.status === 'pending' && (
                            <Button size="small" variant="contained" color="success"
                              disabled={updating === w.id + 'approved'}
                              startIcon={updating === w.id + 'approved' ? <CircularProgress size={12} /> : <CheckCircleIcon sx={{ fontSize: 14 }} />}
                              onClick={() => updateWithdrawal(w.id, 'approved')}
                              sx={{ borderRadius: 2, fontSize: 11 }}>
                              Approve
                            </Button>
                          )}
                          {(w.status === 'pending' || w.status === 'approved') && (
                            <Button size="small" variant="contained"
                              disabled={updating === w.id + 'paid'}
                              startIcon={updating === w.id + 'paid' ? <CircularProgress size={12} /> : <PaidIcon sx={{ fontSize: 14 }} />}
                              onClick={() => updateWithdrawal(w.id, 'paid')}
                              sx={{ borderRadius: 2, fontSize: 11, bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}>
                              Mark Paid
                            </Button>
                          )}
                          {w.status === 'pending' && (
                            <Button size="small" variant="outlined" color="error"
                              disabled={updating === w.id + 'rejected'}
                              startIcon={<CancelIcon sx={{ fontSize: 14 }} />}
                              onClick={() => updateWithdrawal(w.id, 'rejected')}
                              sx={{ borderRadius: 2, fontSize: 11 }}>
                              Reject
                            </Button>
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
      )}
    </Box>
  );
}
