import { Expose, Type } from 'class-transformer';

class PotDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  image_url: string;
}

export class DeviceWithPotResponseDto {
  @Expose()
  id: string;

  @Expose()
  status: string;

  @Expose()
  identifier: string;

  @Expose()
  registered_at: Date;

  @Expose()
  linked_at: Date | null;

  @Expose()
  @Type(() => PotDto)
  pot: PotDto | null;
}