import { Module } from '@nestjs/common';
import { RoleController } from './presentation/controllers/role.controller';
import { CreateRoleUseCase } from './application/use-cases/create-role.use-case';
import { UpdateRoleUseCase } from './application/use-cases/update-role.use-case';
import { DeleteRoleUseCase } from './application/use-cases/delete-role.use-case';
import { GetRolesUseCase } from './application/use-cases/get-roles.use-case';
import { GetRoleByIdUseCase } from './application/use-cases/get-role-by-id.use-case';
import { RoleRepository } from './infrastructure/repositories/role.repository';
import { RoleMapper } from './infrastructure/mappers/role.mapper';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [RoleController],
  providers: [
    RoleMapper,
    {
      provide: 'RoleRepositoryInterface',
      useClass: RoleRepository,
    },
    CreateRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    GetRolesUseCase,
    GetRoleByIdUseCase,
  ],
  exports: [
    CreateRoleUseCase,
    GetRolesUseCase,
    GetRoleByIdUseCase,
    'RoleRepositoryInterface',
    RoleMapper,
  ],
})
export class RolesModule {}