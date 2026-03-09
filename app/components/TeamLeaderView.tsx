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

type CrmOption = {
  id: string;
  name: string;
  web: string;
  leader: string;
};

type LeaderFormState = {
  leaderName: string;
  selectedCrmIds: string[];
  searchTerm: string;
  isOpen: boolean;
};

type Props = {
  teams: TeamLeaderGroup[];
  crmOptions: CrmOption[];
  leaderForm: LeaderFormState;
  setLeaderForm: React.Dispatch<React.SetStateAction<LeaderFormState>>;
  onSaveLeader: () => void | Promise<void>;
};

function statusClass(status: string) {
  if (status === "EXCELLENT" || status === "GOALS") {
    return "bg-emerald-600 text-white";
  }

  if (status === "BETTER" || status === "MENUJU TARGET") {
    return "bg-amber-400 text-black";
  }

  return "bg-black text-red-500";
}

export default function TeamLeaderView({
  teams,
  crmOptions,
  leaderForm,
  setLeaderForm,
  onSaveLeader,
}: Props) {
  function toggleCrm(crmId: string) {
    setLeaderForm((prev) => {
      const exists = prev.selectedCrmIds.includes(crmId);

      return {
        ...prev,
        selectedCrmIds: exists
          ? prev.selectedCrmIds.filter((id) => id !== crmId)
          : [...prev.selectedCrmIds, crmId],
      };
    });
  }

  const filteredCrmOptions = crmOptions.filter((crm) => {
    const keyword = leaderForm.searchTerm.trim().toLowerCase();

    if (!keyword) return true;

    return (
      crm.name.toLowerCase().includes(keyword) ||
      crm.web.toLowerCase().includes(keyword) ||
      (crm.leader || "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="w-full space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Rekap Team
          </div>
          <h1 className="mt-1 text-2xl font-bold">Team Leader</h1>
          <p className="mt-1 text-sm text-slate-600">
            Tampilan padat per team, tanpa scroll halaman.
          </p>
        </div>

        <button
          onClick={() =>
            setLeaderForm((prev) => ({
              ...prev,
              isOpen: true,
            }))
          }
          className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white"
        >
          Tambah / Atur Team
        </button>
      </div>

      {leaderForm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Tambah / Atur Team Leader
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Isi nama leader lalu pilih anggota CRM.
                </p>
              </div>

              <button
                onClick={() =>
                  setLeaderForm((prev) => ({
                    ...prev,
                    isOpen: false,
                  }))
                }
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nama Leader
                </label>
                <input
                  value={leaderForm.leaderName}
                  onChange={(e) =>
                    setLeaderForm((prev) => ({
                      ...prev,
                      leaderName: e.target.value,
                    }))
                  }
                  placeholder="Contoh: KARIN"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Cari CRM
                </label>
                <input
                  value={leaderForm.searchTerm}
                  onChange={(e) =>
                    setLeaderForm((prev) => ({
                      ...prev,
                      searchTerm: e.target.value,
                    }))
                  }
                  placeholder="Cari nama / web / leader"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <div className="mb-1 text-sm font-medium text-slate-700">
                  Pilih Anggota CRM
                </div>

                <div className="max-h-[320px] space-y-2 overflow-auto rounded-xl border border-slate-200 p-3">
                  {filteredCrmOptions.map((crm) => {
                    const checked = leaderForm.selectedCrmIds.includes(crm.id);

                    return (
                      <label
                        key={crm.id}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-2.5 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCrm(crm.id)}
                          className="mt-1"
                        />

                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-900">
                            {crm.name} ({crm.web})
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Leader saat ini: {crm.leader || "-"}
                          </div>
                        </div>
                      </label>
                    );
                  })}

                  {filteredCrmOptions.length === 0 && (
                    <div className="text-sm text-slate-500">
                      Tidak ada CRM yang cocok.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    setLeaderForm((prev) => ({
                      ...prev,
                      isOpen: false,
                    }))
                  }
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700"
                >
                  Batal
                </button>

                <button
                  onClick={() => {
                    void onSaveLeader();
                  }}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
                >
                  Simpan Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {teams.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
          Belum ada data team leader.
        </div>
      )}

      <div className="grid h-[calc(100vh-180px)] grid-cols-1 gap-3 xl:grid-cols-2">
        {teams.map((team) => (
          <div
            key={team.leader}
            className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="grid shrink-0 grid-cols-3 border-b border-slate-200">
              <div className="border-r border-slate-200 p-3 text-center">
                <div className="text-xs font-semibold text-slate-700">
                  {new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">
                  {team.members.length}
                </div>
              </div>

              <div className="border-r border-slate-200">
                <div className="bg-lime-500 px-3 py-1 text-center text-[11px] font-bold text-black">
                  FDP TERBANYAK
                </div>
                <div className="p-2 text-center">
                  <div className="truncate text-sm font-semibold text-slate-900">
                    {team.topFdpName || "-"}
                  </div>
                  <div className="mt-1 text-xl font-bold text-slate-900">
                    {team.topFdpValue}
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-lime-500 px-3 py-1 text-center text-[11px] font-bold text-black">
                  VALUE TERBANYAK
                </div>
                <div className="p-2 text-center">
                  <div className="truncate text-sm font-semibold text-slate-900">
                    {team.topValueName || "-"}
                  </div>
                  <div className="mt-1 text-xl font-bold text-slate-900">
                    {formatCurrency(team.topValueAmount)}
                  </div>
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              <table className="w-full min-w-[760px] text-xs">
                <thead className="sticky top-0 z-10 bg-slate-50">
                  <tr className="border-b border-slate-200 text-left text-slate-600">
                    <th className="px-2 py-1.5">Nama CRM</th>
                    <th className="px-2 py-1.5">Leader</th>
                    <th className="px-2 py-1.5">FDP</th>
                    <th className="px-2 py-1.5">Value</th>
                    <th className="px-2 py-1.5">Nilai FDP</th>
                    <th className="px-2 py-1.5">Nilai Value</th>
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
                      <td className="px-2 py-1.5 font-medium text-slate-900">
                        {member.name} ({member.web})
                      </td>

                      {index === 0 && (
                        <td
                          rowSpan={team.members.length}
                          className="bg-amber-300 px-2 py-1.5 text-center align-middle text-xs font-extrabold text-black"
                        >
                          {member.leader}
                        </td>
                      )}

                      <td className="px-2 py-1.5">{member.fdp}</td>
                      <td className="px-2 py-1.5">{formatCurrency(member.value)}</td>
                      <td className="px-2 py-1.5">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${statusClass(
                            member.fdpStatus
                          )}`}
                        >
                          {member.fdpStatus}
                        </span>
                      </td>
                      <td className="px-2 py-1.5">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${statusClass(
                            member.valueStatus
                          )}`}
                        >
                          {member.valueStatus}
                        </span>
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-lime-500 font-bold text-black">
                    <td className="px-2 py-1.5" colSpan={3}>
                      TOTAL OMSET TEAM
                    </td>
                    <td className="px-2 py-1.5">{formatCurrency(team.totalValue)}</td>
                    <td className="px-2 py-1.5" colSpan={2}></td>
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