'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import PageLoader from '@/components/PageLoader';
import '../student.css';

export default function StudentProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [stats, setStats] = useState({ orders: 0, spent: 0, completed: 0 });
  const [form, setForm] = useState({ full_name: '', phone: '', university: '', hostel_location: '' });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name:       (profile as any).full_name        || '',
        phone:           (profile as any).phone            || '',
        university:      (profile as any).university       || '',
        hostel_location: (profile as any).hostel_location  || '',
      });
      if ((profile as any).avatar_url) setAvatarUrl((profile as any).avatar_url);
    }
    fetchStats();
  }, [profile]);

  const fetchStats = async () => {
    try {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) return;
      const { data } = await supabase.from('orders').select('status, final_amount').eq('student_id', u.id);
      if (data) {
        const completed = data.filter(o => o.status === 'completed');
        setStats({
          orders: data.length,
          spent: completed.reduce((s, o) => s + (o.final_amount || 0), 0),
          completed: completed.length,
        });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) return;
      const { error } = await supabase.from('profiles').update(form).eq('id', u.id);
      if (error) throw error;
      await refreshProfile?.(u.id);
      window.dispatchEvent(new Event('profile-updated'));
      setEditing(false);
      showToast('Profile saved ✓');
    } catch (e: any) {
      showToast('Save failed: ' + e.message);
    } finally { setSaving(false); }
  };

  const handleAvatar = async (file?: File) => {
    if (!file || !user?.id) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `avatars/${user.id}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('avatars').upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      // try public URL first, fall back to signed URL
      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
      let url = pub.publicUrl;
      // verify it's accessible
      const test = await fetch(url, { method: 'HEAD' }).catch(() => ({ ok: false }));
      if (!test.ok) {
        const { data: signed } = await supabase.storage.from('avatars').createSignedUrl(path, 60 * 60 * 24 * 365);
        if (signed?.signedUrl) url = signed.signedUrl;
      }
      await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id);
      setAvatarUrl(url);
      await refreshProfile?.(user.id);
      window.dispatchEvent(new Event('profile-updated'));
      showToast('Photo updated ✓');
    } catch (e: any) {
      showToast('Upload failed: ' + e.message);
    } finally { setUploading(false); }
  };

  const initials = form.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ST';

  if (loading) return <PageLoader />;

  return (
    <div className="sd-content sd-wide" style={{ animation: 'fadeIn .4s ease both' }}>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: 'var(--green)', color: '#fff', padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,.2)', animation: 'fadeUp .3s ease' }}>
          {toast}
        </div>
      )}

      {/* HERO CARD */}
      <div style={{ borderRadius: 24, overflow: 'hidden', background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', border: '1px solid rgba(0,0,0,.08)', boxShadow: '0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.05)' }}>
        {/* Banner */}
        <div style={{ height: 100, background: 'linear-gradient(135deg,var(--green) 0%,var(--green-s) 60%,var(--green-t) 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 100% at 80% 50%,rgba(212,175,55,.2),transparent)', pointerEvents: 'none' }} />
        </div>

        <div style={{ padding: '0 24px 28px' }}>
          {/* Avatar row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -36 }}>
            {/* Avatar — clickable to upload */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => fileRef.current?.click()}
                style={{ width: 80, height: 80, borderRadius: 22, overflow: 'hidden', background: 'linear-gradient(135deg,var(--gold-d),var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', border: '4px solid var(--surf)', boxShadow: '0 8px 24px rgba(212,175,55,.3)', cursor: 'pointer', flexShrink: 0 }}
                title="Click to change photo"
              >
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : initials}
              </div>
              {/* Camera badge */}
              <div
                onClick={() => fileRef.current?.click()}
                style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 8, background: 'var(--green)', border: '2px solid var(--surf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,.2)' }}
              >
                {uploading ? '⏳' : '📷'}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleAvatar(e.target.files?.[0])} />
            <span className="sd-badge delivered" style={{ fontSize: 11, marginBottom: 6 }}>✓ Verified Student</span>
          </div>

          {/* Name + email */}
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em' }}>{form.full_name || 'Student'}</div>
            <div style={{ fontSize: 13, color: 'var(--ink3)', marginTop: 3 }}>{user?.email}</div>
            {uploading && <div style={{ fontSize: 11, color: 'var(--gold-d)', marginTop: 4 }}>Uploading photo…</div>}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--bdr)' }}>
            {[
              { val: stats.orders,    lbl: 'Total Orders' },
              { val: stats.completed, lbl: 'Completed' },
              { val: `₦${(stats.spent / 1000).toFixed(1)}k`, lbl: 'Total Spent' },
            ].map((s, i, arr) => (
              <div key={s.lbl} style={{ textAlign: 'center', padding: '8px 0', borderRight: i < arr.length - 1 ? '1px solid var(--bdr)' : 'none' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.03em' }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 3 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PERSONAL INFO */}
      <div style={{ borderRadius: 20, padding: 22, background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', border: '1px solid rgba(0,0,0,.08)', boxShadow: '0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.05)' }}>
        <div className="sd-section-head" style={{ marginBottom: 20 }}>
          <div className="sd-section-title">Personal Info</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {editing && (
              <button onClick={() => setEditing(false)} style={{ fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 10, cursor: 'pointer', border: '1.5px solid var(--bdr-m)', background: 'transparent', color: 'var(--ink2)', fontFamily: 'inherit' }}>
                Cancel
              </button>
            )}
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={saving}
              style={{ fontSize: 12, fontWeight: 700, padding: '7px 18px', borderRadius: 10, cursor: 'pointer', border: 'none', background: editing ? 'var(--green)' : 'var(--surf2)', color: editing ? '#fff' : 'var(--ink2)', transition: 'all .2s', fontFamily: 'inherit' }}
            >
              {saving ? 'Saving…' : editing ? '✓ Save Changes' : '✎ Edit Profile'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Full Name',         field: 'full_name',       icon: '👤', type: 'text', placeholder: 'Your full name' },
            { label: 'Phone Number',      field: 'phone',           icon: '📱', type: 'tel',  placeholder: '+234 800 000 0000' },
            { label: 'University',        field: 'university',      icon: '🏫', type: 'text', placeholder: 'Your university' },
            { label: 'Hostel / Location', field: 'hostel_location', icon: '📍', type: 'text', placeholder: 'Block A, Room 12' },
          ].map(({ label, field, icon, type, placeholder }) => (
            <div key={field} style={{ display: 'flex', alignItems: editing ? 'flex-start' : 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--surf2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0, marginTop: editing ? 2 : 0 }}>{icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{label}</div>
                {editing ? (
                  <input
                    type={type}
                    value={form[field as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ width: '100%', padding: '10px 13px', border: '1.5px solid var(--bdr-m)', borderRadius: 11, background: 'rgba(255,255,255,.9)', color: 'var(--ink)', fontSize: 13, outline: 'none', fontFamily: 'inherit', transition: 'border-color .2s' }}
                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                    onBlur={e => e.target.style.borderColor = 'var(--bdr-m)'}
                  />
                ) : (
                  <div style={{ fontSize: 14, fontWeight: 600, color: form[field as keyof typeof form] ? 'var(--ink)' : 'var(--ink3)' }}>
                    {form[field as keyof typeof form] || <span style={{ fontStyle: 'italic', fontSize: 13 }}>Not set — tap Edit to add</span>}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Email — read only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--surf2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>✉️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Email</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{user?.email}</div>
                <span className="sd-badge delivered" style={{ fontSize: 9 }}>Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK LINKS */}
      <div style={{ borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', border: '1px solid rgba(0,0,0,.08)', boxShadow: '0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.05)' }}>
        {[
          { icon: '📦', label: 'My Orders',           sub: `${stats.orders} total orders`,  href: '/student/orders' },
          { icon: '💳', label: 'Wallet',              sub: 'View balance & transactions',    href: '/student/wallet' },
          { icon: '🔔', label: 'Notifications',       sub: 'Manage alerts',                  href: '/student/notifications' },
          { icon: '🔒', label: 'Change Password',     sub: 'Update your password',           href: '/forgot-password' },
        ].map(({ icon, label, sub, href }, i, arr) => (
          <a
            key={label} href={href}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 20px', borderBottom: i < arr.length - 1 ? '1px solid var(--bdr)' : 'none', textDecoration: 'none', transition: 'background .15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ width: 42, height: 42, borderRadius: 13, background: 'var(--surf2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>{sub}</div>
            </div>
            <div style={{ fontSize: 18, color: 'var(--ink3)' }}>›</div>
          </a>
        ))}
      </div>

    </div>
  );
}
