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
        error instanceof Error ? error.message : "Greška pri blokiranju."
      );
    }
  };

  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={unitId}
          onChange={(e) => setUnitId(Number(e.target.value))}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none"
        >
          {units.map((unit) => (
            <option key={unit.id} value={unit.id} className="text-slate-900">
              {unit.name}
            </option>
          ))}
        </select>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none"
          />
        </div>

        <input
          type="text"
          placeholder="Razlog (opcionalno)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 outline-none"
        />

        <button className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]">
          Blokiraj termin
        </button>
      </form>

      {message && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
          {message}
        </div>
      )}
    </div>
  );
}