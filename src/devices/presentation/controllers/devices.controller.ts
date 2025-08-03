import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Req
} from '@nestjs/common';
import { LinkDeviceUseCase } from '../../application/use-cases/link-device.use-case';
import { UnlinkDeviceUseCase } from '../../application/use-cases/unlink-device.use-case';
import { GetMyDevicesUseCase } from '../../application/use-cases/get-my-devices.use-case';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';
import { LinkDeviceDto } from '../../application/dtos/link-device.dto';
import { UnlinkDeviceDto } from '../../application/dtos/unlink-device.dto';
import { CreateDeviceResponseDto } from '../../application/dtos/create-device.response.dto';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    name: string;
    type: string;
    email: string;
    status: string;
    iat?: number;
    exp?: number;
  }
}
@Controller('devices')
@UseGuards(JwtAuthGuard)
export class DevicesController {
  constructor(
    private readonly linkDeviceUseCase: LinkDeviceUseCase,
    private readonly unlinkDeviceUseCase: UnlinkDeviceUseCase,
    private readonly getMyDevicesUseCase: GetMyDevicesUseCase
  ) {}

  @Post('link')
  @HttpCode(HttpStatus.OK)
  async linkDevice(
    @Req() request: RequestWithUser,
    @Body() dto: LinkDeviceDto
  ): Promise<CreateDeviceResponseDto> {
    return this.linkDeviceUseCase.execute(request.user.sub, dto);
  }

  @Post('unlink')
  @HttpCode(HttpStatus.OK)
  async unlinkDevice(
    @Req() request: RequestWithUser,
    @Body() dto: UnlinkDeviceDto
  ): Promise<CreateDeviceResponseDto> {
    return this.unlinkDeviceUseCase.execute(request.user.sub, dto);
  }

  @Get('my')
  @HttpCode(HttpStatus.OK)
  async getMyDevices(
    @Req() request: RequestWithUser,
    @Query() filter: PaginationFilterDto
  ) {
    return this.getMyDevicesUseCase.execute(request.user.sub, filter);
  }
}