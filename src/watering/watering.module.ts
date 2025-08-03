import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';

import { WateringController } from './presentation/controllers/watering.controller';
import { CreateWateringGroupUseCase } from './application/use-cases/create-watering-group.use-case';
import { AddPotsToGroupUseCase } from './application/use-cases/add-pots-to-group.use-case';
import { CreateWateringScheduleUseCase } from './application/use-cases/create-watering-schedule.use-case';
import { ExecuteWateringScheduleUseCase } from './application/use-cases/execute-watering-schedule.use-case';
import { GetWateringGroupByIdUseCase } from './application/use-cases/get-watering-group-by-id.use-case';
import { GetWateringGroupsUseCase } from './application/use-cases/get-watering-groups.use-case';
import { UpdateWateringGroupUseCase} from './application/use-cases/update-watering-group.use-case';
import { UpdateWateringScheduleUseCase } from './application/use-cases/update-watering-schedule.use-case';
import { RemovePotFromGroupUseCase } from './application/use-cases/remove-pot-from-group.use-case';
import { DeleteWateringGroupUseCase } from './application/use-cases/delete-watering-group.use-case';
import { WateringRepository } from './infrastructure/repositories/watering.repository';
import { DeviceControlService } from './infrastructure/services/device-control.service';
import { WateringNotificationService } from './infrastructure/services/watering-notification.service';
import { WateringGroupMapper } from './infrastructure/mappers/watering-group.mapper';
import { WateringScheduleMapper } from './infrastructure/mappers/watering-schedule.mapper';
import { WateringImageService } from './infrastructure/services/watering-image.service';
import { UploadWateringGroupImageUseCase } from './application/use-cases/upload-watering-group-image.use-case';
import { UpdateWateringGroupImageUseCase } from './application/use-cases/update-watering-group-image.use-case';
import { DeleteWateringGroupImageUseCase } from './application/use-cases/delete-watering-group-image.use-case';
import { ManualWateringControlUseCase} from './application/use-cases/manual-watering-control.use-case';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [WateringController],
  providers: [
    CreateWateringGroupUseCase,
    AddPotsToGroupUseCase,
    CreateWateringScheduleUseCase,
    ExecuteWateringScheduleUseCase,
    GetWateringGroupByIdUseCase,
    GetWateringGroupsUseCase,
    UpdateWateringGroupUseCase,
    UpdateWateringScheduleUseCase,
    RemovePotFromGroupUseCase,
    DeleteWateringGroupUseCase,
    WateringGroupMapper,
    WateringScheduleMapper,
    WateringImageService,
    UploadWateringGroupImageUseCase,
    UpdateWateringGroupImageUseCase,
    DeleteWateringGroupImageUseCase,
    ManualWateringControlUseCase,

    {
      provide: 'IWateringRepository',
      useClass: WateringRepository
    },
    {
      provide: 'IDeviceControlService',
      useClass: DeviceControlService
    },
    {
      provide: 'IWateringNotificationService',
      useClass: WateringNotificationService
    }
  ],
  exports: ['IWateringRepository']
})
export class WateringModule {}