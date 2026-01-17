import { supabase } from '@/lib/supabase/client';
import { AdminSettings } from '@/types';

export async function getAdminSettings(): Promise<AdminSettings> {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Admin settings error:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Admin settings not initialized');
  }

  return data;
}
