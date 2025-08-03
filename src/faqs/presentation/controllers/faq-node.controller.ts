import { Controller, Post, Body, HttpCode, HttpStatus, Put, Param, Delete, Get, Query, UseGuards, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CreateFaqNodeUseCase } from '../../application/use-cases/create-faq-node.use-case';
import { UpdateFaqNodeUseCase } from '../../application/use-cases/update-faq-node.use-case';
import { DeleteFaqNodeUseCase } from '../../application/use-cases/delete-faq-node.use-case';
import { GetFaqNodesUseCase } from '../../application/use-cases/get-faq-nodes.use-case';
import { CreateFaqNodeDto } from '../../application/dtos/create-faq-node.dto';
import { UpdateFaqNodeDto } from '../../application/dtos/update-faq-node.dto';
import { GetFaqNodesQueryDto } from '../../application/dtos/get-faq-nodes-query.dto';
import { PaginatedResponseDto } from '../../../shared/application/dtos/pagination.dto';
import { FaqNode } from '../../domain/entities/faq-node.entity';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';
import { ModulePermissionGuard, RequirePermission } from '../../../shared/infrastructure/guards/module-permission.guard';
import { PermissionAction } from '@prisma/client';
import { UploadFaqImageUseCase } from '../../application/use-cases/upload-faq-image.usecase';
import { DeleteFaqImageUseCase } from '../../application/use-cases/delete-faq-image.usecase';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('faqs')
@UseGuards(JwtAuthGuard, ModulePermissionGuard)
export class FaqNodeController {
  constructor(
    private readonly createFaqNodeUseCase: CreateFaqNodeUseCase,
    private readonly updateFaqNodeUseCase: UpdateFaqNodeUseCase,
    private readonly deleteFaqNodeUseCase: DeleteFaqNodeUseCase,
    private readonly getFaqNodesUseCase: GetFaqNodesUseCase,
    private readonly uploadFaqImageUseCase: UploadFaqImageUseCase,
    private readonly deleteFaqImageUseCase: DeleteFaqImageUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('faqs', PermissionAction.CREATE)
  async create(@Body() createFaqNodeDto: CreateFaqNodeDto): Promise<{ id: string }> {
    return this.createFaqNodeUseCase.execute(createFaqNodeDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermission('faqs', PermissionAction.UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateFaqNodeDto: UpdateFaqNodeDto
  ): Promise<{ id: string }> {
    return this.updateFaqNodeUseCase.execute(id, updateFaqNodeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('faqs', PermissionAction.DELETE)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteFaqNodeUseCase.execute(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermission('faqs', PermissionAction.READ)
  async get(@Query() query: GetFaqNodesQueryDto): Promise<PaginatedResponseDto<FaqNode>> {
    return this.getFaqNodesUseCase.execute(query);
  }

  @Get('/mobile')
  @HttpCode(HttpStatus.OK)
  async getforusers(@Query() query: GetFaqNodesQueryDto): Promise<PaginatedResponseDto<FaqNode>> {
    return this.getFaqNodesUseCase.execute(query);
  }

  @Post('images')
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('faqs', PermissionAction.CREATE)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]): Promise<{ urls: string[] }> {
    const urls = await this.uploadFaqImageUseCase.execute(files);
    return { urls };
  }

  @Delete('delete/images')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('faqs', PermissionAction.DELETE)
  async deleteImage(@Body('url') url: string): Promise<void> {
    await this.deleteFaqImageUseCase.execute(url);
  }
}