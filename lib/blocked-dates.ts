import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { BlockedDate } from "@/types/booking";

type CreateBlockedDateInput = {
  unitId: number;
  startDate: string;
  endDate: string;
  reason?: string;
};

export async function createBlockedDate(input: CreateBlockedDateInput) {
  const supabaseBrowser = createSupabaseBrowserClient();

  const { data, error } = await supabaseBrowser
    .from("blocked_dates")
    .insert({
      unit_id: input.unitId,
      start_date: input.startDate,
      end_date: input.endDate,
      reason: input.reason ?? null,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Greška pri blokiranju datuma: ${error.message}`);
  }

  return data;
}

export async function getBlockedDates() {
  const { data, error } = await supabase
    .from("blocked_dates")
    .select(`
      *,
      units (
        name,
        slug
      )
    `)
    .order("start_date", { ascending: true });

  if (error) {
    throw new Error(`Greška pri dohvaćanju blokiranih datuma: ${error.message}`);
  }

  return (data ?? []) as (BlockedDate & {
    units: {
      name: string;
      slug: string;
    } | null;
  })[];
}

export async function getOwnerBlockedDates(
  supabaseClient: SupabaseClient,
  ownerId: string
) {
  const { data, error } = await supabaseClient
    .from("blocked_dates")
    .select(`
      *,
      units!inner (
        name,
        slug,
        owner_id
      )
    `)
    .eq("units.owner_id", ownerId)
    .order("start_date", { ascending: true });

  if (error) {
    throw new Error(
      `Greška pri dohvaćanju blokiranih datuma vlasnika: ${error.message}`
    );
  }

  return (data ?? []).map((item) => ({
    ...item,
    units: item.units
      ? {
          name: item.units.name,
          slug: item.units.slug,
        }
      : null,
  })) as (BlockedDate & {
    units: {
      name: string;
      slug: string;
    } | null;
  })[];
}

export async function deleteBlockedDate(id: number) {
  const supabaseBrowser = createSupabaseBrowserClient();

  const { data, error } = await supabaseBrowser
    .from("blocked_dates")
    .delete()
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    throw new Error(`Greška pri odblokiranju datuma: ${error.message}`);
  }

  if (!data) {
    throw new Error("Datum nije obrisan.");
  }

  return true;
}