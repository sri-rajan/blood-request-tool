enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

interface User {
  name: string;
  email: string;
  phone: {
    country_code: string;
    value: string;
  };
  password: string;
  role: UserRole;
  created_at: number;
  created_by: string;
  updated_at: number;
  updated_by: string;
  is_deleted: boolean;
  is_disabled: boolean;
  is_verified: boolean;
}

export { UserRole };
export type { User };
