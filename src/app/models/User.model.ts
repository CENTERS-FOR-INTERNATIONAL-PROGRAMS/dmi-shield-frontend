export class User {
  _id: string = "";
  name: string;
  status: string;
  email: string;
  role: string;
  updatedAt: Date;
  notifications: number;
  confirmedAt?: Date;
  createdAt: Date;

  // constructor(data: any) {
  //   this.name = name;
  //   this.status = status;
  //   this.email = email;
  //   this.role = role;
  //   this.updatedAt = updatedAt;
  //   this.notifications = notifications;
  //   this.createdAt = createdAt;
  //   this.confirmedAt = confirmedAt;
  // }

  constructor() {
  }

  // constructor(data: any) {
  //   this.name = data.name || '';
  //   this.status = data.status || '';
  //   this.email = data.email || '';
  //   this.role = data.role || '';
  //   this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  //   this.notifications = data.notifications || 0;
  //   this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  //   this.confirmedAt = data.confirmedAt ? new Date(data.confirmedAt) : new Date();
  // }
}
