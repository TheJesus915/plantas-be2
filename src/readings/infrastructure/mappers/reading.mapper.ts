import { Reading } from '../../domain/entities/reading.entity';
import { CreateReadingDto } from '../../application/dtos/create-reading.dto';
import { ReadingResponseDto } from '../../application/dtos/reading-response.dto';

export class ReadingMapper {
  static toEntity(dto: CreateReadingDto, potId: string, deviceId: string | null): Reading {
    return new Reading(
      crypto.randomUUID(),
      potId,
      deviceId,
      dto.temperature ?? 0,
      dto.humidity ?? 0,
      new Date(),
    );
  }

  static toResponseDto(reading: Reading): ReadingResponseDto {
    return { id: reading.id };
  }
}