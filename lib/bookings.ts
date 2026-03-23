import { supabase } from "@/lib/supabase/client";
import type { Booking } from "@/types/booking";

export type BookingWithUnitName = Booking & {
  units: {
    name: string;
    slug: string;
  } | null;
};

export async function getBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      units (
        name,
        slug
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Greška pri dohvaćanju rezervacija: ${error.message}`);
  }

  return (data ?? []) as BookingWithUnitName[];
}