'use client';

import Image from 'next/image';

function PageLoader() {
  return (
    <div className="cr-loader-shell">
      <div className="cr-loader-inner">
        {/* Track */}
        <div className="cr-track">
          <div className="cr-track-line" />
          {/* Runner */}
          <div className="cr-runner">
            <Image
              src="/Gemini_Generated_Image_a835kka835kka835.png"
              alt="CampusRunner"
              width={52}
              height={52}
              className="cr-runner-img"
            />
            {/* Speed lines */}
            <div className="cr-speed-lines">
              <span /><span /><span />
            </div>
            {/* Package bob */}
            <div className="cr-package">📦</div>
          </div>
          {/* Destination pin */}
          <div className="cr-pin">📍</div>
        </div>

        <div className="cr-loader-brand">Campus<b>Runner</b></div>
        <div className="cr-loader-dots">
          <span /><span /><span />
        </div>
      </div>

      <style>{`
        .cr-loader-shell {
          position: fixed; inset: 0; z-index: 9999;
          background: #0F3D2E;
          display: flex; align-items: center; justify-content: center;
        }
        .cr-loader-inner {
          display: flex; flex-direction: column; align-items: center; gap: 20px;
        }
        .cr-track {
          width: 260px; position: relative; height: 64px;
          display: flex; align-items: center;
        }
        .cr-track-line {
          position: absolute; bottom: 10px; left: 0; right: 0;
          height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, #D4AF37 0%, rgba(212,175,55,.2) 100%);
          opacity: .5;
        }
        /* runner slides from left to near the pin */
        @keyframes runAcross {
          0%   { left: 0px; }
          80%  { left: 180px; }
          90%  { left: 172px; }
          100% { left: 180px; }
        }
        /* package bobs up and down */
        @keyframes packageBob {
          0%,100% { transform: translateY(0) rotate(-5deg); }
          50%     { transform: translateY(-6px) rotate(5deg); }
        }
        /* legs bounce — achieved via vertical shift on the whole runner */
        @keyframes runBounce {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-5px); }
        }
        /* speed lines fade in/out */
        @keyframes speedLine {
          0%,100% { opacity: 0; transform: scaleX(0); }
          50%     { opacity: 1; transform: scaleX(1); }
        }
        /* pin pulse */
        @keyframes pinPulse {
          0%,100% { transform: translateY(0) scale(1); }
          50%     { transform: translateY(-4px) scale(1.15); }
        }
        /* dots */
        @keyframes dotBlink {
          0%,80%,100% { opacity: .2; transform: scale(.8); }
          40%         { opacity: 1; transform: scale(1); }
        }

        .cr-runner {
          position: absolute; bottom: 12px;
          display: flex; align-items: flex-end; gap: 4px;
          animation: runAcross 1.6s cubic-bezier(.45,0,.55,1) infinite;
        }
        .cr-runner-img {
          border-radius: 50%;
          animation: runBounce .35s ease-in-out infinite;
          box-shadow: 0 4px 16px rgba(0,0,0,.4);
        }
        .cr-speed-lines {
          display: flex; flex-direction: column; gap: 3px;
          position: absolute; left: -22px; bottom: 14px;
        }
        .cr-speed-lines span {
          display: block; height: 2px; border-radius: 2px;
          background: var(--gold, #D4AF37);
          transform-origin: right;
          animation: speedLine .35s ease-in-out infinite;
        }
        .cr-speed-lines span:nth-child(1) { width: 14px; animation-delay: 0s; }
        .cr-speed-lines span:nth-child(2) { width: 10px; animation-delay: .07s; }
        .cr-speed-lines span:nth-child(3) { width: 7px;  animation-delay: .14s; }

        .cr-package {
          font-size: 18px; position: absolute; top: -18px; right: -8px;
          animation: packageBob .35s ease-in-out infinite;
        }
        .cr-pin {
          position: absolute; right: 0; bottom: 10px; font-size: 22px;
          animation: pinPulse 1s ease-in-out infinite;
        }
        .cr-loader-brand {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 18px; font-weight: 800; letter-spacing: -.02em;
          color: #fff;
        }
        .cr-loader-brand b { color: #D4AF37; }
        .cr-loader-dots {
          display: flex; gap: 6px;
        }
        .cr-loader-dots span {
          width: 7px; height: 7px; border-radius: 50%;
          background: #D4AF37;
          animation: dotBlink 1.2s ease-in-out infinite;
        }
        .cr-loader-dots span:nth-child(2) { animation-delay: .2s; }
        .cr-loader-dots span:nth-child(3) { animation-delay: .4s; }
      `}</style>
    </div>
  );
}

export { PageLoader };
export default PageLoader;
