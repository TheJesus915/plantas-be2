// readings-scheduler.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PotReadingsGateway } from '../../presentation/gateways/pot-readings.gateway';
import { GetPotReadingsUseCase } from '../../application/use-cases/pot-readings/get-pot-readings.use-case';
import { IPotsRepository } from '../../domain/interfaces/pots-repository.interface';

@Injectable()
export class ReadingsSchedulerService {
  constructor(
    private readonly potReadingsGateway: PotReadingsGateway,
    private readonly getPotReadingsUseCase: GetPotReadingsUseCase,
    @Inject('IPotsRepository')
    private readonly potsRepository: IPotsRepository
  ) {}

  @Cron('*/5 * * * * *')
  async updatePotReadings() {
    try {
      const activePots = this.potReadingsGateway.getActivePots();

      for (const potId of activePots) {
        const userId = this.potReadingsGateway.getUserIdForPot(potId);

        if (userId) {
          const potReadings = await this.getPotReadingsUseCase.execute(userId, potId);
          this.potReadingsGateway.broadcastPotUpdate(potId, potReadings);
        }
      }
    } catch (error) {
      console.error('Error updating pot readings:', error);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async cleanupConnections() {
    this.potReadingsGateway.cleanupOrphanedConnections();
  }
}