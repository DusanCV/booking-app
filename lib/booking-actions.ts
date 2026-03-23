import { supabase } from "@/lib/supabase/client";

export async function updateBookingStatus(
  bookingId: number,
  status: "confirmed" | "cancelled"
) {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    throw new Error(`Greška pri updateu statusa: ${error.message}`);
  }

  return data;
}