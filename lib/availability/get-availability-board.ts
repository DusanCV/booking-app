import { addDays, format } from "date-fns";
import { supabase } from "@/lib/supabase/client";
import type { Unit } from "@/types/unit";
import type { Booking, BlockedDate } from "@/types/booking";

export type AvailabilityCellStatus =
  | "free"
  | "pending"
  | "confirmed"
  | "blocked";

export type AvailabilityCell = {
  date: string;
  status: AvailabilityCellStatus;
};

export type AvailabilityRow = {
  unit: Unit;
  cells: AvailabilityCell[];
};

function isDateInRange(date: string, start: string, end: string) {
  return date >= start && date < end;
}

export async function getAvailabilityBoard(days = 14) {
  const startDate = new Date();

  const dates = Array.from({ length: days }, (_, index) =>
    format(addDays(startDate, index), "yyyy-MM-dd")
  );

  const { data: unitsData, error: unitsError } = await supabase
    .from("units")
    .select("*")
    .eq("is_active", true)
    .order("id", { ascending: true });

  if (unitsError) {
    throw new Error(`Greška pri dohvaćanju jedinica: ${unitsError.message}`);
  }

  const { data: bookingsData, error: bookingsError } = await supabase
    .from("bookings")
    .select("*")
    .in("status", ["pending", "confirmed"]);

  if (bookingsError) {
    throw new Error(`Greška pri dohvaćanju rezervacija: ${bookingsError.message}`);
  }

  const { data: blockedData, error: blockedError } = await supabase
    .from("blocked_dates")
    .select("*");

  if (blockedError) {
    throw new Error(`Greška pri dohvaćanju blokada: ${blockedError.message}`);
  }

  const units = (unitsData ?? []) as Unit[];
  const bookings = (bookingsData ?? []) as Booking[];
  const blockedDates = (blockedData ?? []) as BlockedDate[];

  const rows: AvailabilityRow[] = units.map((unit) => {
    const unitBookings = bookings.filter((booking) => booking.unit_id === unit.id);
    const unitBlocks = blockedDates.filter((block) => block.unit_id === unit.id);

    const cells: AvailabilityCell[] = dates.map((date) => {
      const blocked = unitBlocks.some((block) =>
        isDateInRange(date, block.start_date, block.end_date)
      );

      if (blocked) {
        return { date, status: "blocked" };
      }

      const confirmed = unitBookings.some(
        (booking) =>
          booking.status === "confirmed" &&
          isDateInRange(date, booking.check_in, booking.check_out)
      );

      if (confirmed) {
        return { date, status: "confirmed" };
      }

      const pending = unitBookings.some(
        (booking) =>
          booking.status === "pending" &&
          isDateInRange(date, booking.check_in, booking.check_out)
      );

      if (pending) {
        return { date, status: "pending" };
      }

      return { date, status: "free" };
    });

    return {
      unit,
      cells,
    };
  });

  return {
    dates,
    rows,
  };
}