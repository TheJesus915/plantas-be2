import { Module } from '@nestjs/common';
import { ModuleController } from './presentation/controllers/module.controller';
import { CreateModuleUseCase } from './application/use-cases/create-module.use-case';
import { GetAllModulesUseCase } from './application/use-cases/get-all-modules.use-case';
import { UpdateModuleUseCase } from './application/use-cases/update-module.use-case';
import { DeleteModuleUseCase } from './application/use-cases/delete-module.use-case';
import { ModuleRepository } from './infrastructure/repositories/module.repository';
import { SharedModule } from '../shared/shared.module';
import { GetModuleByIdUseCase} from './application/use-cases/get-module-by-id.use-case';

@Module({
  imports: [SharedModule],
  controllers: [ModuleController],
  providers: [
    {
      provide: 'IModuleRepository',
      useClass: ModuleRepository
    },
    ModuleRepository,
    CreateModuleUseCase,
    GetAllModulesUseCase,
    UpdateModuleUseCase,
    DeleteModuleUseCase,
    GetModuleByIdUseCase
  ],
  exports: ['IModuleRepository', ModuleRepository]
})
export class ModulesModule {}