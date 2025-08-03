import { Inject, Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { IDeviceRepository } from '../../domain/interfaces/device-repository.interface';
import { IPotsRepository } from '../../../user-garden/domain/interfaces/pots-repository.interface';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';
import { GetMyDevicesResponseDto } from '../dtos/get-my-devices.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetMyDevicesUseCase {
  constructor(
    @Inject('IDeviceRepository')
    private readonly deviceRepository: IDeviceRepository,
    @Inject('IPotsRepository')
    private readonly potsRepository: IPotsRepository
  ) {}

  async execute(userId: string, filter: PaginationFilterDto): Promise<GetMyDevicesResponseDto> {
    try {
      if (!userId || userId.trim() === '') {
        throw new BadRequestException('User ID is required');
      }

      const potsWithDevices = await this.potsRepository.findByUserWithDevices(userId, filter);

      if (!potsWithDevices.data.length) {
        return plainToInstance(GetMyDevicesResponseDto, {
          data: [],
          meta: potsWithDevices.meta
        }, { excludeExtraneousValues: true });
      }

      const deviceIds = potsWithDevices.data
        .map(pot => pot.device_id)
        .filter((id): id is string => id !== null);

      const devices = await this.deviceRepository.findByIds(deviceIds);

      const devicesWithPots = devices.map(device => ({
        ...device,
        pot: this.findAssociatedPot(device.id, potsWithDevices.data)
      }));

      return plainToInstance(GetMyDevicesResponseDto, {
        data: devicesWithPots,
        meta: potsWithDevices.meta
      }, { excludeExtraneousValues: true });
    } catch (error) {

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while retrieving your devices');
    }
  }

  private findAssociatedPot(deviceId: string, pots: any[]) {
    const pot = pots.find(p => p.device_id === deviceId);
    if (!pot) return null;

    return {
      id: pot.id,
      name: pot.name,
      image_url: pot.image_url
    };
  }
}