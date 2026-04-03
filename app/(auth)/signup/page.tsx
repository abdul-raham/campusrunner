'use client';

import Link from 'next/link';
import { GraduationCap, Bolt } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';

const paths = [
  {
    title: 'I am a Student',
    href: '/student-signup',
    icon: GraduationCap,
    gradient: 'linear-gradient(135deg,#0D1F2D,#1C3245)',
    desc: 'Place orders and get errands done while you focus on what matters.',
    points: ['Create requests in seconds', 'Live order tracking', 'Wallet-first checkout'],
  },
  {
    title: 'I am a Runner',
    href: '/runner-signup',
    icon: Bolt,
    gradient: 'linear-gradient(135deg,#C9952A,#E2B24A)',
    desc: 'Earn money between classes by completing errands for fellow students.',
    points: ['Accept jobs instantly', 'Keep 90% per delivery', 'Flexible schedule'],
  },
];

export default function SignupChoicePage() {
  return (
    <AuthShell wide>
      <div className="auth-card auth-animate">
        <div className="auth-card-header auth-animate auth-delay-1">
          <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
            <span
              style={{
                padding: '6px 12px',
                borderRadius: 999,
                background: 'rgba(201,149,42,.15)',
                color: '#8b5e12',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
              }}
            >
              Choose your path
            </span>
          </div>
          <h2 className="auth-title" style={{ marginTop: 12 }}>Join CampusRunner</h2>
          <p className="auth-sub">
            Students place orders. Runners earn. Everyone moves faster on campus.
          </p>
        </div>

        <div className="auth-choice-grid auth-animate auth-delay-2">
          {paths.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} href={card.href} className="auth-choice-card">
                <div className="auth-choice-icon" style={{ background: card.gradient }}>
                  <Icon size={22} />
                </div>
              <div className="auth-choice-title">{card.title}</div>
              <div className="auth-choice-text">{card.desc}</div>
              <ul className="auth-choice-list">
                {card.points.map((point) => (
                  <li key={point}><span></span>{point}</li>
                ))}
              </ul>
              <div style={{ marginTop: 18, fontSize: 13, fontWeight: 700, color: 'var(--gold)' }}>
                Get started →
              </div>
              </Link>
            );
          })}
        </div>

        <p className="auth-muted auth-animate auth-delay-3" style={{ textAlign: 'center', marginTop: 24 }}>
          Already have an account?{' '}
          <Link href="/login" className="auth-link">Sign in here</Link>
        </p>

        <div
          className="auth-animate auth-delay-4"
          style={{
            marginTop: 24,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
          }}
        >
          {[
            { value: '4,200+', label: 'Students onboarded' },
            { value: '850+', label: 'Active runners' },
            { value: '4.9★', label: 'Avg rating' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'var(--surf2)',
                border: '1px solid var(--bdr)',
                borderRadius: 16,
                padding: '12px 10px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontWeight: 800 }}>{stat.value}</div>
              <div className="auth-helper">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </AuthShell>
  );
}
