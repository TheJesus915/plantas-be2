import { Module } from '@nestjs/common';
import { AdminDeviceController } from './presentation/controllers/admin-device.controller';
import { DevicesController } from './presentation/controllers/devices.controller';
import { DeviceRepository } from './infrastructure/repositories/device.repository';
import { IDeviceRepository } from './domain/interfaces/device-repository.interface';
import { DeviceMapper } from './infrastructure/mappers/device.mapper';
import { CreateDeviceUseCase } from './application/use-cases/create-device.use-case';
import { UpdateDeviceUseCase } from './application/use-cases/update-device.use-case';
import { RegenerateLinkingKeyUseCase } from './application/use-cases/regenerate-linking-key.use-case';
import { LinkDeviceUseCase } from './application/use-cases/link-device.use-case';
import { UnlinkDeviceUseCase } from './application/use-cases/unlink-device.use-case';
import { GetMyDevicesUseCase } from './application/use-cases/get-my-devices.use-case';
import { UserGardenModule } from '../user-garden/user-garden.module';
import { GetDevicesUseCase } from './application/use-cases/get-devices.use-case';
import { GetDeviceByIdUseCase } from './application/use-cases/get-device-by-id.use-case';
import { LinkingKeyService } from './infrastructure/services/linking-key.service';
import { DeviceReadingsGateway } from './presentation/gateways/device-readings.gateway';
import { GetDeviceReadingsUseCase } from './application/use-cases/get-device-readings.use-case';
import { DeviceReadingsSchedulerService } from './infrastructure/services/device-readings-scheduler.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserGardenModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AdminDeviceController, DevicesController],
  providers: [
    DeviceMapper,
    LinkingKeyService,
    {
      provide: 'IDeviceRepository',
      useClass: DeviceRepository
    },
    {
      provide: 'ILinkingKeyService',
      useClass: LinkingKeyService
    },
    CreateDeviceUseCase,
    UpdateDeviceUseCase,
    RegenerateLinkingKeyUseCase,
    LinkDeviceUseCase,
    UnlinkDeviceUseCase,
    GetMyDevicesUseCase,
    GetDevicesUseCase,
    GetDeviceByIdUseCase,
    DeviceReadingsGateway,
    GetDeviceReadingsUseCase,
    DeviceReadingsSchedulerService
  ],
  exports: ['IDeviceRepository']
})
export class DevicesModule {}