import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GetPotReadingsUseCase } from '../../application/use-cases/pot-readings/get-pot-readings.use-case';
import { SubscribePotReadingsDto, PotReadingsResponseDto } from '../../application/dtos/pot-readings/pot-readings.dto';
import { validate } from 'class-validator';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' }, namespace: 'pot-readings' })
export class PotReadingsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private userConnections: Map<string, Set<string>> = new Map();
  private potSubscriptions: Map<string, Set<string>> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly getPotReadingsUseCase: GetPotReadingsUseCase
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('No authentication token provided');
      }
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      if (!userId) {
        throw new UnauthorizedException('Invalid authentication token');
      }
      if (!this.userConnections.has(userId)) {
        this.userConnections.set(userId, new Set());
      }
      this.userConnections.get(userId)?.add(client.id);
      client.emit('connection_success', { message: 'Successfully connected' });
    } catch (error) {
      client.emit('error', { message: 'Authentication failed', error: error.message });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userConnections.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userConnections.delete(userId);
        }
        break;
      }
    }
    for (const [potId, sockets] of this.potSubscriptions.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.potSubscriptions.delete(potId);
        }
      }
    }
  }

  @SubscribeMessage('subscribe_pot')
  async handleSubscribePot(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SubscribePotReadingsDto
  ) {
    try {
      const subscribePotDto = new SubscribePotReadingsDto();
      subscribePotDto.potId = data.potId;

      const errors = await validate(subscribePotDto);
      if (errors.length > 0) {
        throw new Error('Invalid pot subscription data');
      }

      const userId = this.getUserIdFromClient(client);
      if (!userId) {
        throw new UnauthorizedException('Not authenticated');
      }

      try {
        const potReadings = await this.getPotReadingsUseCase.execute(userId, data.potId);

        if (!this.potSubscriptions.has(data.potId)) {
          this.potSubscriptions.set(data.potId, new Set());
        }
        this.potSubscriptions.get(data.potId)?.add(client.id);

        client.emit('pot_data', potReadings);
        client.emit('subscription_success', { message: `Subscribed to pot ${data.potId}` });
      } catch (error) {
        client.emit('error', { message: error.message });
      }
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('unsubscribe_pot')
  handleUnsubscribePot(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { potId: string }
  ) {
    const potSubscribers = this.potSubscriptions.get(data.potId);
    if (potSubscribers) {
      potSubscribers.delete(client.id);
      if (potSubscribers.size === 0) {
        this.potSubscriptions.delete(data.potId);
      }
    }
    client.emit('unsubscription_success', { message: `Unsubscribed from pot ${data.potId}` });
  }

  broadcastPotUpdate(potId: string, data: PotReadingsResponseDto) {
    const subscribers = this.potSubscriptions.get(potId);
    if (subscribers) {
      const updateData = {
        ...data
      };

      for (const socketId of subscribers) {
        this.server.to(socketId).emit('pot_data', updateData);
      }
    }
  }

  getActivePots(): string[] {
    return Array.from(this.potSubscriptions.keys());
  }

  getUserIdForPot(potId: string): string | null {
    const subscribers = this.potSubscriptions.get(potId);
    if (!subscribers || subscribers.size === 0) {
      return null;
    }

    const firstSocketId = subscribers.values().next().value;

    for (const [userId, sockets] of this.userConnections.entries()) {
      if (sockets.has(firstSocketId)) {
        return userId;
      }
    }

    return null;
  }

  cleanupOrphanedConnections() {
    for (const [userId, sockets] of this.userConnections.entries()) {
      if (sockets.size === 0) {
        this.userConnections.delete(userId);
      }
    }
    for (const [potId, sockets] of this.potSubscriptions.entries()) {
      if (sockets.size === 0) {
        this.potSubscriptions.delete(potId);
      }
    }
  }

  private getUserIdFromClient(client: Socket): string | null {
    for (const [userId, sockets] of this.userConnections.entries()) {
      if (sockets.has(client.id)) {
        return userId;
      }
    }
    return null;
  }
}