export class AdminProfile {
  id?: string;
  user_id: string;
  birthdate: Date;
  phone: string;
  profile_picture: string | null;

  constructor(partial: Partial<AdminProfile>) {
    Object.assign(this, partial);
  }
}