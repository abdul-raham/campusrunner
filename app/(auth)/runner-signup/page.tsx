import { RunnerSignupForm } from '@/components/auth/RunnerSignupForm';

export default function RunnerSignupPage() {
  return (
    <main className="min-h-screen bg-[#F6F7FB] text-[#0B0E11]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-80px] h-[320px] w-[320px] rounded-full bg-[#6200EE]/20 blur-3xl" />
        <div className="absolute right-[-100px] top-[120px] h-[300px] w-[300px] rounded-full bg-[#03DAC5]/20 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[25%] h-[280px] w-[280px] rounded-full bg-[#4F2EE8]/10 blur-3xl" />
      </div>
      
      <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-[28px] border border-white/60 bg-white/70 p-8 shadow-2xl shadow-[#6200EE]/10 backdrop-blur-xl">
          <RunnerSignupForm />
        </div>
      </div>
    </main>
  );
}