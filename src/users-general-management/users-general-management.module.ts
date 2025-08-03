import { Module } from '@nestjs/common';
import { PrismaService } from '../shared/infrastructure/services/prisma.service';
import { PaginationService } from '../shared/infrastructure/services/pagination.service';
import { UserGeneralRepository } from './infrastructure/repositories/user-general.repository';
import { GetAllGeneralUsersUseCase } from './application/use-cases/get-all-general-users.use-case';
import { GetGeneralUserByIdUseCase } from './application/use-cases/get-general-user-by-id.use-case';
import { UpdateStatusAccountUseCase } from './application/use-cases/update-status-account.use-case';
import { UserGeneralController } from './presentation/controllers/user-general.controller';

@Module({
  controllers: [UserGeneralController],
  providers: [
    PrismaService,
    PaginationService,
    {
      provide: 'IUserGeneralRepository',
      useClass: UserGeneralRepository,
    },
    GetAllGeneralUsersUseCase,
    GetGeneralUserByIdUseCase,
    UpdateStatusAccountUseCase,
  ],
})
export class UsersGeneralManagementModule {}
