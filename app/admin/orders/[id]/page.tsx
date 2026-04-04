'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CancelIcon from '@mui/icons-material/Cancel';
import { alpha, useTheme } from '@mui/material/styles';
import { supabase } from '@/lib/supabase';

interface OrderDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  final_amount: number;
  platform_fee: number;
  runner_payout: number;
  created_at: string;
  updated_at: string;
  student_id: string;
  runner_id: string | null;
  pickup_location: string;
  delivery_location: string;
  service_categories: { name: string } | null;
  student_profile: { full_name: string; email: string; phone: string } | null;
  runner_profile: { full_name: string; email: string; phone: string } | null;
  order_items: Array<{ id: string; item_name: string; quantity: number; price: number }>;
}

const STATUS_CONFIG: Record<string, { label: string; color: 'success' | 'info' | 'warning' | 'error' | 'default' }> = {
  completed:   { label: 'Completed',   color: 'success' },
  in_progress: { label: 'In Progress', color: 'info' },
  accepted:    { label: 'Accepted',    color: 'info' },
  pending:     { label: 'Pending',     color: 'warning' },
  cancelled:   { label: 'Cancelled',   color: 'error' },
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start"
      sx={{ py: 1.2, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ minWidth: 110 }}>{label}</Typography>
      <Typography variant="body2" fontWeight={700} sx={{ textAlign: 'right', flex: 1 }}>{value}</Typography>
    </Stack>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
      <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: alpha('#f59e0b', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
        {icon}
      </Box>
      <Typography variant="body1" fontWeight={800}>{title}</Typography>
    </Stack>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (params.id) fetchOrder(params.id as string);
  }, [params.id]);

  const fetchOrder = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id,title,description,status,final_amount,platform_fee,runner_payout,created_at,updated_at,student_id,runner_id,pickup_location,delivery_location')
        .eq('id', id)
        .single();
      if (error) throw error;

      const [{ data: student }, { data: runner }, { data: items }] = await Promise.all([
        data.student_id
          ? supabase.from('profiles').select('full_name,email,phone').eq('id', data.student_id).single()
          : Promise.resolve({ data: null }),
        data.runner_id
          ? supabase.from('profiles').select('full_name,email,phone').eq('id', data.runner_id).single()
          : Promise.resolve({ data: null }),
        supabase.from('order_items').select('id,item_name,quantity,price').eq('order_id', id),
      ]);

      setOrder({
        ...data,
        service_categories: { name: 'General Service' },
        student_profile: student,
        runner_profile: runner,
        order_items: items || [],
      });
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      await fetch('/api/admin/cancel-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });
      setOrder(prev => prev ? { ...prev, status: 'cancelled' } : prev);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress sx={{ color: '#f59e0b' }} />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Order Not Found</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>This order doesn't exist or was removed.</Typography>
        <Button variant="contained" onClick={() => router.push('/admin/orders')} sx={{ borderRadius: 2 }}>
          Back to Orders
        </Button>
      </Box>
    );
  }

  const sc = STATUS_CONFIG[order.status] || { label: order.status, color: 'default' as const };

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/orders')}
          variant="outlined"
          size="small"
          sx={{ borderRadius: 2, fontWeight: 700, flexShrink: 0 }}
        >
          Orders
        </Button>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={1}>
            <Typography variant="h6" fontWeight={900} noWrap sx={{ flex: 1 }}>{order.title}</Typography>
            <Chip label={sc.label} color={sc.color} size="small" sx={{ fontWeight: 800, flexShrink: 0 }} />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            ID: {order.id.slice(0, 8)}… · {new Date(order.created_at).toLocaleString()}
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={2}>
        {/* Left */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={2}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <SectionHeader icon={<ReceiptIcon sx={{ fontSize: 16 }} />} title="Order Summary" />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {order.description || 'No description provided.'}
                </Typography>
                <InfoRow label="Service" value={order.service_categories?.name || 'General'} />
                <InfoRow label="Pickup" value={
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <LocationOnIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                    <span>{order.pickup_location || '—'}</span>
                  </Stack>
                } />
                <InfoRow label="Delivery" value={
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <LocationOnIcon sx={{ fontSize: 14, color: '#10b981' }} />
                    <span>{order.delivery_location || '—'}</span>
                  </Stack>
                } />
              </CardContent>
            </Card>

            {order.order_items.length > 0 && (
              <Card>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <SectionHeader icon={<ReceiptIcon sx={{ fontSize: 16 }} />} title="Order Items" />
                  <Stack spacing={0}>
                    {order.order_items.map(item => (
                      <Stack key={item.id} direction="row" justifyContent="space-between" alignItems="center"
                        sx={{ py: 1.2, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{item.item_name}</Typography>
                          <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={800}>
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <SectionHeader icon={<AccessTimeIcon sx={{ fontSize: 16 }} />} title="Timeline" />
                <Stack spacing={2}>
                  {[
                    { label: 'Order Created', time: order.created_at, color: '#10b981' },
                    ...(order.updated_at !== order.created_at
                      ? [{ label: 'Last Updated', time: order.updated_at, color: '#3b82f6' }]
                      : []),
                  ].map((event, i) => (
                    <Stack key={i} direction="row" spacing={2} alignItems="flex-start">
                      <Box sx={{
                        width: 10, height: 10, borderRadius: '50%', bgcolor: event.color,
                        mt: 0.6, flexShrink: 0, boxShadow: `0 0 8px ${event.color}`,
                      }} />
                      <Box>
                        <Typography variant="body2" fontWeight={700}>{event.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(event.time).toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={2}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <SectionHeader icon={<ReceiptIcon sx={{ fontSize: 16 }} />} title="Financials" />
                <InfoRow label="Total Amount" value={`₦${(order.final_amount || 0).toLocaleString()}`} />
                <InfoRow label="Platform Fee" value={
                  <Typography variant="body2" fontWeight={800} sx={{ color: '#10b981' }}>
                    ₦{(order.platform_fee || 0).toLocaleString()}
                  </Typography>
                } />
                <InfoRow label="Runner Payout" value={
                  <Typography variant="body2" fontWeight={800} sx={{ color: '#3b82f6' }}>
                    ₦{(order.runner_payout || 0).toLocaleString()}
                  </Typography>
                } />
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <SectionHeader icon={<PersonIcon sx={{ fontSize: 16 }} />} title="Student" />
                {order.student_profile ? (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#8b5cf6', fontSize: 14, fontWeight: 800 }}>
                      {order.student_profile.full_name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={800}>{order.student_profile.full_name}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {order.student_profile.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.student_profile.phone}
                      </Typography>
                    </Box>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">No student info</Typography>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <SectionHeader icon={<DirectionsRunIcon sx={{ fontSize: 16 }} />} title="Runner" />
                {order.runner_profile ? (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#f59e0b', fontSize: 14, fontWeight: 800 }}>
                      {order.runner_profile.full_name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={800}>{order.runner_profile.full_name}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {order.runner_profile.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.runner_profile.phone}
                      </Typography>
                    </Box>
                  </Stack>
                ) : (
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha('#f59e0b', 0.06), border: '1px solid', borderColor: alpha('#f59e0b', 0.15) }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Waiting for a runner to accept this job
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {order.status !== 'completed' && order.status !== 'cancelled' && (
              <Card sx={{ border: '1px solid', borderColor: alpha('#ef4444', 0.2) }}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Typography variant="body2" fontWeight={800} sx={{ mb: 1.5 }}>Admin Actions</Typography>
                  <Button
                    fullWidth variant="outlined" color="error"
                    startIcon={cancelling ? <CircularProgress size={14} /> : <CancelIcon />}
                    onClick={cancelOrder}
                    disabled={cancelling}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                  >
                    {cancelling ? 'Cancelling…' : 'Cancel Order'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
