import { supabase } from '@/lib/supabase';
import type { Order, ServiceCategory } from '@/types';

export const orderService = {
  async getOrdersByStudent(studentId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getOrdersByRunner(
    runnerId: string,
    status?: string
  ): Promise<Order[]> {
    let query = supabase
      .from('orders')
      .select('*')
      .eq('runner_id', runnerId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) throw error;
    return data || [];
  },

  async getAllOrders(status?: string): Promise<Order[]> {
    let query = supabase.from('orders').select('*');

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) throw error;
    return data || [];
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async acceptOrder(
    orderId: string,
    runnerId: string
  ): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .update({
        runner_id: runnerId,
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAvailableOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'pending')
      .is('runner_id', null)
      .order('urgency_level', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },
};

export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createProfile(profile: any) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getRunners() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'runner');

    if (error) throw error;
    return data;
  },

  async getRunnerDetail(userId: string) {
    const { data, error } = await supabase
      .from('runners')
      .select('*')
      .eq('profile_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
};

export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    return data;
  },

  async getCategoryBySlug(slug: string) {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
};

export const notificationService = {
  async getnotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  async createNotification(notification: any) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
