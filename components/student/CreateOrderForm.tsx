'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Category {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  icon_name: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

const URGENCY = [
  { val: 'normal', label: 'Normal', sub: 'Delivered within 2–4 hrs', icon: '🕐' },
  { val: 'urgent', label: 'Urgent', sub: 'Delivered within 1 hr', icon: '⚡' },
];

const DELIVERY_FEES: Record<string, number> = {
  normal: 500,
  urgent: 1500,
};

const formatMoney = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export function CreateOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preCategory = searchParams.get('category') || '';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    categoryId: preCategory,
    title: '',
    description: '',
    items: [{ name: '', quantity: 1, price: '' }] as OrderItem[],
    pickupLocation: '',
    deliveryLocation: '',
    urgency: 'normal',
    notes: '',
  });

  useEffect(() => {
    supabase
      .from('service_categories')
      .select('*')
      .eq('is_active', true)
      .then(({ data }) => {
        if (data) setCategories(data as Category[]);
      });
  }, []);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const addItem = () =>
    set('items', [...form.items, { name: '', quantity: 1, price: '' }]);
  const removeItem = (i: number) =>
    set('items', form.items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, k: keyof OrderItem, v: any) => {
    const next = [...form.items];
    next[i] = { ...next[i], [k]: v };
    set('items', next);
  };

  const selectedCat = categories.find((c) => c.id === form.categoryId);
  const serviceFee = selectedCat?.base_price || 0;
  const deliveryFee = DELIVERY_FEES[form.urgency] || 0;
  const itemsSubtotal = form.items.reduce((sum, i) => {
    const price = parseFloat(i.price || '0');
    const qty = i.quantity || 1;
    return sum + price * qty;
  }, 0);
  const total = itemsSubtotal + serviceFee + deliveryFee;

  const canNext = () => {
    if (step === 1) return !!form.categoryId;
    if (step === 2) return !!form.title.trim();
    if (step === 3)
      return form.items.some(
        (i) => i.name.trim() && parseFloat(i.price || '0') > 0
      );
    if (step === 4) return !!form.pickupLocation && !!form.deliveryLocation;
    return true;
  };

  const handleSubmit = async () => {
    if (step < 5) {
      if (canNext()) setStep((s) => s + 1);
      return;
    }
    if (itemsSubtotal <= 0) {
      setError('Please add at least one item with a price.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check wallet balance
      const { data: wallet } = await supabase
        .from('wallets')
        .select('id, balance, user_id, student_id')
        .or(`user_id.eq.${user.id},student_id.eq.${user.id}`)
        .maybeSingle();

      if (!wallet)
        throw new Error('Wallet not found. Please fund your wallet first.');
      const balance = Number(wallet.balance || 0);
      if (balance < total)
        throw new Error(
          'Insufficient balance. Fund your wallet to place this order.'
        );

      // Create order
      const { data: order, error: oErr } = await supabase
        .from('orders')
        .insert([
          {
            student_id: user.id,
            service_category_id: form.categoryId,
            title: form.title,
            description: form.description,
            budget_amount: itemsSubtotal,
            final_amount: total,
            platform_fee: serviceFee,
            runner_payout: Math.max(0, total - serviceFee),
            pickup_location: form.pickupLocation,
            delivery_location: form.deliveryLocation,
            urgency_level: form.urgency,
            status: 'pending',
            payment_status: 'paid',
          },
        ])
        .select()
        .single();
      if (oErr) throw new Error(oErr.message);

      const validItems = form.items.filter(
        (i) => i.name.trim() && parseFloat(i.price || '0') > 0
      );
      if (validItems.length > 0) {
        const itemsPayload = validItems.map((i) => ({
          order_id: order.id,
          item_name: i.name,
          quantity: i.quantity || 1,
          price: parseFloat(i.price),
        }));
        const { error: itemsErr } = await supabase
          .from('order_items')
          .insert(itemsPayload);
        if (itemsErr) throw itemsErr;
      }

      const metaRows = [
        {
          order_id: order.id,
          meta_key: 'delivery_fee',
          meta_value: String(deliveryFee),
        },
        {
          order_id: order.id,
          meta_key: 'items_subtotal',
          meta_value: String(itemsSubtotal),
        },
        {
          order_id: order.id,
          meta_key: 'service_fee',
          meta_value: String(serviceFee),
        },
      ];
      if (form.notes.trim())
        metaRows.push({
          order_id: order.id,
          meta_key: 'notes',
          meta_value: form.notes.trim(),
        });
      await supabase.from('order_meta').insert(metaRows);

      // Hold funds in wallet
      const newBalance = Math.max(0, balance - total);
      const walletKey = (wallet as any).user_id ? 'user_id' : 'student_id';
      const { error: walletErr } = await supabase
        .from('wallets')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq(walletKey, user.id);
      if (walletErr) throw walletErr;

      await supabase.from('wallet_holds').insert({
        user_id: user.id,
        order_id: order.id,
        amount: total,
        status: 'held',
      });

      await supabase.from('wallet_transactions').insert({
        user_id: user.id,
        order_id: order.id,
        amount: total,
        type: 'debit',
        status: 'held',
        note: 'Funds held for order placement',
      });

      // send confirmation email (non-blocking)
      const {
        data: { session },
      } = await supabase.auth.getSession();
      fetch('/api/student/order-placed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({ orderId: order.id }),
      }).catch(() => {});

      setSuccess(true);
      setTimeout(() => router.push(`/student/orders/${order.id}`), 1800);
    } catch (e: any) {
      setError(e.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const CAT_ICONS: Record<string, string> = {
    food: '🍔',
    laundry: '👕',
    market: '🛒',
    delivery: '📦',
    printing: '🖨️',
    gas: '⛽',
    pharmacy: '💊',
    errand: '🧰',
  };
  const catIcon = (c: Category) =>
    CAT_ICONS[c.slug?.split('_')[0]] ??
    CAT_ICONS[c.name?.toLowerCase().split(' ')[0]] ??
    '📋';

  const STEPS = ['Service', 'Details', 'Items & Prices', 'Location', 'Review'];

  if (success)
    return (
      <div className="co-shell">
        <div className="co-success">
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,var(--green),var(--green-s))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              boxShadow: '0 12px 40px rgba(15,61,46,.3)',
              border: '4px solid rgba(255,255,255,.4)',
            }}
          >
            ✓
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="co-success-title">Order Placed! 🎉</div>
            <div className="co-success-sub">
              Payment held — runners are being notified
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 320 }}>
            <div
              style={{
                flex: 1,
                height: 4,
                borderRadius: 99,
                background: 'var(--surf3)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg,var(--green),var(--gold))',
                  borderRadius: 99,
                  animation: 'progressFill 1.8s ease forwards',
                  width: '100%',
                }}
              />
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink3)' }}>
            Redirecting to your order…
          </div>
        </div>
      </div>
    );

  return (
    <div className="co-shell">
      {/* Progress */}
      <div className="co-progress">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`co-step${step > i + 1 ? ' done' : step === i + 1 ? ' active' : ''}`}
          >
            <div className="co-step-dot">{step > i + 1 ? '✓' : i + 1}</div>
            <div className="co-step-label">{s}</div>
            {i < STEPS.length - 1 && <div className="co-step-line" />}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="co-card">
        <div className="co-card-title">{STEPS[step - 1]}</div>

        {error && <div className="co-error">⚠ {error}</div>}

        {/* Step 1 — Service */}
        {step === 1 && (
          <div className="co-cat-grid">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`co-cat-card${form.categoryId === c.id ? ' selected' : ''}`}
                onClick={() => set('categoryId', c.id)}
              >
                <div className="co-cat-icon">{catIcon(c)}</div>
                <div className="co-cat-name">{c.name}</div>
                <div className="co-cat-price">
                  Service fee {formatMoney(c.base_price || 0)}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2 — Details */}
        {step === 2 && (
          <div className="co-fields">
            <div className="co-field">
              <label className="co-label">Order Title *</label>
              <input
                className="co-input"
                placeholder="e.g. Gas refill at Block C"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
              />
            </div>
            <div className="co-field">
              <label className="co-label">Description</label>
              <textarea
                className="co-input co-textarea"
                placeholder="Any extra details about your order…"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 3 — Items */}
        {step === 3 && (
          <div className="co-fields">
            <div className="co-label" style={{ marginBottom: 4 }}>
              List items with quantity and price *
            </div>
            {form.items.map((item, i) => (
              <div key={i} className="co-item-row">
                <input
                  className="co-input"
                  style={{ flex: 1 }}
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => updateItem(i, 'name', e.target.value)}
                />
                <input
                  className="co-input co-qty"
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(i, 'quantity', parseInt(e.target.value) || 1)
                  }
                />
                <input
                  className="co-input co-price"
                  type="number"
                  min={0}
                  placeholder="₦"
                  value={item.price}
                  onChange={(e) => updateItem(i, 'price', e.target.value)}
                />
                {form.items.length > 1 && (
                  <button
                    type="button"
                    className="co-remove-btn"
                    onClick={() => removeItem(i)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="co-add-item" onClick={addItem}>
              ＋ Add another item
            </button>
          </div>
        )}

        {/* Step 4 — Location & Urgency */}
        {step === 4 && (
          <div className="co-fields">
            <div className="co-field">
              <label className="co-label">Pickup Location *</label>
              <div className="co-input-wrap">
                <span className="co-input-prefix">📍</span>
                <input
                  className="co-input co-input-prefixed"
                  placeholder="e.g. Shoprite, Lekki"
                  value={form.pickupLocation}
                  onChange={(e) => set('pickupLocation', e.target.value)}
                />
              </div>
            </div>
            <div className="co-field">
              <label className="co-label">Delivery Location *</label>
              <div className="co-input-wrap">
                <span className="co-input-prefix">🏠</span>
                <input
                  className="co-input co-input-prefixed"
                  placeholder="e.g. Hostel Block A, Room 12"
                  value={form.deliveryLocation}
                  onChange={(e) => set('deliveryLocation', e.target.value)}
                />
              </div>
            </div>
            <div className="co-field">
              <label className="co-label">Urgency</label>
              <div className="co-urgency-row">
                {URGENCY.map((u) => (
                  <button
                    key={u.val}
                    type="button"
                    className={`co-urgency-card${form.urgency === u.val ? ' selected' : ''}`}
                    onClick={() => set('urgency', u.val)}
                  >
                    <span className="co-urgency-icon">{u.icon}</span>
                    <span className="co-urgency-label">{u.label}</span>
                    <span className="co-urgency-sub">{u.sub}</span>
                    <span className="co-urgency-fee">
                      Delivery {formatMoney(DELIVERY_FEES[u.val])}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="co-field">
              <label className="co-label">Special Instructions</label>
              <textarea
                className="co-input co-textarea"
                placeholder="Any special notes for the runner…"
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                rows={2}
              />
            </div>

            <div className="co-breakdown">
              <div className="co-break-row">
                <span>Items subtotal</span>
                <strong>{formatMoney(itemsSubtotal)}</strong>
              </div>
              <div className="co-break-row">
                <span>Service fee</span>
                <strong>{formatMoney(serviceFee)}</strong>
              </div>
              <div className="co-break-row">
                <span>Delivery fee</span>
                <strong>{formatMoney(deliveryFee)}</strong>
              </div>
              <div className="co-break-row total">
                <span>Total</span>
                <strong>{formatMoney(total)}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Step 5 — Review */}
        {step === 5 && (
          <div className="co-review">
            <div className="co-review-row">
              <span>Service</span>
              <strong>{selectedCat?.name ?? '—'}</strong>
            </div>
            <div className="co-review-row">
              <span>Title</span>
              <strong>{form.title}</strong>
            </div>
            <div className="co-review-row">
              <span>Items</span>
              <div style={{ textAlign: 'right' }}>
                {form.items
                  .filter((i) => i.name)
                  .map((i, idx) => (
                    <div key={idx} style={{ fontSize: 13, fontWeight: 600 }}>
                      {i.name} ×{i.quantity} —{' '}
                      {formatMoney(
                        (parseFloat(i.price || '0') || 0) * (i.quantity || 1)
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <div className="co-review-row">
              <span>Items subtotal</span>
              <strong>{formatMoney(itemsSubtotal)}</strong>
            </div>
            <div className="co-review-row">
              <span>Service fee</span>
              <strong>{formatMoney(serviceFee)}</strong>
            </div>
            <div className="co-review-row">
              <span>Delivery fee</span>
              <strong>{formatMoney(deliveryFee)}</strong>
            </div>
            <div className="co-review-row">
              <span>Total</span>
              <strong style={{ color: 'var(--gold-d)' }}>
                {formatMoney(total)}
              </strong>
            </div>
            <div className="co-review-row">
              <span>Pickup</span>
              <strong>{form.pickupLocation}</strong>
            </div>
            <div className="co-review-row">
              <span>Delivery</span>
              <strong>{form.deliveryLocation}</strong>
            </div>
            <div className="co-review-row">
              <span>Urgency</span>
              <strong style={{ textTransform: 'capitalize' }}>
                {form.urgency}
              </strong>
            </div>
            {form.notes && (
              <div className="co-review-row">
                <span>Notes</span>
                <strong>{form.notes}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="co-actions">
        {step > 1 && (
          <button
            type="button"
            className="co-btn-back"
            onClick={() => setStep((s) => s - 1)}
          >
            ← Back
          </button>
        )}
        <button
          type="button"
          className="co-btn-next"
          disabled={!canNext() || loading}
          onClick={handleSubmit}
        >
          {loading ? <span className="co-spinner" /> : step === 5 ? '🚀 Place Order' : 'Continue →'}
        </button>
      </div>

      <style>{`
        .co-shell{display:flex;flex-direction:column;gap:20px;padding:28px;max-width:720px;margin:0 auto;animation:fadeIn .4s ease both}
        .co-progress{display:flex;align-items:center;gap:0;background:rgba(255,255,255,.6);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.5);border-radius:16px;padding:16px 20px;box-shadow:0 4px 24px rgba(0,0,0,.06)}
        [data-theme="dark"] .co-progress{background:rgba(15,30,24,.8);border-color:rgba(255,255,255,.08)}
        .co-step{display:flex;align-items:center;gap:6px;flex:1;position:relative}
        .co-step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0;background:var(--surf3);color:var(--ink3);transition:all .25s}
        .co-step.active .co-step-dot{background:var(--green);color:#fff;box-shadow:0 0 0 4px rgba(15,61,46,.15)}
        .co-step.done .co-step-dot{background:var(--gold);color:#fff}
        .co-step-label{font-size:11px;font-weight:700;color:var(--ink3);white-space:nowrap;transition:color .25s}
        .co-step.active .co-step-label{color:var(--ink)}
        .co-step.done .co-step-label{color:var(--gold-d)}
        .co-step-line{flex:1;height:2px;background:var(--surf3);border-radius:2px;margin:0 8px;transition:background .25s}
        .co-step.done .co-step-line{background:var(--gold)}

        .co-card{background:rgba(255,255,255,.7);backdrop-filter:blur(20px) saturate(160%);-webkit-backdrop-filter:blur(20px) saturate(160%);border:1px solid rgba(255,255,255,.6);border-radius:20px;padding:24px;box-shadow:0 8px 32px rgba(0,0,0,.07),0 2px 8px rgba(0,0,0,.04)}
        [data-theme="dark"] .co-card{background:rgba(15,30,24,.8);border-color:rgba(255,255,255,.1);box-shadow:0 8px 32px rgba(0,0,0,.3)}
        .co-card-title{font-size:18px;font-weight:800;color:var(--ink);letter-spacing:-.02em;margin-bottom:20px}
        .co-error{background:rgba(220,38,38,.08);border:1px solid rgba(220,38,38,.2);border-radius:10px;padding:10px 14px;font-size:13px;color:var(--err);margin-bottom:16px}

        .co-cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px}
        .co-cat-card{background:var(--surf2);border:2px solid var(--bdr);border-radius:16px;padding:16px 12px;text-align:center;cursor:pointer;transition:all .2s;font-family:inherit}
        .co-cat-card:hover{border-color:rgba(212,175,55,.4);transform:translateY(-2px);box-shadow:var(--s2)}
        .co-cat-card.selected{border-color:var(--gold);background:rgba(212,175,55,.08);box-shadow:0 0 0 3px rgba(212,175,55,.15)}
        .co-cat-icon{font-size:28px;margin-bottom:8px}
        .co-cat-name{font-size:13px;font-weight:700;color:var(--ink);margin-bottom:3px}
        .co-cat-price{font-size:11px;color:var(--ink3)}

        .co-fields{display:flex;flex-direction:column;gap:16px}
        .co-field{display:flex;flex-direction:column;gap:6px}
        .co-label{font-size:12px;font-weight:700;color:var(--ink2);letter-spacing:.01em}
        .co-input{width:100%;padding:11px 14px;border:1.5px solid var(--bdr-m);border-radius:12px;background:rgba(255,255,255,.8);color:var(--ink);font-size:13px;font-family:inherit;outline:none;transition:border-color .2s,box-shadow .2s;backdrop-filter:blur(8px)}
        [data-theme="dark"] .co-input{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.1);color:var(--ink)}
        .co-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(212,175,55,.12)}
        .co-textarea{resize:none}
        .co-input-wrap{position:relative;display:flex;align-items:center}
        .co-input-prefix{position:absolute;left:14px;font-size:14px;color:var(--ink3);pointer-events:none;z-index:1}
        .co-input-prefixed{padding-left:36px}

        .co-item-row{display:flex;gap:8px;align-items:center}
        .co-qty{width:72px;flex-shrink:0;text-align:center}
        .co-price{width:110px;flex-shrink:0}
        .co-remove-btn{width:34px;height:34px;border-radius:9px;background:rgba(220,38,38,.08);border:1px solid rgba(220,38,38,.15);color:var(--err);cursor:pointer;font-size:12px;flex-shrink:0;transition:background .2s}
        .co-remove-btn:hover{background:rgba(220,38,38,.15)}
        .co-add-item{width:100%;padding:10px;border:2px dashed var(--bdr-m);border-radius:12px;background:transparent;color:var(--ink3);font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;font-family:inherit}
        .co-add-item:hover{border-color:var(--gold);color:var(--gold-d);background:rgba(212,175,55,.04)}

        .co-urgency-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .co-urgency-card{display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 10px;border:2px solid var(--bdr);border-radius:14px;background:var(--surf2);cursor:pointer;transition:all .2s;font-family:inherit}
        .co-urgency-card:hover{border-color:rgba(212,175,55,.4)}
        .co-urgency-card.selected{border-color:var(--gold);background:rgba(212,175,55,.08)}
        .co-urgency-icon{font-size:22px}
        .co-urgency-label{font-size:13px;font-weight:800;color:var(--ink)}
        .co-urgency-sub{font-size:10px;color:var(--ink3);text-align:center}
        .co-urgency-fee{font-size:11px;color:var(--gold-d);font-weight:700}

        .co-breakdown{border:1px solid var(--bdr);border-radius:12px;padding:12px 14px;background:var(--surf2)}
        .co-break-row{display:flex;justify-content:space-between;font-size:12px;color:var(--ink2);padding:4px 0}
        .co-break-row strong{color:var(--ink);font-weight:800}
        .co-break-row.total{border-top:1px dashed var(--bdr);margin-top:6px;padding-top:10px}
        .co-break-row.total strong{color:var(--gold-d)}

        .co-review{display:flex;flex-direction:column;gap:0;border-radius:14px;overflow:hidden;border:1px solid var(--bdr)}
        .co-review-row{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:12px 16px;border-bottom:1px solid var(--bdr);font-size:13px}
        .co-review-row:last-child{border-bottom:none}
        .co-review-row span{color:var(--ink3);font-weight:600;flex-shrink:0}
        .co-review-row strong{color:var(--ink);font-weight:700;text-align:right}

        .co-actions{display:flex;gap:10px}
        .co-btn-back{padding:12px 20px;border-radius:12px;border:1.5px solid var(--bdr-m);background:transparent;color:var(--ink2);font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s}
        .co-btn-back:hover{background:var(--surf2)}
        .co-btn-next{flex:1;padding:13px 20px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--green),var(--green-s));color:#fff;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;transition:all .2s;box-shadow:0 4px 16px rgba(15,61,46,.25);display:flex;align-items:center;justify-content:center;gap:8px}
        .co-btn-next:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(15,61,46,.3)}
        .co-btn-next:disabled{opacity:.5;cursor:not-allowed}
        .co-spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}

        .co-success{display:flex;flex-direction:column;align-items:center;gap:16px;padding:48px 24px;background:rgba(255,255,255,.7);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.6);border-radius:20px;text-align:center}
        [data-theme="dark"] .co-success{background:rgba(15,30,24,.8);border-color:rgba(255,255,255,.08)}
        .co-success-title{font-size:24px;font-weight:800;color:var(--ink)}
        .co-success-sub{font-size:14px;color:var(--ink3)}

        @media(max-width:480px){
          .co-shell{padding:16px}
          .co-step-label{display:none}
          .co-cat-grid{grid-template-columns:repeat(2,1fr)}
          .co-item-row{flex-wrap:wrap}
          .co-price{width:100%}
        }
      `}</style>
    </div>
  );
}
