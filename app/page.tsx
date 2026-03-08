"use client";

import { useEffect, useMemo, useState } from "react";

import Sidebar from "./sidebar";

import { supabase } from "./lib/supabase";
import DashboardView from "./components/DashboardView";
import DateRangeFilter from "./components/DateRangeFilter";
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

const [dateRange, setDateRange] = useState({
  startDate: new Date(),
  endDate: new Date(),
});

async function fetchCrms() {
  const { data, error } = await supabase
    .from("crms")
    .select("*");

  if (error) {
    console.error("Error ambil CRM:", error);
    return;
  }

  if (data) {
    setCrms(data);
  }
}

async function fetchInputs() {
  const { data, error } = await supabase
    .from("inputs")
    .select("*");

  if (error) {
    console.error("Error ambil inputs:", error);
    return;
  }

  if (data) {
    const mapped = data.map((row: any) => ({
      id: row.id,
      date: row.date,
      crmId: row.crm_id,
      fdp: row.fdp ?? 0,
      value: row.value ?? 0,
    }));

    setInputs(mapped);
  }
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

  fetchCrms();
  fetchInputs();
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

    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);

    return itemDate >= start && itemDate <= end;
  });
}, [inputs, dateRange]);

const rows: RowComputed[] = useMemo(() => {
  return crms
    .filter((crm) => crm.active)
    .map((crm) => {

      const crmInputs = periodInputs.filter(
        (x) => x.crmId === crm.id
      );

      const totalFdp = crmInputs.reduce(
        (sum, row) => sum + row.fdp, 0
      );

      const totalValue = crmInputs.reduce(
        (sum, row) => sum + row.value, 0
      );

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
    .sort((a,b) => b.score - a.score);

}, [crms, periodInputs]);

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

  const { error } = await supabase
    .from("inputs")
    .insert([
      {
        date: inputForm.date,
        crm_id: inputForm.crmId,
        fdp: cleanFdp,
        value: cleanValue,
      },
    ]);

  if (error) {
    console.error(error);
    alert("Gagal simpan data");
    return;
  }

  await fetchInputs();

  alert("Data berhasil disimpan");

  setInputForm((prev) => ({
    ...prev,
    fdp: "",
    value: "",
  }));

}

async function handleDeleteInput(id: string) {

  const confirmed = window.confirm("Hapus data ini?");
  if (!confirmed) return;

  const { error } = await supabase
    .from("inputs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Gagal hapus data");
    return;
  }

  await fetchInputs();
}

return (
  <div className="min-h-screen bg-slate-100">
    {/* seluruh UI kamu */}
  </div>
);

}