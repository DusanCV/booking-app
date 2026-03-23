import { supabase } from "@/lib/supabase/client";
import type { BlockedDate } from "@/types/booking";

type CreateBlockedDateInput = {
  unitId: number;
  startDate: string;
  endDate: string;
  reason?: string;
};

export async function createBlockedDate(input: CreateBlockedDateInput) {
  const { data, error } = await supabase
    .from("blocked_dates")
    .insert({
      unit_id: input.unitId,
      start_date: input.startDate,
      end_date: input.endDate,
      reason: input.reason ?? null,
    })
    .select()
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

export async function deleteBlockedDate(id: number) {
  const { error } = await supabase
    .from("blocked_dates")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Greška pri odblokiranju datuma: ${error.message}`);
  }

  return true;
}