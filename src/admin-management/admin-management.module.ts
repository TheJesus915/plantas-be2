import { Module } from '@nestjs/common';
import { AdminController } from './presentation/controllers/admin.controller';
import { CreateAdminUserUseCase } from './application/use-cases/create-admin-user.use-case';
import { UpdateAdminProfileUseCase } from './application/use-cases/update-admin-profile.use-case';
import { GetAllAdminsUseCase } from './application/use-cases/get-all-admins.use-case';
import { GetAdminByIdUseCase } from './application/use-cases/get-admin-by-id.use-case';
import { AdminUserRepository } from './infrastructure/repositories/admin-user.repository';
import { AdminEmailService } from './infrastructure/services/admin-email.service';
import { AdminUserMapper } from './infrastructure/mappers/admin-user.mapper';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [AdminController],
  providers: [
    CreateAdminUserUseCase,
    UpdateAdminProfileUseCase,
    GetAllAdminsUseCase,
    GetAdminByIdUseCase,

    {
      provide: 'IAdminUserRepository',
      useClass: AdminUserRepository
    },

    AdminEmailService,
    AdminUserMapper
  ],
  exports: ['IAdminUserRepository']
})
export class AdminManagementModule {}