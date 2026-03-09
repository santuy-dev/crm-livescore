import { formatCurrency } from "../utils";
import type { Crm } from "../data";

type NewCrmForm = {
  name: string;
  group: string;
  web: string;
  type: "TRAINING" | "REGULAR";
  targetFdp: number | "";
  targetValue: number | "";
};

type Props = {
  crms: Crm[];
  newCrmForm: NewCrmForm;
  setNewCrmForm: React.Dispatch<React.SetStateAction<NewCrmForm>>;
  onToggleType: (crmId: string) => void;
  onToggleActive: (crmId: string) => void;
  onAddCrm: () => void;
};

export default function CrmView({
  crms,
  newCrmForm,
  setNewCrmForm,
  onToggleType,
  onToggleActive,
  onAddCrm,
}: Props) {
  return (
    <div className="w-full space-y-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Master Data
        </div>
        <h1 className="mt-2 text-2xl font-bold">CRM Management</h1>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-6">
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2.5">Nama CRM</th>
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5">Group</th>
                  <th className="px-3 py-2.5">Web</th>
                  <th className="px-3 py-2.5">Target FDP</th>
                  <th className="px-3 py-2.5">Target Value</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {crms.map((crm) => (
                  <tr key={crm.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-3 py-2.5 font-semibold">{crm.name}</td>
                    <td className="px-3 py-2.5">{crm.type}</td>
                    <td className="px-3 py-2.5">{crm.group}</td>
                    <td className="px-3 py-2.5">{crm.web}</td>
                    <td className="px-3 py-2.5">{crm.targetFdp}</td>
                    <td className="px-3 py-2.5">{formatCurrency(crm.targetValue)}</td>
                    <td className="px-3 py-2.5">{crm.active ? "ACTIVE" : "ARCHIVED"}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onToggleType(crm.id)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                        >
                          Ubah Type
                        </button>
                        <button
                          onClick={() => onToggleActive(crm.id)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                        >
                          {crm.active ? "Archive" : "Aktifkan"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {crms.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-500">
                      Tidak ada data CRM.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Tambah CRM</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Nama CRM</label>
              <input
                value={newCrmForm.name}
                onChange={(e) =>
                  setNewCrmForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Group</label>
              <input
                value={newCrmForm.group}
                onChange={(e) =>
                  setNewCrmForm((prev) => ({ ...prev, group: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Web</label>
              <input
                value={newCrmForm.web}
                onChange={(e) =>
                  setNewCrmForm((prev) => ({ ...prev, web: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Type</label>
              <select
                value={newCrmForm.type}
                onChange={(e) => {
                  const nextType = e.target.value as "TRAINING" | "REGULAR";
                  setNewCrmForm((prev) => ({
                    ...prev,
                    type: nextType,
                    targetValue: nextType === "TRAINING" ? 250_000_000 : 500_000_000,
                  }));
                }}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
              >
                <option value="TRAINING">TRAINING</option>
                <option value="REGULAR">REGULAR</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Target FDP</label>
              <input
                type="number"
                min={0}
                value={newCrmForm.targetFdp}
                onChange={(e) =>
                  setNewCrmForm((prev) => ({
                    ...prev,
                    targetFdp: e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Target Value</label>
              <input
                type="number"
                min={0}
                value={newCrmForm.targetValue}
                onChange={(e) =>
                  setNewCrmForm((prev) => ({
                    ...prev,
                    targetValue: e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
              />
            </div>

            <button
              onClick={onAddCrm}
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 font-medium text-white"
            >
              Simpan CRM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}