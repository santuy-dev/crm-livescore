import type { User } from "../data";

type NewUserForm = {
  username: string;
  name: string;
  password: string;
  role: "SUPERADMIN" | "ADMIN" | "VIEWER";
};

type Props = {
  users: User[];
  newUserForm: NewUserForm;
  setNewUserForm: React.Dispatch<React.SetStateAction<NewUserForm>>;
  onToggleUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onAddUser: () => void;
};

export default function UsersView({
  users,
  newUserForm,
  setNewUserForm,
  onToggleUser,
  onDeleteUser,
  onAddUser,
}: Props) {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Access Control
        </div>
        <h1 className="mt-2 text-3xl font-bold">User Management</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="p-3">Username</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Password</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 last:border-0">
                    <td className="p-3 font-semibold">{user.username}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.password}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">{user.active ? "ACTIVE" : "INACTIVE"}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onToggleUser(user.id)}
                          className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
                        >
                          {user.active ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                        <button
                          onClick={() => onDeleteUser(user.id)}
                          className="rounded-xl border border-rose-300 px-3 py-2 text-xs text-rose-700"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      Tidak ada akun user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Tambah User</h2>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                value={newUserForm.username}
                onChange={(e) =>
                  setNewUserForm((prev) => ({ ...prev, username: e.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nama
              </label>
              <input
                value={newUserForm.name}
                onChange={(e) =>
                  setNewUserForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                value={newUserForm.password}
                onChange={(e) =>
                  setNewUserForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Role
              </label>
              <select
                value={newUserForm.role}
                onChange={(e) =>
                  setNewUserForm((prev) => ({
                    ...prev,
                    role: e.target.value as "SUPERADMIN" | "ADMIN" | "VIEWER",
                  }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              >
                <option value="SUPERADMIN">SUPERADMIN</option>
                <option value="ADMIN">ADMIN</option>
                <option value="VIEWER">VIEWER</option>
              </select>
            </div>

            <button
              onClick={onAddUser}
              className="w-full rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white"
            >
              Simpan User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}