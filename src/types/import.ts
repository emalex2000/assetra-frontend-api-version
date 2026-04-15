export type ImportStep = 1 | 2 | 3 | 4;

export type AssetImportUploadResponse = {
  import_id: string;
  filename: string;
  sheet_name: string;
  headers: string[];
  total_rows: number;
  preview_rows: (string | number | null)[][];
  status: string;
};

export type AssetImportSession = AssetImportUploadResponse;

export type ImportFieldOption = {
  value: "name" | "serial_number" | "model" | "category" | "location_country";
  label: string;
  required?: boolean;
};

export type AssetImportMapResponse = {
  import_id: string;
  status: string;
  mapped_columns: Record<string, string | null>;
  total_rows: number;
  preview_rows: {
    row_number: number;
    raw_data?: Record<string, string | number | null>;
    normalized_data: Record<string, string | number | null>;
  }[];
};

export type AssetImportValidationRow = {
  row_number: number;
  normalized_data: Record<string, string | number | null>;
  is_valid: boolean;
  errors: string[];
};

export type AssetImportValidationResponse = {
  import_id: string;
  status: string;
  summary: {
    total_rows: number;
    valid_rows: number;
    invalid_rows: number;
    duplicate_rows: number;
  };
  preview_rows: AssetImportValidationRow[];
};

export type AssetImportCommitResponse = {
  import_id: string;
  status: string;
  imported_count: number;
  failed_count: number;
  failed_rows_preview: {
    row_number: number;
    normalized_data: Record<string, string | number | null>;
    error: string;
  }[];
};