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
    <div className="w-full space-y-2">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Rekap Team
        </div>
        <h1 className="mt-2 text-2xl font-bold">Team Leader</h1>
        <p className="mt-2 text-slate-600">
          Rekap performa per team berdasarkan leader dan anggota CRM.
        </p>
      </div>

      <div className="flex justify-start">
        <button
          onClick={() =>
            setLeaderForm((prev) => ({
              ...prev,
              isOpen: true,
            }))
          }
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
        >
          Tambah / Atur Team Leader
        </button>
      </div>

      {leaderForm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Tambah / Atur Team Leader
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Isi nama leader, lalu pilih anggota CRM yang ingin dimasukkan ke
                  team.
                </p>
              </div>

              <button
                onClick={() =>
                  setLeaderForm((prev) => ({
                    ...prev,
                    isOpen: false,
                  }))
                }
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
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
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Cari Nama CRM
                </label>
                <input
                  value={leaderForm.searchTerm}
                  onChange={(e) =>
                    setLeaderForm((prev) => ({
                      ...prev,
                      searchTerm: e.target.value,
                    }))
                  }
                  placeholder="Cari nama CRM / web / leader"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <div className="mb-2 text-sm font-medium text-slate-700">
                  Pilih Anggota CRM
                </div>

                <div className="max-h-[300px] space-y-1 overflow-auto rounded-2xl border border-slate-200 p-3">
                  {filteredCrmOptions.map((crm) => {
                    const checked = leaderForm.selectedCrmIds.includes(crm.id);

                    return (
                      <label
                        key={crm.id}
                        className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCrm(crm.id)}
                          className="mt-1"
                        />

                        <div className="min-w-0">
                          <div className="font-medium text-slate-900">
                            {crm.name} ({crm.web})
                          </div>
                          <div className="text-xs text-slate-500">
                            Leader saat ini: {crm.leader || "-"}
                          </div>
                        </div>
                      </label>
                    );
                  })}

                  {filteredCrmOptions.length === 0 && (
                    <div className="text-sm text-slate-500">
                      Tidak ada CRM yang cocok dengan pencarian.
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
                  className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  Batal
                </button>

                <button
                  onClick={() => {
                    void onSaveLeader();
                  }}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
                >
                  Simpan Team Leader
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {teams.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Belum ada data team leader.
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        {teams.map((team) => (
          <div
            key={team.leader}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="grid grid-cols-3 border-b border-slate-200">
              <div className="col-span-1 border-r border-slate-200 bg-white p-4 text-center">
                <div className="text-lg font-semibold text-slate-900">
                  {new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
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
                  <div className="font-semibold text-slate-900">
                    {team.topFdpName || "-"}
                  </div>
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
                  <div className="font-semibold text-slate-900">
                    {team.topValueName || "-"}
                  </div>
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

                      {index === 0 && (
                        <td
                          rowSpan={team.members.length}
                          className="bg-amber-300 p-3 text-center align-middle text-base font-extrabold text-black"
                        >
                          {member.leader}
                        </td>
                      )}

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