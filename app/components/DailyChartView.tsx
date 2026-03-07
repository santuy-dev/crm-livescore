type DayRow = {
  date: string;
  fdp: number;
  value: number;
};

type Props = {
  data: DayRow[];
};

function formatShortDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
}

function formatCurrencyCompact(value: number) {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(1)}K`;
  }

  return `Rp ${value}`;
}

export default function DailyChartView({ data }: Props) {
  const safeData = Array.isArray(data) ? data : [];

  const maxValue = Math.max(...safeData.map((d) => d.value), 1);
  const maxFdp = Math.max(...safeData.map((d) => d.fdp), 1);

  const totalValue = safeData.reduce((sum, item) => sum + item.value, 0);
  const totalFdp = safeData.reduce((sum, item) => sum + item.fdp, 0);

  const bestValueDay = [...safeData].sort((a, b) => b.value - a.value)[0];
  const bestFdpDay = [...safeData].sort((a, b) => b.fdp - a.fdp)[0];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Trend Harian
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Livescore Harian
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Ringkasan pergerakan FDP dan value harian dalam periode aktif.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <div className="text-xs text-slate-500">Total Value</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {formatCurrencyCompact(totalValue)}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <div className="text-xs text-slate-500">Total FDP</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {totalFdp} FDP
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <div className="text-xs text-slate-500">Best Value Day</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {bestValueDay ? formatShortDate(bestValueDay.date) : "-"}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <div className="text-xs text-slate-500">Best FDP Day</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {bestFdpDay ? formatShortDate(bestFdpDay.date) : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Chart Value Harian
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Perbandingan omset harian berdasarkan tanggal.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {safeData.map((row) => (
              <div key={`value-${row.date}`}>
                <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{formatShortDate(row.date)}</span>
                  <span>{formatCurrencyCompact(row.value)}</span>
                </div>

                <div className="h-4 w-full rounded-full bg-slate-100">
                  <div
                    className="h-4 rounded-full bg-slate-900 transition-all duration-500"
                    style={{
                      width: `${(row.value / maxValue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}

            {safeData.length === 0 && (
              <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                Belum ada data value harian.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Chart FDP Harian
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Perbandingan jumlah FDP harian berdasarkan tanggal.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {safeData.map((row) => (
              <div key={`fdp-${row.date}`}>
                <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{formatShortDate(row.date)}</span>
                  <span>{row.fdp} FDP</span>
                </div>

                <div className="h-4 w-full rounded-full bg-slate-100">
                  <div
                    className="h-4 rounded-full bg-sky-500 transition-all duration-500"
                    style={{
                      width: `${(row.fdp / maxFdp) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}

            {safeData.length === 0 && (
              <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                Belum ada data FDP harian.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}