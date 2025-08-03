import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { randomBytes } from 'crypto';
import { ILinkingKeyService } from '../../domain/interfaces/linking-key-service.interface';

@Injectable()
export class LinkingKeyService implements ILinkingKeyService {
  constructor(private readonly prisma: PrismaService) {}

  private generate(): string {
    return randomBytes(3).toString('hex').toUpperCase();
  }

  async ensureUnique(): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;
    let linking_key = this.generate();

    while (attempts < maxAttempts) {
      const existingDevice = await this.prisma.device.findFirst({
        where: { linking_key }
      });

      if (!existingDevice) {
        return linking_key;
      }

      linking_key = this.generate();
      attempts++;
    }

    throw new Error('Could not generate a unique linking key');
  }
}