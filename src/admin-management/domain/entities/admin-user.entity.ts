import { Role, StatusAccount } from '@prisma/client';

export class AdminUser {
  id?: string;
  name: string;
  lastname: string;
  email: string;
  type: Role;
  status_account: StatusAccount;

  constructor(partial: Partial<AdminUser>) {
    Object.assign(this, partial);
  }
}