import { supabase } from "@/lib/supabase/client";
import type { Unit } from "@/types/unit";

export async function getUnits() {
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .eq("is_active", true)
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Greška pri dohvaćanju jedinica: ${error.message}`);
  }

  return (data ?? []) as Unit[];
}

export async function getUnitBySlug(slug: string) {
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Unit;
}