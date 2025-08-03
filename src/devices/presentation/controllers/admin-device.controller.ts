import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { CreateDeviceDto } from '../../application/dtos/create-device.dto';
import { UpdateDeviceDto } from '../../application/dtos/update-device.dto';
import { CreateDeviceResponseDto } from '../../application/dtos/create-device.response.dto';
import { CreateDeviceUseCase } from '../../application/use-cases/create-device.use-case';
import { UpdateDeviceUseCase } from '../../application/use-cases/update-device.use-case';
import { GetDevicesUseCase } from '../../application/use-cases/get-devices.use-case';
import { GetDeviceByIdUseCase } from '../../application/use-cases/get-device-by-id.use-case';
import { RegenerateLinkingKeyUseCase } from '../../application/use-cases/regenerate-linking-key.use-case';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';
import { ModulePermissionGuard, RequirePermission } from '../../../shared/infrastructure/guards/module-permission.guard';
import { PermissionAction } from '@prisma/client';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';

@Controller('admin/devices')
@UseGuards(JwtAuthGuard, ModulePermissionGuard)
export class AdminDeviceController {
  constructor(
    private readonly createDeviceUseCase: CreateDeviceUseCase,
    private readonly updateDeviceUseCase: UpdateDeviceUseCase,
    private readonly getDevicesUseCase: GetDevicesUseCase,
    private readonly getDeviceByIdUseCase: GetDeviceByIdUseCase,
    private readonly regenerateLinkingKeyUseCase: RegenerateLinkingKeyUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('devices', PermissionAction.CREATE)
  async createDevice(
    @Body() dto: CreateDeviceDto
  ): Promise<CreateDeviceResponseDto> {
    return this.createDeviceUseCase.execute(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermission('devices', PermissionAction.UPDATE)
  async updateDevice(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDeviceDto
  ): Promise<CreateDeviceResponseDto> {
    return this.updateDeviceUseCase.execute(id, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermission('devices', PermissionAction.READ)
  async getAllDevices(
    @Query() filter: PaginationFilterDto
  ) {
    return this.getDevicesUseCase.execute(filter);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermission('devices', PermissionAction.READ)
  async getDeviceById(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.getDeviceByIdUseCase.execute(id);
  }

  @Put(':id/regenerate-key')
  @HttpCode(HttpStatus.OK)
  @RequirePermission('devices', PermissionAction.UPDATE)
  async regenerateLinkingKey(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<CreateDeviceResponseDto> {
    return this.regenerateLinkingKeyUseCase.execute(id);
  }
}