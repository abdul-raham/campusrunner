import { Bell, ClipboardList, Package, Pill, Printer, Shirt, ShoppingBasket, Truck, WalletCards, Zap } from 'lucide-react';

export const serviceCards = [
  { title: 'Gas Refill', subtitle: 'Refill and deliver cooking gas', icon: Zap, color: 'from-violet-500 to-fuchsia-500' },
  { title: 'Market Run', subtitle: 'Groceries and quick essentials', icon: ShoppingBasket, color: 'from-cyan-500 to-teal-400', popular: true },
  { title: 'Laundry Pickup', subtitle: 'Pickup, clean, and return', icon: Shirt, color: 'from-blue-500 to-indigo-500' },
  { title: 'Printing', subtitle: 'Print, photocopy, and bind fast', icon: Printer, color: 'from-amber-500 to-orange-500', popular: true },
  { title: 'Food Pickup', subtitle: 'Meals from campus vendors', icon: Package, color: 'from-emerald-500 to-lime-500', popular: true },
  { title: 'Parcel Delivery', subtitle: 'Hostel-to-hostel fast dropoff', icon: Truck, color: 'from-slate-600 to-slate-400' },
  { title: 'Pharmacy', subtitle: 'Drugs and care essentials', icon: Pill, color: 'from-pink-500 to-rose-500' },
  { title: 'Errand Assistant', subtitle: 'Custom requests around campus', icon: ClipboardList, color: 'from-violet-500 to-cyan-500' },
];

export const studentStats = [
  { label: 'Wallet Balance', value: '₦4,500', icon: WalletCards },
  { label: 'Open Orders', value: '03', icon: Package },
  { label: 'Unread Alerts', value: '07', icon: Bell },
];

export const recentOrders = [
  { id: 'CR-1102', service: 'Printing', amount: '₦1,200', status: 'In Progress', eta: '12 mins', runner: 'Ayo J.' },
  { id: 'CR-1098', service: 'Food Pickup', amount: '₦2,500', status: 'Completed', eta: 'Delivered', runner: 'Sarah K.' },
  { id: 'CR-1092', service: 'Market Run', amount: '₦3,400', status: 'Pending', eta: 'Awaiting runner', runner: '—' },
];

export const runnerJobs = [
  { id: 'JB-201', service: 'Market Run', pickup: 'Campus Mart', dropoff: 'Hall 3', amount: '₦1,200', urgent: true },
  { id: 'JB-202', service: 'Printing', pickup: 'ICT Centre', dropoff: 'LT 2', amount: '₦800' },
  { id: 'JB-203', service: 'Parcel Delivery', pickup: 'Hall 1', dropoff: 'Hostel C', amount: '₦600' },
];

export const adminMetrics = [
  { label: 'Platform Volume', value: '₦482k', delta: '+14%' },
  { label: 'Pending Orders', value: '18', delta: 'Live' },
  { label: 'Verified Runners', value: '124', delta: '+9' },
  { label: 'Disputes', value: '02', delta: 'Needs review' },
];
