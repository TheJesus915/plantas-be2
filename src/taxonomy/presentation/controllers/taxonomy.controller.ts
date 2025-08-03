import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateTaxonomicNodeDto } from '../../application/dtos/create-taxonomic-node.dto';
import { GetTaxonomicNodesQueryDto } from '../../application/dtos/get-taxonomic-nodes-query.dto';
import { UpdateTaxonomicNodeDto } from '../../application/dtos/update-taxonomic-node.dto';
import { CreateTaxonomicNodeUseCase } from '../../application/use-cases/create-taxonomic-node.use-case';
import { DeleteTaxonomicNodeUseCase } from '../../application/use-cases/delete-taxonomic-node.use-case';
import { GetTaxonomicAncestryUseCase } from '../../application/use-cases/get-taxonomic-ancestry.use-case';
import { GetTaxonomicNodesUseCase } from '../../application/use-cases/get-taxonomic-nodes.use-case';
import { UpdateTaxonomicNodeUseCase } from '../../application/use-cases/update-taxonomic-node.use-case';
import { TaxonomicNode } from '../../domain/entities/taxonomic-node.entity';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';
import { ModulePermissionGuard, RequirePermission } from '../../../shared/infrastructure/guards/module-permission.guard';
import { PermissionAction } from '@prisma/client';

@Controller('taxonomy')
@UseGuards(JwtAuthGuard, ModulePermissionGuard)
export class TaxonomyController {
  constructor(
    private readonly createTaxonomicNodeUseCase: CreateTaxonomicNodeUseCase,
    private readonly getTaxonomicNodesUseCase: GetTaxonomicNodesUseCase,
    private readonly updateTaxonomicNodeUseCase: UpdateTaxonomicNodeUseCase,
    private readonly deleteTaxonomicNodeUseCase: DeleteTaxonomicNodeUseCase,
    private readonly getTaxonomicAncestryUseCase: GetTaxonomicAncestryUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('plants', PermissionAction.CREATE)
  async createTaxonomicNode(@Body() dto: CreateTaxonomicNodeDto): Promise<{ id: string }> {
    return await this.createTaxonomicNodeUseCase.execute(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermission('plants', PermissionAction.READ)
  async getTaxonomicNodes(@Query() query: GetTaxonomicNodesQueryDto): Promise<TaxonomicNode[]> {
    return await this.getTaxonomicNodesUseCase.execute(query);
  }

  @Get(':id/ancestry')
  @HttpCode(HttpStatus.OK)
  @RequirePermission('plants', PermissionAction.READ)
  async getTaxonomicAncestry(@Param('id') id: string): Promise<TaxonomicNode[]> {
    return await this.getTaxonomicAncestryUseCase.execute(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermission('plants', PermissionAction.UPDATE)
  async updateTaxonomicNode(
    @Param('id') id: string,
    @Body() dto: UpdateTaxonomicNodeDto,
  ): Promise<{ id: string }> {
    return await this.updateTaxonomicNodeUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('plants', PermissionAction.DELETE)
  async deleteTaxonomicNode(@Param('id') id: string): Promise<void> {
    await this.deleteTaxonomicNodeUseCase.execute(id);
  }
}
