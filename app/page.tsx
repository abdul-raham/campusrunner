'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './landing.css';

export default function LandingPage() {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.dataset.theme) {
      html.dataset.theme = 'light';
    }

    const nav = document.getElementById('nav');
    const themeBtn = document.getElementById('themeBtn');
    const hamburger = document.getElementById('hamburger');
    const navDrawer = document.getElementById('navDrawer');

    const handleScroll = () => {
      if (nav) nav.classList.toggle('on', window.scrollY > 10);
    };

    const handleThemeToggle = () => {
      const isDark = html.dataset.theme === 'dark';
      html.dataset.theme = isDark ? 'light' : 'dark';
      if (themeBtn) themeBtn.textContent = isDark ? '🌙' : '☀️';
    };

    const handleHamburger = () => {
      hamburger?.classList.toggle('open');
      navDrawer?.classList.toggle('open');
    };

    // close drawer on link click
    navDrawer?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger?.classList.remove('open');
        navDrawer?.classList.remove('open');
      });
    });

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    themeBtn?.addEventListener('click', handleThemeToggle);
    hamburger?.addEventListener('click', handleHamburger);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('up');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.rv').forEach((el) => revealObserver.observe(el));

    const countUp = (el: HTMLElement, end: number, duration = 1600) => {
      const start = performance.now();
      const formatValue = (value: number) =>
        value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);

      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(end * eased);
        el.textContent = formatValue(current);
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = Number(entry.target.getAttribute('data-target'));
          if (!target) return;
          const span = entry.target.querySelector('span') as HTMLElement | null;
          if (span) countUp(span, target);
          countObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    document
      .querySelectorAll('[data-target]')
      .forEach((el) => countObserver.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      themeBtn?.removeEventListener('click', handleThemeToggle);
      hamburger?.removeEventListener('click', handleHamburger);
      revealObserver.disconnect();
      countObserver.disconnect();
    };
  }, []);

  return (
    <>
      <nav className="nav" id="nav">
        <div className="ni">
          <Link className="n-logo" href="/">
            <div className="n-mark">
              <Image src="/favicon.svg" alt="CampusRunner" width={36} height={36} style={{ borderRadius: 10 }} />
            </div>
            <span className="n-word">
              Campus<b>Runner</b>
            </span>
          </Link>
          <div className="n-links">
            <Link href="#how">How it works</Link>
            <Link href="#services">Services</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#reviews">Reviews</Link>
          </div>
          <div className="n-right">
            <div className="icon-btn" id="themeBtn" title="Toggle theme">🌙</div>
            <Link className="n-ghost" href="/login">Sign in</Link>
            <Link className="n-cta" href="/signup">Get started →</Link>
            <div className="n-hamburger" id="hamburger">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </nav>
      <div className="n-drawer" id="navDrawer">
        <Link href="#how">How it works</Link>
        <Link href="#services">Services</Link>
        <Link href="#pricing">Pricing</Link>
        <Link href="#reviews">Reviews</Link>
        <Link href="/login">Sign in</Link>
        <Link className="n-cta" href="/signup">Get started →</Link>
      </div>

      <div className="hero">
        <div className="h-left">
          <div className="h-eye">Campus delivery network</div>
          <h1 className="h-title">
            Your campus errands,
            <br />
            done <em>while you study.</em>
          </h1>
          <p className="h-sub">
            CampusRunner connects students who need errands done with fellow students
            who earn completing them. Fast, trusted, always on campus.
          </p>
          <div className="h-actions">
            <Link className="h-btn p" href="/signup">
              Order an errand →
            </Link>
            <Link className="h-btn s" href="/runner-signup">
              ⚡ Earn as a runner
            </Link>
          </div>
          <div className="trust">
            <div className="t-avs">
              <span>AO</span>
              <span>KI</span>
              <span>FF</span>
              <span>CE</span>
            </div>
            <p className="t-txt">
              <strong>4,200+ students</strong> on the platform this semester
            </p>
          </div>
        </div>

        <div className="h-right">
          <div className="dash-frame">
            <div className="dash-chrome">
              <div className="dots">
                <span className="d1"></span>
                <span className="d2"></span>
                <span className="d3"></span>
              </div>
              <div className="url-bar">campusrunner.app/student</div>
            </div>
            <div className="dash-body">
              <div className="d-sidebar">
                <div className="ds-brand">
                  <div className="ds-bicon">
                    <Image src="/favicon.svg" alt="CR" width={16} height={16} style={{ borderRadius: 4 }} />
                  </div>
                  <div className="ds-bname">
                    Campus
                    <br />
                    Runner
                  </div>
                </div>
                <div className="ds-nav">
                  <div className="ds-i on">
                    <span className="ds-ico">⊞</span> Dashboard
                  </div>
                  <div className="ds-i">
                    <span className="ds-ico">📦</span> My Orders
                  </div>
                  <div className="ds-i">
                    <span className="ds-ico">💳</span> Wallet
                  </div>
                  <div className="ds-i">
                    <span className="ds-ico">🔔</span> Alerts
                  </div>
                  <div className="ds-i">
                    <span className="ds-ico">⚙</span> Settings
                  </div>
                </div>
                <div className="ds-user">
                  <div className="ds-av">AO</div>
                  <div>
                    <div className="ds-un">Ada Okafor</div>
                    <div className="ds-ur">Student · 200L</div>
                  </div>
                </div>
              </div>

              <div className="d-content">
                <div className="dc-h">Dashboard</div>
                <div className="dc-row">
                  <div className="dc-s">
                    <div className="dc-sv">3</div>
                    <div className="dc-sl">Active</div>
                  </div>
                  <div className="dc-s">
                    <div className="dc-sv k">47</div>
                    <div className="dc-sl">Done</div>
                  </div>
                  <div className="dc-s">
                    <div className="dc-sv g">₦5k</div>
                    <div className="dc-sl">Balance</div>
                  </div>
                </div>
                <div className="dc-card">
                  <div className="dc-ch">
                    <span className="dc-ct">Recent orders</span>
                    <span className="dc-b b-ok">● 3 active</span>
                  </div>
                  <div className="dc-or">
                    <div
                      className="dc-oi"
                      style={{ background: 'rgba(217,119,6,.1)' }}
                    >
                      🍔
                    </div>
                    <div className="dc-oin">
                      <div className="dc-ot">Food pickup · Cafeteria B</div>
                      <div className="dc-os">Runner on the way · ETA 4 min</div>
                    </div>
                    <div className="dc-op">₦800</div>
                  </div>
                  <div className="dc-or">
                    <div
                      className="dc-oi"
                      style={{ background: 'rgba(13,31,45,.08)' }}
                    >
                      🖨️
                    </div>
                    <div className="dc-oin">
                      <div className="dc-ot">Print 12 pages · Faculty</div>
                      <div className="dc-os">Finding a runner...</div>
                    </div>
                    <div className="dc-op">₦350</div>
                  </div>
                  <div className="dc-or">
                    <div
                      className="dc-oi"
                      style={{ background: 'rgba(22,163,74,.08)' }}
                    >
                      ⛽
                    </div>
                    <div className="dc-oin">
                      <div className="dc-ot">Gas refill · Block C</div>
                      <div className="dc-os">Completed yesterday</div>
                    </div>
                    <div className="dc-op">₦1,200</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-band">
        <div className="sb-inner">
          <div className="sc rv">
            <div className="sn" data-target="10000">
              <sup>#</sup>
              <span>0</span>
            </div>
            <div className="sl">Orders completed</div>
          </div>
          <div className="sc rv r1">
            <div className="sn" data-target="850">
              <span>0</span>
              <sup>+</sup>
            </div>
            <div className="sl">Active runners</div>
          </div>
          <div className="sc rv r2">
            <div className="sn">
              <span>4.9</span>
              <sup>★</sup>
            </div>
            <div className="sl">Average rating</div>
          </div>
          <div className="sc rv r3">
            <div className="sn">
              <span>8</span>
              <sup>min</sup>
            </div>
            <div className="sl">Avg delivery time</div>
          </div>
        </div>
      </div>

      <section className="sec" id="how">
        <div className="rv">
          <div className="eye">How it works</div>
          <h2 className="st">
            Three steps.
            <br />
            Done and <em>delivered.</em>
          </h2>
          <p className="ss">
            No calls, no confusion — place an order and let a runner handle it end to
            end.
          </p>
        </div>
        <div className="how-grid rv r1">
          <div className="how-c">
            <div className="how-n">01</div>
            <div className="how-icon">📝</div>
            <div className="how-t">Place your order</div>
            <p className="how-d">
              Describe your errand, set pickup and drop-off, pick urgency, and name a
              fair budget. Takes under 60 seconds.
            </p>
          </div>
          <div className="how-c">
            <div className="how-n">02</div>
            <div className="how-icon">⚡</div>
            <div className="how-t">Runner accepts</div>
            <p className="how-d">
              A verified campus runner nearby accepts your request. You&apos;re notified
              instantly and can track them live.
            </p>
          </div>
          <div className="how-c">
            <div className="how-n">03</div>
            <div className="how-icon">🎉</div>
            <div className="how-t">Receive & rate</div>
            <p className="how-d">
              Your errand arrives right at your door. Pay from your wallet, then rate
              your runner.
            </p>
          </div>
        </div>
      </section>

      <div className="svc-wrap" id="services">
        <div className="svc-inner">
          <div className="rv">
            <div className="eye">Services</div>
            <h2 className="st">
              Everything <em>on campus,</em>
              <br />
              covered.
            </h2>
            <p className="ss">
              Whatever you need fetched, printed, picked up, or delivered — we have
              a runner for it.
            </p>
          </div>
          <div className="svc-grid rv r1">
            <div className="svc-c">
              <span className="svc-em">🍔</span>
              <div className="svc-n">Food Pickup</div>
              <div className="svc-h">Canteen & cafeteria</div>
            </div>
            <div className="svc-c">
              <span className="svc-em">🛒</span>
              <div className="svc-n">Market Run</div>
              <div className="svc-h">Groceries & supplies</div>
            </div>
            <div className="svc-c">
              <span className="svc-em">⛽</span>
              <div className="svc-n">Gas Refill</div>
              <div className="svc-h">Cooking gas delivery</div>
            </div>
            <div className="svc-c">
              <span className="svc-em">👕</span>
              <div className="svc-n">Laundry</div>
              <div className="svc-h">Pickup & drop-off</div>
            </div>
            <div className="svc-c">
              <span className="svc-em">🖨️</span>
              <div className="svc-n">Printing</div>
              <div className="svc-h">Documents & copies</div>
            </div>
            <div className="svc-c">
              <span className="svc-em">💊</span>
              <div className="svc-n">Pharmacy</div>
              <div className="svc-h">Meds & essentials</div>
            </div>
            <div className="svc-c">
              <span className="svc-em">📦</span>
              <div className="svc-n">Parcel Delivery</div>
              <div className="svc-h">Send & receive</div>
            </div>
            <div className="svc-c">
              <span className="svc-em">🔧</span>
              <div className="svc-n">Errands</div>
              <div className="svc-h">Anything on campus</div>
            </div>
          </div>
        </div>
      </div>

      <section className="sec">
        <div className="fsplit">
          <div className="rv">
            <div className="eye">For runners</div>
            <h2 className="st">
              Turn free time into <em>real income.</em>
            </h2>
            <p className="ss">
              Accept jobs between classes. Get paid daily. No boss, no fixed schedule
              — just your campus and your pace.
            </p>
            <div className="f-list">
              <div className="f-item">
                <div className="f-num">01</div>
                <div className="f-b">
                  <h4>Instant job alerts</h4>
                  <p>
                    The moment a request lands near you, your phone buzzes. First to
                    accept is first to earn.
                  </p>
                </div>
              </div>
              <div className="f-item">
                <div className="f-num">02</div>
                <div className="f-b">
                  <h4>Keep 90% of every order</h4>
                  <p>
                    We take only 10% to keep the lights on. The rest goes straight to
                    your wallet, daily.
                  </p>
                </div>
              </div>
              <div className="f-item">
                <div className="f-num">03</div>
                <div className="f-b">
                  <h4>Verified & trusted</h4>
                  <p>
                    Your runner badge builds credibility. Students choose high-rated
                    runners — so good work always pays more.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-wrap rv r2">
            <div className="p-chip pc1">
              <div className="pcd" style={{ background: 'var(--ok)' }}></div>
              Runner assigned!
            </div>
            <div className="p-chip pc2">
              <div className="pcd" style={{ background: 'var(--gold)' }}></div>
              +₦1,200 earned
            </div>
            <div className="p-shell">
              <div className="p-screen">
                <div className="p-island"></div>
                <div className="ps-h" style={{ paddingTop: 44 }}>
                  <div>
                    <div className="ps-g">Good afternoon 👋</div>
                    <div className="ps-name">Ada Okafor</div>
                  </div>
                  <div className="ps-notif">🔔</div>
                </div>
                <div className="ps-bal">
                  <div className="ps-bl">Wallet balance</div>
                  <div className="ps-ba">₦5,000</div>
                  <div className="ps-bs">↑ ₦800 added this week</div>
                </div>
                <div className="ps-sg">
                  <div className="ps-sc">
                    <div className="ps-sv">3</div>
                    <div className="ps-slb">Active orders</div>
                  </div>
                  <div className="ps-sc">
                    <div className="ps-sv" style={{ color: 'var(--ok)' }}>
                      47
                    </div>
                    <div className="ps-slb">Completed</div>
                  </div>
                </div>
                <div className="ps-ol">
                  <div className="ps-olt">
                    <span>Recent orders</span>
                    <span>See all →</span>
                  </div>
                  <div className="ps-o">
                    <div className="pso-ic" style={{ background: 'rgba(217,119,6,.12)' }}>🍔</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="pso-t">Food · Cafeteria B</div>
                      <div className="pso-s">ETA 4 min · ₦800</div>
                    </div>
                    <div className="pso-b bo">Live</div>
                  </div>
                  <div className="ps-o">
                    <div className="pso-ic" style={{ background: 'rgba(217,119,6,.1)' }}>🖨️</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="pso-t">Print 12 pages</div>
                      <div className="pso-s">Finding runner · ₦350</div>
                    </div>
                    <div className="pso-b bw">Soon</div>
                  </div>
                  <div className="ps-o">
                    <div className="pso-ic" style={{ background: 'rgba(22,163,74,.1)' }}>⛽</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="pso-t">Gas refill · Block C</div>
                      <div className="pso-s">Completed · ₦1,200</div>
                    </div>
                    <div className="pso-b" style={{ background: 'rgba(22,163,74,.1)', color: 'var(--ok)' }}>Done</div>
                  </div>
                </div>
                {/* Quick actions */}
                <div className="ps-qa">
                  <div className="ps-olt" style={{ margin: '0 12px 8px' }}>
                    <span style={{ color: 'var(--ink)', fontWeight: 700, fontSize: 10 }}>Quick order</span>
                  </div>
                  <div className="ps-qg">
                    <div className="ps-qi"><span>🍔</span><div>Food</div></div>
                    <div className="ps-qi"><span>🛒</span><div>Market</div></div>
                    <div className="ps-qi"><span>🖨️</span><div>Print</div></div>
                    <div className="ps-qi"><span>⛽</span><div>Gas</div></div>
                  </div>
                </div>
                {/* Earn banner */}
                <div className="ps-earn">
                  <div>
                    <div className="ps-et">Earn between classes</div>
                    <div className="ps-es">Runners made ₦12k+ this week</div>
                  </div>
                  <div className="ps-eb">Join →</div>
                </div>
                <div className="ps-bn">
                  <div className="ps-bi on">
                    <div className="ps-bic">⊞</div>Home
                  </div>
                  <div className="ps-bi">
                    <div className="ps-bic">📦</div>Orders
                  </div>
                  <div className="ps-bi" style={{ marginTop: -12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        background: 'var(--navy)',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(13,31,45,.35)',
                      }}
                    >
                      +
                    </div>
                  </div>
                  <div className="ps-bi">
                    <div className="ps-bic">💳</div>Wallet
                  </div>
                  <div className="ps-bi">
                    <div className="ps-bic">👤</div>Profile
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="price-sec" id="pricing">
        <div className="price-inner">
          <div className="rv">
            <div className="eye">Pricing</div>
            <h2 className="st">
              Simple pricing.
              <br />
              <em>No surprises.</em>
            </h2>
            <p className="ss">
              Free to start. Pay only when an order completes. Runners keep the
              lion&apos;s share.
            </p>
          </div>
          <div className="pg rv r1">
            <div className="pc">
              <div className="pc-tier">For students</div>
              <div className="pc-name">Free account</div>
              <p className="pc-desc">Everything you need to start placing orders today.</p>
              <div className="pc-amt">
                <sup>₦</sup>
                <span>0</span>
              </div>
              <p className="pc-per">+ small platform fee per order</p>
              <div className="pc-div"></div>
              <ul className="pc-ul">
                <li>Unlimited orders</li>
                <li>Real-time order tracking</li>
                <li>All 8 service types</li>
                <li>Campus wallet</li>
                <li>Full order history</li>
              </ul>
              <Link className="pc-btn pb-ol" href="/signup">
                Create free account →
              </Link>
            </div>
            <div className="pc feat">
              <div className="pc-badge">Most used</div>
              <div className="pc-tier gd">Platform fee</div>
              <div className="pc-name">Per delivery</div>
              <p className="pc-desc">
                A small cut per completed order keeps the platform running and everyone
                protected.
              </p>
              <div className="pc-amt">
                <span>10</span>
                <sup>%</sup>
              </div>
              <p className="pc-per">Of the order total, per delivery</p>
              <div className="pc-div"></div>
              <ul className="pc-ul">
                <li>Runner vetting & verification</li>
                <li>Dispute resolution support</li>
                <li>24/7 platform uptime</li>
                <li>Secure wallet transactions</li>
                <li>Order protection coverage</li>
              </ul>
              <Link className="pc-btn pb-g" href="/signup">
                Get started free →
              </Link>
            </div>
            <div className="pc">
              <div className="pc-tier gd">For runners</div>
              <div className="pc-name">Runner deal</div>
              <p className="pc-desc">
                Earn big between classes. Keep most of what you make, every time.
              </p>
              <div className="pc-amt">
                <span>90</span>
                <sup>%</sup>
              </div>
              <p className="pc-per">Of every order goes to you</p>
              <div className="pc-div"></div>
              <ul className="pc-ul">
                <li>Keep 90% per delivery</li>
                <li>Instant job notifications</li>
                <li>Daily earnings dashboard</li>
                <li>Flexible schedule</li>
                <li>Runner badge & profile</li>
              </ul>
              <Link className="pc-btn pb-ol" href="/runner-signup">
                ⚡ Become a runner
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="sec" id="reviews">
        <div className="rv">
          <div className="eye">Reviews</div>
          <h2 className="st">
            Loved across <em>the campus.</em>
          </h2>
          <p className="ss">
            From students who hate long walks to runners funding their degrees.
          </p>
        </div>
        <div className="rv-grid rv r1">
          <div className="rv-c">
            <div className="rv-stars">★★★★★</div>
            <p className="rv-q">
              &quot;I ordered lunch from the far canteen during a 30-minute break. The
              runner showed up in 11 minutes. CampusRunner is genuinely the best thing
              to happen to this campus.&quot;
            </p>
            <div className="rv-who">
              <div
                className="rv-av"
                style={{ background: 'linear-gradient(135deg,#0D1F2D,#1C3245)' }}
              >
                AO
              </div>
              <div>
                <div className="rv-n">Adaeze Okafor</div>
                <div className="rv-r">200L, Computer Science</div>
              </div>
            </div>
          </div>
          <div className="rv-c">
            <div className="rv-stars">★★★★★</div>
            <p className="rv-q">
              &quot;I make ₦8,000–₦12,000 a week just doing deliveries between my
              morning and afternoon lectures. Best side hustle on campus, full
              stop.&quot;
            </p>
            <div className="rv-who">
              <div
                className="rv-av"
                style={{ background: 'linear-gradient(135deg,#C9952A,#E2B24A)' }}
              >
                CE
              </div>
              <div>
                <div className="rv-n">Chukwuemeka Eze</div>
                <div className="rv-r">Runner · 300L, Engineering</div>
              </div>
            </div>
          </div>
          <div className="rv-c">
            <div className="rv-stars">★★★★★</div>
            <p className="rv-q">
              &quot;Got my gas refilled during exam week without leaving the library
              once. I didn&apos;t know that was possible until CampusRunner.
              Life-changing.&quot;
            </p>
            <div className="rv-who">
              <div
                className="rv-av"
                style={{ background: 'linear-gradient(135deg,#16A34A,#0d6640)' }}
              >
                FF
              </div>
              <div>
                <div className="rv-n">Fatima Faruk</div>
                <div className="rv-r">400L, Medicine & Surgery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="cta-sec rv">
        <div className="cta-in">
          <h2 className="cta-t">
            Stop walking.
            <br />
            Start <em>ordering.</em>
          </h2>
          <p className="cta-s">
            Join thousands of students already on CampusRunner. Free to start, no
            subscriptions, instant access.
          </p>
          <div className="cta-as">
            <Link
              className="n-cta"
              href="/signup"
              style={{ fontSize: 15, padding: '14px 32px', borderRadius: 14 }}
            >
              Order your first errand →
            </Link>
            <Link
              className="n-cta g"
              href="/runner-signup"
              style={{ fontSize: 15, padding: '14px 32px', borderRadius: 14 }}
            >
              ⚡ Earn as a runner
            </Link>
          </div>
        </div>
      </div>

      <footer>
        <div className="fi">
          <div className="ft">
            <div className="fb">
              <span className="fb-w">
                Campus<b>Runner</b>
              </span>
              <p>
                The campus delivery network built by students, for students. Fast,
                trusted, always on campus.
              </p>
            </div>
            <div className="fc">
              <h5>Platform</h5>
              <Link href="#how">How it works</Link>
              <Link href="#services">Services</Link>
              <Link href="#pricing">Pricing</Link>
              <Link href="#">Download app</Link>
            </div>
            <div className="fc">
              <h5>Company</h5>
              <Link href="#">About us</Link>
              <Link href="#">Blog</Link>
              <Link href="#">Careers</Link>
              <Link href="#">Press</Link>
            </div>
            <div className="fc">
              <h5>Support</h5>
              <Link href="#">Help center</Link>
              <Link href="#">Contact us</Link>
              <Link href="#">Privacy policy</Link>
              <Link href="#">Terms</Link>
            </div>
          </div>
          <div className="fb-bot">
            <p>© 2026 CampusRunner · Made for campus life</p>
            <div className="fb-soc">
              <Link className="sb" href="#">
                𝕏
              </Link>
              <Link className="sb" href="#">
                in
              </Link>
              <Link className="sb" href="#">
                ig
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
