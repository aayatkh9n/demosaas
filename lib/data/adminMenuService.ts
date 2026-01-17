import { supabase } from '@/lib/supabase/client';
import { MenuItem } from '@/types';

export async function fetchMenu() {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as MenuItem[];
}

export async function addMenuItem(item: MenuItem) {
  const { error } = await supabase
    .from('menu_items')
    .insert(item);

  if (error) throw error;
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>) {
  const { error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteMenuItem(id: string) {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
