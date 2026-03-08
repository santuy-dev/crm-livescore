"use client";

import { useEffect, useMemo, useState } from "react";

import Sidebar from "./sidebar";

import { supabase } from "./supabase";
import DashboardView from "./components/DashboardView";
import DateRangeFilter from "./DateRangeFilter";
import DailyChartView from "./components/DailyChartView";
import InputView from "./components/InputView";
import WebView from "./components/WebView";
import GroupView from "./components/GroupView";
import BonusView from "./components/BonusView";
import CrmView from "./components/CrmView";
import UsersView from "./components/UsersView";

import {
  INITIAL_USERS,
  type Crm,
  type InputFormState,
  type InputRow,
  type Role,
  type RowComputed,
  type User,
} from "./data";

import {
  clamp01,
  exportCsv,
  getBonusPercent,
  getBonusTierLabel,
  getStatus,
  loadLocal,
  makeId,
  monthKey,
  safeNumber,
  saveLocal,
} from "./utils";

type PageKey =
  | "dashboard"
  | "web"
  | "group"
  | "bonus"
  | "input"
  | "crm"
  | "users";

type NewCrmForm = {
  name: string;
  group: string;
  web: string;
  type: "TRAINING" | "REGULAR";
  targetFdp: number | "";
  targetValue: number | "";
};

type NewUserForm = {
  username: string;
  name: string;
  password: string;
  role: Role;
};

