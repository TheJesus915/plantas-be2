import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AreasController } from './presentation/controllers/areas.controller';
import { PotsController } from './presentation/controllers/pots.controller';
import { CreateAreaUseCase } from './application/use-cases/areas/create-area.use-case';
import { UpdateAreaUseCase } from './application/use-cases/areas/update-area.use-case';
import { GetAreaUseCase } from './application/use-cases/areas/get-area.use-case';
import { GetAreasUseCase } from './application/use-cases/areas/get-areas.use-case';
import { DeleteAreaUseCase } from './application/use-cases/areas/delete-area.use-case';
import { CreatePotUseCase } from './application/use-cases/pots/create-pot.use-case';
import { UpdatePotUseCase } from './application/use-cases/pots/update-pot.use-case';
import { GetPotUseCase } from './application/use-cases/pots/get-pot.use-case';
import { GetPotsUseCase } from './application/use-cases/pots/get-pots.use-case';
import { DeletePotUseCase } from './application/use-cases/pots/delete-pot.use-case';
import { AreasRepository } from './infrastructure/repositories/areas.repository';
import { PotsRepository } from './infrastructure/repositories/pots.repository';
import { AreaMapper } from './infrastructure/mappers/area.mapper';
import { PotMapper } from './infrastructure/mappers/pot.mapper';
import { GardenImageService } from './infrastructure/services/garden-image.service';
import { PotReadingsGateway } from './presentation/gateways/pot-readings.gateway';
import { ReadingsSchedulerService } from './infrastructure/services/readings-scheduler.service';
import { GetPotReadingsUseCase } from './application/use-cases/pot-readings/get-pot-readings.use-case';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [
    AreasController,
    PotsController
  ],
  providers: [
    AreaMapper,
    PotMapper,
    GardenImageService,
    PotReadingsGateway,
    GetPotReadingsUseCase,
    ReadingsSchedulerService,
    AreasRepository,
    {
      provide: 'IAreasRepository',
      useClass: AreasRepository
    },
    PotsRepository,
    {
      provide: 'IPotsRepository',
      useClass: PotsRepository
    },
    CreateAreaUseCase,
    UpdateAreaUseCase,
    GetAreaUseCase,
    GetAreasUseCase,
    DeleteAreaUseCase,
    CreatePotUseCase,
    UpdatePotUseCase,
    GetPotUseCase,
    GetPotsUseCase,
    DeletePotUseCase
  ],
  exports: [
    GardenImageService,
    PotMapper,
    PotReadingsGateway,
    {
      provide: 'IPotsRepository',
      useClass: PotsRepository
    }
  ]
})
export class UserGardenModule {}