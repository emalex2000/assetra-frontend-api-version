export type UserRole = {
  company_id: string;
  company_name: string;
  role: "ADMIN" | "STAFF" | "RECIPIENT" | string;
};

export type CurrentUser = {
  id: string;
  email: string;
  phone_number?: string;
  profile_image?: string | null;
  roles: UserRole[];
};