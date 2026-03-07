"use client";

type PageKey =
  | "dashboard"
  | "web"
  | "group"
  | "bonus"
  | "input"
  | "crm"
  | "users";

type Role = "SUPERADMIN" | "ADMIN" | "VIEWER";

type Props = {
  current: PageKey;
  setPage: (page: PageKey) => void;
  role: Role;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function Sidebar({
  current,
  setPage,
  role,
  sidebarOpen,
  setSidebarOpen,
}: Props) {
  const menus: { key: PageKey; label: string; roles: Role[] }[] = [
    { key: "dashboard", label: "Dashboard", roles: ["SUPERADMIN", "ADMIN", "VIEWER"] },
    { key: "web", label: "Omset per Web", roles: ["SUPERADMIN", "ADMIN", "VIEWER"] },
    { key: "group", label: "Omset per Group", roles: ["SUPERADMIN", "ADMIN", "VIEWER"] },
    { key: "bonus", label: "Bonus CRM", roles: ["SUPERADMIN", "ADMIN"] },
    { key: "input", label: "Input Harian", roles: ["SUPERADMIN", "ADMIN"] },
    { key: "crm", label: "CRM Management", roles: ["SUPERADMIN"] },
    { key: "users", label: "User Management", roles: ["SUPERADMIN"] },
  ];

  const visibleMenus = menus.filter((m) => m.roles.includes(role));

  if (!sidebarOpen) return null;

  return (
    <aside className="sticky top-0 h-screen w-72 border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Internal App
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              CRM Livescore
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Dashboard operasional CRM, omset, target, bonus, dan input harian.
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            title="Archive menu"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Menu
        </div>

        <div className="space-y-2">
          {visibleMenus.map((menu) => {
            const active = current === menu.key;

            return (
              <button
                key={menu.key}
                onClick={() => setPage(menu.key)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {menu.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-slate-50 p-5">
        <div className="text-sm font-semibold text-slate-800">
          crmleaderboard.site
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Prototype website dari workflow Google Sheet
        </div>
      </div>
    </aside>
  );
}