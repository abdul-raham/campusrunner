export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#6200EE] animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-[#6200EE] animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 rounded-full bg-[#03DAC5] animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}
