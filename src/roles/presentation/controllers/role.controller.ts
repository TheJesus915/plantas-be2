import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpStatus,
  UseGuards,
  HttpCode
} from '@nestjs/common';
import { CreateRoleDto } from '../../application/dtos/create-role.dto';
import { UpdateRoleDto } from '../../application/dtos/update-role.dto';
import { CreateRoleUseCase } from '../../application/use-cases/create-role.use-case';
import { UpdateRoleUseCase } from '../../application/use-cases/update-role.use-case';
import { DeleteRoleUseCase } from '../../application/use-cases/delete-role.use-case';
import { GetRolesUseCase } from '../../application/use-cases/get-roles.use-case';
import { GetRoleByIdUseCase } from '../../application/use-cases/get-role-by-id.use-case';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../../../shared/infrastructure/guards/super-admin.guard';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';

@Controller('roles')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    private readonly getRolesUseCase: GetRolesUseCase,
    private readonly getRoleByIdUseCase: GetRoleByIdUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.createRoleUseCase.execute(createRoleDto);
  }

  @Get()
  async getRoles(
    @Query() filter: PaginationFilterDto,
    @Query('include_inactive') includeInactive: string = 'true'
  ) {
    const includeInactiveFlag = includeInactive === 'true';
    return await this.getRolesUseCase.execute(filter, includeInactiveFlag);
  }

  @Get(':id')
  async getRoleById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.getRoleByIdUseCase.execute(id);
  }

  @Put(':id')
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    return await this.updateRoleUseCase.execute(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteRoleUseCase.execute(id);
  }
}