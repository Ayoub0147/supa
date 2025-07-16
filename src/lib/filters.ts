import { supabase } from "./supabaseClient";

export async function fetchManufacturers() {
  const { data, error } = await supabase.from("manufacturers").select("id, name").order("name");
  if (error) throw error;
  return data;
}

export async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select("id, name").order("name");
  if (error) throw error;
  return data;
} 