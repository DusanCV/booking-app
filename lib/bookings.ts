import type { SupabaseClient } from "@supabase/supabase-js";
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

export async function getOwnerBookings(
  supabaseClient: SupabaseClient,
  ownerId: string
) {
  const { data, error } = await supabaseClient
    .from("bookings")
    .select(`
      *,
      units!inner (
        name,
        slug,
        owner_id
      )
    `)
    .eq("units.owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Greška pri dohvaćanju rezervacija vlasnika: ${error.message}`
    );
  }

  return (data ?? []).map((booking) => ({
    ...booking,
    units: booking.units
      ? {
          name: booking.units.name,
          slug: booking.units.slug,
        }
      : null,
  })) as BookingWithUnitName[];
}