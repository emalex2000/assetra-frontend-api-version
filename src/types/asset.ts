export type Device = {
  id: string;
  asset_name: string;
  asset_tag: string;
  category_name: string;
  assigned_to: string;
  status: string;
  condition: string;
};

export type Category = {
  category_id: string;
  name: string;
  description?: string;
};

export type CreateCategoryPayload = {
  name: string;
  description?: string;
};

export type CreateDevicePayload = {
  name: string;
  serial_number: string;
  model?: string;
  category: string;
  location_country?: string;
};