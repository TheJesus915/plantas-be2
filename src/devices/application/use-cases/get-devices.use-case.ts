import { Injectable, Inject } from '@nestjs/common';
import { IDeviceRepository } from '../../domain/interfaces/device-repository.interface';
import { PaginationFilterDto, PaginatedResponseDto } from '../../../shared/application/dtos/pagination.dto';
import { DeviceResponseDto } from '../dtos/device.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetDevicesUseCase {
  constructor(
    @Inject('IDeviceRepository')
    private readonly deviceRepository: IDeviceRepository
  ) {}

  async execute(filter: PaginationFilterDto): Promise<PaginatedResponseDto<DeviceResponseDto>> {
    const result = await this.deviceRepository.findAll(filter);

    return {
      data: plainToInstance(DeviceResponseDto, result.data, {
        excludeExtraneousValues: true
      }),
      meta: result.meta
    };
  }
}