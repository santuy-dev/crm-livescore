import type { InputFormState, InputRow, RowComputed } from "../data";
import { formatCurrency } from "../utils";

type Props = {
  rows: RowComputed[];
  inputForm: InputFormState;
  setInputForm: React.Dispatch<React.SetStateAction<InputFormState>>;
  selectedCrm?: RowComputed;
  selectedCrmInputs: InputRow[];
  onSave: () => void;
  onEdit: (row: InputRow) => void;
  onDelete: (id: string) => void;
};

export default function InputView({
  rows,
  inputForm,
  setInputForm,
  selectedCrm,
  selectedCrmInputs,
  onSave,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Operasional Harian
        </div>
        <h1 className="mt-2 text-3xl font-bold">Input Harian</h1>
        <p className="mt-2 text-slate-600">
          Setelah simpan, halaman tetap di sini supaya lanjut input lebih cepat.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[430px_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Form Input</h2>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tanggal
              </label>
              <input
                type="date"
                value={inputForm.date}
                onChange={(e) =>
                  setInputForm((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                CRM
              </label>
              <select
                value={inputForm.crmId}
                onChange={(e) =>
                  setInputForm((prev) => ({
                    ...prev,
                    crmId: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              >
                {rows.map((crm) => (
                  <option key={crm.id} value={crm.id}>
                    {crm.name} - {crm.web}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                FDP
              </label>
              <input
                type="number"
                min={0}
                value={inputForm.fdp}
                onChange={(e) =>
                  setInputForm((prev) => ({
                    ...prev,
                    fdp: e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Value
              </label>
              <input
                type="number"
                min={0}
                value={inputForm.value}
                onChange={(e) =>
                  setInputForm((prev) => ({
                    ...prev,
                    value: e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              />
            </div>

            <button
  onClick={() => {
    alert("tombol save diklik");
    onSave();
  }}
  className="rounded-2xl bg-slate-900 px-4 py-3 text-white"
>
  Simpan Input TEST
</button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Ringkasan CRM Terpilih</h2>

            {selectedCrm ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-sm text-slate-500">CRM</div>
                  <div className="mt-2 font-semibold text-slate-900">
                    {selectedCrm.name}
                  </div>
                  <div className="text-sm text-slate-500">{selectedCrm.web}</div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-sm text-slate-500">Type</div>
                  <div className="mt-2 font-semibold text-slate-900">
                    {selectedCrm.type}
                  </div>
                  <div className="text-sm text-slate-500">{selectedCrm.group}</div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-sm text-slate-500">Total FDP</div>
                  <div className="mt-2 font-semibold text-slate-900">
                    {selectedCrm.totalFdp}
                  </div>
                  <div className="text-sm text-slate-500">
                    Target {selectedCrm.targetFdp}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-sm text-slate-500">Total Value</div>
                  <div className="mt-2 font-semibold text-slate-900">
                    {formatCurrency(selectedCrm.totalValue)}
                  </div>
                  <div className="text-sm text-slate-500">
                    Target {formatCurrency(selectedCrm.targetValue)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-sm text-slate-500">
                Pilih CRM untuk melihat ringkasan.
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Riwayat Input</h2>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[850px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">CRM</th>
                    <th className="p-3">FDP</th>
                    <th className="p-3">Value</th>
                    <th className="p-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCrmInputs.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 last:border-0">
                      <td className="p-3">{row.date}</td>
                      <td className="p-3 font-semibold">{selectedCrm?.name}</td>
                      <td className="p-3">{row.fdp}</td>
                      <td className="p-3">{formatCurrency(row.value)}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEdit(row)}
                            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(row.id)}
                            className="rounded-xl border border-rose-300 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {selectedCrmInputs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">
                        Belum ada input untuk CRM ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}