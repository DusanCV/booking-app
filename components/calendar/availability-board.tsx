import { format } from "date-fns";
import {
  type AvailabilityCellStatus,
  type AvailabilityRow,
} from "@/lib/availability/get-availability-board";

type Props = {
  dates: string[];
  rows: AvailabilityRow[];
};

function getCellClasses(status: AvailabilityCellStatus) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-500 text-white";
    case "pending":
      return "bg-amber-300 text-slate-900";
    case "blocked":
      return "bg-rose-500 text-white";
    default:
      return "bg-white/10 text-white/50";
  }
}

function getCellLabel(status: AvailabilityCellStatus) {
  switch (status) {
    case "confirmed":
      return "Potvrđeno";
    case "pending":
      return "Na čekanju";
    case "blocked":
      return "Blokirano";
    default:
      return "Slobodno";
  }
}

export function AvailabilityBoard({ dates, rows }: Props) {
  return (
    <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur">
      <table className="min-w-max border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="sticky left-0 bg-[#0b1626] px-4 py-4 text-left text-sm font-semibold text-white">
              Jedinica
            </th>
            {dates.map((date) => (
              <th
                key={date}
                className="px-3 py-4 text-center text-sm font-semibold text-white/75"
              >
                {format(new Date(date), "dd.MM")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.unit.id} className="border-b border-white/10">
              <td className="sticky left-0 bg-[#0b1626] px-4 py-4 text-base font-semibold text-white">
                {row.unit.name}
              </td>

              {row.cells.map((cell) => (
                <td key={`${row.unit.id}-${cell.date}`} className="px-2 py-3">
                  <div
                    title={`${cell.date} - ${getCellLabel(cell.status)}`}
                    className={`min-w-[44px] rounded-xl px-2 py-3 text-center text-xs font-semibold ${getCellClasses(
                      cell.status
                    )}`}
                  >
                    {cell.status === "free" ? "—" : ""}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex flex-wrap gap-5 text-base text-white/75">
        <div className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded bg-white/10" />
          <span>Slobodno</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded bg-amber-300" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded bg-emerald-500" />
          <span>Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded bg-rose-500" />
          <span>Blocked</span>
        </div>
      </div>
    </div>
  );
}