import { Expose, Type } from 'class-transformer';
import { DeviceWithPotResponseDto } from './device-with-pot.response.dto';

class MetaDto {
  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  totalItems: number;

  @Expose()
  totalPages: number;
}

export class GetMyDevicesResponseDto {
  @Expose()
  @Type(() => DeviceWithPotResponseDto)
  data: DeviceWithPotResponseDto[];

  @Expose()
  @Type(() => MetaDto)
  meta: MetaDto;
}