

export class NotificationModel {
  message: string;
  status: string;
  type: string;
  title: string;
  sender: string;
  updated_at: Date;
  created_at: Date;

  constructor(data: any) {
    this.message = data.message || '';
    this.status = data.status || '';
    this.type = data.type || '';
    this.title = data.title || '';
    this.sender = data.sender || '';
    this.updated_at = data.updated_at ? new Date(data.updated_at) : new Date();
    this.created_at = data.created_at ? new Date(data.created_at) : new Date();
  }
}

