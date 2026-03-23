"use client";

import { useState } from "react";
import { createBlockedDate } from "@/lib/blocked-dates";

type Props = {
  units: { id: number; name: string }[];
};

export function BlockDatesForm({ units }: Props) {
  const [unitId, setUnitId] = useState(units[0]?.id ?? 0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setMessage(null);

      await createBlockedDate({
        unitId,
        startDate,
        endDate,
        reason,
      });

      setMessage("Datumi uspješno blokirani.");
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Greška pri blokiranju."
      );
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">
        Blokiraj datume
      </h2>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <select
          value={unitId}
          onChange={(e) => setUnitId(Number(e.target.value))}
          className="w-full rounded-xl border px-4 py-3"
        >
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />

        <input
          type="text"
          placeholder="Razlog (opcionalno)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />

        <button className="w-full rounded-xl bg-gray-900 px-4 py-3 text-white">
          Blokiraj
        </button>
      </form>

      {message && (
        <div className="mt-4 text-sm text-gray-700">{message}</div>
      )}
    </div>
  );
}