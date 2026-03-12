export default function StudentNotificationsPage() {
  return <div className="px-4 py-5 md:px-8 md:py-8"><h1 className="text-2xl font-black">Notifications</h1><div className="mt-5 space-y-3">{['Your printing order was accepted.','Wallet top up completed successfully.','Food pickup runner is 8 minutes away.'].map((n)=><div key={n} className="rounded-[24px] border border-[#E9E4FF] bg-white p-4 shadow-sm text-slate-600">{n}</div>)}</div></div>;
}
