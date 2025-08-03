import { Expose } from 'class-transformer';

export class ModuleResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  is_active: boolean;
}

export class ModuleDetailResponseDto extends ModuleResponseDto {
  @Expose()
  created_date: Date;
}

export class IdResponseDto {
  id: string;
}