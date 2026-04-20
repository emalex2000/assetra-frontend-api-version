export type OrganisationSearchResult = {
  company_id: string;
  name: string;
  country: string;
  industry: string | null;
  company_logo: string | null;
  allow_join_request: boolean;
  is_member: boolean;
  has_pending_request: boolean;
};