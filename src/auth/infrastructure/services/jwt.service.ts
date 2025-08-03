import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { IJwtService } from '../../domain/interfaces/jwt-service.interface';
import { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';

@Injectable()
export class JwtService implements IJwtService {
    constructor(private readonly jwtService: NestJwtService) {}

    async sign(payload: JwtPayload): Promise<string> {
        return this.jwtService.sign(payload, {
            noTimestamp: true
        });
    }

    async verify(token: string): Promise<JwtPayload> {
        return this.jwtService.verify<JwtPayload>(token);
    }
}