import { formatCurrency } from "../utils";

type Props = {
  groupRows: Array<{
    group: string;
    crmCount: number;
    totalFdp: number;
    totalValue: number;
  }>;
  onExport: () => void;
};

export default function GroupView({ groupRows, onExport }: Props) {
  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Rekap Omset
          </div>
          <h1 className="mt-2 text-2xl font-bold">Omset per Group</h1>
        </div>

        <button
          onClick={onExport}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700"
        >
          Export CSV
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="p-3">Rank</th>
                <th className="p-3">Group</th>
                <th className="p-3">Jumlah CRM</th>
                <th className="p-3">Total FDP</th>
                <th className="p-3">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {groupRows.map((row, index) => (
                <tr key={row.group} className="border-b border-slate-100 last:border-0">
                  <td className="p-3 font-semibold">{index + 1}</td>
                  <td className="p-3 font-semibold">{row.group}</td>
                  <td className="p-3">{row.crmCount}</td>
                  <td className="p-3">{row.totalFdp}</td>
                  <td className="p-3">{formatCurrency(row.totalValue)}</td>
                </tr>
              ))}

              {groupRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">
                    Belum ada data group.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}