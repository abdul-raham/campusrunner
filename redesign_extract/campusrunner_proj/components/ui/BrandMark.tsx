export function BrandMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <div className={`${className} rounded-2xl bg-[linear-gradient(135deg,#6200EE,#03DAC5)] p-[1px] shadow-lg shadow-violet-500/20`}>
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
        <span className="text-lg font-black text-white">⚡</span>
      </div>
    </div>
  );
}
