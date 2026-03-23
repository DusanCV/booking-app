import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export async function updateBookingStatus(
  bookingId: number,
  status: "confirmed" | "cancelled"
) {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId)
    .select("id, status")
    .single();

  if (error) {
    if (
      error.message.includes("bookings_no_overlap") ||
      error.message.includes("conflicting key value violates exclusion constraint")
    ) {
      throw new Error(
        "Ova rezervacija se ne može potvrditi jer se termin preklapa s postojećom rezervacijom."
      );
    }

    throw new Error(`Greška pri updateu statusa: ${error.message}`);
  }

  if (!data) {
    throw new Error(
      "Status nije spremljen. Vjerojatno nemaš pravo mijenjati ovu rezervaciju."
    );
  }

  return data;
}