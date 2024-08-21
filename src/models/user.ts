export interface USER {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  created_at: Date;
  updated_at: Date;
}
