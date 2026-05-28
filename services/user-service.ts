import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';

export type UserRow = Database['public']['Tables']['users']['Row'];

export const userService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<UserRow>) {
    const { data, error } = await (supabase.from('users') as any)
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSessions(userId: string) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }
};