type SessionUser = {
  username: string;
  name: string;
  role: Role;
};

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [page, setPage] = useState<PageKey>("dashboard");
  const [sessionRole, setSessionRole] = useState<Role>("SUPERADMIN");

  const [crms, setCrms] = useState<Crm[]>([]);
  const [inputs, setInputs] = useState<InputRow[]>([]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(monthKey(new Date()));

  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  const [loginForm, setLoginForm] = useState({
    username: "superadmin",
    password: "123456",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroupFilter, setSelectedGroupFilter] = useState("ALL");
  const [selectedWebFilter, setSelectedWebFilter] = useState("ALL");

  const [inputForm, setInputForm] = useState<InputFormState>({
    date: new Date().toISOString().slice(0, 10),
    crmId: "",
    fdp: "",
    value: "",
  });

  const [newCrmForm, setNewCrmForm] = useState<NewCrmForm>({
    name: "",
    group: "",
    web: "",
    type: "TRAINING",
    targetFdp: 100,
    targetValue: 250000000,
  });

  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    username: "",
    name: "",
    password: "",
    role: "VIEWER",
  });

  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  async function fetchCrms() {
    const { data, error } = await supabase.from("crms").select("*");

    if (error) {
      console.error("Error ambil CRM:", error);
      return;
    }

    const mapped: Crm[] = (data ?? []).map((item: any) => ({
      id: item.id,
      name: item.name,
      group: item.group,
      web: item.web,
      type: item.type ?? "TRAINING",
      targetFdp: item.target_fdp ?? item.targetFdp ?? 100,
      targetValue: item.target_value ?? item.targetValue ?? 250000000,
      active: item.active ?? true,
    }));

    setCrms(mapped);

    setInputForm((prev) => ({
      ...prev,
      crmId: mapped.some((crm) => crm.id === prev.crmId)
        ? prev.crmId
        : mapped[0]?.id ?? "",
    }));
  }

  async function fetchInputs() {
    const { data, error } = await supabase
      .from("inputs")
      .select("id, date, crm_id, fdp, value")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error ambil inputs:", error);
      return;
    }

    const mapped: InputRow[] = (data ?? []).map((item: any) => ({
      id: item.id,
      date: item.date,
      crmId: item.crm_id,
      fdp: item.fdp ?? 0,
      value: item.value ?? 0,
    }));

    setInputs(mapped);
  }

  useEffect(() => {
    const loadedUsers = loadLocal("crm_users", INITIAL_USERS);
    const loadedSession = loadLocal<SessionUser | null>("crm_session", null);

    setUsers(loadedUsers);

    if (loadedSession) {
      setSessionUser(loadedSession);
      setSessionRole(loadedSession.role);
    }

    setIsHydrated(true);

    void fetchCrms();
    void fetchInputs();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveLocal("crm_users", users);
  }, [users, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveLocal("crm_session", sessionUser);
  }, [sessionUser, isHydrated]);

  const periodInputs = useMemo(() => {
    return inputs.filter((x) => {
      const itemDate = new Date(x.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      return itemDate >= start && itemDate <= end;
    });
  }, [inputs, dateRange]);

  const rows: RowComputed[] = useMemo(() => {
    return crms
      .filter((crm) => crm.active)
      .map((crm) => {
        const crmInputs = periodInputs.filter((x) => x.crmId === crm.id);

        const totalFdp = crmInputs.reduce((sum, row) => sum + row.fdp, 0);
        const totalValue = crmInputs.reduce((sum, row) => sum + row.value, 0);

        const pFdp = crm.targetFdp > 0 ? totalFdp / crm.targetFdp : 0;
        const pValue = crm.targetValue > 0 ? totalValue / crm.targetValue : 0;
        const score = (clamp01(pFdp) + clamp01(pValue)) / 2;

        return {
          ...crm,
          totalFdp,
          totalValue,
          pFdp,
          pValue,
          score,
          status: getStatus(score),
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [crms, periodInputs]);

  const groupOptions = useMemo(() => {
    return Array.from(new Set(crms.map((x) => x.group))).sort();
  }, [crms]);

  const webOptions = useMemo(() => {
    const source =
      selectedGroupFilter === "ALL"
        ? crms
        : crms.filter((x) => x.group === selectedGroupFilter);

    return Array.from(new Set(source.map((x) => x.web))).sort();
  }, [crms, selectedGroupFilter]);

  useEffect(() => {
    if (selectedWebFilter === "ALL") return;
    if (!webOptions.includes(selectedWebFilter)) {
      setSelectedWebFilter("ALL");
    }
  }, [selectedWebFilter, webOptions]);

  const filteredRows = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        keyword === "" ||
        row.name.toLowerCase().includes(keyword) ||
        row.group.toLowerCase().includes(keyword) ||
        row.web.toLowerCase().includes(keyword);

      const matchesGroup =
        selectedGroupFilter === "ALL" || row.group === selectedGroupFilter;

      const matchesWeb =
        selectedWebFilter === "ALL" || row.web === selectedWebFilter;

      return matchesSearch && matchesGroup && matchesWeb;
    });
  }, [rows, searchTerm, selectedGroupFilter, selectedWebFilter]);

  const filteredCrms = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return crms.filter((crm) => {
      const matchesSearch =
        keyword === "" ||
        crm.name.toLowerCase().includes(keyword) ||
        crm.group.toLowerCase().includes(keyword) ||
        crm.web.toLowerCase().includes(keyword);

      const matchesGroup =
        selectedGroupFilter === "ALL" || crm.group === selectedGroupFilter;

      const matchesWeb =
        selectedWebFilter === "ALL" || crm.web === selectedWebFilter;

      return matchesSearch && matchesGroup && matchesWeb;
    });
  }, [crms, searchTerm, selectedGroupFilter, selectedWebFilter]);

  const filteredPeriodInputs = useMemo(() => {
    const allowedCrmIds = new Set(filteredRows.map((x) => x.id));
    return periodInputs.filter((x) => allowedCrmIds.has(x.crmId));
  }, [periodInputs, filteredRows]);

  const totalOmset = filteredRows.reduce((sum, row) => sum + row.totalValue, 0);
  const totalFdp = filteredRows.reduce((sum, row) => sum + row.totalFdp, 0);
  const topFdp = [...filteredRows].sort((a, b) => b.totalFdp - a.totalFdp)[0];
  const topValue = [...filteredRows].sort((a, b) => b.totalValue - a.totalValue)[0];

  const dailyChartData = useMemo(() => {
    const map = new Map<string, { date: string; fdp: number; value: number }>();

    filteredPeriodInputs.forEach((item) => {
      if (!map.has(item.date)) {
        map.set(item.date, { date: item.date, fdp: 0, value: 0 });
      }

      const current = map.get(item.date)!;
      current.fdp += item.fdp;
      current.value += item.value;
    });

    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredPeriodInputs]);

  const webRows = useMemo(() => {
    const map = new Map<
      string,
      { web: string; group: string; crmCount: number; totalFdp: number; totalValue: number }
    >();

    filteredRows.forEach((row) => {
      if (!map.has(row.web)) {
        map.set(row.web, {
          web: row.web,
          group: row.group,
          crmCount: 0,
          totalFdp: 0,
          totalValue: 0,
        });
      }

      const current = map.get(row.web)!;
      current.crmCount += 1;
      current.totalFdp += row.totalFdp;
      current.totalValue += row.totalValue;
    });

    return Array.from(map.values()).sort((a, b) => b.totalValue - a.totalValue);
  }, [filteredRows]);

  const groupRows = useMemo(() => {
    const map = new Map<
      string,
      { group: string; crmCount: number; totalFdp: number; totalValue: number }
    >();

    filteredRows.forEach((row) => {
      if (!map.has(row.group)) {
        map.set(row.group, {
          group: row.group,
          crmCount: 0,
          totalFdp: 0,
          totalValue: 0,
        });
      }

      const current = map.get(row.group)!;
      current.crmCount += 1;
      current.totalFdp += row.totalFdp;
      current.totalValue += row.totalValue;
    });

    return Array.from(map.values()).sort((a, b) => b.totalValue - a.totalValue);
  }, [filteredRows]);

  const bonusRows = useMemo(() => {
    return filteredRows
      .map((row) => {
        const bonusPercent = getBonusPercent(row.type, row.totalValue);
        const bonusAmount = Math.round(row.totalValue * bonusPercent);

        return {
          ...row,
          bonusPercent,
          bonusTierLabel: getBonusTierLabel(row.type, row.totalValue),
          bonusAmount,
        };
      })
      .filter((row) => row.bonusAmount > 0)
      .sort((a, b) => b.bonusAmount - a.bonusAmount);
  }, [filteredRows]);

  const totalBonus = bonusRows.reduce((sum, row) => sum + row.bonusAmount, 0);

  const selectedCrm =
    filteredRows.find((x) => x.id === inputForm.crmId) ??
    rows.find((x) => x.id === inputForm.crmId);

  const selectedCrmInputs = filteredPeriodInputs
    .filter((x) => x.crmId === inputForm.crmId)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  function handleLogin() {
    const found = users.find(
      (u) =>
        u.username.toLowerCase() === loginForm.username.trim().toLowerCase() &&
        u.active
    );

    if (!found) {
      alert("Username tidak ditemukan atau akun tidak aktif.");
      return;
    }

    if (loginForm.password !== found.password) {
      alert("Password salah.");
      return;
    }

    const nextSession: SessionUser = {
      username: found.username,
      name: found.name,
      role: found.role,
    };

    setSessionUser(nextSession);
    setSessionRole(found.role);
    setPage("dashboard");
  }

  function handleLogout() {
    setSessionUser(null);
    setLoginForm({
      username: "",
      password: "",
    });
  }

  async function saveInput() {
    if (!inputForm.crmId) {
      alert("CRM harus dipilih.");
      return;
    }

    const cleanFdp = safeNumber(inputForm.fdp);
    const cleanValue = safeNumber(inputForm.value);

    if (cleanFdp <= 0 && cleanValue <= 0) {
      alert("Minimal isi FDP atau Value.");
      return;
    }

    const { data: existingRow, error: checkError } = await supabase
      .from("inputs")
      .select("id")
      .eq("crm_id", inputForm.crmId)
      .eq("date", inputForm.date)
      .maybeSingle();

    if (checkError) {
      console.error("Supabase check error:", checkError);
      alert("Gagal cek data lama: " + checkError.message);
      return;
    }

    let saveError: any = null;

    if (existingRow) {
      const { error } = await supabase
        .from("inputs")
        .update({
          fdp: cleanFdp,
          value: cleanValue,
        })
        .eq("id", existingRow.id);

      saveError = error;
    } else {
      const { error } = await supabase.from("inputs").insert([
        {
          date: inputForm.date,
          crm_id: inputForm.crmId,
          fdp: cleanFdp,
          value: cleanValue,
        },
      ]);

      saveError = error;
    }

    if (saveError) {
      console.error("Supabase error:", saveError);
      alert("Gagal simpan ke database: " + saveError.message);
      return;
    }

    await fetchInputs();

    setSelectedPeriod(monthKey(inputForm.date));
    alert(existingRow ? "Data berhasil diupdate." : "Data berhasil disimpan.");

    setInputForm((prev) => ({
      ...prev,
      fdp: "",
      value: "",
    }));
  }

  function handleEditInput(row: InputRow) {
    setInputForm({
      date: row.date,
      crmId: row.crmId,
      fdp: row.fdp,
      value: row.value,
    });
    setPage("input");
  }

  async function handleDeleteInput(id: string) {
    const confirmed = window.confirm("Hapus data ini?");
    if (!confirmed) return;

    const { error } = await supabase.from("inputs").delete().eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      alert("Gagal hapus data: " + error.message);
      return;
    }

    await fetchInputs();
  }

  function toggleCrmType(crmId: string) {
    setCrms((prev) =>
      prev.map((crm) =>
        crm.id === crmId
          ? {
              ...crm,
              type: crm.type === "TRAINING" ? "REGULAR" : "TRAINING",
              targetValue: crm.type === "TRAINING" ? 500000000 : 250000000,
            }
          : crm
      )
    );
  }

  function toggleCrmActive(crmId: string) {
    setCrms((prev) =>
      prev.map((crm) => (crm.id === crmId ? { ...crm, active: !crm.active } : crm))
    );
  }

  function addCrm() {
    if (!newCrmForm.name.trim() || !newCrmForm.group.trim() || !newCrmForm.web.trim()) {
      alert("Lengkapi nama CRM, group, dan web.");
      return;
    }

    setCrms((prev) => [
      ...prev,
      {
        id: makeId("crm"),
        name: newCrmForm.name.trim(),
        group: newCrmForm.group.trim(),
        web: newCrmForm.web.trim(),
        type: newCrmForm.type,
        targetFdp: safeNumber(newCrmForm.targetFdp),
        targetValue: safeNumber(newCrmForm.targetValue),
        active: true,
      },
    ]);

    setNewCrmForm({
      name: "",
      group: "",
      web: "",
      type: "TRAINING",
      targetFdp: 100,
      targetValue: 250000000,
    });
  }

  function toggleUser(userId: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, active: !u.active } : u))
    );
  }

  function deleteUser(userId: string) {
    const confirmed = window.confirm("Yakin mau hapus akun ini?");
    if (!confirmed) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  }

  function addUser() {
    if (
      !newUserForm.username.trim() ||
      !newUserForm.name.trim() ||
      !newUserForm.password.trim()
    ) {
      alert("Lengkapi username, nama, dan password.");
      return;
    }

    const exists = users.some(
      (u) => u.username.toLowerCase() === newUserForm.username.trim().toLowerCase()
    );

    if (exists) {
      alert("Username sudah dipakai.");
      return;
    }

    setUsers((prev) => [
      ...prev,
      {
        id: makeId("user"),
        username: newUserForm.username.trim(),
        name: newUserForm.name.trim(),
        password: newUserForm.password.trim(),
        role: newUserForm.role,
        active: true,
      },
    ]);

    setNewUserForm({
      username: "",
      name: "",
      password: "",
      role: "VIEWER",
    });
  }

  function exportWebCsv() {
    exportCsv(`omset-web-${selectedPeriod}.csv`, [
      ["Web", "Group", "Jumlah CRM", "Total FDP", "Total Value"],
      ...webRows.map((row) => [row.web, row.group, row.crmCount, row.totalFdp, row.totalValue]),
    ]);
  }

  function exportGroupCsv() {
    exportCsv(`omset-group-${selectedPeriod}.csv`, [
      ["Group", "Jumlah CRM", "Total FDP", "Total Value"],
      ...groupRows.map((row) => [row.group, row.crmCount, row.totalFdp, row.totalValue]),
    ]);
  }

  function exportBonusCsv() {
    exportCsv(`bonus-${selectedPeriod}.csv`, [
      ["CRM", "Type", "Group", "Web", "Value", "Tier", "Bonus"],
      ...bonusRows.map((row) => [
        row.name,
        row.type,
        row.group,
        row.web,
        row.totalValue,
        row.bonusTierLabel,
        row.bonusAmount,
      ]),
    ]);
  }

  function resetFilters() {
    setSearchTerm("");
    setSelectedGroupFilter("ALL");
    setSelectedWebFilter("ALL");
  }

  const canSeeRestricted = sessionRole === "SUPERADMIN" || sessionRole === "ADMIN";

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        Memuat data...
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Livescore Report
          </div>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Login CRM Livescore
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Login untuk melihat laporan livescore, input harian, dan manajemen data.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm((prev) => ({ ...prev, username: e.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                placeholder="Masukkan password"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex">
        <Sidebar
          current={page}
          setPage={(nextPage) => setPage(nextPage)}
          role={sessionRole}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={(open) => setSidebarOpen(open)}
        />

        <main className="min-h-screen flex-1 p-6 md:p-8">
          {!sidebarOpen && (
            <div className="mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                ☰ Menu
              </button>
            </div>
          )}

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <DateRangeFilter onApply={setDateRange} />

              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search CRM"
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm w-[180px]"
                />

                <select
                  value={selectedGroupFilter}
                  onChange={(e) => setSelectedGroupFilter(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                >
                  <option value="ALL">Semua Group</option>
                  {groupOptions.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedWebFilter}
                  onChange={(e) => setSelectedWebFilter(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                >
                  <option value="ALL">Semua Web</option>
                  {webOptions.map((web) => (
                    <option key={web} value={web}>
                      {web}
                    </option>
                  ))}
                </select>

                <button
                  onClick={resetFilters}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                >
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-500">
                  Hasil:{" "}
                  <span className="font-semibold text-slate-900">{filteredRows.length}</span> CRM
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm">
                  <span className="font-semibold text-slate-900">{sessionUser.name}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">{sessionUser.role}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {page === "dashboard" && (
            <div className="space-y-6">
              <DashboardView
                rows={filteredRows}
                totalOmset={totalOmset}
                totalFdp={totalFdp}
                topFdp={topFdp}
                topValue={topValue}
                selectedPeriodLabel={`${dateRange.startDate.toLocaleDateString(
                  "id-ID"
                )} - ${dateRange.endDate.toLocaleDateString("id-ID")}`}
              />
              <div className="mx-auto max-w-7xl">
                <DailyChartView data={dailyChartData} />
              </div>
            </div>
          )}

          {page === "web" && <WebView webRows={webRows} onExport={exportWebCsv} />}

          {page === "group" && (
            <GroupView groupRows={groupRows} onExport={exportGroupCsv} />
          )}

          {page === "bonus" && canSeeRestricted && (
            <BonusView
              bonusRows={bonusRows}
              totalBonus={totalBonus}
              onExport={exportBonusCsv}
            />
          )}

          {page === "input" && canSeeRestricted && (
            <InputView
              rows={filteredRows}
              inputForm={inputForm}
              setInputForm={setInputForm}
              selectedCrm={selectedCrm}
              selectedCrmInputs={selectedCrmInputs}
              onSave={saveInput}
              onEdit={handleEditInput}
              onDelete={handleDeleteInput}
            />
          )}

          {page === "crm" && sessionRole === "SUPERADMIN" && (
            <CrmView
              crms={filteredCrms}
              newCrmForm={newCrmForm}
              setNewCrmForm={setNewCrmForm}
              onToggleType={toggleCrmType}
              onToggleActive={toggleCrmActive}
              onAddCrm={addCrm}
            />
          )}

          {page === "users" && sessionRole === "SUPERADMIN" && (
            <UsersView
              users={users}
              newUserForm={newUserForm}
              setNewUserForm={setNewUserForm}
              onToggleUser={toggleUser}
              onDeleteUser={deleteUser}
              onAddUser={addUser}
            />
          )}
        </main>
      </div>
    </div>
  );
}