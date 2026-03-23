import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import type { Unit } from "@/types/unit";

function normalizeUnit(unit: Unit): Unit {
  const images = Array.isArray(unit.unit_images)
    ? [...unit.unit_images].sort((a, b) => a.sort_order - b.sort_order)
    : [];

  return {
    ...unit,
    amenities: unit.amenities ?? [],
    unit_images: images,
  };
}

export async function getUnits() {
  const { data, error } = await supabase
    .from("units")
    .select(`
      *,
      unit_images (*)
    `)
    .eq("is_active", true)
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Greška pri dohvaćanju jedinica: ${error.message}`);
  }

  return ((data ?? []) as Unit[]).map(normalizeUnit);
}

export async function getUnitBySlug(slug: string) {
  const { data, error } = await supabase
    .from("units")
    .select(`
      *,
      unit_images (*)
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return normalizeUnit(data as Unit);
}

export async function getOwnerUnits(
  supabaseClient: SupabaseClient,
  ownerId: string
) {
  const { data, error } = await supabaseClient
    .from("units")
    .select(`
      *,
      unit_images (*)
    `)
    .eq("owner_id", ownerId)
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Greška pri dohvaćanju owner jedinica: ${error.message}`);
  }

  return ((data ?? []) as Unit[]).map(normalizeUnit);
}

export async function getOwnerUnitById(
  supabaseClient: SupabaseClient,
  unitId: number,
  ownerId: string
) {
  const { data, error } = await supabaseClient
    .from("units")
    .select(`
      *,
      unit_images (*)
    `)
    .eq("id", unitId)
    .eq("owner_id", ownerId)
    .single();

  if (error || !data) {
    return null;
  }

  return normalizeUnit(data as Unit);
}