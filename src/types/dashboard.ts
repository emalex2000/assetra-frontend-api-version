export type StatusTabKey =
  | "availableDevices"
  | "assignedDevices"
  | "organizationMembers"
  | "totalDevices";

export type StatusTab = {
  key: StatusTabKey;
  label: string;
};

export type DashboardStats = {
  totalDevices: number;
  assignedDevices: number;
  availableDevices: number;
  organisationMembers: number;
};

export type StatusDataItem = {
  label: string;
  availableDevices: number;
  assignedDevices: number;
  organizationMembers: number;
  totalDevices: number;
};

export type AssignedDeviceRow = {
  id: number | string;
  device: string;
  assignedTo: string;
  location: string;
  assignedBy: string;
  date: string;
  status: "Assigned";
};

export type DamagedDataItem = {
  month: string;
  value: number;
  color: string;
};

export type OrganisationDashboardResponse = {
  stats?: {
    totalDevices?: number;
    assignedDevices?: number;
    availableDevices?: number;
    organisationMembers?: number;
  };
  statusOverview?: Array<{
    label?: string;
    availableDevices?: number;
    assignedDevices?: number;
    organizationMembers?: number;
    totalDevices?: number;
  }>;
  recentlyAssignedDevices?: Array<{
    id?: number | string;
    device?: string;
    assignedTo?: string;
    location?: string;
    assignedBy?: string;
    date?: string;
    status?: string;
  }>;
  damagedDevicesTrend?: Array<{
    month?: string;
    value?: number;
  }>;
};