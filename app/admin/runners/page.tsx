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
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { alpha, useTheme } from '@mui/material/styles';

interface Runner {
  id: string; full_name: string; email: string; phone: string;
  university: string; hostel_location: string | null; matric_number: string | null; created_at: string;
  runners: { id: string; verification_status: string; rating: number; total_jobs: number };
}

const STATUS_CONFIG: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'default' }> = {
  approved:  { label: 'Approved',  color: 'success' },
  pending:   { label: 'Pending',   color: 'warning' },
  declined:  { label: 'Declined',  color: 'error'   },
  rejected:  { label: 'Rejected',  color: 'error'   },
  suspended: { label: 'Suspended', color: 'default' },
};

function DetailDialog({ runner, onClose, onUpdate, updating }: {
  runner: Runner; onClose: () => void;
  onUpdate: (id: string, status: string) => void; updating: string | null;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const sc = STATUS_CONFIG[runner.runners.verification_status] || { label: runner.runners.verification_status, color: 'default' as const };
  const isUpdating = updating === runner.id;
  const status = runner.runners.verification_status;

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: isDark
            ? 'rgba(15,23,42,0.85)'
            : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid',
          borderColor: isDark ? 'rgba(148,163,184,0.15)' : 'rgba(148,163,184,0.2)',
          boxShadow: isDark
            ? '0 24px 64px rgba(0,0,0,0.6)'
            : '0 24px 64px rgba(15,23,42,0.15)',
          overflow: 'hidden',
        },
      }}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', bgcolor: 'rgba(0,0,0,0.4)' },
        },
      }}
    >
      {/* Header */}
      <Box sx={{
        p: 3, pb: 2,
        background: 'linear-gradient(135deg, #f59e0b22, #d9770611)',
        borderBottom: '1px solid', borderColor: isDark ? 'rgba(148,163,184,0.1)' : 'rgba(148,163,184,0.15)',
      }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{
              width: 56, height: 56, fontSize: 22, fontWeight: 900,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              boxShadow: '0 4px 16px rgba(245,158,11,0.4)',
            }}>
              {runner.full_name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={900}>{runner.full_name}</Typography>
              <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                <Chip label={sc.label} color={sc.color} size="small" sx={{ fontWeight: 800, fontSize: 11 }} />
                <Typography variant="caption" color="text.secondary">
                  ⭐ {(runner.runners.rating ?? 0).toFixed(1)} · {runner.runners.total_jobs} jobs
                </Typography>
              </Stack>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {[
            { icon: <EmailIcon fontSize="small" />, label: 'Email', value: runner.email },
            { icon: <PhoneIcon fontSize="small" />, label: 'Phone', value: runner.phone || 'N/A' },
            { icon: <SchoolIcon fontSize="small" />, label: 'University', value: runner.university },
            { icon: <HomeIcon fontSize="small" />, label: 'Hostel', value: runner.hostel_location || 'N/A' },
            { icon: <BadgeIcon fontSize="small" />, label: 'Matric Number', value: runner.matric_number || 'N/A' },
            { icon: <CalendarTodayIcon fontSize="small" />, label: 'Joined', value: new Date(runner.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { icon: <StarIcon fontSize="small" />, label: 'Rating', value: `${(runner.runners.rating ?? 0).toFixed(1)} / 5.0` },
            { icon: <WorkIcon fontSize="small" />, label: 'Total Jobs', value: String(runner.runners.total_jobs ?? 0) },
          ].map(({ icon, label, value }) => (
            <Grid key={label} size={{ xs: 12, sm: 6 }}>
              <Box sx={{
                p: 1.5, borderRadius: 2,
                bgcolor: isDark ? 'rgba(148,163,184,0.06)' : 'rgba(148,163,184,0.07)',
                border: '1px solid', borderColor: isDark ? 'rgba(148,163,184,0.1)' : 'rgba(148,163,184,0.12)',
              }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                  <Box sx={{ color: '#f59e0b' }}>{icon}</Box>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</Typography>
                </Stack>
                <Typography variant="body2" fontWeight={700}>{value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Actions */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {status === 'pending' && (
            <>
              <Button variant="contained" color="success" disabled={isUpdating}
                onClick={() => onUpdate(runner.id, 'approved')}
                startIcon={isUpdating ? <CircularProgress size={14} color="inherit" /> : <CheckCircleIcon />}
                sx={{ borderRadius: 2, fontWeight: 800 }}>Approve</Button>
              <Button variant="outlined" color="error" disabled={isUpdating}
                onClick={() => onUpdate(runner.id, 'declined')}
                startIcon={<CancelIcon />}
                sx={{ borderRadius: 2, fontWeight: 800 }}>Decline</Button>
            </>
          )}
          {status === 'approved' && (
            <Button variant="outlined" color="warning" disabled={isUpdating}
              onClick={() => onUpdate(runner.id, 'suspended')}
              startIcon={isUpdating ? <CircularProgress size={14} color="inherit" /> : <PauseCircleIcon />}
              sx={{ borderRadius: 2, fontWeight: 800 }}>Suspend Runner</Button>
          )}
          {['suspended', 'rejected', 'declined'].includes(status) && (
            <Button variant="contained" color="success" disabled={isUpdating}
              onClick={() => onUpdate(runner.id, 'approved')}
              startIcon={isUpdating ? <CircularProgress size={14} color="inherit" /> : <CheckCircleIcon />}
              sx={{ borderRadius: 2, fontWeight: 800 }}>Reactivate</Button>
          )}
          <Button variant="text" onClick={onClose} sx={{ borderRadius: 2, ml: 'auto', color: 'text.secondary' }}>Close</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminRunnersPage() {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [filtered, setFiltered] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [detail, setDetail] = useState<Runner | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchRunners(); }, []);
  useEffect(() => {
    let r = runners;
    if (statusFilter !== 'all') r = r.filter(x => x.runners?.verification_status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(x => x.full_name.toLowerCase().includes(q) || x.email.toLowerCase().includes(q) || x.university.toLowerCase().includes(q));
    }
    setFiltered(r);
  }, [statusFilter, search, runners]);

  const fetchRunners = async () => {
    try {
      const res = await fetch('/api/admin/runners');
      const data = await res.json();
      if (!res.ok) { setError(`API error ${res.status}: ${data.error}`); return; }
      setRunners(data.runners || []);
    } finally { setLoading(false); }
  };

  const updateStatus = async (profileId: string, status: string) => {
    setUpdating(profileId);
    try {
      await fetch('/api/admin/runners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, status }),
      });
      const normalized = status === 'declined' ? 'rejected' : status;
      setRunners(prev => prev.map(r => r.id === profileId ? { ...r, runners: { ...r.runners, verification_status: normalized } } : r));
      // update detail dialog if open
      setDetail(prev => prev?.id === profileId ? { ...prev, runners: { ...prev.runners, verification_status: normalized } } : prev);
    } finally { setUpdating(null); }
  };

  const counts = {
    total:     runners.length,
    pending:   runners.filter(r => r.runners?.verification_status === 'pending').length,
    approved:  runners.filter(r => r.runners?.verification_status === 'approved').length,
    suspended: runners.filter(r => r.runners?.verification_status === 'suspended').length,
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: alpha('#f59e0b', 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
          <DirectionsRunIcon />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={900}>Runner Management</Typography>
          <Typography variant="body2" color="text.secondary">Approve, manage, and monitor all platform runners</Typography>
        </Box>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Runners', value: counts.total,     color: '#64748b' },
          { label: 'Pending',       value: counts.pending,   color: '#f59e0b' },
          { label: 'Approved',      value: counts.approved,  color: '#10b981' },
          { label: 'Suspended',     value: counts.suspended, color: '#94a3b8' },
        ].map(s => (
          <Grid key={s.label} size={{ xs: 6, sm: 3 }}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</Typography>
                <Typography variant="h4" fontWeight={900} sx={{ color: s.color, mt: 0.5 }}>{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField size="small" placeholder="Search runners..." value={search} onChange={e => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} sx={{ flex: 1 }} />
            <ToggleButtonGroup size="small" value={statusFilter} exclusive onChange={(_, v) => v && setStatusFilter(v)}>
              {['all', 'pending', 'approved', 'rejected', 'suspended'].map(s => (
                <ToggleButton key={s} value={s} sx={{ px: 2, fontWeight: 700, fontSize: 12 }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>
        </CardContent>
      </Card>

      {error && (
        <Card sx={{ mb: 2, border: '1px solid', borderColor: 'error.main' }}>
          <CardContent sx={{ p: 2 }}>
            <Typography color="error" fontWeight={700}>{error}</Typography>
          </CardContent>
        </Card>
      )}

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Runner</TableCell>
                <TableCell>University</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Jobs</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}><CircularProgress sx={{ color: '#f59e0b' }} /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}><Typography color="text.secondary">No runners found</Typography></TableCell></TableRow>
              ) : filtered.map(runner => {
                const sc = STATUS_CONFIG[runner.runners.verification_status] || { label: runner.runners.verification_status, color: 'default' as const };
                const isUpdating = updating === runner.id;
                const status = runner.runners.verification_status;
                return (
                  <TableRow key={runner.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{ width: 34, height: 34, fontSize: 13, fontWeight: 800, bgcolor: '#f59e0b' }}>
                          {runner.full_name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{runner.full_name}</Typography>
                          <Typography variant="caption" color="text.secondary">{runner.email}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell><Typography variant="body2">{runner.university}</Typography></TableCell>
                    <TableCell><Typography variant="body2">⭐ {(runner.runners.rating ?? 0).toFixed(1)}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{runner.runners.total_jobs}</Typography></TableCell>
                    <TableCell><Chip label={sc.label} color={sc.color} size="small" /></TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{new Date(runner.created_at).toLocaleDateString()}</Typography></TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Button size="small" variant="outlined" onClick={() => setDetail(runner)} sx={{ borderRadius: 2, fontSize: 11 }}>Details</Button>
                        {status === 'pending' && (
                          <>
                            <Button size="small" variant="contained" color="success" disabled={isUpdating}
                              onClick={() => updateStatus(runner.id, 'approved')}
                              startIcon={isUpdating ? <CircularProgress size={12} color="inherit" /> : <CheckCircleIcon fontSize="small" />}
                              sx={{ borderRadius: 2, fontSize: 11 }}>Approve</Button>
                            <Button size="small" variant="contained" color="error" disabled={isUpdating}
                              onClick={() => updateStatus(runner.id, 'declined')}
                              startIcon={<CancelIcon fontSize="small" />}
                              sx={{ borderRadius: 2, fontSize: 11 }}>Decline</Button>
                          </>
                        )}
                        {status === 'approved' && (
                          <Button size="small" variant="outlined" color="warning" disabled={isUpdating}
                            onClick={() => updateStatus(runner.id, 'suspended')}
                            startIcon={isUpdating ? <CircularProgress size={12} color="inherit" /> : <PauseCircleIcon fontSize="small" />}
                            sx={{ borderRadius: 2, fontSize: 11 }}>Suspend</Button>
                        )}
                        {['suspended', 'rejected', 'declined'].includes(status) && (
                          <Button size="small" variant="contained" color="success" disabled={isUpdating}
                            onClick={() => updateStatus(runner.id, 'approved')}
                            startIcon={isUpdating ? <CircularProgress size={12} color="inherit" /> : <CheckCircleIcon fontSize="small" />}
                            sx={{ borderRadius: 2, fontSize: 11 }}>Reactivate</Button>
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

      {detail && (
        <DetailDialog
          runner={detail}
          onClose={() => setDetail(null)}
          onUpdate={updateStatus}
          updating={updating}
        />
      )}
    </Box>
  );
}
