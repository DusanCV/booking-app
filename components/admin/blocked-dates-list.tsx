"use client";

import { useState } from "react";
import { deleteBlockedDate } from "@/lib/blocked-dates";

type BlockedDateItem = {
  id: number;
  unit_id: number;
  start_date: string;
  end_date: string;
  reason: string | null;
  units: {
    name: string;
    slug: string;
  } | null;
};

type Props = {
  initialBlockedDates: BlockedDateItem[];
};

export function BlockedDatesList({ initialBlockedDates }: Props) {
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    try {
      setLoadingId(id);
      await deleteBlockedDate(id);
      setBlockedDates((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("Greška pri odblokiranju datuma");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <h2 className="text-2xl font-semibold text-white">Blokirani termini</h2>

      <div className="mt-5 space-y-3">
        {blockedDates.length === 0 ? (
          <p className="text-white/60">Trenutno nema blokiranih termina.</p>
        ) : (
          blockedDates.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-lg font-semibold text-white">
                  {item.units?.name ?? `Jedinica #${item.unit_id}`}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {item.start_date} → {item.end_date}
                </p>
                <p className="mt-1 text-sm text-white/50">
                  Razlog: {item.reason || "-"}
                </p>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                disabled={loadingId === item.id}
                className="inline-flex items-center justify-center rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:opacity-50"
              >
                {loadingId === item.id ? "Odblokiravam..." : "Odblokiraj"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}