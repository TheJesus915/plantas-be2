import { Controller, Get, Query, Param, Put, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GetAllGeneralUsersUseCase } from '../../application/use-cases/get-all-general-users.use-case';
import { GetGeneralUserByIdUseCase } from '../../application/use-cases/get-general-user-by-id.use-case';
import { UpdateStatusAccountUseCase } from '../../application/use-cases/update-status-account.use-case';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';
import { UpdateStatusAccountDto } from '../../application/dtos/update-status-account.dto';

@Controller('users-general-management')
export class UserGeneralController {
  constructor(
    private readonly getAllGeneralUsersUseCase: GetAllGeneralUsersUseCase,
    private readonly getGeneralUserByIdUseCase: GetGeneralUserByIdUseCase,
    private readonly updateStatusAccountUseCase: UpdateStatusAccountUseCase,
  ) {}

  @Get()
  async getAll(@Query() query: PaginationFilterDto) {
    return await this.getAllGeneralUsersUseCase.execute(query);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.getGeneralUserByIdUseCase.execute(id);
  }

  @Put(':id/status-account')
  @HttpCode(HttpStatus.OK)
  async updateStatusAccount(@Param('id') id: string, @Body() dto: UpdateStatusAccountDto) {
    return await this.updateStatusAccountUseCase.execute(id, dto);
  }
}
