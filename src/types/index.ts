// User and Authentication Types
export type UserRole = 'student' | 'runner' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  university: string;
  hostel_location: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Runner extends Profile {
  student_id_number: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  runner_tier: 'normal' | 'campus_hero';
  is_available: boolean;
  rating: number;
  total_jobs: number;
}

// Service Types
export type ServiceCategory =
  | 'gas_refill'
  | 'market_run'
  | 'laundry_pickup'
  | 'printing_photocopy'
  | 'food_pickup'
  | 'parcel_delivery'
  | 'pharmacy_essentials'
  | 'errand_assistant';

export interface ServiceCategoryData {
  id: string;
  name: string;
  slug: ServiceCategory;
  description: string;
  icon_name: string;
  is_active: boolean;
  created_at: string;
}

// Order Types
export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type UrgencyLevel = 'normal' | 'urgent';

export interface Order {
  id: string;
  student_id: string;
  runner_id: string | null;
  service_category_id: string;
  title: string;
  description: string;
  status: OrderStatus;
  budget_amount: number;
  final_amount: number;
  platform_fee: number;
  runner_payout: number;
  pickup_location: string;
  delivery_location: string;
  urgency_level: UrgencyLevel;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
  completed_at: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_name: string;
  quantity: number;
  notes: string | null;
}

export interface OrderMeta {
  id: string;
  order_id: string;
  meta_key: string;
  meta_value: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  order_id: string;
  student_id: string;
  runner_id: string;
  amount: number;
  platform_fee: number;
  runner_amount: number;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  created_at: string;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Form Types
export interface StudentSignupForm {
  full_name: string;
  email: string;
  phone: string;
  university: string;
  hostel_location: string;
  password: string;
  confirmPassword: string;
}

export interface RunnerSignupForm extends StudentSignupForm {
  student_id_number: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

// Service Form Types
export interface GasRefillForm {
  cylinder_size: '3kg' | '5kg' | '12.5kg';
  current_level: 'empty' | 'low' | 'half';
  preferred_vendor?: string;
  hostel_location: string;
  notes?: string;
}

export interface MarketRunForm {
  items: { name: string; quantity: number }[];
  budget?: number;
  preferred_market?: string;
  delivery_location: string;
  notes?: string;
}

export interface LaundryPickupForm {
  bag_count: number;
  laundry_type: 'wash_fold' | 'iron_only' | 'full_service';
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  notes?: string;
}

export interface PrintingPhotocopyForm {
  document_url: string; // File upload
  copies: number;
  print_type: 'black_white' | 'color';
  binding_option: 'none' | 'spiral' | 'stapled';
  delivery_location: string;
  deadline?: string;
  notes?: string;
}

export interface FoodPickupForm {
  restaurant_name: string;
  food_details: string;
  pickup_location: string;
  delivery_location: string;
  payment_method: 'cash' | 'wallet';
  notes?: string;
}

export interface ParcelDeliveryForm {
  item_description: string;
  pickup_location: string;
  delivery_location: string;
  receiver_name: string;
  receiver_phone: string;
  notes?: string;
}

export interface PharmacyForm {
  items: { name: string; quantity: number }[];
  preferred_pharmacy?: string;
  urgency: 'normal' | 'urgent';
  delivery_location: string;
  notes?: string;
}

export interface ErrandAssistantForm {
  task_title: string;
  task_description: string;
  budget: number;
  pickup_location?: string;
  delivery_location?: string;
  urgency: 'normal' | 'urgent';
  notes?: string;
}
