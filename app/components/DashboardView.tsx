import { formatCurrency, pct, getStatusClasses } from "../utils";
import type { RowComputed } from "../data";

type Props = {
  rows: RowComputed[];
  totalOmset: number;
  totalFdp: number;
  topFdp?: RowComputed;
  topValue?: RowComputed;
  selectedPeriodLabel: string;
};

function StatCard({
  title,
  value,
  subtext,
}: {
  title: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-xl font-bold text-slate-900">{value}</div>
      <div className="mt-2 text-sm text-slate-500">{subtext}</div>
    </div>
  );
}

function PodiumCard({
  title,
  row,
  rank,
}: {
  title: string;
  row?: RowComputed;
  rank: number;
}) {
  if (!row) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm text-slate-500">{title}</div>
        <div className="mt-4 text-lg font-semibold text-slate-900">-</div>
        <div className="mt-2 text-sm text-slate-500">Belum ada data</div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">{title}</div>
        <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
          #{rank}
        </div>
      </div>

      <div className="mt-4 text-xl font-bold text-slate-900">{row.name}</div>
      <div className="mt-1 text-sm text-slate-500">
        {row.group} • {row.web} • {row.type}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-3">
          <div className="text-xs text-slate-500">FDP</div>
          <div className="mt-1 font-semibold text-slate-900">{row.totalFdp}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <div className="text-xs text-slate-500">Score</div>
          <div className="mt-1 font-semibold text-slate-900">{pct(row.score)}</div>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-slate-50 p-3">
        <div className="text-xs text-slate-500">Value</div>
        <div className="mt-1 font-semibold text-slate-900">
          {formatCurrency(row.totalValue)}
        </div>
      </div>

      <div className="mt-4">
        <span
          className={`rounded-xl border px-3 py-1 text-xs font-medium ${getStatusClasses(
            row.status
          )}`}
        >
          {row.status}
        </span>
      </div>
    </div>
  );
}

function ProgressBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const safe = Math.max(0, Math.min(value, 1.5));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>{pct(value)}</span>
      </div>
      <div className="h-3 w-full rounded-full bg-slate-100">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${
            value >= 1
              ? "bg-emerald-500"
              : value >= 0.7
              ? "bg-amber-500"
              : "bg-slate-900"
          }`}
          style={{ width: `${safe * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardView({
  rows,
  totalOmset,
  totalFdp,
  topFdp,
  topValue,
  selectedPeriodLabel,
}: Props) {
  const topThree = rows.slice(0, 3);
  const topFive = rows.slice(0, 5);

  return (
    <div className="w-full space-y-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Livescore Report
        </div>
        <h1 className="mt-2 text-2xl font-bold">
          CRM Livescore — {selectedPeriodLabel}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Ringkasan performa CRM, target, ranking, dan progress bulan berjalan.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Omset"
          value={formatCurrency(totalOmset)}
          subtext="Akumulasi value semua CRM"
        />
        <StatCard
          title="Total FDP"
          value={String(totalFdp)}
          subtext="Total FDP bulan berjalan"
        />
        <StatCard
          title="Top FDP"
          value={topFdp?.name ?? "-"}
          subtext={`${topFdp?.totalFdp ?? 0} FDP`}
        />
        <StatCard
          title="Top Value"
          value={topValue?.name ?? "-"}
          subtext={formatCurrency(topValue?.totalValue ?? 0)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <PodiumCard title="Top 1 Performer" row={topThree[0]} rank={1} />
        <PodiumCard title="Top 2 Performer" row={topThree[1]} rank={2} />
        <PodiumCard title="Top 3 Performer" row={topThree[2]} rank={3} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Leaderboard CRM</h2>
              <p className="mt-1 text-sm text-slate-500">
                Ranking berdasarkan score gabungan target FDP dan value.
              </p>
            </div>
            <div className="text-sm text-slate-500">{rows.length} CRM aktif</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="p-3 py-2.5">Rank</th>
                  <th className="p-3 py-2.5">CRM</th>
                  <th className="p-3 py-2.5">Type</th>
                  <th className="p-3 py-2.5">Group</th>
                  <th className="p-3 py-2.5">Web</th>
                  <th className="p-3 py-2.5">FDP</th>
                  <th className="p-3 py-2.5">Value</th>
                  <th className="p-3 py-2.5">Target FDP</th>
                  <th className="p-3 py-2.5">Target Value</th>
                  <th className="p-3 py-2.5">Progress FDP</th>
                  <th className="p-3 py-2.5">Progress Value</th>
                  <th className="p-3 py-2.5">Score</th>
                  <th className="p-3 py-2.5">Status</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="p-3 font-semibold">{index + 1}</td>
                    <td className="p-3 font-semibold">{row.name}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          row.type === "TRAINING"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="p-3">{row.group}</td>
                    <td className="p-3">{row.web}</td>
                    <td className="p-3">{row.totalFdp}</td>
                    <td className="p-3">{formatCurrency(row.totalValue)}</td>
                    <td className="p-3">{row.targetFdp}</td>
                    <td className="p-3">{formatCurrency(row.targetValue)}</td>
                    <td className="p-3">{pct(row.pFdp)}</td>
                    <td className="p-3">{pct(row.pValue)}</td>
                    <td className="p-3 font-semibold">{pct(row.score)}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-xl border px-3 py-1 text-xs font-medium ${getStatusClasses(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={13} className="p-6 text-center text-slate-500">
                      Belum ada data CRM.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Top Performer Panel</h2>
              <p className="mt-1 text-sm text-slate-500">
                5 CRM terbaik berdasarkan score performa.
              </p>
            </div>

            <div className="space-y-4">
              {topFive.map((row, index) => (
                <div
                  key={row.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        #{index + 1} — {row.name}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {row.group} • {row.web} • {row.type}
                      </div>
                    </div>
                    <span
                      className={`rounded-xl border px-3 py-1 text-xs font-medium ${getStatusClasses(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <ProgressBar label="Progress FDP" value={row.pFdp} />
                    <ProgressBar label="Progress Value" value={row.pValue} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">FDP</div>
                      <div className="mt-1 font-semibold text-slate-900">
                        {row.totalFdp}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Value</div>
                      <div className="mt-1 font-semibold text-slate-900">
                        {formatCurrency(row.totalValue)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {topFive.length === 0 && (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                  Belum ada data performer.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Quick Insight</h2>
              <p className="mt-1 text-sm text-slate-500">
                Snapshot cepat kondisi livescore saat ini.
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-slate-500">CRM tertinggi berdasarkan value</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {topValue?.name ?? "-"}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-slate-500">CRM tertinggi berdasarkan FDP</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {topFdp?.name ?? "-"}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-slate-500">Jumlah CRM aktif</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {rows.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}