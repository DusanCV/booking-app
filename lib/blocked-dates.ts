import { supabase } from "@/lib/supabase/client";

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