export type OrganisationSearchResult = {
  company_id: string;
  name: string;
  industry: string;
  country?: string;
  company_logo?: string | null;
};
export type JoinRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"

export type PendingJoinRequest = {
  request_id: string;
  user_id: string;
  email: string;
  phone_number?: string | null;
  message?: string | null;
  status: JoinRequestStatus;
  created_at: string;
};

export type ReviewJoinRequestPayload = {
  action: "approve" | "reject";
};

export type ReviewJoinRequestAction = "APPROVED" | "REJECTED";

export type Organisation = {
  company_id: string;
  name: string;
  industry: string | null;
  company_size: number | null;
  country: string;
  created_at: string;
  company_logo: string | null;
  membersCount: number;
  assetsCount: number;
};