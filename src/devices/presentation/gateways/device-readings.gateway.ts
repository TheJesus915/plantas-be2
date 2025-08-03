import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GetDeviceReadingsUseCase } from '../../application/use-cases/get-device-readings.use-case';
import { SubscribeDeviceReadingsDto, DeviceReadingsResponseDto } from '../../application/dtos/device-readings.dto';
import { validate } from 'class-validator';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { PermissionAction } from '@prisma/client';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' }, namespace: 'device-readings' })
export class DeviceReadingsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private userConnections: Map<string, Set<string>> = new Map();
  private deviceSubscriptions: Map<string, Set<string>> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly getDeviceReadingsUseCase: GetDeviceReadingsUseCase,
    private readonly prismaService: PrismaService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token ||
                   (client.handshake.headers.authorization &&
                    client.handshake.headers.authorization.split(' ')[1]);

      if (!token) {
        throw new UnauthorizedException('No authentication token provided');
      }
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      if (!userId) {
        throw new UnauthorizedException('Invalid authentication token');
      }

      const hasPermission = await this.checkPermission(userId, 'devices', PermissionAction.READ);
      if (!hasPermission) {
        throw new UnauthorizedException('You do not have permission to access this resource');
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
    for (const [deviceId, sockets] of this.deviceSubscriptions.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.deviceSubscriptions.delete(deviceId);
        }
      }
    }
  }

  @SubscribeMessage('subscribe_device')
  async handleSubscribeDevice(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SubscribeDeviceReadingsDto
  ) {
    try {
      const userId = this.getUserIdFromClient(client);
      if (!userId) {
        throw new WsException('Not authenticated');
      }

      const hasPermission = await this.checkPermission(userId, 'devices', PermissionAction.READ);
      if (!hasPermission) {
        throw new WsException('You do not have permission to access this device data');
      }

      const subscribeDeviceDto = new SubscribeDeviceReadingsDto();
      subscribeDeviceDto.deviceId = data.deviceId;

      const errors = await validate(subscribeDeviceDto);
      if (errors.length > 0) {
        throw new WsException('Invalid device subscription data');
      }

      try {
        const deviceReadings = await this.getDeviceReadingsUseCase.execute(userId, data.deviceId);

        if (!this.deviceSubscriptions.has(data.deviceId)) {
          this.deviceSubscriptions.set(data.deviceId, new Set());
        }
        this.deviceSubscriptions.get(data.deviceId)?.add(client.id);

        client.emit('device_data', deviceReadings);
        client.emit('subscription_success', { message: `Subscribed to device ${data.deviceId}` });
      } catch (error) {
        client.emit('error', { message: error.message });
      }
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('unsubscribe_device')
  handleUnsubscribeDevice(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { deviceId: string }
  ) {
    const deviceSubscribers = this.deviceSubscriptions.get(data.deviceId);
    if (deviceSubscribers) {
      deviceSubscribers.delete(client.id);
      if (deviceSubscribers.size === 0) {
        this.deviceSubscriptions.delete(data.deviceId);
      }
    }
    client.emit('unsubscription_success', { message: `Unsubscribed from device ${data.deviceId}` });
  }

  broadcastDeviceUpdate(deviceId: string, data: DeviceReadingsResponseDto) {
    const subscribers = this.deviceSubscriptions.get(deviceId);
    if (subscribers) {
      const updateData = {
        ...data
      };

      for (const socketId of subscribers) {
        this.server.to(socketId).emit('device_data', updateData);
      }
    }
  }

  getActiveDevices(): string[] {
    return Array.from(this.deviceSubscriptions.keys());
  }

  getUserIdForDevice(deviceId: string): string | null {
    const subscribers = this.deviceSubscriptions.get(deviceId);
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
    for (const [deviceId, sockets] of this.deviceSubscriptions.entries()) {
      if (sockets.size === 0) {
        this.deviceSubscriptions.delete(deviceId);
      }
    }
  }

  private async checkPermission(userId: string, moduleName: string, action: PermissionAction): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId }
    });

    if (user?.type === 'superadmin') {
      return true;
    }

    const userRoles = await this.prismaService.userRole.findMany({
      where: { user_id: userId },
      include: { role: true },
    });

    for (const userRole of userRoles) {
      const hasPermission = await this.prismaService.modulePermission.findFirst({
        where: {
          role_id: userRole.role_id,
          module: { name: moduleName },
          permission: action,
        },
        include: { module: true },
      });

      if (hasPermission) {
        return true;
      }
    }

    return false;
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