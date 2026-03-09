import { formatCurrency } from "../utils";

type WebMemberRow = {
  id: string;
  name: string;
  group: string;
  web: string;
  totalFdp: number;
  totalValue: number;
  type: "TRAINING" | "REGULAR";
};

type WebSummaryRow = {
  web: string;
  group: string;
  crmCount: number;
  totalFdp: number;
  totalValue: number;
};

type Props = {
  webRows: WebSummaryRow[];
  webMembersMap: Record<string, WebMemberRow[]>;
  openWebs: string[];
  setOpenWebs: React.Dispatch<React.SetStateAction<string[]>>;
  onExport: () => void;
};

export default function WebView({
  webRows,
  webMembersMap,
  openWebs,
  setOpenWebs,
  onExport,
}: Props) {
  function toggleWeb(web: string) {
    setOpenWebs((prev) =>
      prev.includes(web) ? prev.filter((item) => item !== web) : [...prev, web]
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Rekap Omset
          </div>
          <h1 className="mt-2 text-2xl font-bold">Omset per Web</h1>
          <p className="mt-2 text-slate-600">
            Klik baris web untuk melihat nama CRM dan total performanya.
          </p>
        </div>

        <button
          onClick={onExport}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700"
        >
          Export CSV
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="p-3 w-[70px]"></th>
                <th className="p-3">Rank</th>
                <th className="p-3">Web</th>
                <th className="p-3">Group</th>
                <th className="p-3">Jumlah CRM</th>
                <th className="p-3">Total FDP</th>
                <th className="p-3">Total Value</th>
              </tr>
            </thead>

            <tbody>
              {webRows.map((row, index) => {
                const isOpen = openWebs.includes(row.web);
                const members = webMembersMap[row.web] ?? [];

                return (
                  <>
                    <tr
                      key={`summary-${row.web}`}
                      className="cursor-pointer border-b border-slate-100 bg-white hover:bg-slate-50"
                      onClick={() => toggleWeb(row.web)}
                    >
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWeb(row.web);
                          }}
                          className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                        >
                          {isOpen ? "−" : "+"}
                        </button>
                      </td>
                      <td className="p-3 font-semibold">{index + 1}</td>
                      <td className="p-3 font-semibold">{row.web}</td>
                      <td className="p-3">{row.group}</td>
                      <td className="p-3">{row.crmCount}</td>
                      <td className="p-3">{row.totalFdp}</td>
                      <td className="p-3">{formatCurrency(row.totalValue)}</td>
                    </tr>

                    {isOpen && (
                      <tr key={`detail-${row.web}`} className="border-b border-slate-200 bg-slate-50/70">
                        <td colSpan={7} className="p-4">
                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="mb-4 text-sm font-semibold text-slate-700">
                              Detail CRM di web {row.web}
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full min-w-[850px] text-sm">
                                <thead>
                                  <tr className="border-b border-slate-200 text-left text-slate-500">
                                    <th className="p-3">Nama CRM</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Group</th>
                                    <th className="p-3">Web</th>
                                    <th className="p-3">Total FDP</th>
                                    <th className="p-3">Total Value</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {members.map((member) => (
                                    <tr
                                      key={member.id}
                                      className="border-b border-slate-100 last:border-0"
                                    >
                                      <td className="p-3 font-medium text-slate-900">
                                        {member.name}
                                      </td>
                                      <td className="p-3">{member.type}</td>
                                      <td className="p-3">{member.group}</td>
                                      <td className="p-3">{member.web}</td>
                                      <td className="p-3">{member.totalFdp}</td>
                                      <td className="p-3">
                                        {formatCurrency(member.totalValue)}
                                      </td>
                                    </tr>
                                  ))}

                                  {members.length === 0 && (
                                    <tr>
                                      <td
                                        colSpan={6}
                                        className="p-6 text-center text-slate-500"
                                      >
                                        Belum ada CRM di web ini.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}

              {webRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500">
                    Belum ada data web.
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