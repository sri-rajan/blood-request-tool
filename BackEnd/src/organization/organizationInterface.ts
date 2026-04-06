interface Organization {
  name: string;
  country: string;
  state: string;
  city: string;
  created_at: number;
  created_by: string;
  updated_at: number;
  updated_by: string;
  is_deleted: boolean;
  is_disabled: boolean;
}

export type { Organization };
