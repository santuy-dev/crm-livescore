export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

export function pct(x: number) {
  return `${Math.round(x * 100)}%`;
}

export function getStatus(score: number) {
  if (score >= 1) return "GOALS";
  if (score >= 0.7) return "MENUJU TARGET";
  return "JAUH TARGET";
}

export function getStatusClasses(status: string) {
  if (status === "GOALS") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "MENUJU TARGET") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-rose-200 bg-rose-50 text-rose-700";
}

export function saveLocal(key: string, data: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function safeNumber(value: number | string | "") {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

export function makeId(prefix: string) {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}`;
}

export function monthKey(date: string | Date) {
  if (date instanceof Date) {
    return date.toISOString().slice(0, 7);
  }

  return String(date).slice(0, 7);
}

export function monthLabel(period: string) {
  const [y, m] = period.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

export function getBonusPercent(
  type: "TRAINING" | "REGULAR",
  value: number
) {
  if (type === "TRAINING") {
    if (value >= 1_000_000_000) return 0.015;
    if (value >= 600_000_000) return 0.01;
    if (value >= 400_000_000) return 0.0075;
    if (value >= 250_000_000) return 0.004;
    return 0;
  }

  if (value >= 2_000_000_000) return 0.015;
  if (value >= 1_200_000_000) return 0.01;
  if (value >= 800_000_000) return 0.0075;
  if (value >= 500_000_000) return 0.004;
  return 0;
}

export function getBonusTierLabel(
  type: "TRAINING" | "REGULAR",
  value: number
) {
  const percent = getBonusPercent(type, value);
  if (percent === 0) return "Tidak Lolos Bonus";
  return `${percent * 100}%`;
}

export function exportCsv(filename: string, rows: Array<Array<string | number>>) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const text = String(cell ?? "");
          if (text.includes(",") || text.includes('"') || text.includes("\n")) {
            return `"${text.replaceAll('"', '""')}"`;
          }
          return text;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}