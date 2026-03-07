import { formatCurrency } from "../utils";

type BonusRow = {
  id: string;
  name: string;
  type: "TRAINING" | "REGULAR";
  group: string;
  web: string;
  totalValue: number;
  bonusTierLabel: string;
  bonusAmount: number;
};

type Props = {
  bonusRows: BonusRow[];
  totalBonus: number;
  onExport: () => void;
};

function Card({
  title,
  value,
  subtext,
}: {
  title: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
      <div className="mt-2 text-sm text-slate-500">{subtext}</div>
    </div>
  );
}

export default function BonusView({ bonusRows, totalBonus, onExport }: Props) {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Bonus Bulanan
          </div>
          <h1 className="mt-2 text-3xl font-bold">Bonus CRM</h1>
        </div>

        <button
          onClick={onExport}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700"
        >
          Export CSV
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card
          title="Total Penerima Bonus"
          value={String(bonusRows.length)}
          subtext="Hanya CRM yang lolos minimum"
        />
        <Card
          title="Total Bonus"
          value={formatCurrency(totalBonus)}
          subtext="Akumulasi bonus bulan berjalan"
        />
        <Card
          title="Top Bonus"
          value={bonusRows[0]?.name ?? "-"}
          subtext={formatCurrency(bonusRows[0]?.bonusAmount ?? 0)}
        />
        <Card
          title="Rule Aktif"
          value="Training + Regular"
          subtext="Tier bonus berbeda sesuai type CRM"
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="p-3">CRM</th>
                <th className="p-3">Type</th>
                <th className="p-3">Group</th>
                <th className="p-3">Web</th>
                <th className="p-3">Value</th>
                <th className="p-3">Tier</th>
                <th className="p-3">Bonus</th>
              </tr>
            </thead>
            <tbody>
              {bonusRows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0">
                  <td className="p-3 font-semibold">{row.name}</td>
                  <td className="p-3">{row.type}</td>
                  <td className="p-3">{row.group}</td>
                  <td className="p-3">{row.web}</td>
                  <td className="p-3">{formatCurrency(row.totalValue)}</td>
                  <td className="p-3">{row.bonusTierLabel}</td>
                  <td className="p-3 font-semibold text-emerald-700">
                    {formatCurrency(row.bonusAmount)}
                  </td>
                </tr>
              ))}

              {bonusRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500">
                    Belum ada CRM yang lolos minimum bonus.
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