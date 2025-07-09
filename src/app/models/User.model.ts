export class User {
  id: string;
  name: string;
  status: string;
  email: string;
  role: string;
  updated_at: Date;
  notifications: number;
  confirmed_at?: Date;
  created_at: Date;
  selected?: boolean;

  constructor() {}
}
