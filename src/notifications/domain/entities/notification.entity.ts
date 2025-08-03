export class Notification {
  id: string;
  userId: string;
  payload: any;
  created_at: Date;

  constructor(partial: Partial<Notification>) {
    Object.assign(this, partial);
  }
}
