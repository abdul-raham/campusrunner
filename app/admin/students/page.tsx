'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { alpha } from '@mui/material/styles';
import { supabase } from '@/lib/supabase';

interface Student {
  id: string; full_name: string; email: string; phone: string;
  university: string; created_at: string; order_count: number; total_spent: number;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => {
    if (!search) { setFiltered(students); return; }
    const q = search.toLowerCase();
    setFiltered(students.filter(s => s.full_name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.university.toLowerCase().includes(q)));
  }, [search, students]);

  const fetchStudents = async () => {
    try {
      const { data: profiles } = await supabase.from('profiles').select('id,full_name,email,phone,university,created_at').eq('role', 'student');
      const withStats = await Promise.all((profiles || []).map(async p => {
        const { data: orders } = await supabase.from('orders').select('final_amount').eq('student_id', p.id);
        return { ...p, order_count: orders?.length || 0, total_spent: orders?.reduce((s, o) => s + (o.final_amount || 0), 0) || 0 };
      }));
      setStudents(withStats); setFiltered(withStats);
    } finally { setLoading(false); }
  };

  const totalSpent = students.reduce((s, st) => s + st.total_spent, 0);
  const thisMonth = students.filter(s => new Date(s.created_at) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)).length;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: alpha('#8b5cf6', 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
          <PeopleIcon />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={900}>Student Management</Typography>
          <Typography variant="body2" color="text.secondary">View and manage all registered students</Typography>
        </Box>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Students', value: students.length, icon: <PeopleIcon />, color: '#8b5cf6' },
          { label: 'Joined This Month', value: thisMonth, icon: <TrendingUpIcon />, color: '#10b981' },
          { label: 'Total Spent', value: `₦${totalSpent.toLocaleString()}`, icon: <AccountBalanceWalletIcon />, color: '#3b82f6' },
        ].map(s => (
          <Grid key={s.label} size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</Typography>
                    <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>{s.value}</Typography>
                  </Box>
                  <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: alpha(s.color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                    {s.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <TextField size="small" fullWidth placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
        </CardContent>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>University</TableCell>
                <TableCell>Orders</TableCell>
                <TableCell>Total Spent</TableCell>
                <TableCell>Joined</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress sx={{ color: '#f59e0b' }} /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><Typography color="text.secondary">No students found</Typography></TableCell></TableRow>
              ) : filtered.map(s => (
                <TableRow key={s.id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar sx={{ width: 34, height: 34, fontSize: 13, fontWeight: 800, bgcolor: '#8b5cf6' }}>{s.full_name.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>{s.full_name}</Typography>
                        <Typography variant="caption" color="text.secondary">{s.email}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell><Typography variant="body2">{s.phone}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{s.university}</Typography></TableCell>
                  <TableCell><Typography variant="body2" fontWeight={700}>{s.order_count}</Typography></TableCell>
                  <TableCell><Typography variant="body2" fontWeight={700}>₦{s.total_spent.toLocaleString()}</Typography></TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary">{new Date(s.created_at).toLocaleDateString()}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
