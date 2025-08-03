import { JwtPayload } from './jwt-payload.interface';

export interface IJwtService {
    sign(payload: JwtPayload): Promise<string>;
    verify(token: string): Promise<JwtPayload>;
}