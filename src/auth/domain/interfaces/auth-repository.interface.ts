import { User } from '@prisma/client';

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  findByEmailWithResetData(email: string): Promise<User | null>;
  findByEmailAndToken(email: string, token: string): Promise<User | null>;
  create(userData: any): Promise<User>;
  saveResetCode(userId: string, resetCode: string, expirationTime: Date): Promise<void>;
  updatePasswordAndClearResetCode(userId: string, hashedPassword: string): Promise<void>;
  updateVerificationToken(userId: string, token: string, expirationTime: Date): Promise<void>;
  activateAccount(userId: string): Promise<void>;
}
