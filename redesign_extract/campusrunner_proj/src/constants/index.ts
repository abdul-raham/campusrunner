import {
  Zap,
  ShoppingCart,
  Shirt,
  Printer,
  UtensilsCrossed,
  Package,
  Pill,
  ClipboardList,
} from 'lucide-react';

export const SERVICE_CATEGORIES = [
  {
    id: 'gas_refill',
    name: 'Gas Refill',
    slug: 'gas_refill',
    description: 'Get your gas cylinder refilled quickly',
    icon: 'Zap',
    popular: false,
  },
  {
    id: 'market_run',
    name: 'Market Run',
    slug: 'market_run',
    description: 'Shopping groceries from local markets',
    icon: 'ShoppingCart',
    popular: true,
  },
  {
    id: 'laundry_pickup',
    name: 'Laundry Pickup',
    slug: 'laundry_pickup',
    description: 'Laundry collection and delivery',
    icon: 'Shirt',
    popular: false,
  },
  {
    id: 'printing_photocopy',
    name: 'Printing & Photocopy',
    slug: 'printing_photocopy',
    description: 'Document printing and copying services',
    icon: 'Printer',
    popular: true,
  },
  {
    id: 'food_pickup',
    name: 'Food Pickup',
    slug: 'food_pickup',
    description: 'Get food from your favorite restaurants',
    icon: 'UtensilsCrossed',
    popular: true,
  },
  {
    id: 'parcel_delivery',
    name: 'Parcel Delivery',
    slug: 'parcel_delivery',
    description: 'Send and receive parcels safely',
    icon: 'Package',
    popular: false,
  },
  {
    id: 'pharmacy_essentials',
    name: 'Pharmacy / Essentials',
    slug: 'pharmacy_essentials',
    description: 'Medicine and essential items delivery',
    icon: 'Pill',
    popular: false,
  },
  {
    id: 'errand_assistant',
    name: 'Errand Assistant',
    slug: 'errand_assistant',
    description: 'General errand assistance',
    icon: 'ClipboardList',
    popular: false,
  },
];

export const BASE_FEES = {
  gas_refill: 50,
  market_run: 75,
  laundry_pickup: 60,
  printing_photocopy: 40,
  food_pickup: 50,
  parcel_delivery: 75,
  pharmacy_essentials: 45,
  errand_assistant: 100,
};

export const PLATFORM_FEE_PERCENTAGE = 0.1; // 10%
export const URGENT_SURCHARGE = 50; // Additional amount for urgent orders

export const UNIVERSITIES = [
  'University of Lagos',
  'University of Ibadan',
  'Covenant University',
  'Lasu',
  'Ui',
  'Other',
];

export const EMERGENCY_CONTACT = '+234 800 000 0000';
export const SUPPORT_EMAIL = 'support@campusrunner.app';

export const COLORS = {
  primary: '#6200EE', // Electric Violet
  secondary: '#03DAC5', // Cyber Teal
  success: '#00C853', // Mint Green
  background_light: '#F6F7FB',
  background_dark: '#0B0E11', // Deep Obsidian
  trust_accent: '#4F2EE8', // Royal Violet
  card_border: '#E9E4FF', // Soft Lavender
  card_white: '#FFFFFF',
  text_primary: '#0B0E11', // Deep Obsidian
  text_secondary: '#6B7280',
};
