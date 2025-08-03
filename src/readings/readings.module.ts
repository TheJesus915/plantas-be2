import { Module } from '@nestjs/common';
import { ReadingGateway } from './presentation/gateways/reading.gateway';
import { CreateReadingUseCase } from './application/use-cases/create-reading.use-case';
import { ReadingRepositoryImpl } from './infrastructure/repositories/reading.repository';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [
    ReadingGateway,
    CreateReadingUseCase,
    { provide: 'ReadingRepository', useClass: ReadingRepositoryImpl },
  ],
})
export class ReadingsModule {}