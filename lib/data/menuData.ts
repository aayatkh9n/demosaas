import { supabase } from '@/lib/supabase/client';
import { MenuItem, Cuisine } from '@/types';

/**
 * PRODUCTION MENU FETCH
 * Single source of truth = Supabase
 */

export const getMenuItemsByCuisine = async (
  cuisine: Cuisine
): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('cuisine', cuisine)
    .eq('availability', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching menu:', error);
    return [];
  }

  return data as MenuItem[];
};

export const getMenuItemById = async (
  id: string
): Promise<MenuItem | null> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching menu item:', error);
    return null;
  }

  return data as MenuItem;
};

export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching all menu items:', error);
    return [];
  }

  return data as MenuItem[];
};
