export type Role = "SUPERADMIN" | "ADMIN" | "VIEWER";
export type CrmType = "TRAINING" | "REGULAR";

export type Crm = {
  id: string;
  name: string;
  group: string;
  web: string;
  type: CrmType;
  targetFdp: number;
  targetValue: number;
  active: boolean;
};

export type InputRow = {
  id: string;
  date: string;
  crmId: string;
  fdp: number;
  value: number;
};

export type InputFormState = {
  date: string;
  crmId: string;
  fdp: number | "";
  value: number | "";
};

export type RowComputed = Crm & {
  totalFdp: number;
  totalValue: number;
  pFdp: number;
  pValue: number;
  score: number;
  status: string;
};

export type User = {
  id: string;
  username: string;
  name: string;
  password: string;
  role: Role;
  active: boolean;
};

export const INITIAL_CRMS: Crm[] = [
  {
    id: "c1",
    name: "Maudy",
    group: "TOPAN",
    web: "TOPANBET",
    type: "REGULAR",
    targetFdp: 100,
    targetValue: 500_000_000,
    active: true,
  },
  {
    id: "c2",
    name: "Tiara",
    group: "API",
    web: "GANA33",
    type: "REGULAR",
    targetFdp: 100,
    targetValue: 500_000_000,
    active: true,
  },
  {
    id: "c3",
    name: "Sonya",
    group: "SIR",
    web: "CERAH88",
    type: "TRAINING",
    targetFdp: 100,
    targetValue: 250_000_000,
    active: true,
  },
];

export const INITIAL_INPUTS: InputRow[] = [];

export const INITIAL_USERS: User[] = [
  {
    id: "u1",
    username: "superadmin",
    name: "Super Admin",
    password: "123456",
    role: "SUPERADMIN",
    active: true,
  },
  {
    id: "u2",
    username: "admin",
    name: "Admin",
    password: "123456",
    role: "ADMIN",
    active: true,
  },
  {
    id: "u3",
    username: "viewer",
    name: "Viewer",
    password: "123456",
    role: "VIEWER",
    active: true,
  },
];