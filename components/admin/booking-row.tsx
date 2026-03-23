"use client";

import { useState } from "react";
import { updateBookingStatus } from "@/lib/booking-actions";
import type { BookingWithUnitName } from "@/lib/bookings";

type Props = {
  booking: BookingWithUnitName;
};

export function BookingRow({ booking }: Props) {
  const [status, setStatus] = useState(booking.status);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: "confirmed" | "cancelled") => {
    try {
      setLoading(true);
      const updated = await updateBookingStatus(booking.id, newStatus);
      setStatus(updated.status);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Greška pri promjeni statusa"
      );
    } finally {
      setLoading(false);
    }
  };

  const statusClasses =
    status === "confirmed"
      ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
      : status === "cancelled"
      ? "border-rose-400/25 bg-rose-500/10 text-rose-200"
      : "border-amber-400/25 bg-amber-400/10 text-amber-200";

  return (
    <tr className="border-t border-white/10 text-white/85">
      <td className="px-4 py-4 font-medium">
        {booking.units?.name ?? `Jedinica #${booking.unit_id}`}
      </td>
      <td className="px-4 py-4">{booking.guest_name}</td>
      <td className="px-4 py-4 text-white/70">{booking.guest_email}</td>
      <td className="px-4 py-4 text-white/70">{booking.guest_phone ?? "-"}</td>
      <td className="px-4 py-4">{booking.check_in}</td>
      <td className="px-4 py-4">{booking.check_out}</td>
      <td className="px-4 py-4">
        {booking.adults} + {booking.children}
      </td>
      <td className="px-4 py-4 font-semibold">
        {booking.total_price ? `${booking.total_price} €` : "-"}
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClasses}`}
        >
          {status}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleUpdate("confirmed")}
            disabled={loading}
            className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-50"
          >
            Potvrdi
          </button>

          <button
            onClick={() => handleUpdate("cancelled")}
            disabled={loading}
            className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:opacity-50"
          >
            Otkaži
          </button>
        </div>
      </td>
    </tr>
  );
}