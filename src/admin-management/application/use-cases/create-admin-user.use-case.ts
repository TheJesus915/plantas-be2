import { Injectable, Inject, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateAdminUserDto } from '../dtos/create-admin-user.dto';
import { IAdminUserRepository } from '../../domain/interfaces/admin-user-repository.interface';
import { Role, StatusAccount } from '@prisma/client';
import { AdminEmailService } from '../../infrastructure/services/admin-email.service';
import * as bcrypt from 'bcrypt';

interface CreateAdminResponse {
  id: string;
}

@Injectable()
export class CreateAdminUserUseCase {
  constructor(
    @Inject('IAdminUserRepository')
    private readonly adminUserRepository: IAdminUserRepository,
    private readonly adminEmailService: AdminEmailService
  ) {}

  async execute(dto: CreateAdminUserDto): Promise<CreateAdminResponse> {
    const existingUser = await this.adminUserRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const birthdate = new Date(dto.birthdate);
    if (isNaN(birthdate.getTime())) {
      throw new BadRequestException('Invalid birthdate format');
    }

    const password = this.generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.adminUserRepository.createUser({
      name: dto.name,
      lastname: dto.lastname,
      email: dto.email,
      password: hashedPassword,
      type: Role.admin,
      status_account: StatusAccount.Active,
      token_recovery: null,
      token_exp: null,
      reset_token: null,
      reset_token_exp: null
    });

    await this.adminUserRepository.createProfile({
      user_id: user.id,
      birthdate,
      phone: dto.phone,
      profile_picture: null,
      country: 'Default',
      province: 'Default',
      city: 'Default'
    });

    await this.adminUserRepository.createUserRole(user.id, dto.roleId);

    await this.adminEmailService.sendAdminCredentials(
      user.email,
      user.name,
      password
    );

    return { id: user.id };
  }

  private generatePassword(): string {
    const length = 12;
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    const allChars = lowercase + uppercase + numbers + special;

    let password = '';
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += special.charAt(Math.floor(Math.random() * special.length));

    for (let i = 4; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}