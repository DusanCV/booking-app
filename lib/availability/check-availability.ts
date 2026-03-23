import { supabase } from "@/lib/supabase/client";
import type { Booking, BlockedDate } from "@/types/booking";

type CheckAvailabilityInput = {
  unitId: number;
  checkIn: string;
  checkOut: string;
};

type AvailabilityResult = {
  isAvailable: boolean;
  overlappingBookings: Booking[];
  overlappingBlocks: BlockedDate[];
};

export async function checkAvailability({
  unitId,
  checkIn,
  checkOut,
}: CheckAvailabilityInput): Promise<AvailabilityResult> {
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("*")
    .eq("unit_id", unitId)
    .in("status", ["pending", "confirmed"])
    .lt("check_in", checkOut)
    .gt("check_out", checkIn);

  if (bookingsError) {
    throw new Error(
      `Greška pri provjeri rezervacija: ${bookingsError.message}`
    );
  }

  const { data: blocks, error: blocksError } = await supabase
    .from("blocked_dates")
    .select("*")
    .eq("unit_id", unitId)
    .lt("start_date", checkOut)
    .gt("end_date", checkIn);

  if (blocksError) {
    throw new Error(`Greška pri provjeri blokada: ${blocksError.message}`);
  }

  const overlappingBookings = (bookings ?? []) as Booking[];
  const overlappingBlocks = (blocks ?? []) as BlockedDate[];

  return {
    isAvailable:
      overlappingBookings.length === 0 && overlappingBlocks.length === 0,
    overlappingBookings,
    overlappingBlocks,
  };
}