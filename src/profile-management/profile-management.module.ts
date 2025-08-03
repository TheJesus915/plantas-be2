import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../shared/infrastructure/services/prisma.service';
import { GetProfileUseCase } from './application/use-cases/User/get-profile.use-case';
import { UserController } from './presentation/controllers/user.controller';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserEmailService } from './infrastructure/services/user-email.service';
import { UpdateProfileUseCase } from './application/use-cases/User/update-profile.use-case';
import { ChangePasswordUseCase } from './application/use-cases/User/change-password.use-case';
import { RequestEmailChangeUseCase } from './application/use-cases/User/request-email-change.use-case';
import { VerifyEmailChangeUseCase } from './application/use-cases/User/verify-email-change.use-case';
import { DeactivateUserUseCase } from './application/use-cases/User/deactivate-user.use-case';
import { UploadProfilePhotoUseCase } from './application/use-cases/User/upload-profile-photo.use-case';
import { DeleteProfilePhotoUseCase } from './application/use-cases/User/delete-profile-photo.use-case';
import { StorageService } from '../shared/infrastructure/services/storage.service';
import { GetAdminProfileUseCase } from './application/use-cases/User/get-admin-profile.use-case';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [
    PrismaService,
    GetProfileUseCase,
    UpdateProfileUseCase,
    ChangePasswordUseCase,
    RequestEmailChangeUseCase,
    VerifyEmailChangeUseCase,
    DeactivateUserUseCase,
    UploadProfilePhotoUseCase,
    DeleteProfilePhotoUseCase,
    StorageService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    UserEmailService,
    GetAdminProfileUseCase,
  ],
  exports: ['IUserRepository'],
})
export class ProfileManagementModule {}