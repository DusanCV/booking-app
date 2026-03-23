"use client";

import { useState } from "react";
import { updateBookingStatus } from "@/lib/booking-actions";

type Props = {
  booking: any;
};

export function BookingRow({ booking }: Props) {
  const [status, setStatus] = useState(booking.status);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: "confirmed" | "cancelled") => {
    try {
      setLoading(true);
      await updateBookingStatus(booking.id, newStatus);
      setStatus(newStatus);
    } catch {
      alert("Greška pri promjeni statusa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="border-t">
      <td className="px-4 py-3">
        {booking.units?.name ?? `Jedinica #${booking.unit_id}`}
      </td>
      <td className="px-4 py-3">{booking.guest_name}</td>
      <td className="px-4 py-3">{booking.guest_email}</td>
      <td className="px-4 py-3">{booking.guest_phone ?? "-"}</td>
      <td className="px-4 py-3">{booking.check_in}</td>
      <td className="px-4 py-3">{booking.check_out}</td>
      <td className="px-4 py-3">
        {booking.adults} + {booking.children}
      </td>
      <td className="px-4 py-3">
  {booking.total_price ? `${booking.total_price} €` : "-"}
</td>
      <td className="px-4 py-3">{status}</td>
      <td className="px-4 py-3 flex gap-2">
        <button
          onClick={() => handleUpdate("confirmed")}
          disabled={loading}
          className="rounded border px-3 py-1 text-xs"
        >
          Potvrdi
        </button>

        <button
          onClick={() => handleUpdate("cancelled")}
          disabled={loading}
          className="rounded border px-3 py-1 text-xs"
        >
          Otkaži
        </button>
      </td>
    </tr>
  );
}