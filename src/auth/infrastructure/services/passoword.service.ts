import { Injectable } from '@nestjs/common';
import { IPasswordService } from '../../domain/interfaces/password-service.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService implements IPasswordService {
  private readonly saltRounds = 10;

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
}