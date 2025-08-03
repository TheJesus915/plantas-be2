import { Expose } from 'class-transformer';

export class CreateDeviceResponseDto {
  @Expose()
  id: string;
}