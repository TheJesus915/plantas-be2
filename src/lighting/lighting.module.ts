import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';

import { LightingController } from './presentation/controllers/lighting.controller';
import { CreateLightingGroupUseCase } from './application/use-cases/create-lighting-group.use-case';
import { AddPotsToGroupUseCase } from './application/use-cases/add-pots-to-group.use-case';
import { CreateLightingScheduleUseCase } from './application/use-cases/create-lighting-schedule.use-case';
import { ExecuteLightingScheduleUseCase } from './application/use-cases/execute-lighting-schedule.use-case';
import { GetLightingGroupByIdUseCase } from './application/use-cases/get-lighting-group-by-id.use-case';
import { GetLightingGroupsUseCase } from './application/use-cases/get-lighting-groups.use-case';
import { UpdateLightingGroupUseCase} from './application/use-cases/update-lighting-group.use-case';
import { UpdateLightingScheduleUseCase } from './application/use-cases/update-lighting-schedule.use-case';
import { RemovePotFromGroupUseCase } from './application/use-cases/remove-pot-from-group.use-case';
import { DeleteLightingGroupUseCase } from './application/use-cases/delete-lighting-group.use-case';
import { LightingRepository } from './infrastructure/repositories/lighting.repository';
import { DeviceControlService } from './infrastructure/services/device-control.service';
import { LightingNotificationService } from './infrastructure/services/lighting-notification.service';
import { LightingGroupMapper } from './infrastructure/mappers/lighting-group.mapper';
import { LightingScheduleMapper } from './infrastructure/mappers/lighting-schedule.mapper';
import { LightingImageService } from './infrastructure/services/lighting-image.service';
import { UploadLightingGroupImageUseCase } from './application/use-cases/upload-lighting-group-image.use-case';
import { UpdateLightingGroupImageUseCase } from './application/use-cases/update-lighting-group-image.use-case';
import { DeleteLightingGroupImageUseCase } from './application/use-cases/delete-lighting-group-image.use-case';
import { ManualLightingControlUseCase} from './application/use-cases/manual-lighting-control.use-case';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [LightingController],
  providers: [
    CreateLightingGroupUseCase,
    AddPotsToGroupUseCase,
    CreateLightingScheduleUseCase,
    ExecuteLightingScheduleUseCase,
    GetLightingGroupByIdUseCase,
    GetLightingGroupsUseCase,
    UpdateLightingGroupUseCase,
    UpdateLightingScheduleUseCase,
    RemovePotFromGroupUseCase,
    DeleteLightingGroupUseCase,
    LightingGroupMapper,
    LightingScheduleMapper,
    LightingImageService,
    UploadLightingGroupImageUseCase,
    UpdateLightingGroupImageUseCase,
    DeleteLightingGroupImageUseCase,
    ManualLightingControlUseCase,

    {
      provide: 'ILightingRepository',
      useClass: LightingRepository
    },
    {
      provide: 'IDeviceControlService',
      useClass: DeviceControlService
    },
    {
      provide: 'ILightingNotificationService',
      useClass: LightingNotificationService
    }
  ],
  exports: ['ILightingRepository']
})
export class LightingModule {}
