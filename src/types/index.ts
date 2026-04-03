import { z } from 'zod';
import { loginSchema, studentSignupSchema, runnerSignupSchema } from '@/lib/schemas';

// Schema-based types
export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof studentSignupSchema>;
export type RunnerSignupForm = z.infer<typeof runnerSignupSchema>;

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'runner' | 'admin';
  matric_number?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'student' | 'runner' | 'admin';
  university: string;
  hostel_location: string;
  matric_number?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  title: string;
  description: string;
  status: string;
  final_amount: number;
  platform_fee: number;
  created_at: string;
  updated_at: string;
  pickup_location: string;
  delivery_location: string;
  urgency_level: string;
  service_category_id: string;
  runner_id: string | null;
  student_id: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon_name: string;
  description: string;
  base_price: number;
  created_at: string;
}
