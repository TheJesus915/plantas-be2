import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Injectable } from '@nestjs/common';
import { CreateReadingDto } from '../../application/dtos/create-reading.dto';
import { CreateReadingUseCase } from '../../application/use-cases/create-reading.use-case';
import { ReadingRepository } from '../../domain/interfaces/reading-repository.interface';
import { validate } from 'class-validator';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' }, namespace: 'readings' })
export class ReadingGateway {
  @WebSocketServer() server: Server;
  private deviceConnections: Map<string, Socket> = new Map();

  constructor(
    private readonly createReadingUseCase: CreateReadingUseCase,
    @Inject('ReadingRepository') private readonly readingRepository: ReadingRepository,
  ) {}

  async handleConnection(client: Socket) {
    client.emit('auth_success', { message: 'Connected successfully' });
  }

  handleDisconnect(client: Socket) {
    for (const [deviceId, socket] of this.deviceConnections.entries()) {
      if (socket.id === client.id) {
        this.deviceConnections.delete(deviceId);
        break;
      }
    }
  }

  @SubscribeMessage('reading')
  async handleReading(
    @MessageBody() data: CreateReadingDto,
    @ConnectedSocket() client: Socket,
  ) {
    const readingDto = new CreateReadingDto();
    readingDto.temperature = data.temperature;
    readingDto.humidity = data.humidity;
    readingDto.deviceId = data.deviceId;

    const errors = await validate(readingDto);
    if (errors.length > 0) {
      client.emit('error', { message: 'Invalid reading data' });
      return;
    }

    try {
      const response = await this.createReadingUseCase.execute(readingDto);
      client.emit('reading_response', response);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  notifyDevice(deviceId: string, settings: { light_on: boolean; watering_on: boolean }) {
    const client = this.deviceConnections.get(deviceId);
    if (client) {
      client.emit('settings_update', settings);
    }
  }
}