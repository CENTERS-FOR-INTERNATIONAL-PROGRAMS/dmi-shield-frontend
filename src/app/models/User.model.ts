export class User {
  id: string;
  name: string;
  status: string;
  email: string;
  role: string;
  updatedAt: Date;
  notifications: number;
  confirmedAt?: Date;
  createdAt: Date;
  selected?: boolean;

  constructor() {}
}
