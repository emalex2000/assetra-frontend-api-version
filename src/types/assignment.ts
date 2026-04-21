export type AssignmentStatus = "ACTIVE" | "RETURNED";
export type ReceiveStatus = "RECEIVED" | "PENDING";

export type AssignmentRow = {
  id: string;
  assetName: string;
  assetType?: string;
  assetCode: string;
  serialNumber?: string;
  locationName: string;
  locationCode?: string;
  countryName: string;
  countryCode: string;
  countryFlag: string;
  assignmentStatus: AssignmentStatus;
  receiveStatus: ReceiveStatus;
  assignedDate?: string;
};

export type AssignableAsset = {
  asset_id: string;
  asset_name: string;
  serial_number: string | null;
  model: string | null;
  category_name: string | null;
  status: string;
  condition: string;
  location_country: string | null;
  current_holder_email: string | null;
};

export type AssignableUser = {
  user_id: string;
  email: string;
  phone_number: string | null;
  role: string;
  joined_at: string;
};

export type CreateAssignmentPayload = {
  asset: string;
  user: string;
  date_assigned?: string;
  location_country: string;
  notes?: string;
};

export type AssignmentCreateResponse = {
  assignment_id: string;
  asset: string;
  user: string;
  date_assigned: string | null;
  location_country: string;
  notes: string;
};