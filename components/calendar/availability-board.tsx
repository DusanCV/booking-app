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
      return "bg-green-500 text-white";
    case "pending":
      return "bg-yellow-300 text-gray-900";
    case "blocked":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-100 text-gray-500";
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
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="sticky left-0 bg-gray-50 px-4 py-4 text-left font-semibold text-gray-900">
              Jedinica
            </th>
            {dates.map((date) => (
              <th
                key={date}
                className="px-3 py-4 text-center text-xs font-semibold text-gray-700"
              >
                {format(new Date(date), "dd.MM")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.unit.id} className="border-b border-gray-100">
              <td className="sticky left-0 bg-white px-4 py-4 font-medium text-gray-900">
                {row.unit.name}
              </td>

              {row.cells.map((cell) => (
                <td key={`${row.unit.id}-${cell.date}`} className="px-2 py-3">
                  <div
                    title={`${cell.date} - ${getCellLabel(cell.status)}`}
                    className={`rounded-lg px-2 py-3 text-center text-xs font-medium ${getCellClasses(
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

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded bg-gray-100" />
          <span>Slobodno</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded bg-yellow-300" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded bg-green-500" />
          <span>Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded bg-red-500" />
          <span>Blocked</span>
        </div>
      </div>
    </div>
  );
}