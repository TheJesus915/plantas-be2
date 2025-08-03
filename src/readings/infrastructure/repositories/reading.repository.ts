import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { Reading } from '../../domain/entities/reading.entity';
import { ReadingRepository } from '../../domain/interfaces/reading-repository.interface';

@Injectable()
export class ReadingRepositoryImpl implements ReadingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveReading(reading: Reading): Promise<Reading> {
    const saved = await this.prisma.readings.create({
      data: {
        id: reading.id,
        ...(reading.potId ? { pot_id: reading.potId } : {}),
        device_id: reading.deviceId ?? '',
        temperature: reading.temperature,
        humidity: reading.humidity,
        created_at: reading.createdAt,
      },
    });
    return new Reading(saved.id, saved.pot_id ?? '', saved.device_id, saved.temperature, saved.humidity, saved.created_at);
  }

  async findPotById(potId: string): Promise<{
    id: string;
    name: string;
    device: { id: string; linking_key: string } | null;
    plant: { name: string; image_url?: string | null; mintemp?: number | null | undefined; maxtemp?: number | null | undefined; minhum?: number | null | undefined; maxhum?: number | null | undefined };
    user: { id: string };
    area: { name: string };
  } | null> {
    const pot = await this.prisma.pot.findUnique({
      where: { id: potId },
      include: {
        device: true,
        plant: {
          include: {
            plantimages: true,
          },
        },
        user: true,
        area: true,
      },
    });
    if (!pot) return null;
    let image_url: string | null = null;
    if (pot.plant && pot.plant.plantimages && pot.plant.plantimages.length > 0) {
      image_url = pot.plant.plantimages[0].image_url;
    }
    return {
      id: pot.id,
      name: pot.name,
      device: pot.device ? { id: pot.device.id, linking_key: pot.device.linking_key } : null,
      plant: {
        name: pot.plant?.name,
        image_url,
        mintemp: pot.plant?.mintemp,
        maxtemp: pot.plant?.maxtemp,
        minhum: pot.plant?.minhum,
        maxhum: pot.plant?.maxhum,
      },
      user: { id: pot.user.id },
      area: { name: pot.area.name },
    };
  }

  async findDeviceSettingsById(deviceId: string): Promise<{ light_on: boolean; watering_on: boolean } | null> {
    const device = await this.prisma.device.findUnique({
      where: { id: deviceId },
      select: { light_on: true, watering_on: true },
    });
    if (!device) return null;
    return { light_on: device.light_on, watering_on: device.watering_on };
  }

  async findPotByDeviceId(deviceId: string): Promise<{ id: string; device?: { id: string } | null }> {
    const pot = await this.prisma.pot.findUnique({
      where: { device_id: deviceId },
      select: { id: true, device: { select: { id: true } } },
    });
    return pot ? { id: pot.id, device: pot.device } : { id: '', device: undefined };
  }
}