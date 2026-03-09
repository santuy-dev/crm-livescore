import { formatCurrency } from "../utils";

type TeamLeaderMember = {
  id: string;
  name: string;
  web: string;
  leader: string;
  fdp: number;
  value: number;
  fdpStatus: string;
  valueStatus: string;
};

type TeamLeaderGroup = {
  leader: string;
  members: TeamLeaderMember[];
  totalFdp: number;
  totalValue: number;
  topFdpName: string;
  topFdpValue: number;
  topValueName: string;
  topValueAmount: number;
};

type Props = {
  teams: TeamLeaderGroup[];
};

function statusClass(status: string) {
  if (status === "EXCELLENT" || status === "GOALS") {
    return "bg-emerald-600 text-white";
  }

  if (status === "BETTER" || status === "MENUJU TARGET") {
    return "bg-amber-500 text-black";
  }

  return "bg-black text-red-500";
}

export default function TeamLeaderView({ teams }: Props) {
  return (
    <div className="w-full space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Rekap Team
        </div>
        <h1 className="mt-2 text-3xl font-bold">Team Leader</h1>
        <p className="mt-2 text-slate-600">
          Rekap performa per team berdasarkan leader dan anggota CRM.
        </p>
      </div>

      {teams.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Belum ada data team leader.
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {teams.map((team) => (
          <div
            key={team.leader}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="grid grid-cols-3 border-b border-slate-200">
              <div className="col-span-1 border-r border-slate-200 bg-white p-6 text-center">
                <div className="text-lg font-semibold text-slate-900">
                  {team.members.length > 0
                    ? new Date().toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </div>
                <div className="mt-4 text-3xl font-bold text-slate-900">
                  {team.members.length}
                </div>
              </div>

              <div className="col-span-1 border-r border-slate-200">
                <div className="bg-lime-500 px-4 py-2 text-center text-sm font-bold text-black">
                  FDP TERBANYAK
                </div>
                <div className="p-4 text-center">
                  <div className="font-semibold text-slate-900">{team.topFdpName || "-"}</div>
                  <div className="mt-3 text-2xl font-bold text-slate-900">
                    {team.topFdpValue}
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <div className="bg-lime-500 px-4 py-2 text-center text-sm font-bold text-black">
                  VALUE TERBANYAK
                </div>
                <div className="p-4 text-center">
                  <div className="font-semibold text-slate-900">{team.topValueName || "-"}</div>
                  <div className="mt-3 text-2xl font-bold text-slate-900">
                    {formatCurrency(team.topValueAmount)}
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                    <th className="p-3">Nama CRM</th>
                    <th className="p-3">Leader</th>
                    <th className="p-3">FDP</th>
                    <th className="p-3">Value</th>
                    <th className="p-3">Nilai FDP</th>
                    <th className="p-3">Nilai Value</th>
                  </tr>
                </thead>
                <tbody>
                  {team.members.map((member, index) => (
                    <tr
                      key={member.id}
                      className={`border-b border-slate-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      <td className="p-3 font-medium text-slate-900">
                        {member.name} ({member.web})
                      </td>
                      <td className="bg-amber-300 p-3 text-center font-bold text-black">
                        {member.leader}
                      </td>
                      <td className="p-3">{member.fdp}</td>
                      <td className="p-3">{formatCurrency(member.value)}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block rounded px-2 py-1 text-xs font-bold ${statusClass(
                            member.fdpStatus
                          )}`}
                        >
                          {member.fdpStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block rounded px-2 py-1 text-xs font-bold ${statusClass(
                            member.valueStatus
                          )}`}
                        >
                          {member.valueStatus}
                        </span>
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-lime-500 font-bold text-black">
                    <td className="p-3" colSpan={3}>
                      TOTAL OMSET TEAM
                    </td>
                    <td className="p-3">{formatCurrency(team.totalValue)}</td>
                    <td className="p-3" colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}