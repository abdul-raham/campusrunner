import { z } from 'zod';

export const studentSignupSchema = z
  .object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^[\d+\-\s()]+$/, 'Invalid phone number'),
    university: z.string().min(1, 'Please select a university'),
    hostel_location: z
      .string()
      .min(2, 'Location must be at least 2 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const runnerSignupSchema = studentSignupSchema.extend({
  student_id_number: z.string().min(3, 'Student ID is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const gasRefillSchema = z.object({
  cylinder_size: z.enum(['3kg', '5kg', '12.5kg']),
  current_level: z.enum(['empty', 'low', 'half']),
  preferred_vendor: z.string().optional(),
  hostel_location: z
    .string()
    .min(2, 'Location must be at least 2 characters'),
  notes: z.string().optional(),
});

export const marketRunSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().min(1, 'Item name is required'),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
      })
    )
    .min(1, 'At least one item is required'),
  budget: z.number().optional(),
  preferred_market: z.string().optional(),
  delivery_location: z
    .string()
    .min(2, 'Location must be at least 2 characters'),
  notes: z.string().optional(),
});

export const laundryPickupSchema = z.object({
  bag_count: z.number().min(1, 'Bag count must be at least 1'),
  laundry_type: z.enum(['wash_fold', 'iron_only', 'full_service']),
  pickup_date: z.string(),
  return_date: z.string(),
  pickup_location: z
    .string()
    .min(2, 'Location must be at least 2 characters'),
  notes: z.string().optional(),
});

export const printingPhotocopySchema = z.object({
  document_url: z.string().url('Please upload a valid file'),
  copies: z.number().min(1, 'Copies must be at least 1'),
  print_type: z.enum(['black_white', 'color']),
  binding_option: z.enum(['none', 'spiral', 'stapled']),
  delivery_location: z
    .string()
    .min(2, 'Location must be at least 2 characters'),
  deadline: z.string().optional(),
  notes: z.string().optional(),
});

export const foodPickupSchema = z.object({
  restaurant_name: z.string().min(1, 'Restaurant name is required'),
  food_details: z.string().min(5, 'Please provide food order details'),
  pickup_location: z
    .string()
    .min(2, 'Location must be at least 2 characters'),
  delivery_location: z
    .string()
    .min(2, 'Location must be at least 2 characters'),
  payment_method: z.enum(['cash', 'wallet']),
  notes: z.string().optional(),
});

export const parcelDeliverySchema = z.object({
  item_description: z.string().min(3, 'Please describe the item'),
  pickup_location: z
    .string()
    .min(2, 'Location must be at least 2 characters'),
  delivery_location: z
    .string()
    .min(2, 'Location must be at least 2 characters'),
  receiver_name: z.string().min(2, 'Receiver name is required'),
  receiver_phone: z.string().regex(/^[\d+\-\s()]+$/, 'Invalid phone number'),
  notes: z.string().optional(),
});

export const pharmacySchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().min(1, 'Item name is required'),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
      })
    )
    .min(1, 'At least one item is required'),
  preferred_pharmacy: z.string().optional(),
  urgency: z.enum(['normal', 'urgent']),
  delivery_location: z
    .string()
    .min(2, 'Location must be at least 2 characters'),
  notes: z.string().optional(),
});

export const errandAssistantSchema = z.object({
  task_title: z.string().min(3, 'Task title must be at least 3 characters'),
  task_description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  budget: z.number().min(50, 'Budget must be at least 50'),
  pickup_location: z.string().optional(),
  delivery_location: z.string().optional(),
  urgency: z.enum(['normal', 'urgent']),
  notes: z.string().optional(),
});
