export type RecentlyAssignedMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  devicesAssigned: string;
  location: string;
  status: "Active" | "Pending" | "Inactive" | string;
  avatarUrl?: string;
};