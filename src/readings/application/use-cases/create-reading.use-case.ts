import { Inject, Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { CreateReadingDto } from '../dtos/create-reading.dto';
import { ReadingResponseDto } from '../dtos/reading-response.dto';
import { ReadingRepository } from '../../domain/interfaces/reading-repository.interface';
import { NotificationService } from '../../domain/interfaces/notification-service.interface';
import { ReadingMapper } from '../../infrastructure/mappers/reading.mapper';

@Injectable()
export class CreateReadingUseCase {
  private readonly notificationCooldown = new Map<string, Date>();
  private readonly COOLDOWN_MS = 5 * 60 * 1000;

  constructor(
    @Inject('ReadingRepository') private readonly readingRepository: ReadingRepository,
    @Inject('INotificationService') private readonly notificationService: NotificationService,
  ) {}

  async execute(dto: CreateReadingDto): Promise<ReadingResponseDto> {
    const pot = await this.readingRepository.findPotByDeviceId(dto.deviceId);
    let potId: string | undefined = undefined;
    let potData: Awaited<ReturnType<typeof this.readingRepository.findPotById>> | null = null;
    if (pot) {
      potId = pot.id;
      potData = await this.readingRepository.findPotById(pot.id);
    }

    if (!dto.temperature && !dto.humidity) {
      throw new ConflictException('At least one metric (temperature or humidity) is required');
    }

    let potName = potData?.name;
    let deviceId = dto.deviceId;
    let plant = potData?.plant;
    let userId = potData?.user?.id;
    let area = potData?.area;

    const reading = ReadingMapper.toEntity(dto, potId ?? '', deviceId);
    const savedReading = await this.readingRepository.saveReading(reading);

    const notifications: Array<{ texto: string; tipo: string; icono: string; key: string; title: string; body: string }> = [];
    if (plant && dto.temperature && (plant.mintemp || plant.maxtemp)) {
      if (plant.mintemp && dto.temperature < plant.mintemp) {
        notifications.push({
          texto: 'Temperatura baja',
          tipo: 'alerta',
          icono: 'temperature',
          key: `${potId}_temperature_too_low`,
          title: `La maceta ${potName ?? potId} tiene temperatura baja`,
          body: 'Ajusta el ambiente para aumentar la temperatura',
        });
      } else if (plant.maxtemp && dto.temperature > plant.maxtemp) {
        notifications.push({
          texto: 'Temperatura alta',
          tipo: 'alerta',
          icono: 'temperature',
          key: `${potId}_temperature_too_high`,
          title: `La maceta ${potName ?? potId} tiene temperatura alta`,
          body: 'Ajusta el ambiente para disminuir la temperatura',
        });
      }
    }
    if (plant && dto.humidity && (plant.minhum || plant.maxhum)) {
      if (plant.minhum && dto.humidity < plant.minhum) {
        notifications.push({
          texto: 'Humedad baja',
          tipo: 'alerta',
          icono: 'humidity',
          key: `${potId}_humidity_too_low`,
          title: `La maceta ${potName ?? potId} tiene poca humedad`,
          body: 'Riega la maceta ahora',
        });
      } else if (plant.maxhum && dto.humidity > plant.maxhum) {
        notifications.push({
          texto: 'Humedad alta',
          tipo: 'alerta',
          icono: 'humidity',
          key: `${potId}_humidity_too_high`,
          title: `La maceta ${potName ?? potId} tiene mucha humedad`,
          body: 'Reduce el riego',
        });
      }
    }

    if (notifications.length > 0 && userId) {
      const now = new Date();
      const filteredNotifications = notifications.filter(notification => {
        const lastSent = this.notificationCooldown.get(notification.key);
        if (!lastSent || now.getTime() - lastSent.getTime() >= this.COOLDOWN_MS) {
          this.notificationCooldown.set(notification.key, now);
          return true;
        }
        return false;
      });

      if (filteredNotifications.length > 0) {
        const primaryNotification = filteredNotifications[0];
        await this.notificationService.sendToUser(
          userId,
          primaryNotification.title,
          primaryNotification.body,
          {
            macetas: [
              {
                nombre: plant?.name,
                id: potId,
                area: area?.name,
                maceta: potName,
                imagenUrl: plant?.image_url || 'https://ejemplo.com/default.png',
                estados: filteredNotifications.map(n => ({
                  texto: n.texto,
                  tipo: n.tipo,
                  icono: n.icono,
                })),
                acciones: [
                  { texto: 'Ver detalles', tipo: 'ver_detalles', color: 'primary' },
                ],
              },
            ],
          },
        );
      }
    }

    return ReadingMapper.toResponseDto(savedReading);
  }
}