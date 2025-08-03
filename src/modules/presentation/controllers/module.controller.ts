import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe
} from '@nestjs/common';
import { CreateModuleUseCase } from '../../application/use-cases/create-module.use-case';
import { GetAllModulesUseCase } from '../../application/use-cases/get-all-modules.use-case';
import { UpdateModuleUseCase } from '../../application/use-cases/update-module.use-case';
import { DeleteModuleUseCase } from '../../application/use-cases/delete-module.use-case';
import { CreateModuleDto } from '../../application/dtos/create-module.dto';
import { UpdateModuleDto } from '../../application/dtos/update-module.dto';
import { ModuleResponseDto, IdResponseDto } from '../../application/dtos/module-response.dto';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../../../shared/infrastructure/guards/super-admin.guard';
import { PaginationFilterDto, PaginatedResponseDto } from '../../../shared/application/dtos/pagination.dto';
import { GetModuleByIdUseCase} from '../../application/use-cases/get-module-by-id.use-case';
import { ModuleDetailResponseDto } from '../../application/dtos/module-response.dto';

@Controller('modules')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class ModuleController {
  constructor(
    private readonly createModuleUseCase: CreateModuleUseCase,
    private readonly getModulesUseCase: GetAllModulesUseCase,
    private readonly updateModuleUseCase: UpdateModuleUseCase,
    private readonly deleteModuleUseCase: DeleteModuleUseCase,
    private readonly GetModuleByIdUseCase: GetModuleByIdUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createModuleDto: CreateModuleDto
  ): Promise<IdResponseDto> {
    return this.createModuleUseCase.execute(createModuleDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query(new ValidationPipe({
      transform: true,
      whitelist: true
    })) filter: PaginationFilterDto,
    @Query('include_inactive') includeInactive: boolean = true
  ): Promise<PaginatedResponseDto<ModuleResponseDto>> {
    return this.getModulesUseCase.execute(filter, includeInactive);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    ) id: string,
  ): Promise<ModuleDetailResponseDto> {
    return this.GetModuleByIdUseCase.execute(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseUUIDPipe({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      version: '4'
    })) id: string,
    @Body(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })) updateModuleDto: UpdateModuleDto
  ): Promise<IdResponseDto> {
    return this.updateModuleUseCase.execute(id, updateModuleDto);
  }


  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', new ParseUUIDPipe({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      version: '4'
    })) id: string
  ): Promise<void> {
    await this.deleteModuleUseCase.execute(id);
  }
}