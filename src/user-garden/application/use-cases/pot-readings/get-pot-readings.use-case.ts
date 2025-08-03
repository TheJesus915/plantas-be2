import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { IPotsRepository } from '../../../domain/interfaces/pots-repository.interface';
import { PotReadingsResponseDto } from '../../dtos/pot-readings/pot-readings.dto';

@Injectable()
export class GetPotReadingsUseCase {
  constructor(
    @Inject('IPotsRepository')
    private readonly potsRepository: IPotsRepository
  ) {}

  async execute(userId: string, potId: string): Promise<PotReadingsResponseDto> {
    const pot = await this.potsRepository.findById(potId);
    if (!pot) {
      throw new Error('Pot not found');
    }

    if (pot.user_id !== userId) {
      throw new UnauthorizedException('You do not have access to this pot');
    }

    if (!pot.device_id) {
      throw new Error('This pot does not have a connected device');
    }

    const latestReadings = await this.potsRepository.getLatestReadingsForPot(potId);
    const deviceStatus = await this.potsRepository.getDeviceStatusForPot(potId);
    return {
      potId,
      temperature: latestReadings?.temperature || 0,
      humidity: latestReadings?.humidity || 0,
      light_on: deviceStatus?.light_on || false,
      watering_on: deviceStatus?.watering_on || false,
    };
  }
}
