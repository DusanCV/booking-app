import { supabase } from "@/lib/supabase/client";

type CreateBookingInput = {
  unitId: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  totalPrice?: number;
};

export async function createBooking(input: CreateBookingInput) {
  const { error } = await supabase.from("bookings").insert({
    unit_id: input.unitId,
    guest_name: input.guestName,
    guest_email: input.guestEmail,
    guest_phone: input.guestPhone ?? null,
    check_in: input.checkIn,
    check_out: input.checkOut,
    adults: input.adults,
    children: input.children,
    total_price: input.totalPrice ?? null,
    status: "pending",
    source: "website",
  });

  if (error) {
    if (
      error.message.includes("bookings_no_overlap") ||
      error.message.includes("conflicting key value violates exclusion constraint")
    ) {
      throw new Error(
        "Odabrani termin više nije dostupan. Molimo odaberi druge datume i pokušaj ponovno."
      );
    }

    throw new Error(`Greška pri spremanju bookinga: ${error.message}`);
  }

  return true;
}