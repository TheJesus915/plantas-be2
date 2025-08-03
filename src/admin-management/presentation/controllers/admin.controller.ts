import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  Get,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe
} from '@nestjs/common';
import { CreateAdminUserDto } from '../../application/dtos/create-admin-user.dto';
import { UpdateAdminProfileDto } from '../../application/dtos/update-admin-profile.dto';
import { CreateAdminUserUseCase } from '../../application/use-cases/create-admin-user.use-case';
import { UpdateAdminProfileUseCase } from '../../application/use-cases/update-admin-profile.use-case';
import { GetAllAdminsUseCase } from '../../application/use-cases/get-all-admins.use-case';
import { GetAdminByIdUseCase } from '../../application/use-cases/get-admin-by-id.use-case';
import { AdminListResponseDto } from '../../application/dtos/admin-list-response.dto';
import { AdminDetailResponseDto } from '../../application/dtos/admin-detail-response.dto';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../../../shared/infrastructure/guards/super-admin.guard';
import { GetAllAdminsFilterDto } from '../../application/dtos/get-all-admins-filter.dto';

interface AdminIdResponse {
  id: string;
}

@Controller('admin-management/users')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class AdminController {
  constructor(
    private readonly createAdminUserUseCase: CreateAdminUserUseCase,
    private readonly updateAdminProfileUseCase: UpdateAdminProfileUseCase,
    private readonly getAllAdminsUseCase: GetAllAdminsUseCase,
    private readonly getAdminByIdUseCase: GetAdminByIdUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(
    @Body() createAdminDto: CreateAdminUserDto
  ): Promise<AdminIdResponse> {
    const result = await this.createAdminUserUseCase.execute(createAdminDto);
    return { id: result.id };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateAdminProfile(
    @Param('id', new ParseUUIDPipe({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      version: '4'
    })) id: string,
    @Body() updateDto: UpdateAdminProfileDto
  ): Promise<AdminIdResponse> {
    const result = await this.updateAdminProfileUseCase.execute(id, updateDto);
    return { id: result.id };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllAdmins(
    @Query() filter: GetAllAdminsFilterDto
  ): Promise<AdminListResponseDto> {
    return this.getAllAdminsUseCase.execute(filter);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getAdminById(
    @Param('id', new ParseUUIDPipe({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      version: '4'
    })) id: string
  ): Promise<AdminDetailResponseDto> {
    return this.getAdminByIdUseCase.execute(id);
  }
}